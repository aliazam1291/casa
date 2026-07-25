/* eslint-disable */
import * as THREE from 'three';
import { createRoundedBoxGeometry, createFlutedCylinderGeometry } from '../geometries.js';
import { addContactShadow } from '../shadows.js';

export function addLivingFurniture(group, sm, matAccent, W, H, D) {
  const sofaGroup = new THREE.Group();
  const body = sm.leatherCognac;

  const base = new THREE.Mesh(createRoundedBoxGeometry(3.35, 0.24, 1.28, 0.06, 4), body);
  base.position.set(-1.2, 0.18, -0.8);
  base.castShadow = true; base.receiveShadow = true;
  sofaGroup.add(base);

  for (let i = 0; i < 3; i++) {
    const seat = new THREE.Mesh(createRoundedBoxGeometry(0.96, 0.22, 1.02, 0.09, 4), body);
    seat.position.set(-2.32 + i * 1.04, 0.39, -0.74);
    seat.castShadow = true; seat.receiveShadow = true;
    sofaGroup.add(seat);
  }
  for (let i = 0; i < 3; i++) {
    const back = new THREE.Mesh(createRoundedBoxGeometry(0.96, 0.52, 0.28, 0.11, 4), body);
    back.position.set(-2.32 + i * 1.04, 0.62, -1.2);
    back.castShadow = true;
    sofaGroup.add(back);
  }
  for (const ax of [-2.98, 0.58]) {
    const arm = new THREE.Mesh(createRoundedBoxGeometry(0.26, 0.54, 1.24, 0.1, 4), body);
    arm.position.set(ax, 0.44, -0.8);
    arm.castShadow = true;
    sofaGroup.add(arm);
  }

  const pMats = [sm.linen, sm.velvetForest, sm.linen];
  for (let i = 0; i < 3; i++) {
    const pillow = new THREE.Mesh(createRoundedBoxGeometry(0.5, 0.34, 0.16, 0.07, 4), pMats[i]);
    pillow.position.set(-2.15 + i * 0.98, 0.56, -1.02);
    pillow.rotation.y = (i - 1) * 0.16;
    pillow.castShadow = true;
    sofaGroup.add(pillow);
  }

  const feetCoords = [[-2.82, -1.32], [-0.35, -1.32], [-2.82, -0.28], [-0.35, -0.28]];
  feetCoords.forEach(([fx, fz]) => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.014, 0.16, 10), sm.metal);
    foot.position.set(fx, 0.08, fz);
    sofaGroup.add(foot);
  });

  group.add(sofaGroup);
  addContactShadow(group, -1.2, -0.7, 3.7, 2.3, 0.6);

  // Fluted marble drum coffee table
  const tableGroup = new THREE.Group();
  const coffeeTable = new THREE.Mesh(createFlutedCylinderGeometry(0.65, 0.36, 22), sm.marble);
  coffeeTable.position.set(0.6, 0.18, 0.3);
  coffeeTable.castShadow = true; coffeeTable.receiveShadow = true;
  tableGroup.add(coffeeTable);
  const topSlab = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.05, 32), sm.marbleNero);
  topSlab.position.set(0.6, 0.385, 0.3);
  topSlab.castShadow = true;
  tableGroup.add(topSlab);
  const brassLip = new THREE.Mesh(new THREE.TorusGeometry(0.685, 0.012, 8, 32), sm.metal);
  brassLip.rotation.x = Math.PI / 2;
  brassLip.position.set(0.6, 0.4, 0.3);
  tableGroup.add(brassLip);
  group.add(tableGroup);
  addContactShadow(group, 0.6, 0.3, 1.5, 1.5, 0.5);

  // Calacatta marble side table
  const sideBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.55, 28), sm.marble);
  sideBase.position.set(-3.5, 0.275, -1.0);
  sideBase.castShadow = true; sideBase.receiveShadow = true;
  group.add(sideBase);
  const sideTop = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.045, 28), sm.marbleNero);
  sideTop.position.set(-3.5, 0.57, -1.0);
  sideTop.castShadow = true;
  group.add(sideTop);
  const brassBowl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), sm.metal);
  brassBowl.position.set(-3.5, 0.6, -1.0);
  group.add(brassBowl);
  addContactShadow(group, -3.5, -1.0, 0.95, 0.95, 0.4);

  // Book stack
  const bookColors = [sm.velvetTerracotta, sm.walnutWood, sm.velvetNavy];
  for (let b = 0; b < 3; b++) {
    const bk = new THREE.Mesh(new THREE.BoxGeometry(0.34 - b * 0.03, 0.032, 0.25 - b * 0.02), bookColors[b]);
    bk.position.set(0.48 + (b - 1) * 0.01, 0.42 + b * 0.032, 0.2);
    bk.rotation.y = (b - 1) * 0.04;
    bk.castShadow = true;
    group.add(bk);
  }

  // Smoked Glass Vessel Vase
  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.11, 0.26, 16), sm.glass);
  vase.position.set(0.74, 0.54, 0.35);
  group.add(vase);

  // Brass Candle Holder Trio
  for (let c = 0; c < 3; c++) {
    const ch = 0.10 + c * 0.06;
    const candleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, ch, 10), sm.metal);
    candleBase.position.set(0.35 + c * 0.12, 0.40 + ch / 2, 0.42);
    group.add(candleBase);
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.08, 8), sm.linen);
    wick.position.set(0.35 + c * 0.12, 0.40 + ch + 0.04, 0.42);
    group.add(wick);
  }

  // Designer Lounge Chair
  const chairGroup = new THREE.Group();
  const cSeat = new THREE.Mesh(createRoundedBoxGeometry(0.78, 0.12, 0.72, 0.05, 4), sm.leatherCognac);
  cSeat.position.set(2.4, 0.28, -1.2);
  cSeat.rotation.y = -0.4;
  cSeat.castShadow = true;
  chairGroup.add(cSeat);
  const cBack = new THREE.Mesh(createRoundedBoxGeometry(0.78, 0.65, 0.1, 0.05, 4), sm.leatherCognac);
  cBack.position.set(2.25, 0.64, -1.48);
  cBack.rotation.y = -0.4;
  cBack.castShadow = true;
  chairGroup.add(cBack);
  for (const arm of [-0.34, 0.34]) {
    const armrest = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.55), sm.leatherCognac);
    armrest.position.set(2.32 + arm * 0.85, 0.42, -1.34);
    armrest.rotation.y = -0.4;
    chairGroup.add(armrest);
  }
  for (const legX of [-0.34, 0.34]) {
    for (const legZ of [-0.30, 0.30]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 10), sm.metal);
      leg.position.set(2.4 + legX, 0.14, -1.2 + legZ);
      chairGroup.add(leg);
    }
  }
  const chairCush = new THREE.Mesh(createRoundedBoxGeometry(0.42, 0.18, 0.1, 0.04, 3), sm.velvetNavy);
  chairCush.position.set(2.30, 0.50, -1.40);
  chairCush.rotation.y = -0.4;
  chairGroup.add(chairCush);
  group.add(chairGroup);
  addContactShadow(group, 2.4, -1.3, 1.2, 1.2, 0.45);
}
