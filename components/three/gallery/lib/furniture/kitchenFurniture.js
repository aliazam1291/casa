/* eslint-disable */
import * as THREE from 'three';
import { createRoundedBoxGeometry, createFlutedCylinderGeometry } from '../geometries.js';
import { addContactShadow } from '../shadows.js';
import { tagPieceById } from '../interactive.js';

export function addKitchenFurniture(group, sm, matPanel, matAccent, W, H, D) {
  // Full rear kitchen run: tall pantry/fridge towers, working counter,
  // backsplash, oven and induction hob. These are the clear silhouettes that
  // make the room read as a real kitchen from the entry.
  const kitchenRun = new THREE.Group();
  const backZ = -D / 2 + 0.38;
  const cabinetMat = sm.walnutWood;
  const darkAppliance = new THREE.MeshPhysicalMaterial({ color: 0x111313, roughness: 0.2, metalness: 0.62, clearcoat: 0.55, clearcoatRoughness: 0.12 });
  const backsplashMat = new THREE.MeshPhysicalMaterial({ color: 0xf0e9dc, roughness: 0.34, metalness: 0.03, clearcoat: 0.52, clearcoatRoughness: 0.12 });

  const counterBase = new THREE.Mesh(createRoundedBoxGeometry(7.8, 0.86, 0.62, 0.025, 3), cabinetMat);
  counterBase.position.set(0, 0.43, backZ);
  counterBase.castShadow = true; counterBase.receiveShadow = true;
  kitchenRun.add(counterBase);
  const worktop = new THREE.Mesh(new THREE.BoxGeometry(7.95, 0.075, 0.74), sm.marble);
  worktop.position.set(0, 0.89, backZ);
  worktop.castShadow = true; worktop.receiveShadow = true;
  kitchenRun.add(worktop);
  const backsplash = new THREE.Mesh(new THREE.BoxGeometry(7.85, 1.24, 0.045), backsplashMat);
  backsplash.position.set(0, 1.53, backZ - 0.34);
  kitchenRun.add(backsplash);

  // Drawer and door breaks keep the cabinetry from becoming one featureless box.
  const seamMat = new THREE.MeshStandardMaterial({ color: 0x20170f, roughness: 0.65 });
  for (const x of [-3.1, -1.55, 0, 1.55, 3.1]) {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.8, 0.025), seamMat);
    seam.position.set(x, 0.43, backZ + 0.325);
    kitchenRun.add(seam);
  }
  for (const y of [0.34, 0.58]) {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(7.62, 0.018, 0.025), seamMat);
    seam.position.set(0, y, backZ + 0.325);
    kitchenRun.add(seam);
  }
  for (const x of [-3.85, -2.3, -0.78, 0.78, 2.3, 3.85]) {
    const pull = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26, 8), sm.metal);
    pull.rotation.z = Math.PI / 2;
    pull.position.set(x, 0.46, backZ + 0.355);
    kitchenRun.add(pull);
  }

  // Tall integrated refrigerator and pantry towers frame the counter.
  for (const x of [-4.65, 4.65]) {
    const tower = new THREE.Mesh(createRoundedBoxGeometry(1.15, 3.7, 0.72, 0.03, 3), cabinetMat);
    tower.position.set(x, 1.85, backZ);
    tower.castShadow = true; tower.receiveShadow = true;
    kitchenRun.add(tower);
    const towerLine = new THREE.Mesh(new THREE.BoxGeometry(0.025, 3.45, 0.025), seamMat);
    towerLine.position.set(x, 1.85, backZ + 0.38);
    kitchenRun.add(towerLine);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.12, 8), sm.metal);
    handle.position.set(x + (x < 0 ? 0.23 : -0.23), 1.85, backZ + 0.405);
    kitchenRun.add(handle);
  }

  // Built-in oven, induction hob and a stainless extractor give the kitchen
  // its working equipment rather than a living-room console.
  const oven = new THREE.Mesh(createRoundedBoxGeometry(1.18, 0.62, 0.055, 0.018, 3), darkAppliance);
  oven.position.set(0, 0.49, backZ + 0.35);
  kitchenRun.add(oven);
  const ovenGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.38), new THREE.MeshPhysicalMaterial({ color: 0x101820, roughness: 0.04, metalness: 0.25, clearcoat: 1 }));
  ovenGlass.position.set(0, 0.47, backZ + 0.382);
  kitchenRun.add(ovenGlass);
  for (const x of [-0.78, -0.26, 0.26, 0.78]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.012, 8, 24), darkAppliance);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.935, backZ + 0.02);
    kitchenRun.add(ring);
  }
  const hood = new THREE.Mesh(createRoundedBoxGeometry(1.45, 0.48, 0.42, 0.025, 3), darkAppliance);
  hood.position.set(0, 2.58, backZ - 0.08);
  kitchenRun.add(hood);
  const hoodChimney = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.06, 0.28), darkAppliance);
  hoodChimney.position.set(0, 3.32, backZ - 0.08);
  kitchenRun.add(hoodChimney);

  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.3, 8), sm.metal);
  rail.rotation.z = Math.PI / 2;
  rail.position.set(-2.25, 1.65, backZ + 0.035);
  kitchenRun.add(rail);
  for (let i = 0; i < 3; i++) {
    const utensil = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.018, 0.28, 8), sm.metal);
    utensil.position.set(-3.05 + i * 0.58, 1.45, backZ + 0.04);
    kitchenRun.add(utensil);
  }
  tagPieceById(kitchenRun, 'gourmet-kitchen/the-working-kitchen');
  group.add(kitchenRun);

  // Nero Marquina Dark Marble Kitchen Island
  const island = new THREE.Mesh(createRoundedBoxGeometry(3.6, 0.94, 1.2, 0.03, 3), sm.marbleNero);
  island.position.set(0, 0.47, 0);
  island.castShadow = true; island.receiveShadow = true;
  tagPieceById(island, 'gourmet-kitchen/the-hearth-island');
  group.add(island);
  addContactShadow(group, 0, 0, 3.9, 1.5, 0.55);

  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(3.66, 0.04, 1.26), sm.marble);
  counterTop.position.set(0, 0.94, 0);
  group.add(counterTop);

  const islandPanel = new THREE.Mesh(createFlutedCylinderGeometry(0.55, 0.88, 32), sm.walnutWood);
  islandPanel.scale.set(3.2, 1, 0.2);
  islandPanel.position.set(0, 0.44, 0.52);
  group.add(islandPanel);

  // Undermount Brass Sink & Tapware
  const sink = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.4), sm.metal);
  sink.position.set(1.0, 0.941, 0);
  group.add(sink);
  const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 10), sm.metal);
  tap.position.set(1.0, 1.12, -0.22);
  group.add(tap);

  // Saddle Leather Counter Stools
  const stoolGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const sx = -1.1 + i * 1.1;
    const seat = new THREE.Mesh(createRoundedBoxGeometry(0.42, 0.06, 0.4, 0.03, 3), sm.leatherCognac);
    seat.position.set(sx, 0.72, 1.05);
    seat.castShadow = true;
    stoolGroup.add(seat);
    const footrest = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.012, 8, 16), sm.metal);
    footrest.rotation.x = Math.PI / 2;
    footrest.position.set(sx, 0.3, 1.05);
    stoolGroup.add(footrest);
    addContactShadow(group, sx, 1.05, 0.55, 0.55, 0.35);
  }
  tagPieceById(stoolGroup, 'gourmet-kitchen/the-counter-stools');
  group.add(stoolGroup);

  // Floating Brass Linear Pendant Light
  const pendant = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.4, 12), sm.metal);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, H - 1.2, 0);
  pendant.add(bar);
  for (const cx of [-0.9, 0, 0.9]) {
    const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.8, 6), sm.metal);
    drop.position.set(cx, H - 0.8, 0);
    pendant.add(drop);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), sm.fixtureGlow);
    bulb.position.set(cx, H - 1.24, 0);
    pendant.add(bulb);
  }
  tagPieceById(pendant, 'gourmet-kitchen/the-linear-pendant');
  group.add(pendant);
}
