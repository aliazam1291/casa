/* eslint-disable */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FLOORS } from '../galleryData.js';
import { createFlutedCylinderGeometry, createRoundedBoxGeometry } from './geometries.js';
import { addContactShadow } from './shadows.js';
import { getSurfBundle, getArtTexture, addFramedArt } from './textures.js';
import * as furniture from './furniture/index.js';

const gltfLoader = typeof window !== 'undefined' ? new GLTFLoader() : null;
const gltfCache = new Map();

function loadGLTF(url) {
  if (gltfCache.has(url)) return gltfCache.get(url);
  const p = new Promise((resolve, reject) => {
    if (!gltfLoader) return reject(new Error('no loader'));
    gltfLoader.load(url, resolve, undefined, reject);
  });
  gltfCache.set(url, p);
  return p;
}

function placeModel(group, { url, x = 0, z = 0, ry = 0, w = 2, h = null }) {
  loadGLTF(url)
    .then((gltf) => {
      const obj = gltf.scene.clone(true);
      obj.rotation.y = ry;
      obj.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);
      const scale = h ? h / (size.y || 1) : w / (Math.max(size.x, size.z) || 1);
      obj.scale.setScalar(scale);
      obj.updateMatrixWorld(true);

      const box2 = new THREE.Box3().setFromObject(obj);
      const center = new THREE.Vector3();
      box2.getCenter(center);
      obj.position.x += x - center.x;
      obj.position.z += z - center.z;
      obj.position.y += -box2.min.y;

      obj.traverse((o) => {
        if (o.isMesh) {
          o.userData.isModel = true;
          if (o.material) o.material.envMapIntensity = 1.25;
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      obj.userData.isModel = true;
      group.add(obj);
    })
    .catch(() => {});
}

function softenBoxGeometry(root) {
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.geometry || obj.geometry.type !== 'BoxGeometry') return;
    const { width = 1, height = 1, depth = 1 } = obj.geometry.parameters || {};
    const smallest = Math.min(width, height, depth);
    if (smallest < 0.026) return;
    const radius = Math.min(0.055, Math.max(0.006, smallest * 0.18));
    const old = obj.geometry;
    obj.geometry = createRoundedBoxGeometry(width, height, depth, radius, 3);
    old.dispose();
  });
}

function addArchitecturalRealism(group, W, H, D, isTerrace) {
  const seamMat = new THREE.MeshBasicMaterial({ color: 0x342a22, transparent: true, opacity: isTerrace ? 0.16 : 0.09, depthWrite: false });
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x1c1712, transparent: true, opacity: 0.12, depthWrite: false });
  const revealMat = new THREE.MeshBasicMaterial({ color: 0x5b4c3f, transparent: true, opacity: 0.12, depthWrite: false });

  // Subtle slab joints prevent large floor planes from reading as flat cartoons.
  for (let x = -W / 2 + 2; x < W / 2 - 0.5; x += 2) {
    const seam = new THREE.Mesh(new THREE.PlaneGeometry(0.012, D), seamMat);
    seam.rotation.x = -Math.PI / 2;
    seam.position.set(x, 0.009, 0);
    group.add(seam);
  }
  for (let z = -D / 2 + 2; z < D / 2 - 0.5; z += 2) {
    const seam = new THREE.Mesh(new THREE.PlaneGeometry(W, 0.012), seamMat);
    seam.rotation.x = -Math.PI / 2;
    seam.position.set(0, 0.01, z);
    group.add(seam);
  }

  // Contact-darkened wall/floor corners mimic the ambient occlusion you expect
  // from a real interior renderer, without adding a post-processing pipeline.
  const rearShadow = new THREE.Mesh(new THREE.PlaneGeometry(W, 0.38), shadowMat);
  rearShadow.rotation.x = -Math.PI / 2;
  rearShadow.position.set(0, 0.012, -D / 2 + 0.18);
  group.add(rearShadow);

  for (const side of [-1, 1]) {
    const wallLine = new THREE.Mesh(new THREE.PlaneGeometry(0.018, H - 0.35), revealMat);
    wallLine.position.set(side * (W / 2 - 0.04), H / 2, -D / 2 + 0.04);
    group.add(wallLine);
  }

  if (!isTerrace) {
    for (let x = -W / 2 + 1.4; x < W / 2; x += 1.4) {
      const plasterJoint = new THREE.Mesh(new THREE.BoxGeometry(0.01, H - 0.8, 0.012), revealMat);
      plasterJoint.position.set(x, H / 2, -D / 2 + 0.066);
      group.add(plasterJoint);
    }
  }
}

// Small recessed can lights near the room's four corners — the detail whose
// absence most reads as "a render" rather than a photographed interior. Kept
// clear of the ceiling tray's beams/crossbars by sitting on the flat field.
function addDownlights(group, sm, W, H, D) {
  const y = H - 0.015;
  const insetX = Math.min(2.0, W / 2 - 0.6);
  const insetZ = Math.min(1.8, D / 2 - 0.6);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const trim = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.01, 8, 20), sm.metalDark);
      trim.rotation.x = Math.PI / 2;
      trim.position.set(sx * (W / 2 - insetX), y, sz * (D / 2 - insetZ));
      group.add(trim);
      const bulb = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), sm.glowDim);
      bulb.rotation.x = Math.PI / 2;
      bulb.position.set(sx * (W / 2 - insetX), y - 0.004, sz * (D / 2 - insetZ));
      group.add(bulb);
    }
  }
}

// Paired wall sconces flanking the hero painting — the human-scale fixture a
// real evening room is lit by, rather than the ceiling alone.
function addWallSconces(group, sm, W, D, H) {
  const y = 2.32;
  const z = -D / 2 + 0.07;
  for (const sx of [-1.15, 1.15]) {
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.03), sm.metalDark);
    back.position.set(sx, y, z);
    group.add(back);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8), sm.metal);
    arm.rotation.x = Math.PI / 2;
    arm.position.set(sx, y, z + 0.08);
    group.add(arm);
    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.075, 0.16, 14, 1, true, 0, Math.PI),
      new THREE.MeshBasicMaterial({ color: 0xfff3dc, transparent: true, opacity: 0.72, side: THREE.DoubleSide })
    );
    shade.rotation.y = sx < 0 ? Math.PI / 2 : -Math.PI / 2;
    shade.position.set(sx, y, z + 0.16);
    group.add(shade);
    const glowDisc = new THREE.Mesh(new THREE.CircleGeometry(0.11, 16), sm.glowDim);
    glowDisc.position.set(sx, y, z + 0.01);
    group.add(glowDisc);
  }
}

// A single wall switch plate by the entry corner — the kind of throwaway
// detail nobody designs on purpose but every real room has.
function addSwitchPlate(group, sm, W, D) {
  const x = -W / 2 + 0.42;
  const y = 1.32;
  const z = -D / 2 + 0.042;
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.16, 0.012), sm.marble);
  plate.position.set(x, y, z);
  group.add(plate);
  for (const dy of [0.035, -0.035]) {
    const toggle = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.045, 0.014), sm.metalDark);
    toggle.position.set(x, y + dy, z + 0.011);
    group.add(toggle);
  }
}

// A false ceiling gives each interior a distinct architectural profile. The
// shallow construction keeps headroom generous while creating real edges for
// light and shadow to describe in the walkthrough.
function addFalseCeiling(group, sm, W, H, D, roomName) {
  const name = roomName.toLowerCase();
  const drop = H - 0.2;
  const trimMat = sm.metalDark;
  const recessMat = new THREE.MeshStandardMaterial({ color: 0xe8dfd2, roughness: 0.86 });
  const darkRecessMat = new THREE.MeshStandardMaterial({ color: 0x2b2119, roughness: 0.78 });
  const addPerimeter = (insetX, insetZ, material = trimMat) => {
    for (const side of [-1, 1]) {
      const xRail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, D - insetZ * 2), material);
      xRail.position.set(side * (W / 2 - insetX), drop, 0);
      group.add(xRail);
      const zRail = new THREE.Mesh(new THREE.BoxGeometry(W - insetX * 2, 0.16, 0.1), material);
      zRail.position.set(0, drop, side * (D / 2 - insetZ));
      group.add(zRail);
    }
  };
  const addGlowLine = (x, z, width, depth) => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(width, 0.018, depth), sm.glow);
    line.position.set(x, drop - 0.09, z);
    group.add(line);
  };

  if (name.includes('wine') || name.includes('archive') || name.includes('study')) {
    // Dark timber coffer ceiling for the cellar and more intimate rooms.
    const inset = new THREE.Mesh(new THREE.BoxGeometry(W - 0.8, 0.055, D - 0.8), darkRecessMat);
    inset.position.set(0, drop + 0.03, 0);
    group.add(inset);
    addPerimeter(0.4, 0.4, sm.walnutWood);
    for (let x = -W / 2 + 1.4; x < W / 2 - 0.7; x += 1.7) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.18, D - 0.9), sm.walnutWood);
      beam.position.set(x, drop, 0);
      beam.castShadow = true;
      group.add(beam);
    }
    addGlowLine(0, -D / 2 + 0.58, W - 1.3, 0.045);
    return;
  }

  if (name.includes('kitchen')) {
    // A clean floating tray with parallel oak battens and a continuous LED
    // reveal, echoing the joinery and linear island pendant below.
    const tray = new THREE.Mesh(new THREE.BoxGeometry(W - 1.0, 0.07, D - 1.0), recessMat);
    tray.position.set(0, drop + 0.04, 0);
    group.add(tray);
    addPerimeter(0.5, 0.5, trimMat);
    for (let x = -4.4; x <= 4.4; x += 0.55) {
      const batten = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.11, D - 1.3), sm.walnutWood);
      batten.position.set(x, drop - 0.035, 0.2);
      group.add(batten);
    }
    addGlowLine(0, -D / 2 + 0.62, W - 1.4, 0.05);
    addGlowLine(0, D / 2 - 0.62, W - 1.4, 0.05);
    return;
  }

  if (name.includes('bath') || name.includes('spa')) {
    // Spa: a large quiet recessed field with four soft linear light slots.
    const tray = new THREE.Mesh(new THREE.BoxGeometry(W - 1.2, 0.07, D - 1.2), recessMat);
    tray.position.set(0, drop + 0.04, 0);
    group.add(tray);
    addPerimeter(0.6, 0.6, sm.marble);
    for (const x of [-3.2, -1.05, 1.05, 3.2]) addGlowLine(x, 0, 0.065, D - 1.5);
    return;
  }

  // Social and bedroom rooms use a soft plaster coffer with brass-edged
  // crossbars. It reads more residential than a commercial grid ceiling.
  const tray = new THREE.Mesh(new THREE.BoxGeometry(W - 1.1, 0.065, D - 1.1), recessMat);
  tray.position.set(0, drop + 0.035, 0);
  group.add(tray);
  addPerimeter(0.55, 0.55, trimMat);
  for (const z of [-D * 0.22, 0, D * 0.22]) {
    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(W - 1.25, 0.12, 0.1), name.includes('bed') ? sm.walnutWood : sm.metal);
    crossbar.position.set(0, drop - 0.02, z);
    group.add(crossbar);
  }
  addGlowLine(0, -D / 2 + 0.65, W - 1.45, 0.045);
}

export function disposeGLTFCache() {
  gltfCache.forEach((p) => {
    p.then((gltf) => gltf.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          Object.values(m).forEach((v) => { if (v && v.isTexture) v.dispose(); });
          m.dispose();
        });
      }
    })).catch(() => {});
  });
  gltfCache.clear();
}

export function addCommonDecor(group, sm, matAccent, W, H, D, seed, name = '') {
  let st = (seed * 2654435761 + 12345) >>> 0;
  const rnd = () => { st = (st * 1664525 + 1013904223) >>> 0; return st / 4294967296; };
  const side = rnd() < 0.5 ? -1 : 1;
  const lounge = /foyer|living|atrium|lounge|hall|gallery|pavilion|terrace|great|salon/.test(name);
  const artRoom = /foyer|gallery|pavilion|atrium|living|salon/.test(name);

  if (lounge) {
    // Woven Linen Area Rug under seating area
    const rugW = 4.5, rugD = 3.2;
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(rugW, rugD), sm.rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(-0.5, 0.005, 0.2);
    rug.receiveShadow = true;
    group.add(rug);
    // Rug border trim
    const rugBorder = new THREE.Mesh(new THREE.PlaneGeometry(rugW + 0.06, rugD + 0.06), new THREE.MeshStandardMaterial({ color: 0x8a7a64, roughness: 0.9, transparent: true, opacity: 0.25 }));
    rugBorder.rotation.x = -Math.PI / 2;
    rugBorder.position.set(-0.5, 0.004, 0.2);
    group.add(rugBorder);
    // Hand-knotted fringe along the rug's short edges
    const fringeMat = new THREE.MeshStandardMaterial({ color: 0xd9c9a8, roughness: 0.95 });
    for (const fz of [0.2 - rugD / 2, 0.2 + rugD / 2]) {
      for (let i = 0; i < 16; i++) {
        const fx = -0.5 - rugW / 2 + 0.1 + i * ((rugW - 0.2) / 15);
        const strand = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.1, 4), fringeMat);
        strand.rotation.x = Math.PI / 2;
        strand.position.set(fx, 0.006, fz + (fz > 0.2 ? 0.05 : -0.05));
        group.add(strand);
      }
    }

    // Upholstered ottomans on the rug
    const poufGeo = new THREE.SphereGeometry(0.42, 18, 12);
    const poufMats = [sm.velvetForest, sm.fabricDark, sm.fabricDark];
    const cx = side * (2.0 + rnd() * 0.6);
    const cz = 1.8 + (rnd() - 0.5) * 0.8;
    for (let i = 0; i < 3; i++) {
      const s = (0.34 + rnd() * 0.18) / 0.42;
      const p = new THREE.Mesh(poufGeo, poufMats[i % poufMats.length]);
      p.scale.set(s, s * 0.55, s);
      p.position.set(cx + (rnd() - 0.5) * 1.6, s * 0.42 * 0.55, cz + (rnd() - 0.5) * 1.4);
      p.castShadow = true; p.receiveShadow = true;
      group.add(p);
    }
    addContactShadow(group, cx, cz, 3.4, 2.4, 0.35);

    // A throw blanket, casually folded over the nearest ottoman — the kind of
    // lived-in touch that keeps a staged room from reading as showroom-empty.
    const throwGroup = new THREE.Group();
    const throwMat = sm.velvetCaramel || sm.linen;
    const foldCount = 3;
    for (let f = 0; f < foldCount; f++) {
      const fold = new THREE.Mesh(createRoundedBoxGeometry(0.62, 0.05, 0.4 - f * 0.03, 0.05, 3), throwMat);
      fold.position.set(0, f * 0.045, f * 0.03);
      fold.rotation.z = -0.06;
      fold.castShadow = true;
      throwGroup.add(fold);
    }
    throwGroup.position.set(cx - 0.3, 0.32, cz - 0.35);
    throwGroup.rotation.y = 0.35;
    group.add(throwGroup);
  }

  // Potted Ceramic Architectural Plant
  const px = -side * (W / 2 - 1.2);
  const planter = new THREE.Mesh(createFlutedCylinderGeometry(0.25, 0.6, 16), sm.ceramicPot);
  planter.position.set(px, 0.3, -1.0);
  planter.castShadow = true;
  group.add(planter);
  addContactShadow(group, px, -1.0, 0.7, 0.7, 0.4);
  for (let l = 0; l < 7; l++) {
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.9 + rnd() * 0.6, 5), sm.foliage);
    blade.position.set(px + (rnd() - 0.5) * 0.34, 0.85 + rnd() * 0.28, -1.0 + (rnd() - 0.5) * 0.34);
    blade.rotation.z = (rnd() - 0.5) * 0.55;
    group.add(blade);
  }

  if (artRoom) {
    // Sculptural Marble Plinth with Champagne Brass Torus Knot Sculpture
    const plx = side * (W / 2 - 1.4);
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.0, 0.5), sm.marble);
    plinth.position.set(plx, 0.5, -2.4);
    plinth.castShadow = true;
    group.add(plinth);
    addContactShadow(group, plx, -2.4, 0.8, 0.8, 0.45);

    const sculp = new THREE.Mesh(new THREE.TorusKnotGeometry(0.16, 0.055, 64, 10), sm.metal);
    sculp.position.set(plx, 1.22, -2.4);
    sculp.castShadow = true;
    group.add(sculp);
  }

  if (lounge) {
    // Architectural Arc Lamp
    const lx = -side * (2.8 + rnd() * 0.4);
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 18), sm.marble);
    lampBase.position.set(lx, 0.02, 2.6);
    group.add(lampBase);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 1.8, 8), sm.metal);
    pole.position.set(lx, 0.9, 2.6);
    group.add(pole);

    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.22, 0.3, 16),
      new THREE.MeshBasicMaterial({ color: 0xfff5e0, transparent: true, opacity: 0.65 })
    );
    shade.position.set(lx, 1.85, 2.6);
    group.add(shade);
    addContactShadow(group, lx, 2.6, 0.6, 0.6, 0.35);
  }
}

export function buildRoom(def, roomIndex, floorIndex, sm) {
  const group = new THREE.Group();
  const W = 12, H = 4.5, D = 10;
  const lastIndex = FLOORS[floorIndex].rooms.length - 1;

  const roomName = (def.name || '').toLowerCase();
  // The terrace is genuinely outdoors: open to the sky, stone paving, a glass
  // balustrade and a pergola instead of a ceiling, painting and slat wall.
  const isTerrace = roomName.includes('terrace');
  // The wine cellar's hero is a full-height wine wall, so it must not also get
  // the slat wall, hero painting or console ledge stacked on the same surface.
  const isWineCellar = roomName.includes('wine');
  const isKitchen = roomName.includes('kitchen');

  const marbleFloor = !isTerrace && (floorIndex === 0 || (roomIndex % 2 === 1));
  const wallB = getSurfBundle('plaster', def.wallColor, 3, 1.4);
  const floorB = isTerrace
    ? getSurfBundle('marble', 0xbdb2a2, 4, 4)  // riven stone paving
    : getSurfBundle(marbleFloor ? 'marble' : 'herringbone', def.floorColor, marbleFloor ? 1.5 : 3, marbleFloor ? 1.5 : 3);
  const panelB = getSurfBundle('wood', def.panelColor, 1, 2);

  const matWall = new THREE.MeshStandardMaterial({
    color: 0xffffff, map: wallB.map, normalMap: wallB.normalMap, roughnessMap: wallB.roughnessMap, normalScale: new THREE.Vector2(0.35, 0.35), roughness: 1.0,
  });
  const matFloor = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, map: floorB.map, normalMap: floorB.normalMap, roughnessMap: floorB.roughnessMap,
    // Outdoor paving reads matte and coarse; interior stone stays polished.
    normalScale: new THREE.Vector2(isTerrace ? 1.15 : 0.6, isTerrace ? 1.15 : 0.6),
    roughness: 1.0, metalness: isTerrace ? 0.0 : (marbleFloor ? 0.08 : 0.02),
    envMapIntensity: isTerrace ? 1.15 : (marbleFloor ? 2.0 : 0.9),
    clearcoat: isTerrace ? 0.0 : (marbleFloor ? 0.85 : 0.2),
    clearcoatRoughness: marbleFloor ? 0.06 : 0.2,
  });
  const matPanel = new THREE.MeshStandardMaterial({
    color: 0xffffff, map: panelB.map, normalMap: panelB.normalMap, roughnessMap: panelB.roughnessMap, normalScale: new THREE.Vector2(0.5, 0.5), roughness: 1.0, metalness: 0.02,
  });
  const matAccent = new THREE.MeshStandardMaterial({ color: def.accent, roughness: 0.35, metalness: 0.15 });

  // Floor & Ceiling
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  if (isTerrace) {
    // Open sky overhead + a slatted timber pergola casting real shadow bars.
    const sky = new THREE.Mesh(
      new THREE.PlaneGeometry(W, D),
      new THREE.MeshBasicMaterial({ color: 0xbcd0de })
    );
    sky.rotation.x = Math.PI / 2;
    sky.position.y = H + 1.6;
    group.add(sky);

    for (const bx of [-W / 2 + 0.35, W / 2 - 0.35]) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, D - 0.4), sm.darkWood);
      beam.position.set(bx, H - 0.12, 0);
      beam.castShadow = true;
      group.add(beam);
    }
    for (let i = 0; i < 14; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(W - 0.5, 0.09, 0.1), sm.darkWood);
      slat.position.set(0, H - 0.2, -D / 2 + 0.6 + i * ((D - 1.2) / 13));
      slat.castShadow = true;
      group.add(slat);
    }
  } else {
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), sm.ceiling);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = H;
    group.add(ceil);
    addFalseCeiling(group, sm, W, H, D, roomName);
    addDownlights(group, sm, W, H, D);
  }

  // Walls — the terrace opens to a view behind a glass balustrade instead.
  if (isTerrace) {
    const view = new THREE.Mesh(
      new THREE.PlaneGeometry(W, H + 1.4),
      new THREE.MeshBasicMaterial({ color: 0xc3d4de })
    );
    view.position.set(0, (H + 1.4) / 2, -D / 2 - 0.05);
    group.add(view);

    const glassRail = new THREE.Mesh(
      new THREE.PlaneGeometry(W - 0.4, 1.05),
      new THREE.MeshPhysicalMaterial({
        color: 0xdfe8ea, roughness: 0.04, metalness: 0.0,
        transparent: true, opacity: 0.3, transmission: 0.6, envMapIntensity: 1.6,
      })
    );
    glassRail.position.set(0, 0.55, -D / 2 + 0.12);
    group.add(glassRail);

    const capRail = new THREE.Mesh(new THREE.BoxGeometry(W - 0.3, 0.07, 0.13), sm.metal);
    capRail.position.set(0, 1.1, -D / 2 + 0.12);
    capRail.castShadow = true;
    group.add(capRail);
    for (let i = -2; i <= 2; i++) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.08, 0.06), sm.metalDark);
      post.position.set(i * ((W - 0.6) / 4), 0.54, -D / 2 + 0.12);
      group.add(post);
    }
  } else {
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), matWall);
    backWall.position.set(0, H / 2, -D / 2);
    backWall.receiveShadow = true;
    group.add(backWall);
    if (!isWineCellar && !isKitchen) addSwitchPlate(group, sm, W, D);
  }

  if (roomIndex === 0) {
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), matWall);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-W / 2, H / 2, 0);
    group.add(leftWall);
    const leftBase = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, D), sm.darkWood);
    leftBase.position.set(-W / 2 + 0.02, 0.06, 0);
    group.add(leftBase);
  }
  if (roomIndex === lastIndex) {
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), matWall);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(W / 2, H / 2, 0);
    group.add(rightWall);
    const rightBase = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, D), sm.darkWood);
    rightBase.position.set(W / 2 - 0.02, 0.06, 0);
    group.add(rightBase);
  }

  addArchitecturalRealism(group, W, H, D, isTerrace);

  // Slatted wood acoustic wall feature. The sky pavilion trades this for a
  // full-height glazed horizon, so its two rooms never read like bedrooms.
  if (floorIndex !== 3 && !isWineCellar) {
    const slatCount = 18;
    const slatGap = 0.035;
    const slatW = (W - slatGap * (slatCount + 1)) / slatCount;
    const slatH = H - 0.5;
    for (let i = 0; i < slatCount; i++) {
      const sx = -W / 2 + slatGap + slatW / 2 + i * (slatW + slatGap);
      const slat = new THREE.Mesh(new THREE.BoxGeometry(slatW, slatH, 0.04), matPanel);
      slat.position.set(sx, H / 2, -D / 2 + 0.025);
      slat.castShadow = true;
      group.add(slat);
    }
  }

  if (floorIndex === 3 && !isTerrace) {
    const skyline = new THREE.MeshStandardMaterial({
      color: roomIndex === 0 ? 0x8d9bae : 0x667181,
      roughness: 0.12,
      metalness: 0.45,
      transparent: true,
      opacity: 0.72,
    });
    const windowWall = new THREE.Mesh(new THREE.PlaneGeometry(W - 1.1, H - 0.9), skyline);
    windowWall.position.set(0, H / 2, -D / 2 + 0.03);
    group.add(windowWall);

    for (let i = -2; i <= 2; i++) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.055, H - 0.7, 0.08), sm.metalDark);
      mullion.position.set(i * 2.1, H / 2, -D / 2 + 0.08);
      group.add(mullion);
    }
    const sill = new THREE.Mesh(new THREE.BoxGeometry(W - 0.9, 0.08, 0.28), sm.marbleNero);
    sill.position.set(0, 0.82, -D / 2 + 0.16);
    group.add(sill);

    // Book-matched travertine piers flanking the glazing so the pavilion
    // reads as real stone architecture rather than a blank glass panel.
    const travB = getSurfBundle('marble', 0xcbbda6, 1, 2);
    const matTrav = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: travB.map, normalMap: travB.normalMap, roughnessMap: travB.roughnessMap,
      normalScale: new THREE.Vector2(0.7, 0.7), roughness: 1.0, metalness: 0.04, envMapIntensity: 1.3,
    });
    for (const sgn of [-1, 1]) {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(0.9, H, 0.16), matTrav);
      pier.position.set(sgn * (W / 2 - 0.45), H / 2, -D / 2 + 0.07);
      pier.castShadow = true; pier.receiveShadow = true;
      group.add(pier);
    }
    const header = new THREE.Mesh(new THREE.BoxGeometry(W, 0.5, 0.16), matTrav);
    header.position.set(0, H - 0.25, -D / 2 + 0.07);
    header.receiveShadow = true;
    group.add(header);
  }

  // Indoor-only trim and art. The terrace has no wall to hang them on, and the
  // wine cellar's back wall is entirely given over to the wine wall.
  if (!isTerrace && !isWineCellar && !isKitchen) {
    // Base Rails & Crown molding
    const baseRail = new THREE.Mesh(new THREE.BoxGeometry(W, 0.12, 0.04), sm.darkWood);
    baseRail.position.set(0, 0.06, -D / 2 + 0.05);
    group.add(baseRail);
    const crown = new THREE.Mesh(new THREE.BoxGeometry(W, 0.1, 0.06), matPanel);
    crown.position.set(0, H - 0.05, -D / 2 + 0.04);
    group.add(crown);

    // Hero Framed Painting
    const heroTex = getArtTexture(`${floorIndex}-${roomIndex}-hero`, floorIndex * 17 + roomIndex * 3 + 1);
    addFramedArt(group, sm, heroTex, { x: 0, y: 2.1, z: -D / 2 + 0.05, w: 1.8, h: 2.2 });
    addWallSconces(group, sm, W, D, H);

    // Console Ledge
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.05, 0.35), sm.marble);
    ledge.position.set(0, 0.9, -D / 2 + 0.2);
    ledge.castShadow = true;
    group.add(ledge);
    for (const lx of [-0.95, 0.95]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.28), sm.metalDark);
      leg.position.set(lx, 0.45, -D / 2 + 0.2);
      group.add(leg);
    }
    addContactShadow(group, 0, -D / 2 + 0.2, 2.4, 0.5, 0.4);
  } else if (isTerrace) {
    // Terrace: planted stone borders instead of skirting/art.
    for (const bx of [-1, 1]) {
      const trough = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.42, 0.6), sm.marble);
      trough.position.set(bx * 3.6, 0.21, -D / 2 + 0.75);
      trough.castShadow = true; trough.receiveShadow = true;
      group.add(trough);
      addContactShadow(group, bx * 3.6, -D / 2 + 0.75, 3.3, 0.9, 0.4);
      for (let s = 0; s < 9; s++) {
        const shrub = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 9), sm.foliage);
        shrub.position.set(bx * 3.6 - 1.25 + s * 0.31, 0.5, -D / 2 + 0.75);
        shrub.scale.y = 0.82;
        shrub.castShadow = true;
        group.add(shrub);
      }
    }
  }

  // Staging Furniture Dispatch
  if (def.models && def.models.length) {
    addContactShadow(group, 0, -0.2, 4.8, 3.6, 0.35);
    def.models.forEach((m) => placeModel(group, m));
  } else if (floorIndex === 0) {
    furniture.addUndergroundFurniture(group, roomIndex, sm, matPanel, matAccent, W, H, D);
  } else {
    const n = (def.name || '').toLowerCase();
    if (n.includes('kitchen')) furniture.addKitchenFurniture(group, sm, matPanel, matAccent, W, H, D);
    else if (n.includes('dining')) furniture.addDiningFurniture(group, sm, matPanel, matAccent, W, H, D);
    else if (n.includes('bath') || n.includes('spa')) furniture.addBathFurniture(group, sm, matAccent, W, H, D);
    else if (n.includes('guest')) furniture.addGuestBedroomFurniture(group, sm, matPanel, matAccent, W, H, D);
    else if (n.includes('bed') || n.includes('suite') || n.includes('master')) furniture.addBedroomFurniture(group, sm, matPanel, matAccent, W, H, D);
    else if (n.includes('study')) furniture.addStudyFurniture(group, sm, matPanel, matAccent, W, H, D);
    else if (n.includes('gallery') || n.includes('terrace') || n.includes('skyline') || n.includes('pavilion')) furniture.addGalleryFurniture(group, sm, matAccent, W, H, D, n);
    else if (n.includes('living') || n.includes('atrium') || n.includes('lounge') || n.includes('great') || n.includes('salon')) furniture.addLivingFurniture(group, sm, matAccent, W, H, D);
    else furniture.addHallFurniture(group, sm, matAccent, W, H, D);
  }

  addCommonDecor(group, sm, matAccent, W, H, D, floorIndex * 10 + roomIndex, (def.name || '').toLowerCase());
  softenBoxGeometry(group);
  return group;
}
