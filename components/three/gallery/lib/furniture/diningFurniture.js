/* eslint-disable */
import * as THREE from 'three';
import { createRoundedBoxGeometry, createFlutedCylinderGeometry } from '../geometries.js';
import { addContactShadow } from '../shadows.js';

export function addDiningFurniture(group, sm, matPanel, matAccent, W, H, D) {
  // Capsule Calacatta Marble Dining Table
  const tableShape = new THREE.Shape();
  const L = 3.6, Wt = 1.1, R = Wt / 2;
  tableShape.absarc(-L / 2 + R, 0, R, Math.PI / 2, -Math.PI / 2, true);
  tableShape.absarc(L / 2 - R, 0, R, -Math.PI / 2, Math.PI / 2, true);
  const tableGeo = new THREE.ExtrudeGeometry(tableShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 });
  tableGeo.rotateX(Math.PI / 2);
  tableGeo.center();

  const top = new THREE.Mesh(tableGeo, sm.marble);
  top.position.set(0, 0.75, 0);
  top.castShadow = true; top.receiveShadow = true;
  group.add(top);

  for (const bx of [-1.1, 1.1]) {
    const base = new THREE.Mesh(createFlutedCylinderGeometry(0.32, 0.72, 20), sm.walnutWood);
    base.position.set(bx, 0.36, 0);
    base.castShadow = true;
    group.add(base);
  }
  addContactShadow(group, 0, 0, 4.0, 1.8, 0.5);

  // Upholstered Curved Bouclé Dining Chairs (6)
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const cx = -1.2 + i * 1.2;
      const cz = side * (Wt / 2 + 0.42);
      const seat = new THREE.Mesh(createRoundedBoxGeometry(0.48, 0.06, 0.45, 0.03, 3), sm.boucle);
      seat.position.set(cx, 0.48, cz);
      seat.castShadow = true;
      group.add(seat);
      const back = new THREE.Mesh(createRoundedBoxGeometry(0.48, 0.42, 0.06, 0.03, 3), sm.boucle);
      back.position.set(cx, 0.71, cz + side * 0.2);
      group.add(back);
      for (const legX of [-0.2, 0.2]) {
        for (const legZ of [-0.18, 0.18]) {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 8), sm.walnutWood);
          leg.position.set(cx + legX, 0.225, cz + legZ);
          group.add(leg);
          const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.05, 8), sm.metal);
          cap.position.set(cx + legX, 0.025, cz + legZ);
          group.add(cap);
        }
      }
      addContactShadow(group, cx, cz, 0.6, 0.6, 0.35);
    }
  }

  // Multi-Ring Sculptural Brass Chandelier
  const chand = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.015, 12, 32), sm.metal);
  chand.rotation.x = Math.PI / 2;
  chand.position.set(0, H - 1.1, 0);
  group.add(chand);
  for (let a = 0; a < 6; a++) {
    const ang = (a / 6) * Math.PI * 2;
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), sm.fixtureGlow);
    orb.position.set(Math.cos(ang) * 0.7, H - 1.1, Math.sin(ang) * 0.7);
    group.add(orb);
  }
}
