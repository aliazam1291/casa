/* eslint-disable */
import * as THREE from 'three';
import { createRoundedBoxGeometry, createFlutedCylinderGeometry } from '../geometries.js';
import { addContactShadow } from '../shadows.js';

export function addHallFurniture(group, sm, matAccent, W, H, D) {
  // Round entry rug
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.95, 44), sm.rugMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.006, 0.3);
  rug.receiveShadow = true;
  group.add(rug);

  // Central channel-tufted bench — forest velvet, brass legs
  const benchTop = new THREE.Mesh(createRoundedBoxGeometry(2.0, 0.18, 0.62, 0.06, 4), sm.velvetForest);
  benchTop.position.set(0, 0.46, 0.3);
  benchTop.castShadow = true; benchTop.receiveShadow = true;
  group.add(benchTop);
  for (let t = 0; t < 4; t++) {
    const tuft = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.02, 0.58), sm.metalDark);
    tuft.position.set(-0.72 + t * 0.48, 0.56, 0.3);
    group.add(tuft);
  }
  for (const bx of [-0.9, 0.9]) {
    for (const bz of [-0.24, 0.24]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.016, 0.38, 10), sm.metal);
      leg.position.set(bx, 0.21, 0.3 + bz);
      group.add(leg);
    }
  }
  addContactShadow(group, 0, 0.3, 2.3, 0.95, 0.5);

  // Flanking marble plinths with objets
  [-1, 1].forEach((sgn, i) => {
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.0, 0.42), sm.marble);
    plinth.position.set(sgn * 2.7, 0.5, -1.6);
    plinth.castShadow = true; plinth.receiveShadow = true;
    group.add(plinth);
    if (i === 0) {
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), sm.metal);
      orb.position.set(sgn * 2.7, 1.16, -1.6);
      orb.castShadow = true;
      group.add(orb);
    } else {
      const vessel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.34, 20), sm.ceramicPot);
      vessel.position.set(sgn * 2.7, 1.17, -1.6);
      vessel.castShadow = true;
      group.add(vessel);
    }
    addContactShadow(group, sgn * 2.7, -1.6, 0.7, 0.7, 0.4);
  });

  // Tall branch vase in the near corner
  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.11, 0.72, 20), sm.ceramicPot);
  vase.position.set(-(W / 2) + 1.2, 0.36, 1.9);
  vase.castShadow = true;
  group.add(vase);
  for (let s = 0; s < 6; s++) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.012, 1.0 + (s % 3) * 0.25, 5), sm.walnutWood);
    stem.position.set(-(W / 2) + 1.2 + (s - 3) * 0.05, 1.15 + (s % 3) * 0.12, 1.9 + ((s % 2) - 0.5) * 0.15);
    stem.rotation.z = (s - 3) * 0.12;
    group.add(stem);
  }
  addContactShadow(group, -(W / 2) + 1.2, 1.9, 0.7, 0.7, 0.4);
}
