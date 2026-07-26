/* eslint-disable */
import * as THREE from 'three';
import { createRoundedBoxGeometry, createFlutedCylinderGeometry } from '../geometries.js';
import { addContactShadow } from '../shadows.js';
import { tagPiece } from '../interactive.js';

export function addStudyFurniture(group, sm, matPanel, matAccent, W, H, D) {
  // Executive Caramel Walnut Desk with Saddle Leather Inlay & Brass Edge Trim
  const desk = new THREE.Mesh(createRoundedBoxGeometry(2.3, 0.06, 0.95, 0.03, 3), sm.walnutWood);
  desk.position.set(-0.5, 0.78, -0.4);
  desk.castShadow = true;
  tagPiece(desk, {
    name: 'The Writing Desk',
    materials: ['Caramel walnut', 'Cognac saddle leather', 'Champagne brass'],
    description: 'A walnut desk with a hand-skived saddle-leather inlay and a brass edge trim, the grain running unbroken across the full span.',
  });
  group.add(desk);
  const inlay = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.65), sm.leatherCognac);
  inlay.rotation.x = -Math.PI / 2;
  inlay.position.set(-0.5, 0.811, -0.4);
  group.add(inlay);
  for (const [tw, td, tx, tz] of [[2.36, 0.015, 0, -0.88], [2.36, 0.015, 0, 0.08], [0.015, 0.98, -1.17, -0.4], [0.015, 0.98, 0.17, -0.4]]) {
    const trim = new THREE.Mesh(new THREE.BoxGeometry(tw, 0.065, td), sm.metal);
    trim.position.set(-0.5 + tx, 0.78, -0.4 + tz);
    group.add(trim);
  }
  for (const dx of [-0.95, 0.95]) {
    const leg = new THREE.Mesh(createRoundedBoxGeometry(0.06, 0.75, 0.8, 0.02, 2), sm.walnutWood);
    leg.position.set(-0.5 + dx, 0.38, -0.4);
    group.add(leg);
  }
  addContactShadow(group, -0.5, -0.4, 2.6, 1.2, 0.45);

  // Desk accessories
  const penHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.10, 10), sm.metal);
  penHolder.position.set(-0.1, 0.86, -0.55);
  group.add(penHolder);
  const deskBook = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.16), sm.velvetTerracotta);
  deskBook.position.set(-0.75, 0.825, -0.3);
  group.add(deskBook);

  // Ergonomic Saddle Leather Desk Chair
  const chair = new THREE.Mesh(createRoundedBoxGeometry(0.65, 0.1, 0.6, 0.04, 3), sm.leatherCognac);
  chair.position.set(-0.5, 0.48, 0.45);
  chair.castShadow = true;
  group.add(chair);
  const back = new THREE.Mesh(createRoundedBoxGeometry(0.65, 0.75, 0.08, 0.04, 3), sm.leatherCognac);
  back.position.set(-0.5, 0.88, 0.72);
  group.add(back);
  addContactShadow(group, -0.5, 0.5, 0.8, 0.8, 0.4);

  // Architectural Slatted Timber Library Shelving
  const spineColors = [sm.velvetTerracotta, sm.velvetForest, sm.velvetNavy, sm.walnutWood, sm.leatherCognac];
  for (let r = 0; r < 4; r++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 2.8), sm.walnutWood);
    shelf.position.set(W / 2 - 0.25, 0.6 + r * 0.72, -0.8);
    group.add(shelf);
    for (let b = 0; b < 8; b++) {
      const bw = 0.04 + Math.random() * 0.04;
      const bh = 0.20 + Math.random() * 0.12;
      const spine = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.14), spineColors[b % spineColors.length]);
      spine.position.set(W / 2 - 0.25, 0.62 + r * 0.72 + bh / 2, -2.0 + b * 0.32);
      spine.castShadow = true;
      group.add(spine);
    }
  }

  // Reading nook area rug
  const nookRug = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), sm.rugMat);
  nookRug.rotation.x = -Math.PI / 2;
  nookRug.position.set(-2.8, 0.006, 1.2);
  nookRug.receiveShadow = true;
  group.add(nookRug);

  // Classic high-back leather armchair
  const armGroup = new THREE.Group();
  const aSeat = new THREE.Mesh(createRoundedBoxGeometry(0.75, 0.18, 0.70, 0.06, 3), sm.leatherCognac);
  aSeat.position.set(-2.8, 0.24, 1.2);
  aSeat.rotation.y = 0.55;
  aSeat.castShadow = true;
  armGroup.add(aSeat);
  const aBack = new THREE.Mesh(createRoundedBoxGeometry(0.75, 0.72, 0.16, 0.06, 3), sm.leatherCognac);
  aBack.position.set(-3.05, 0.66, 1.38);
  aBack.rotation.y = 0.55;
  aBack.castShadow = true;
  armGroup.add(aBack);
  const aOtt = new THREE.Mesh(createRoundedBoxGeometry(0.50, 0.14, 0.40, 0.05, 3), sm.leatherCognac);
  aOtt.position.set(-2.3, 0.16, 0.85);
  aOtt.rotation.y = 0.55;
  aOtt.castShadow = true;
  armGroup.add(aOtt);
  tagPiece(armGroup, {
    name: 'The Reading Chair',
    materials: ['Cognac saddle leather', 'Solid walnut'],
    description: 'A high-backed armchair and ottoman in the study’s own reading nook, angled toward the window rather than the desk.',
  });
  group.add(armGroup);
  addContactShadow(group, -2.7, 1.1, 1.3, 1.3, 0.45);

  // Marble side table
  const readTable = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.5, 16), sm.marbleNero);
  readTable.position.set(-3.4, 0.25, 0.4);
  readTable.castShadow = true;
  tagPiece(readTable, {
    name: 'The Side Table',
    materials: ['Nero Marquina marble'],
    description: 'A single turned drum in Nero Marquina, kept low and close to the reading chair for a cup or a closed book.',
  });
  group.add(readTable);
  addContactShadow(group, -3.4, 0.4, 0.55, 0.55, 0.35);

  // Reading floor lamp
  const lampGroup = new THREE.Group();
  const lBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 12), sm.metal);
  lBase.position.set(-3.6, 0.01, 1.8);
  lampGroup.add(lBase);
  const lStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.45, 8), sm.metal);
  lStem.position.set(-3.6, 0.725, 1.8);
  lampGroup.add(lStem);
  const lShade = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.14, 0.18, 12), sm.metal);
  lShade.rotation.z = -0.45;
  lShade.position.set(-3.45, 1.45, 1.8);
  lampGroup.add(lShade);
  const lBulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), sm.fixtureGlow);
  lBulb.position.set(-3.41, 1.40, 1.8);
  lampGroup.add(lBulb);
  tagPiece(lampGroup, {
    name: 'The Reading Lamp',
    materials: ['Blackened brass'],
    description: 'A slim arcing floor lamp, its shade angled low over the reading chair so the light falls on the page and nowhere else.',
  });
  group.add(lampGroup);
  addContactShadow(group, -3.6, 1.8, 0.4, 0.4, 0.3);
}
