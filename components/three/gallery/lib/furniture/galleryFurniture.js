/* eslint-disable */
import * as THREE from 'three';
import { createRoundedBoxGeometry, createFlutedCylinderGeometry } from '../geometries.js';
import { addContactShadow } from '../shadows.js';

export function addGalleryFurniture(group, sm, matAccent, W, H, D, name = '') {
  if (name.includes('pavilion') || name.includes('skyline')) {
    // L-shaped modern sofa (creamy bouclé)
    const sofa = new THREE.Group();
    const backSeat = new THREE.Mesh(createRoundedBoxGeometry(3.0, 0.36, 1.0, 0.08, 4), sm.boucle);
    backSeat.position.set(-0.5, 0.18, -1.2);
    backSeat.castShadow = true;
    sofa.add(backSeat);
    const backRest = new THREE.Mesh(createRoundedBoxGeometry(3.0, 0.45, 0.24, 0.08, 4), sm.boucle);
    backRest.position.set(-0.5, 0.54, -1.68);
    backRest.castShadow = true;
    sofa.add(backRest);
    const sideSeat = new THREE.Mesh(createRoundedBoxGeometry(1.0, 0.36, 2.0, 0.08, 4), sm.boucle);
    sideSeat.position.set(1.5, 0.18, -0.7);
    sideSeat.castShadow = true;
    sofa.add(sideSeat);
    const sideRest = new THREE.Mesh(createRoundedBoxGeometry(0.24, 0.45, 2.0, 0.08, 4), sm.boucle);
    sideRest.position.set(2.0, 0.54, -0.7);
    sideRest.castShadow = true;
    sofa.add(sideRest);
    const pMats = [sm.velvetNavy, sm.velvetForest, sm.velvetTerracotta];
    for (let i = 0; i < 3; i++) {
      const pillow = new THREE.Mesh(createRoundedBoxGeometry(0.48, 0.48, 0.14, 0.05, 4), pMats[i % pMats.length]);
      pillow.position.set(-1.2 + i * 0.9, 0.50, -1.48);
      pillow.rotation.y = (i - 1) * 0.12;
      sofa.add(pillow);
    }
    group.add(sofa);
    addContactShadow(group, 0.5, -0.9, 3.4, 2.4, 0.55);

    // Low marble circular coffee table
    const coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.28, 24), sm.marble);
    coffee.position.set(-0.6, 0.14, 0.4);
    coffee.castShadow = true; coffee.receiveShadow = true;
    group.add(coffee);
    addContactShadow(group, -0.6, 0.4, 1.25, 1.25, 0.45);
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.20, 10), sm.glass);
    bottle.position.set(-0.6, 0.38, 0.4);
    group.add(bottle);

    // Tall architectural planter
    const planter = new THREE.Mesh(createFlutedCylinderGeometry(0.3, 0.8, 14), sm.ceramicPot);
    planter.position.set(-4.0, 0.4, -2.6);
    planter.castShadow = true;
    group.add(planter);
    addContactShadow(group, -4.0, -2.6, 0.8, 0.8, 0.4);
    for (let l = 0; l < 5; l++) {
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.08, 1.2 + Math.random() * 0.5, 5), sm.foliage);
      blade.position.set(-4.0 + (Math.random() - 0.5) * 0.2, 1.2, -2.6 + (Math.random() - 0.5) * 0.2);
      blade.rotation.set((Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.6);
      group.add(blade);
    }
  } else {
    // Two modern wood/linen sun loungers (terrace)
    for (const lx of [-1.0, 1.0]) {
      const lounger = new THREE.Group();
      const frame = new THREE.Mesh(createRoundedBoxGeometry(0.68, 0.08, 1.9, 0.02, 3), sm.darkWood);
      frame.position.set(lx, 0.1, 0.5);
      frame.castShadow = true;
      lounger.add(frame);
      const cush = new THREE.Mesh(createRoundedBoxGeometry(0.64, 0.1, 1.84, 0.04, 3), sm.linen);
      cush.position.set(lx, 0.18, 0.5);
      cush.castShadow = true;
      lounger.add(cush);
      const back = new THREE.Mesh(createRoundedBoxGeometry(0.64, 0.1, 0.65, 0.04, 3), sm.linen);
      back.position.set(lx, 0.35, -0.2);
      back.rotation.x = -0.35;
      back.castShadow = true;
      lounger.add(back);
      group.add(lounger);
      addContactShadow(group, lx, 0.5, 0.9, 2.1, 0.45);
    }

    // Linear outdoor fireplace table
    const fpTable = new THREE.Mesh(createRoundedBoxGeometry(0.55, 0.45, 1.6, 0.03, 3), sm.marbleNero);
    fpTable.position.set(0, 0.225, 2.2);
    fpTable.castShadow = true;
    group.add(fpTable);
    addContactShadow(group, 0, 2.2, 0.9, 1.9, 0.5);
    const fireGlow = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 1.0), sm.fixtureGlow);
    fireGlow.position.set(0, 0.46, 2.2);
    group.add(fireGlow);
  }
}
