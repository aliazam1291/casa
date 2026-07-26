/* eslint-disable */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FLOORS } from '../galleryData.js';
import { createFlutedCylinderGeometry } from './geometries.js';
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

  const marbleFloor = !isTerrace && (floorIndex === 0 || (roomIndex % 2 === 1));
  const wallB = getSurfBundle('plaster', def.wallColor, 3, 1.4);
  const floorB = isTerrace
    ? getSurfBundle('marble', 0xbdb2a2, 4, 4)  // riven stone paving
    : getSurfBundle(marbleFloor ? 'marble' : 'herringbone', def.floorColor, marbleFloor ? 1.5 : 3, marbleFloor ? 1.5 : 3);
  const panelB = getSurfBundle('wood', def.panelColor, 1, 2);

  const matWall = new THREE.MeshStandardMaterial({
    color: 0xffffff, map: wallB.map, normalMap: wallB.normalMap, roughnessMap: wallB.roughnessMap, normalScale: new THREE.Vector2(0.35, 0.35), roughness: 1.0,
  });
  const matFloor = new THREE.MeshStandardMaterial({
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

    // Warm ceiling cove strips
    const cove = new THREE.Mesh(new THREE.BoxGeometry(W * 0.65, 0.04, 0.25), sm.glow);
    cove.position.set(0, H - 0.02, -2);
    group.add(cove);
    for (const side of [-1, 1]) {
      const sc = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.04, D * 0.45), sm.glowDim);
      sc.position.set(side * W * 0.35, H - 0.02, 0);
      group.add(sc);
    }
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
  }

  if (roomIndex === 0) {
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), matWall);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-W / 2, H / 2, 0);
    group.add(leftWall);
  }
  if (roomIndex === lastIndex) {
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), matWall);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(W / 2, H / 2, 0);
    group.add(rightWall);
  }

  // Slatted wood acoustic wall feature. The sky pavilion trades this for a
  // full-height glazed horizon, so its two rooms never read like bedrooms.
  if (floorIndex !== 3) {
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

  // Indoor-only trim and art. The terrace has no wall to hang them on.
  if (!isTerrace) {
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
  } else {
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
  return group;
}
