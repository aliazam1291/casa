/* eslint-disable */
import * as THREE from 'three';
import { createRoundedBoxGeometry, createFlutedCylinderGeometry } from '../geometries.js';
import { addContactShadow } from '../shadows.js';

export function addKitchenFurniture(group, sm, matPanel, matAccent, W, H, D) {
  // Nero Marquina Dark Marble Kitchen Island
  const island = new THREE.Mesh(createRoundedBoxGeometry(3.6, 0.94, 1.2, 0.03, 3), sm.marbleNero);
  island.position.set(0, 0.47, 0);
  island.castShadow = true; island.receiveShadow = true;
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
  for (let i = 0; i < 3; i++) {
    const sx = -1.1 + i * 1.1;
    const seat = new THREE.Mesh(createRoundedBoxGeometry(0.42, 0.06, 0.4, 0.03, 3), sm.leatherCognac);
    seat.position.set(sx, 0.72, 1.05);
    seat.castShadow = true;
    group.add(seat);
    const footrest = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.012, 8, 16), sm.metal);
    footrest.rotation.x = Math.PI / 2;
    footrest.position.set(sx, 0.3, 1.05);
    group.add(footrest);
    addContactShadow(group, sx, 1.05, 0.55, 0.55, 0.35);
  }

  // Floating Brass Linear Pendant Light
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.4, 12), sm.metal);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, H - 1.2, 0);
  group.add(bar);
  for (const cx of [-0.9, 0, 0.9]) {
    const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.8, 6), sm.metal);
    drop.position.set(cx, H - 0.8, 0);
    group.add(drop);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), sm.fixtureGlow);
    bulb.position.set(cx, H - 1.24, 0);
    group.add(bulb);
  }
}
