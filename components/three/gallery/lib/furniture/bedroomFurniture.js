/* eslint-disable */
import * as THREE from 'three';
import { createRoundedBoxGeometry, createFlutedCylinderGeometry } from '../geometries.js';
import { addContactShadow } from '../shadows.js';
import { tagPiece } from '../interactive.js';

export function addBedroomFurniture(group, sm, matPanel, matAccent, W, H, D) {
  const bedW = 2.6, bedD = 3.1;

  // Platform Bed with Channel-Tufted Terracotta Velvet Headboard
  const headboard = new THREE.Mesh(createRoundedBoxGeometry(bedW + 0.5, 1.45, 0.12, 0.04, 4), sm.velvetTerracotta);
  headboard.position.set(0, 1.05, -D / 2 + 0.2);
  headboard.castShadow = true;
  tagPiece(headboard, {
    name: 'The Monastic Bed',
    materials: ['Terracotta cotton velvet', 'Solid walnut', 'Washed linen'],
    description: 'A channel-tufted headboard in terracotta velvet on a low walnut platform — six hand-run channels, each stuffed and closed by one maker.',
  });
  group.add(headboard);
  for (let ch = 0; ch < 6; ch++) {
    const stitch = new THREE.Mesh(new THREE.BoxGeometry(bedW + 0.3, 0.008, 0.13), sm.metalDark);
    stitch.position.set(0, 0.48 + ch * 0.20, -D / 2 + 0.21);
    group.add(stitch);
  }

  const bedBase = new THREE.Mesh(createRoundedBoxGeometry(bedW, 0.3, bedD), sm.darkWood);
  bedBase.position.set(0, 0.15, -D / 2 + bedD / 2 + 0.3);
  bedBase.castShadow = true;
  group.add(bedBase);

  const mattress = new THREE.Mesh(createRoundedBoxGeometry(bedW - 0.06, 0.22, bedD - 0.1), sm.linen);
  mattress.position.set(0, 0.38, -D / 2 + bedD / 2 + 0.3);
  group.add(mattress);

  for (const px of [-0.48, 0.48]) {
    const pillow = new THREE.Mesh(createRoundedBoxGeometry(0.6, 0.14, 0.36, 0.06, 4), sm.linen);
    pillow.position.set(px, 0.52, -D / 2 + 0.65);
    pillow.castShadow = true;
    group.add(pillow);
    const accentPillow = new THREE.Mesh(createRoundedBoxGeometry(0.42, 0.12, 0.22, 0.05, 4), sm.velvetNavy);
    accentPillow.position.set(px, 0.54, -D / 2 + 0.85);
    accentPillow.rotation.y = (px > 0 ? 1 : -1) * 0.08;
    accentPillow.castShadow = true;
    group.add(accentPillow);
  }
  const duvet = new THREE.Mesh(createRoundedBoxGeometry(bedW - 0.3, 0.08, 0.8), sm.velvetForest);
  duvet.position.set(0, 0.42, -D / 2 + bedD + 0.05);
  duvet.castShadow = true;
  group.add(duvet);
  addContactShadow(group, 0, -D / 2 + bedD / 2 + 0.3, bedW + 0.6, bedD + 0.6, 0.5);

  // Calacatta Marble Nightstands
  for (const nx of [-1, 1]) {
    const ns = new THREE.Mesh(createRoundedBoxGeometry(0.55, 0.48, 0.42, 0.03, 3), sm.marble);
    ns.position.set(nx * (bedW / 2 + 0.52), 0.24, -D / 2 + 0.5);
    ns.castShadow = true;
    group.add(ns);
    const drawerFront = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.2, 0.02), sm.walnutWood);
    drawerFront.position.set(nx * (bedW / 2 + 0.52), 0.24, -D / 2 + 0.72);
    group.add(drawerFront);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.015), sm.metal);
    handle.position.set(nx * (bedW / 2 + 0.52), 0.24, -D / 2 + 0.74);
    group.add(handle);
    addContactShadow(group, nx * (bedW / 2 + 0.52), -D / 2 + 0.5, 0.7, 0.6, 0.35);

    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8), sm.metal);
    lampStem.position.set(nx * (bedW / 2 + 0.52), 0.55, -D / 2 + 0.5);
    group.add(lampStem);
    const lampGlobe = new THREE.Mesh(new THREE.SphereGeometry(0.10, 16, 12), sm.fixtureGlow);
    lampGlobe.position.set(nx * (bedW / 2 + 0.52), 0.66, -D / 2 + 0.5);
    group.add(lampGlobe);

    if (nx > 0) {
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.015, 14), sm.ceramicPot);
      dish.position.set(nx * (bedW / 2 + 0.52) - 0.12, 0.495, -D / 2 + 0.45);
      group.add(dish);
    } else {
      const nightBook = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.02, 0.15), sm.velvetForest);
      nightBook.position.set(nx * (bedW / 2 + 0.52) + 0.10, 0.50, -D / 2 + 0.45);
      group.add(nightBook);
    }
  }

  // Fireplace feature wall
  const fpGroup = new THREE.Group();
  const mantel = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.2, 1.8), sm.marbleNero);
  mantel.position.set(W / 2 - 0.4, 0.6, 2.2);
  mantel.castShadow = true; mantel.receiveShadow = true;
  fpGroup.add(mantel);
  const firebox = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.6, 1.0), sm.metalDark);
  firebox.position.set(W / 2 - 0.38, 0.4, 2.2);
  fpGroup.add(firebox);
  const fireGlow = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.8), sm.fixtureGlow);
  fireGlow.position.set(W / 2 - 0.3, 0.12, 2.2);
  fpGroup.add(fireGlow);
  group.add(fpGroup);
  addContactShadow(group, W / 2 - 0.4, 2.2, 0.8, 2.2, 0.4);

  // Cozy lounge chair facing fireplace
  const loungeGroup = new THREE.Group();
  const lSeat = new THREE.Mesh(createRoundedBoxGeometry(0.68, 0.14, 0.64, 0.06, 3), sm.velvetNavy);
  lSeat.position.set(W / 2 - 1.8, 0.22, 1.2);
  lSeat.rotation.y = -1.1;
  lSeat.castShadow = true;
  loungeGroup.add(lSeat);
  const lBack = new THREE.Mesh(createRoundedBoxGeometry(0.68, 0.62, 0.12, 0.06, 3), sm.velvetNavy);
  lBack.position.set(W / 2 - 2.0, 0.58, 1.0);
  lBack.rotation.y = -1.1;
  lBack.castShadow = true;
  loungeGroup.add(lBack);
  for (const lx of [-0.28, 0.28]) {
    for (const lz of [-0.26, 0.26]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8), sm.walnutWood);
      leg.position.set(W / 2 - 1.8 + lx, 0.11, 1.2 + lz);
      loungeGroup.add(leg);
    }
  }
  group.add(loungeGroup);
  addContactShadow(group, W / 2 - 1.8, 1.2, 1.0, 1.0, 0.4);

  // Side table next to lounge chair
  const sTable = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.48, 16), sm.metal);
  sTable.position.set(W / 2 - 2.2, 0.24, 2.2);
  sTable.castShadow = true;
  group.add(sTable);
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.08, 8), sm.ceramicPot);
  mug.position.set(W / 2 - 2.2, 0.52, 2.2);
  group.add(mug);
  addContactShadow(group, W / 2 - 2.2, 2.2, 0.5, 0.5, 0.3);

  // Full-height dressing wall and upholstered end bench make the master
  // suite a private retreat rather than a scaled-up guest room.
  for (let i = 0; i < 5; i++) {
    const panel = new THREE.Mesh(createRoundedBoxGeometry(0.82, 2.9, 0.14, 0.025, 3), sm.walnutWood);
    panel.position.set(-4.65 + i * 0.88, 1.45, 2.9);
    panel.castShadow = true;
    group.add(panel);
    const pull = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.52, 0.03), sm.metal);
    pull.position.set(-4.65 + i * 0.88 + 0.31, 1.46, 2.99);
    group.add(pull);
  }
  const bench = new THREE.Mesh(createRoundedBoxGeometry(1.85, 0.32, 0.52, 0.08, 4), sm.velvetTerracotta);
  bench.position.set(0, 0.3, 1.95);
  bench.castShadow = true;
  group.add(bench);
  addContactShadow(group, 0, 1.95, 2.2, 0.8, 0.35);
}

export function addGuestBedroomFurniture(group, sm, matPanel, matAccent, W, H, D) {
  const bedW = 1.9, bedD = 2.3;

  // 1. Minimalist Queen Bed with Walnut Headboard
  const headboard = new THREE.Mesh(createRoundedBoxGeometry(bedW + 0.2, 0.9, 0.08, 0.02, 3), sm.walnutWood);
  headboard.position.set(0, 0.45, -D / 2 + 0.2);
  headboard.castShadow = true;
  group.add(headboard);

  const bedBase = new THREE.Mesh(createRoundedBoxGeometry(bedW, 0.24, bedD, 0.03, 3), sm.walnutWood);
  bedBase.position.set(0, 0.12, -D / 2 + bedD / 2 + 0.2);
  bedBase.castShadow = true;
  group.add(bedBase);

  const mattress = new THREE.Mesh(createRoundedBoxGeometry(bedW - 0.06, 0.20, bedD - 0.1, 0.04, 3), sm.linen);
  mattress.position.set(0, 0.32, -D / 2 + bedD / 2 + 0.2);
  group.add(mattress);

  // Pillows and caramel bolster
  for (const px of [-0.36, 0.36]) {
    const pillow = new THREE.Mesh(createRoundedBoxGeometry(0.5, 0.12, 0.34, 0.05, 4), sm.linen);
    pillow.position.set(px, 0.44, -D / 2 + 0.52);
    pillow.castShadow = true;
    group.add(pillow);
  }
  const bolster = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 16), sm.velvetCaramel);
  bolster.rotation.z = Math.PI / 2;
  bolster.position.set(0, 0.44, -D / 2 + 0.78);
  bolster.castShadow = true;
  group.add(bolster);

  const throwBlanket = new THREE.Mesh(createRoundedBoxGeometry(bedW - 0.1, 0.04, 0.6, 0.02, 3), sm.velvetCaramel);
  throwBlanket.position.set(0, 0.35, -D / 2 + bedD - 0.1);
  throwBlanket.castShadow = true;
  group.add(throwBlanket);
  addContactShadow(group, 0, -D / 2 + bedD / 2 + 0.2, bedW + 0.4, bedD + 0.4, 0.45);

  // 2. Walnut Nightstands
  for (const nx of [-1, 1]) {
    const ns = new THREE.Mesh(createRoundedBoxGeometry(0.46, 0.38, 0.36, 0.02, 3), sm.walnutWood);
    ns.position.set(nx * (bedW / 2 + 0.38), 0.19, -D / 2 + 0.45);
    ns.castShadow = true;
    group.add(ns);

    const pull = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.015, 0.015), sm.metal);
    pull.position.set(nx * (bedW / 2 + 0.38), 0.22, -D / 2 + 0.64);
    group.add(pull);
    addContactShadow(group, nx * (bedW / 2 + 0.38), -D / 2 + 0.45, 0.6, 0.55, 0.3);

    // Modern globe table lamp
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.12, 8), sm.metal);
    lampStem.position.set(nx * (bedW / 2 + 0.38), 0.44, -D / 2 + 0.45);
    group.add(lampStem);
    const lampGlobe = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), sm.fixtureGlow);
    lampGlobe.position.set(nx * (bedW / 2 + 0.38), 0.53, -D / 2 + 0.45);
    group.add(lampGlobe);
  }

  // 3. Vanity/Writing Desk (on the right wall)
  const deskGroup = new THREE.Group();
  const desk = new THREE.Mesh(createRoundedBoxGeometry(1.3, 0.04, 0.55, 0.01, 3), sm.walnutWood);
  desk.position.set(W / 2 - 0.85, 0.74, 1.2);
  desk.rotation.y = -Math.PI / 2;
  desk.castShadow = true;
  deskGroup.add(desk);

  // Slender metal legs
  for (const lx of [W / 2 - 1.1, W / 2 - 0.6]) {
    for (const lz of [0.6, 1.8]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.72, 8), sm.metalDark);
      leg.position.set(lx, 0.36, lz);
      deskGroup.add(leg);
    }
  }
  addContactShadow(group, W / 2 - 0.85, 1.2, 0.8, 1.5, 0.35);

  // Backlit Round Brass Mirror on wall
  const mirrorFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.03, 32), sm.metal);
  mirrorFrame.rotation.x = Math.PI / 2;
  mirrorFrame.position.set(W / 2 - 0.02, 1.55, 1.2);
  deskGroup.add(mirrorFrame);

  const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.01, 32), sm.glass);
  mirror.rotation.x = Math.PI / 2;
  mirror.position.set(W / 2 - 0.04, 1.55, 1.2);
  deskGroup.add(mirror);

  // Bouclé Vanity Stool
  const stool = new THREE.Mesh(createRoundedBoxGeometry(0.38, 0.38, 0.38, 0.05, 4), sm.boucle);
  stool.position.set(W / 2 - 1.2, 0.19, 1.2);
  stool.castShadow = true;
  deskGroup.add(stool);
  addContactShadow(group, W / 2 - 1.2, 1.2, 0.55, 0.55, 0.3);

  group.add(deskGroup);

  // 4. Reading Cozy Corner (on the left side)
  const readingGroup = new THREE.Group();
  const rug = new THREE.Mesh(new THREE.CircleGeometry(0.9, 32), sm.rugMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(-W / 2 + 1.6, 0.005, 1.4);
  rug.receiveShadow = true;
  readingGroup.add(rug);

  // Caramel velvet armchair
  const chair = new THREE.Mesh(createRoundedBoxGeometry(0.65, 0.65, 0.65, 0.06, 4), sm.velvetCaramel);
  chair.position.set(-W / 2 + 1.6, 0.325, 1.4);
  chair.rotation.y = 0.6;
  chair.castShadow = true;
  readingGroup.add(chair);
  addContactShadow(group, -W / 2 + 1.6, 1.4, 0.95, 0.95, 0.4);

  // Pedestal table
  const pBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.45, 16), sm.marble);
  pBase.position.set(-W / 2 + 2.3, 0.225, 0.5);
  pBase.castShadow = true;
  readingGroup.add(pBase);
  const pTop = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.03, 16), sm.marbleNero);
  pTop.position.set(-W / 2 + 2.3, 0.46, 0.5);
  readingGroup.add(pTop);
  addContactShadow(group, -W / 2 + 2.3, 0.5, 0.55, 0.55, 0.3);

  // Potted olive plant
  const planter = new THREE.Mesh(createFlutedCylinderGeometry(0.14, 0.35, 12), sm.ceramicPot);
  planter.position.set(-W / 2 + 0.75, 0.175, 2.6);
  planter.castShadow = true;
  readingGroup.add(planter);
  addContactShadow(group, -W / 2 + 0.75, 2.6, 0.45, 0.45, 0.3);

  for (let l = 0; l < 4; l++) {
    const branch = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.65 + Math.random() * 0.3, 4), sm.foliage);
    branch.position.set(-W / 2 + 0.75 + (Math.random() - 0.5) * 0.15, 0.6 + Math.random() * 0.15, 2.6 + (Math.random() - 0.5) * 0.15);
    branch.rotation.set((Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4);
    readingGroup.add(branch);
  }

  group.add(readingGroup);

  // A slim luggage rack and open hanging rail give the guest room a
  // completely different purpose and silhouette from the master suite.
  const rack = new THREE.Group();
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.6, 8), sm.metalDark);
  rail.rotation.z = Math.PI / 2;
  rail.position.set(-3.7, 1.85, -1.8);
  rack.add(rail);
  for (const x of [-4.45, -2.95]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.75, 8), sm.metalDark);
    leg.position.set(x, 0.875, -1.8);
    rack.add(leg);
  }
  for (let i = 0; i < 3; i++) {
    const hanger = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.009, 6, 12, Math.PI), sm.metal);
    hanger.position.set(-4.15 + i * 0.42, 1.68, -1.8);
    hanger.rotation.z = Math.PI;
    rack.add(hanger);
  }
  const luggage = new THREE.Mesh(createRoundedBoxGeometry(0.92, 0.36, 0.46, 0.06, 3), sm.leatherCognac);
  luggage.position.set(-3.7, 0.32, -1.8);
  luggage.castShadow = true;
  rack.add(luggage);
  group.add(rack);
  addContactShadow(group, -3.7, -1.8, 2.1, 0.8, 0.35);
}
