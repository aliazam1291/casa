/* eslint-disable */
import * as THREE from 'three';
import { createRoundedBoxGeometry, createFlutedCylinderGeometry } from '../geometries.js';
import { addContactShadow } from '../shadows.js';
import { tagPiece } from '../interactive.js';

function addWineCellarFurniture(group, sm, W, H, D) {
  // 1. Central Tasting Table (Walnut slab, brass/dark-metal legs)
  const table = new THREE.Mesh(createRoundedBoxGeometry(2.0, 0.06, 0.85, 0.02, 3), sm.walnutWood);
  table.position.set(0, 0.9, 0.5);
  table.castShadow = true;
  group.add(table);

  const legGroup = new THREE.Group();
  for (const tx of [-0.8, 0.8]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8), sm.metalDark);
    leg.position.set(tx, 0.45, 0.5);
    legGroup.add(leg);
  }
  group.add(legGroup);
  addContactShadow(group, 0, 0.5, 2.2, 1.0, 0.45);

  // 2. Leather Tasting Stools (2)
  for (const sx of [-0.6, 0.6]) {
    const stool = new THREE.Mesh(createRoundedBoxGeometry(0.38, 0.06, 0.38, 0.03, 3), sm.leatherCognac);
    stool.position.set(sx, 0.62, 1.2);
    stool.castShadow = true;
    group.add(stool);
    const sLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.56, 8), sm.metalDark);
    sLeg.position.set(sx, 0.28, 1.2);
    group.add(sLeg);
    addContactShadow(group, sx, 1.2, 0.5, 0.5, 0.35);
  }

  // 3. Staged items on table (tray, bottle, 2 wine glasses)
  const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.21, 0.02, 16), sm.metal);
  tray.position.set(-0.2, 0.94, 0.5);
  group.add(tray);

  const wineBottle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.22, 12), sm.glass);
  wineBottle.position.set(-0.2, 1.05, 0.5);
  group.add(wineBottle);
  const bottleNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.06, 12), sm.glass);
  bottleNeck.position.set(-0.2, 1.18, 0.5);
  group.add(bottleNeck);

  for (const gz of [-0.12, 0.12]) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.1, 8), sm.glass);
    stem.position.set(0.3, 0.98, 0.5 + gz);
    group.add(stem);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.005, 12), sm.glass);
    base.position.set(0.3, 0.9325, 0.5 + gz);
    group.add(base);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.02, 0.06, 12), sm.glass);
    bowl.position.set(0.3, 1.05, 0.5 + gz);
    group.add(bowl);
  }

  // 4. Suspended Candelabra Chandelier above the table
  const candelabra = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.015, 8, 24), sm.metalDark);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, H - 1.2, 0.5);
  candelabra.add(ring);
  const dropChain = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1.2, 4), sm.metalDark);
  dropChain.position.set(0, H - 0.6, 0.5);
  candelabra.add(dropChain);
  for (let c = 0; c < 5; c++) {
    const ang = (c / 5) * Math.PI * 2;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), sm.fixtureGlow);
    bulb.position.set(Math.cos(ang) * 0.38, H - 1.2 + 0.05, 0.5 + Math.sin(ang) * 0.38);
    candelabra.add(bulb);
  }
  group.add(candelabra);

  // 5. THE WINE WALL — a full-height, wall-to-wall cellar of bottles in
  // walnut cubbies, backlit so the glass glows. This is the room's hero.
  const wallZ = -D / 2 + 0.34;
  const wineWall = new THREE.Group();

  // Dark recessed backing so the bottle ends read against shadow
  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(W - 0.6, H - 0.35, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x16110d, roughness: 0.95 })
  );
  backing.position.set(0, (H - 0.35) / 2, wallZ - 0.3);
  backing.receiveShadow = true;
  wineWall.add(backing);

  // Warm backlight washing through the bottles
  const wallGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.8, H - 0.6),
    new THREE.MeshBasicMaterial({ color: 0xffb765, transparent: true, opacity: 0.16 })
  );
  wallGlow.position.set(0, (H - 0.35) / 2, wallZ - 0.24);
  wineWall.add(wallGlow);

  // Cubby grid — walnut shelves + vertical dividers across the whole wall
  const cols = 14, rows = 7;
  const gridW = W - 0.8, gridH = H - 0.75;
  const cellW = gridW / cols, cellH = gridH / rows;
  const baseY = 0.3;

  for (let r = 0; r <= rows; r++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(gridW, 0.035, 0.36), sm.walnutWood);
    shelf.position.set(0, baseY + r * cellH, wallZ);
    shelf.castShadow = true; shelf.receiveShadow = true;
    wineWall.add(shelf);
  }
  for (let c = 0; c <= cols; c++) {
    const div = new THREE.Mesh(new THREE.BoxGeometry(0.03, gridH, 0.36), sm.walnutWood);
    div.position.set(-gridW / 2 + c * cellW, baseY + gridH / 2, wallZ);
    div.castShadow = true;
    wineWall.add(div);
  }

  // Bottles laid on their sides, necks out — shared geometry, three glass tones
  const bottleGeo = new THREE.CylinderGeometry(0.036, 0.038, 0.3, 10);
  const neckGeo = new THREE.CylinderGeometry(0.013, 0.017, 0.12, 8);
  const bottleMats = [
    new THREE.MeshPhysicalMaterial({ color: 0x1e3320, roughness: 0.14, metalness: 0.0, transmission: 0.55, thickness: 0.4, envMapIntensity: 1.6 }),
    new THREE.MeshPhysicalMaterial({ color: 0x3a1518, roughness: 0.14, metalness: 0.0, transmission: 0.5, thickness: 0.4, envMapIntensity: 1.6 }),
    new THREE.MeshPhysicalMaterial({ color: 0x2b2a16, roughness: 0.18, metalness: 0.0, transmission: 0.45, thickness: 0.4, envMapIntensity: 1.5 }),
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // A few empty cubbies keep it from looking mechanically perfect
      if ((r * 31 + c * 17) % 23 === 0) continue;
      const bx = -gridW / 2 + (c + 0.5) * cellW;
      const by = baseY + (r + 0.5) * cellH;
      const mat = bottleMats[(r + c) % bottleMats.length];

      const bottle = new THREE.Mesh(bottleGeo, mat);
      bottle.rotation.x = Math.PI / 2;
      bottle.position.set(bx, by, wallZ + 0.02);
      bottle.castShadow = true;
      wineWall.add(bottle);

      const neck = new THREE.Mesh(neckGeo, mat);
      neck.rotation.x = Math.PI / 2;
      neck.position.set(bx, by, wallZ + 0.2);
      wineWall.add(neck);

      // Brass foil cap catches the cellar light
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.03, 8), sm.metal);
      cap.rotation.x = Math.PI / 2;
      cap.position.set(bx, by, wallZ + 0.27);
      wineWall.add(cap);
    }
  }

  tagPiece(wineWall, {
    name: 'The Wine Wall',
    materials: ['Solid walnut', 'Blown glass', 'Champagne brass'],
    description: 'A full-height cellar wall of hand-fitted walnut cubbies, backlit so the glass holds the light. Ninety-eight bottles, laid neck-out at a constant twelve degrees.',
  });
  group.add(wineWall);
  addContactShadow(group, 0, wallZ, W - 0.5, 0.9, 0.55);

  // 6. Oak Aging Barrels stack
  const barrelRadius = 0.38, barrelHeight = 0.9;
  const bGeo = new THREE.CylinderGeometry(barrelRadius * 0.85, barrelRadius, barrelHeight, 18);
  const pos = bGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const factor = 1.0 + (1.0 - Math.pow(y / (barrelHeight / 2), 2)) * 0.15;
    pos.setX(i, pos.getX(i) * factor);
    pos.setZ(i, pos.getZ(i) * factor);
  }
  bGeo.computeVertexNormals();

  const barrelGroup = new THREE.Group();
  const bPos = [
    { x: -4.4, y: barrelRadius, z: 2.2, rx: Math.PI / 2, rz: 0.2 },
    { x: -3.4, y: barrelRadius, z: 2.2, rx: Math.PI / 2, rz: 0.2 },
    { x: -3.9, y: barrelRadius * 2 + 0.1, z: 2.2, rx: Math.PI / 2, rz: 0.2 }
  ];
  bPos.forEach((bp) => {
    const barrel = new THREE.Mesh(bGeo, sm.darkWood);
    barrel.position.set(bp.x, bp.y, bp.z);
    barrel.rotation.set(bp.rx, 0, bp.rz);
    barrel.castShadow = true;
    barrelGroup.add(barrel);
    for (const by of [-0.28, 0.28]) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(barrelRadius * 1.06, 0.01, 8, 18), sm.metalDark);
      band.rotation.x = Math.PI / 2;
      band.position.set(0, 0, by);
      barrel.add(band);
    }
  });
  group.add(barrelGroup);
  addContactShadow(group, -3.9, 2.2, 1.8, 1.8, 0.5);

  // 7. Stacked Vintage Wood Wine Boxes (placed near barrels)
  const box1 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.38), sm.walnutWood);
  box1.position.set(-2.8, 0.16, 2.3);
  box1.rotation.y = 0.14;
  box1.castShadow = true;
  group.add(box1);

  const box2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.28, 0.34), sm.walnutWood);
  box2.position.set(-2.85, 0.46, 2.2);
  box2.rotation.y = -0.08;
  box2.castShadow = true;
  group.add(box2);
  addContactShadow(group, -2.8, 2.2, 0.7, 0.7, 0.35);
}

function addMaterialVaultFurniture(group, sm, W, H, D) {
  // Central Marble Design Workbench
  const island = new THREE.Mesh(createRoundedBoxGeometry(2.4, 0.9, 1.1, 0.03, 3), sm.marbleNero);
  island.position.set(0, 0.45, 0.2);
  island.castShadow = true; island.receiveShadow = true;
  group.add(island);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.04, 1.14), sm.metal);
  trim.position.set(0, 0.9, 0.2);
  group.add(trim);
  addContactShadow(group, 0, 0.2, 2.7, 1.4, 0.55);

  // Task Pendant light above workbench
  const pendant = new THREE.Group();
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.18, 0.16, 16), sm.metal);
  shade.position.set(0, H - 1.2, 0.2);
  pendant.add(shade);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 1.2, 4), sm.metalDark);
  cord.position.set(0, H - 0.6, 0.2);
  pendant.add(cord);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), sm.fixtureGlow);
  bulb.position.set(0, H - 1.28, 0.2);
  pendant.add(bulb);
  group.add(pendant);

  // High stool
  const stool = new THREE.Mesh(createRoundedBoxGeometry(0.38, 0.06, 0.38, 0.02, 3), sm.leatherCognac);
  stool.position.set(-0.2, 0.68, 1.1);
  stool.castShadow = true;
  group.add(stool);
  const sLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.62, 8), sm.metalDark);
  sLeg.position.set(-0.2, 0.31, 1.1);
  group.add(sLeg);
  addContactShadow(group, -0.2, 1.1, 0.55, 0.55, 0.35);

  // Staged sample boards on table
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 0.32), sm.walnutWood);
  tray.position.set(-0.4, 0.93, 0.2);
  tray.rotation.y = 0.1;
  group.add(tray);
  const slab1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.01, 0.22), sm.marble);
  slab1.position.set(-0.46, 0.945, 0.2);
  slab1.rotation.y = 0.1;
  group.add(slab1);
  const slab2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.01, 0.22), new THREE.MeshStandardMaterial({ color: 0x1c2420, roughness: 0.1, metalness: 0.1 }));
  slab2.position.set(-0.32, 0.945, 0.2);
  slab2.rotation.y = 0.1;
  group.add(slab2);
  for (let i = 0; i < 4; i++) {
    const sw = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.005, 0.06), new THREE.MeshStandardMaterial({ color: [0xb85d43, 0x2e3d30, 0xcbb082, 0xe8ddd0][i] }));
    sw.position.set(0.3, 0.922 + i * 0.005, 0.3);
    sw.rotation.y = -0.2 + i * 0.15;
    group.add(sw);
  }

  // Large Material Storage racks
  const rackW = 2.0, rackH = 2.4, rackD = 0.42;
  for (const rx of [-2.8, 2.8]) {
    const rack = new THREE.Mesh(createRoundedBoxGeometry(rackW, rackH, rackD, 0.04, 3), sm.darkWood);
    rack.position.set(rx, rackH / 2, -D / 2 + rackD / 2 + 0.1);
    rack.castShadow = true;
    group.add(rack);
    for (let sh = 0; sh < 4; sh++) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(rackW - 0.08, 0.03, rackD - 0.06), sm.darkWood);
      shelf.position.set(rx, 0.48 + sh * 0.55, -D / 2 + rackD / 2 + 0.1);
      group.add(shelf);
      for (let j = 0; j < 3; j++) {
        const matColors = [sm.velvetTerracotta, sm.velvetForest, sm.velvetNavy, sm.linen];
        const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.45, 12), matColors[(sh + j) % matColors.length]);
        roll.rotation.z = Math.PI / 2;
        roll.position.set(rx - 0.5 + j * 0.5, 0.56 + sh * 0.55, -D / 2 + rackD / 2 + 0.1);
        group.add(roll);
      }
    }
    addContactShadow(group, rx, -D / 2 + rackD / 2 + 0.1, rackW + 0.4, rackD + 0.4, 0.5);
  }

  // Standing large material boards
  const marbleSlabs = [sm.marble, sm.marbleNero, new THREE.MeshStandardMaterial({ color: 0x1c2420, roughness: 0.1, clearcoat: 0.9 })];
  for (let s = 0; s < 3; s++) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.06), marbleSlabs[s]);
    slab.position.set(4.2 - s * 0.15, 0.8, 1.8 + s * 0.1);
    slab.rotation.set(0, -0.6, 0.15);
    slab.castShadow = true;
    group.add(slab);
  }

  // Blueprint basket with rolled blueprints in the back-right corner
  const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5, 12), sm.metalDark);
  basket.position.set(4.2, 0.25, -2.6);
  basket.castShadow = true;
  group.add(basket);
  addContactShadow(group, 4.2, -2.6, 0.5, 0.5, 0.3);
  for (let r = 0; r < 4; r++) {
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.8, 8), sm.linen);
    roll.position.set(4.2 + (Math.random() - 0.5) * 0.12, 0.5, -2.6 + (Math.random() - 0.5) * 0.12);
    roll.rotation.set(0.1 + Math.random() * 0.15, (Math.random() - 0.5) * 0.3, 0.1 + Math.random() * 0.15);
    roll.castShadow = true;
    group.add(roll);
  }
}

function addArchiveFurniture(group, sm, W, H, D) {
  // Classical Drafting Table
  const tableGroup = new THREE.Group();
  const frame = new THREE.Mesh(createRoundedBoxGeometry(1.6, 0.72, 0.9, 0.03, 3), sm.darkWood);
  frame.position.set(-0.5, 0.76, 0.2);
  frame.rotation.x = 0.14;
  frame.castShadow = true;
  tableGroup.add(frame);
  const blueprint = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.65), sm.linen);
  blueprint.position.set(-0.5, 0.79, 0.2);
  blueprint.rotation.x = -Math.PI / 2 + 0.14;
  tableGroup.add(blueprint);
  const ruler = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.004, 0.02), sm.metal);
  ruler.position.set(-0.2, 0.782, 0.3);
  ruler.rotation.set(-0.14, 0.6, 0);
  tableGroup.add(ruler);

  // Classic Green Glass Bankers Lamp on the desk
  const lamp = new THREE.Group();
  const lBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.015, 10), sm.metal);
  lBase.position.set(-1.1, 0.785, 0.45);
  lamp.add(lBase);
  const lStem = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.16, 8), sm.metal);
  lStem.position.set(-1.1, 0.865, 0.45);
  lStem.rotation.x = -0.15;
  lamp.add(lStem);
  // green glass banker shade
  const shadeMat = new THREE.MeshStandardMaterial({ color: 0x1a4a2a, roughness: 0.15 });
  const lShade = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 12), shadeMat);
  lShade.rotation.z = Math.PI / 2;
  lShade.position.set(-1.1, 0.965, 0.42);
  lamp.add(lShade);
  const lGlow = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), sm.fixtureGlow);
  lGlow.position.set(-1.1, 0.95, 0.42);
  lamp.add(lGlow);
  tableGroup.add(lamp);

  for (const lx of [-0.6, 0.6]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.034, 0.74, 10), sm.metalDark);
    leg.position.set(-0.5 + lx, 0.37, 0.2);
    tableGroup.add(leg);
  }
  group.add(tableGroup);
  addContactShadow(group, -0.5, 0.2, 1.8, 1.1, 0.45);

  // Comfortable reading lounge chair
  const chairGroup = new THREE.Group();
  const cSeat = new THREE.Mesh(createRoundedBoxGeometry(0.76, 0.2, 0.72, 0.08, 4), sm.leatherCognac);
  cSeat.position.set(2.6, 0.25, -1.0);
  cSeat.rotation.y = -0.55;
  cSeat.castShadow = true;
  chairGroup.add(cSeat);
  const cBack = new THREE.Mesh(createRoundedBoxGeometry(0.76, 0.68, 0.18, 0.08, 4), sm.leatherCognac);
  cBack.position.set(2.45, 0.64, -1.28);
  cBack.rotation.y = -0.55;
  cBack.castShadow = true;
  chairGroup.add(cBack);
  const ott = new THREE.Mesh(createRoundedBoxGeometry(0.52, 0.15, 0.42, 0.05, 3), sm.leatherCognac);
  ott.position.set(2.15, 0.185, -0.35);
  ott.rotation.y = -0.55;
  ott.castShadow = true;
  chairGroup.add(ott);
  group.add(chairGroup);
  addContactShadow(group, 2.4, -0.8, 1.4, 1.4, 0.5);

  // Tall Archive Book Cabinets
  const cabW = 2.0, cabH = 2.5, cabD = 0.42;
  for (const cx of [-2.8, 2.8]) {
    const cabinet = new THREE.Mesh(createRoundedBoxGeometry(cabW, cabH, cabD, 0.04, 3), sm.darkWood);
    cabinet.position.set(cx, cabH / 2, -D / 2 + cabD / 2 + 0.1);
    cabinet.castShadow = true;
    group.add(cabinet);
    for (let sh = 0; sh < 5; sh++) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(cabW - 0.08, 0.03, cabD - 0.06), sm.darkWood);
      shelf.position.set(cx, 0.4 + sh * 0.48, -D / 2 + cabD / 2 + 0.1);
      group.add(shelf);
      const fileCount = 4 + Math.floor(Math.random() * 4);
      const fColors = [sm.leatherCognac, sm.linen, sm.walnutWood];
      for (let f = 0; f < fileCount; f++) {
        const file = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.025, 0.24), fColors[f % fColors.length]);
        file.position.set(cx - 0.6 + f * 0.36 + (Math.random() - 0.5) * 0.05, 0.435 + sh * 0.48, -D / 2 + cabD / 2 + 0.1);
        file.rotation.y = (Math.random() - 0.5) * 0.12;
        group.add(file);
      }
    }
    addContactShadow(group, cx, -D / 2 + cabD / 2 + 0.1, cabW + 0.4, cabD + 0.4, 0.5);
  }

  // Vintage Library Ladder leaning against the left cabinet (-2.8)
  const ladder = new THREE.Group();
  const railL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.6, 8), sm.walnutWood);
  railL.position.set(-3.6, 1.25, -D / 2 + cabD + 0.3);
  railL.rotation.x = 0.14;
  ladder.add(railL);
  const railR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.6, 8), sm.walnutWood);
  railR.position.set(-3.25, 1.25, -D / 2 + cabD + 0.3);
  railR.rotation.x = 0.14;
  ladder.add(railR);
  for (let r = 0; r < 6; r++) {
    const rungY = 0.25 + r * 0.36;
    const rungZ = -D / 2 + cabD + 0.3 - (rungY - 1.25) * Math.sin(0.14);
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35, 8), sm.walnutWood);
    rung.rotation.z = Math.PI / 2;
    rung.position.set(-3.425, rungY, rungZ);
    ladder.add(rung);
  }
  group.add(ladder);
  addContactShadow(group, -3.425, -D / 2 + cabD + 0.5, 0.6, 0.6, 0.35);
}

export function addUndergroundFurniture(group, roomIndex, sm, matPanel, matAccent, W, H, D) {
  if (roomIndex === 0) addWineCellarFurniture(group, sm, W, H, D);
  else if (roomIndex === 1) addMaterialVaultFurniture(group, sm, W, H, D);
  else addArchiveFurniture(group, sm, W, H, D);
}
