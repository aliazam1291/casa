/* eslint-disable */
import * as THREE from 'three';
import { createRoundedBoxGeometry, createFlutedCylinderGeometry } from '../geometries.js';
import { addContactShadow } from '../shadows.js';
import { tagPieceById } from '../interactive.js';

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
  tagPieceById(top, 'courtyard-dining/the-heirloom-table');
  group.add(top);

  for (const bx of [-1.1, 1.1]) {
    const base = new THREE.Mesh(createFlutedCylinderGeometry(0.32, 0.72, 20), sm.walnutWood);
    base.position.set(bx, 0.36, 0);
    base.castShadow = true;
    group.add(base);
  }
  addContactShadow(group, 0, 0, 4.0, 1.8, 0.5);

  // Upholstered Curved Bouclé Dining Chairs (6)
  const chairSet = new THREE.Group();

  // Geometry is built ONCE and shared across all six chairs. It used to be
  // constructed inside the loop, so six chairs meant 6 seats + 6 backs + 24
  // legs + 24 caps = 60 separate geometries for what is really four shapes.
  const seatGeo = createRoundedBoxGeometry(0.48, 0.07, 0.45, 0.03, 3);
  const cushionGeo = createRoundedBoxGeometry(0.44, 0.05, 0.41, 0.025, 3);
  const backGeo = createRoundedBoxGeometry(0.48, 0.42, 0.06, 0.03, 3);
  const legGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.45, 8);
  const capGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.05, 8);

  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const cx = -1.2 + i * 1.2;
      const cz = side * (Wt / 2 + 0.42);
      // A few degrees of yaw per chair. Six chairs squared perfectly to the
      // table read as a showroom display; a slight turn reads as a room
      // someone has actually eaten in.
      const yaw = ((i - 1) * 0.05 + (side > 0 ? 0.03 : -0.04));

      const seat = new THREE.Mesh(seatGeo, sm.walnutWood);
      seat.position.set(cx, 0.46, cz);
      seat.rotation.y = yaw;
      seat.castShadow = true;
      chairSet.add(seat);

      // A separate bouclé cushion sitting on a timber seat frame, rather than
      // the whole seat being one bouclé slab — two materials meeting is what
      // makes it read as upholstery.
      const cushion = new THREE.Mesh(cushionGeo, sm.boucle);
      cushion.position.set(cx, 0.515, cz);
      cushion.rotation.y = yaw;
      cushion.castShadow = true;
      chairSet.add(cushion);

      // Reclined, not vertical. A dining back at 90° is the clearest tell of
      // an untouched primitive.
      const back = new THREE.Mesh(backGeo, sm.boucle);
      back.position.set(cx, 0.73, cz + side * 0.21);
      back.rotation.y = yaw;
      back.rotation.x = side * 0.14;
      back.castShadow = true;
      chairSet.add(back);

      for (const legX of [-0.2, 0.2]) {
        for (const legZ of [-0.18, 0.18]) {
          const leg = new THREE.Mesh(legGeo, sm.walnutWood);
          leg.position.set(cx + legX, 0.225, cz + legZ);
          leg.rotation.y = yaw;
          chairSet.add(leg);
          const cap = new THREE.Mesh(capGeo, sm.metal);
          cap.position.set(cx + legX, 0.025, cz + legZ);
          chairSet.add(cap);
        }
      }
      addContactShadow(group, cx, cz, 0.6, 0.6, 0.35);
    }
  }
  tagPieceById(chairSet, 'courtyard-dining/the-dining-chairs');
  group.add(chairSet);

  // Multi-Ring Sculptural Brass Chandelier
  const chandelier = new THREE.Group();
  const ringY = H - 1.1;

  // It used to hang from nothing — the ring and its orbs simply floated at
  // ceiling height with no canopy and no cable, which is the single thing the
  // eye checks first on a suspended fixture. Canopy at the slab, three cables
  // down to the ring.
  const canopy = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.05, 16), sm.metal);
  canopy.position.set(0, H - 0.025, 0);
  chandelier.add(canopy);

  // One geometry, three instances — the cable is the same object each time.
  const cableGeo = new THREE.CylinderGeometry(0.004, 0.004, H - 0.05 - ringY, 6);
  for (let c = 0; c < 3; c++) {
    const ang = (c / 3) * Math.PI * 2;
    const cable = new THREE.Mesh(cableGeo, sm.metalDark);
    cable.position.set(Math.cos(ang) * 0.34, (H - 0.05 + ringY) / 2, Math.sin(ang) * 0.34);
    chandelier.add(cable);
  }

  // Two concentric rings at slightly different heights rather than one, so the
  // fixture reads as "multi-ring" from the side as well as from below.
  for (const [radius, drop] of [[0.7, 0], [0.44, 0.16]]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.015, 10, 28), sm.metal);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, ringY - drop, 0);
    chandelier.add(ring);
  }

  // Spokes tying the inner ring to the outer one — the join a real fixture has.
  const spokeGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.3, 6);
  for (let s = 0; s < 3; s++) {
    const ang = (s / 3) * Math.PI * 2 + 0.5;
    const spoke = new THREE.Mesh(spokeGeo, sm.metal);
    spoke.position.set(Math.cos(ang) * 0.57, ringY - 0.08, Math.sin(ang) * 0.57);
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.y = -ang;
    chandelier.add(spoke);
  }

  const orbGeo = new THREE.SphereGeometry(0.075, 10, 8);
  const collarGeo = new THREE.CylinderGeometry(0.018, 0.026, 0.05, 8);
  for (let a = 0; a < 6; a++) {
    const ang = (a / 6) * Math.PI * 2;
    const x = Math.cos(ang) * 0.7;
    const z = Math.sin(ang) * 0.7;
    // Orbs hang just BELOW the ring on a small brass collar, instead of being
    // centred inside it — that gap is what makes them read as bulbs.
    const collar = new THREE.Mesh(collarGeo, sm.metal);
    collar.position.set(x, ringY - 0.045, z);
    chandelier.add(collar);
    const orb = new THREE.Mesh(orbGeo, sm.fixtureGlow);
    orb.position.set(x, ringY - 0.135, z);
    chandelier.add(orb);
  }
  // Three smaller orbs on the inner ring, staggered against the outer six.
  for (let a = 0; a < 3; a++) {
    const ang = (a / 3) * Math.PI * 2 + Math.PI / 6;
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), sm.fixtureGlow);
    orb.position.set(Math.cos(ang) * 0.44, ringY - 0.26, Math.sin(ang) * 0.44);
    chandelier.add(orb);
  }

  tagPieceById(chandelier, 'courtyard-dining/the-ring-chandelier');
  group.add(chandelier);

  // ── Styling on the table ────────────────────────────────────────────────
  // The table was a bare slab. A composed room is the brand's whole argument,
  // so the dining table is styled: a runner, a low centrepiece bowl and a pair
  // of tapers. Deliberately sparse — the Brand Book's "three materials, not
  // eight" — and all low-segment primitives so it costs almost nothing.
  const styling = new THREE.Group();

  const runner = new THREE.Mesh(createRoundedBoxGeometry(2.2, 0.012, 0.42, 0.01, 2), sm.linen);
  runner.position.set(0, 0.786, 0);
  runner.receiveShadow = true;
  styling.add(runner);

  const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), sm.ceramicPot);
  bowl.rotation.x = Math.PI;
  bowl.position.set(0, 0.86, 0);
  bowl.castShadow = true;
  styling.add(bowl);

  const candleGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.26, 8);
  const holderGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.04, 10);
  const flameGeo = new THREE.SphereGeometry(0.018, 6, 5);
  for (const cxp of [-0.72, 0.72]) {
    const holder = new THREE.Mesh(holderGeo, sm.metal);
    holder.position.set(cxp, 0.812, 0);
    holder.castShadow = true;
    styling.add(holder);
    const candle = new THREE.Mesh(candleGeo, sm.linen);
    candle.position.set(cxp, 0.962, 0);
    styling.add(candle);
    const flame = new THREE.Mesh(flameGeo, sm.fixtureGlow);
    flame.position.set(cxp, 1.104, 0);
    styling.add(flame);
  }

  tagPieceById(styling, 'courtyard-dining/the-heirloom-table');
  group.add(styling);
}
