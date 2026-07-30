/* eslint-disable */
// Rigid-body physics for the walkthrough, so furniture can actually be picked
// up, shoved around and dropped instead of being scenery.
//
// Rapier ships as WASM, so init() is async and deliberately NOT awaited during
// scene setup — the room must render on the first frame whether or not physics
// is ready. GalleryScene kicks this off after the first frame and simply has no
// draggable furniture until the module resolves.
//
// Only the ACTIVE room gets bodies. Thirteen rooms of dynamic furniture would
// be simulated forever off-screen for nothing; RoomPhysics is torn down and
// rebuilt on every room change.
import * as THREE from 'three';

let rapierPromise = null;

/** Loads and initialises the Rapier WASM module once per page. */
export function initPhysics() {
  if (!rapierPromise) {
    rapierPromise = import('@dimforge/rapier3d-compat').then(async (mod) => {
      const RAPIER = mod.default ?? mod;
      await RAPIER.init();
      return RAPIER;
    });
  }
  return rapierPromise;
}

const GRAVITY = { x: 0, y: -9.81, z: 0 };

// How hard a grabbed piece chases the pointer. Velocity is set directly rather
// than applying a force: the contact solver still resolves collisions, so a
// dragged sofa shoves a stool out of the way, but the grab can never build up
// the runaway energy a spring force does when the pointer jumps across the room.
const GRAB_STIFFNESS = 12;
const GRAB_MAX_SPEED = 14;

export class RoomPhysics {
  /**
   * @param RAPIER  the initialised Rapier module
   * @param scene   pieces are re-parented here so their transforms are world
   *                transforms, which is what the physics world speaks
   */
  constructor(RAPIER, scene) {
    this.RAPIER = RAPIER;
    this.scene = scene;
    this.world = new RAPIER.World(GRAVITY);
    this.items = [];
    this.grab = null;
    this._v = new THREE.Vector3();
    this._q = new THREE.Quaternion();
    this._box = new THREE.Box3();
  }

  /** Static floor plane and four walls, so nothing can be dragged out of the room. */
  addRoomShell({ centre, width, depth, height, floorY }) {
    const { RAPIER } = this;
    const half = 0.5;
    const add = (hx, hy, hz, x, y, z) => {
      const body = this.world.createRigidBody(
        RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z),
      );
      this.world.createCollider(RAPIER.ColliderDesc.cuboid(hx, hy, hz), body);
    };
    // Floor — thick slab downward so a fast-moving piece cannot tunnel through.
    add(width / 2, half, depth / 2, centre.x, floorY - half, centre.z);
    // Walls, inset by half a unit so furniture stops at the visible surface.
    add(half, height / 2, depth / 2, centre.x - width / 2 - half, floorY + height / 2, centre.z);
    add(half, height / 2, depth / 2, centre.x + width / 2 + half, floorY + height / 2, centre.z);
    add(width / 2, height / 2, half, centre.x, floorY + height / 2, centre.z - depth / 2 - half);
    add(width / 2, height / 2, half, centre.x, floorY + height / 2, centre.z + depth / 2 + half);
  }

  /**
   * Give one tagged furniture group a dynamic body — if it is the kind of thing
   * a person could actually push across a floor.
   *
   * WHAT IS EXCLUDED, AND WHY IT MATTERS. Every tagged piece used to get a
   * gravity-affected body, which meant the ring chandelier and the linear
   * pendant fell out of the ceiling, the floating vanity and the rain shower
   * came off the wall, and the kitchen run, wine wall and marble plinths could
   * be shoved around. Three tests keep that from happening, all geometric
   * rather than a hand-maintained list of piece ids that would rot the moment
   * someone adds a room:
   *
   *   - not resting on the floor  -> hung or wall-mounted, leave it alone
   *   - footprint over 4m         -> built-in joinery, islands, wine walls
   *   - taller than 2.2m          -> full-height racks and cabinetry
   *
   * Excluded pieces keep their hover label; they simply stay exactly where the
   * room author put them.
   *
   * The collider is a single cuboid fitted to the group's world bounding box.
   * A sofa is a dozen rounded boxes and a convex hull per mesh would be both
   * slow to build and worse to interact with — one box that matches the piece's
   * footprint is what makes dragging feel predictable.
   */
  addPiece(object, floorY = 0) {
    const { RAPIER } = this;

    // Measured in place, BEFORE re-parenting, so a piece that fails the tests
    // below is left completely untouched.
    object.updateWorldMatrix(true, true);
    this._box.setFromObject(object);
    if (this._box.isEmpty()) return null;

    const size = this._box.getSize(new THREE.Vector3());
    const centre = this._box.getCenter(new THREE.Vector3());
    if (size.x < 0.02 || size.y < 0.02 || size.z < 0.02) return null;

    const standsOnFloor = this._box.min.y <= floorY + 0.12;
    const footprint = Math.max(size.x, size.z);
    if (!standsOnFloor || footprint > 4.0 || size.y > 2.2) return null;

    // World transforms from here on, so sync is a straight copy. The original
    // parent is kept so dispose() can hand the piece back — the room's own
    // teardown walks its children to free geometry, and a piece re-parented to
    // the scene and never returned would leak on every room change.
    const originalParent = object.parent;
    this.scene.attach(object);

    const body = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(centre.x, centre.y, centre.z)
        // Furniture should settle quickly rather than glide like it is on ice.
        .setLinearDamping(1.6)
        .setAngularDamping(3.2)
        .setCcdEnabled(true)
        // Weightless until grabbed. Furniture in a finished room is already
        // where it belongs, so there is nothing to fall or settle into — and a
        // room that visibly settles on arrival looks broken, however correct
        // the simulation is. beginGrab() switches gravity on for the piece
        // being moved, so letting go of one in mid-air still drops it.
        .setGravityScale(0),
    );
    this.world.createCollider(
      // Colliders are inset a little. Pieces that visually touch — a stool
      // against a table, cushions against an arm — would otherwise start the
      // frame interpenetrating, and the solver's first act would be to fling
      // them apart.
      RAPIER.ColliderDesc.cuboid(size.x / 2 * 0.94, size.y / 2 * 0.94, size.z / 2 * 0.94)
        .setFriction(0.9)
        .setRestitution(0.04)
        // Heavier than default so a dragged piece displaces a light stool
        // rather than being deflected by it.
        .setDensity(6),
      body,
    );

    const item = {
      object,
      originalParent,
      body,
      // The group's origin is not its bounding-box centre, and the body tracks
      // the centre — so keep the delta and the group's baked rotation to
      // reconstruct the visual transform each frame.
      offset: object.position.clone().sub(centre),
      baseQuat: object.quaternion.clone(),
      home: { position: object.position.clone(), quaternion: object.quaternion.clone() },
    };
    object.userData.physicsItem = item;
    this.items.push(item);
    return item;
  }

  /** Collect every draggable piece in a room group. Surfaces are skipped. */
  addRoom(roomGroup, shell) {
    const pieces = [];
    roomGroup.traverse((obj) => {
      if (obj.userData?.pieceInfo && !obj.userData.isSurface) pieces.push(obj);
    });
    // Re-parenting during traverse would mutate the tree being walked.
    for (const p of pieces) this.addPiece(p, shell?.floorY ?? 0);
    if (shell) this.addRoomShell(shell);
    return this.items.length;
  }

  beginGrab(object, worldPoint) {
    const item = object?.userData?.physicsItem;
    if (!item) return false;
    // From the first grab onward the piece is under gravity, so releasing it
    // over a table drops it rather than leaving it hanging in the air.
    item.body.setGravityScale(1, true);
    const t = item.body.translation();
    this.grab = {
      item,
      // Preserve where on the piece it was grabbed, so it does not snap its
      // centre to the pointer.
      offset: new THREE.Vector3(t.x - worldPoint.x, t.y - worldPoint.y, t.z - worldPoint.z),
      target: worldPoint.clone(),
    };
    item.body.wakeUp();
    return true;
  }

  moveGrab(worldPoint) {
    if (this.grab) this.grab.target.copy(worldPoint);
  }

  endGrab() {
    this.grab = null;
  }

  get isGrabbing() {
    return this.grab !== null;
  }

  step(dt) {
    if (this.grab) {
      const { item, offset, target } = this.grab;
      const t = item.body.translation();
      this._v.set(target.x + offset.x - t.x, target.y + offset.y - t.y, target.z + offset.z - t.z);
      this._v.multiplyScalar(GRAB_STIFFNESS);
      if (this._v.length() > GRAB_MAX_SPEED) this._v.setLength(GRAB_MAX_SPEED);
      item.body.setLinvel({ x: this._v.x, y: this._v.y, z: this._v.z }, true);
    }
    // Rapier integrates at a fixed step; clamp dt so a backgrounded tab does
    // not resume by teleporting everything through the floor.
    this.world.timestep = Math.min(dt, 1 / 30);
    this.world.step();
  }

  /** Push body transforms back onto the three.js objects. */
  sync() {
    for (const item of this.items) {
      const t = item.body.translation();
      const r = item.body.rotation();
      this._q.set(r.x, r.y, r.z, r.w);
      this._v.copy(item.offset).applyQuaternion(this._q);
      item.object.position.set(t.x + this._v.x, t.y + this._v.y, t.z + this._v.z);
      item.object.quaternion.copy(this._q).multiply(item.baseQuat);
    }
  }

  /** Put every piece back where the room author placed it. */
  reset() {
    this.endGrab();
    for (const item of this.items) {
      // Back to weightless, so a reset room stays put like a finished room does.
      item.body.setGravityScale(0, true);
      const p = item.home.position.clone().sub(item.offset.clone().applyQuaternion(item.home.quaternion));
      item.body.setTranslation({ x: p.x, y: p.y, z: p.z }, true);
      item.body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      item.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      item.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      item.object.position.copy(item.home.position);
      item.object.quaternion.copy(item.home.quaternion);
    }
  }

  dispose() {
    this.endGrab();
    for (const item of this.items) {
      delete item.object.userData.physicsItem;
      // Hand the piece back to the room group it came from, so the room's own
      // disposal still reaches it.
      if (item.originalParent) item.originalParent.attach(item.object);
    }
    this.items.length = 0;
    this.world.free();
    this.world = null;
  }
}
