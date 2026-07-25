/* eslint-disable */
import * as THREE from 'three';

export function createRoundedBoxGeometry(width, height, depth, radius = 0.06, smoothness = 4) {
  const shape = new THREE.Shape();
  const w = width / 2 - radius;
  const h = height / 2 - radius;
  shape.moveTo(-w, -h - radius);
  shape.lineTo(w, -h - radius);
  shape.quadraticCurveTo(w + radius, -h - radius, w + radius, -h);
  shape.lineTo(w + radius, h);
  shape.quadraticCurveTo(w + radius, h + radius, w, h + radius);
  shape.lineTo(-w, h + radius);
  shape.quadraticCurveTo(-w - radius, h + radius, -w - radius, h);
  shape.lineTo(-w - radius, -h);
  shape.quadraticCurveTo(-w - radius, -h - radius, -w, -h - radius);

  const extrudeSettings = {
    depth: depth - radius * 2,
    bevelEnabled: true,
    bevelSegments: smoothness,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius,
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

export function createFlutedCylinderGeometry(radius, height, numFlutes = 24, radialSegments = 64) {
  const shape = new THREE.Shape();
  for (let i = 0; i < radialSegments; i++) {
    const angle = (i / radialSegments) * Math.PI * 2;
    const fluteAngle = (angle * numFlutes);
    const r = radius + Math.sin(fluteAngle) * (radius * 0.06);
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  const extrudeSettings = { depth: height, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.015, bevelThickness: 0.015 };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.rotateX(Math.PI / 2);
  geo.center();
  return geo;
}
