/* eslint-disable */
import * as THREE from 'three';
import { createRoundedBoxGeometry, createFlutedCylinderGeometry } from '../geometries.js';
import { addContactShadow } from '../shadows.js';
import { tagPiece } from '../interactive.js';

export function addBathFurniture(group, sm, matAccent, W, H, D) {
  // Freestanding Oval Soaking Tub in Honed Travertine
  const tubShape = new THREE.Shape();
  tubShape.absellipse(0, 0, 1.0, 0.55, 0, Math.PI * 2, false, 0);
  const extrudeSettings = { depth: 0.55, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
  const tubGeo = new THREE.ExtrudeGeometry(tubShape, extrudeSettings);
  tubGeo.rotateX(Math.PI / 2);
  tubGeo.center();

  const tub = new THREE.Mesh(tubGeo, sm.marble);
  tub.position.set(-2.2, 0.3, -1.2);
  tub.castShadow = true; tub.receiveShadow = true;
  tagPiece(tub, {
    name: 'The Still Bath',
    materials: ['Calacatta marble', 'Polished brass'],
    description: 'An oval bath carved from one block of Calacatta, walls honed to twenty millimetres so the stone warms with the water.',
  });
  group.add(tub);
  addContactShadow(group, -2.2, -1.2, 2.4, 1.4, 0.5);

  // Floor-Mounted Polished Brass Tapware
  const tapStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.85, 10), sm.metal);
  tapStem.position.set(-1.1, 0.425, -1.2);
  group.add(tapStem);

  // Floating Calacatta Marble Vanity with Fluted Walnut Cabinetry
  const vanity = new THREE.Mesh(createRoundedBoxGeometry(2.4, 0.45, 0.55, 0.02, 3), sm.walnutWood);
  vanity.position.set(2.2, 0.65, -D / 2 + 0.32);
  vanity.castShadow = true;
  group.add(vanity);
  const vanityTop = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.04, 0.58), sm.marble);
  vanityTop.position.set(2.2, 0.88, -D / 2 + 0.32);
  group.add(vanityTop);
  const sink = new THREE.Mesh(createFlutedCylinderGeometry(0.22, 0.12, 16), sm.marble);
  sink.position.set(2.2, 0.96, -D / 2 + 0.32);
  sink.castShadow = true;
  group.add(sink);

  // Backlit Architectural Arch Mirror
  const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.03), sm.metal);
  mirrorFrame.position.set(2.2, 2.05, -D / 2 + 0.02);
  group.add(mirrorFrame);
  const mirror = new THREE.Mesh(new THREE.PlaneGeometry(1.32, 1.52), sm.glass);
  mirror.position.set(2.2, 2.05, -D / 2 + 0.04);
  group.add(mirror);

  // Toiletries on vanity top
  const bottle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 8), sm.glass);
  bottle1.position.set(1.4, 0.94, -D / 2 + 0.35);
  group.add(bottle1);
  const pump1 = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.02, 6), sm.metal);
  pump1.position.set(1.4, 0.99, -D / 2 + 0.35);
  group.add(pump1);
  const bottle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.10, 8), sm.ceramicPot);
  bottle2.position.set(1.5, 0.95, -D / 2 + 0.32);
  group.add(bottle2);

  // Luxury walk-in glass shower stall
  const showerGroup = new THREE.Group();
  const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(0.015, 2.4, 1.4), sm.glass);
  glassPanel.position.set(-W / 2 + 1.45, 1.2, 1.8);
  showerGroup.add(glassPanel);
  const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 0.015), sm.glass);
  frontPanel.position.set(-W / 2 + 0.7, 1.2, 2.5);
  showerGroup.add(frontPanel);
  const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.03, 2.4, 0.03), sm.metal);
  frameLeft.position.set(-W / 2 + 1.45, 1.2, 2.5);
  showerGroup.add(frameLeft);
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.03, 0.03), sm.metal);
  frameTop.position.set(-W / 2 + 0.725, 2.4, 2.5);
  showerGroup.add(frameTop);
  const showerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.8, 8), sm.metal);
  showerPipe.position.set(-W / 2 + 0.1, 1.6, 1.8);
  showerGroup.add(showerPipe);
  const showerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 12), sm.metal);
  showerHead.rotation.x = Math.PI / 2;
  showerHead.position.set(-W / 2 + 0.25, 2.3, 1.8);
  showerGroup.add(showerHead);
  group.add(showerGroup);
  addContactShadow(group, -W / 2 + 0.8, 1.8, 1.6, 1.6, 0.4);

  // Plush bouclé vanity stool
  const stool = new THREE.Mesh(createRoundedBoxGeometry(0.44, 0.44, 0.44, 0.06, 4), sm.boucle);
  stool.position.set(2.2, 0.22, 0.5);
  stool.castShadow = true;
  group.add(stool);
  addContactShadow(group, 2.2, 0.5, 0.65, 0.65, 0.45);
}
