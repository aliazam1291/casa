/* eslint-disable */
import * as THREE from 'three';

// Module-level cache (no React dependency)
const shadowTexCache = { current: null };

function getContactShadowTexture() {
  if (!shadowTexCache.current) {
    const cv = document.createElement('canvas');
    cv.width = 128; cv.height = 128;
    const ctx = cv.getContext('2d');
    const rad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    rad.addColorStop(0, 'rgba(0,0,0,0.70)');
    rad.addColorStop(0.4, 'rgba(0,0,0,0.30)');
    rad.addColorStop(0.8, 'rgba(0,0,0,0.06)');
    rad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 128, 128);
    shadowTexCache.current = new THREE.CanvasTexture(cv);
  }
  return shadowTexCache.current;
}

export function addContactShadow(parent, x, z, width, depth, opacity = 0.45) {
  const shadowMat = new THREE.MeshBasicMaterial({
    map: getContactShadowTexture(),
    transparent: true,
    opacity: opacity,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(x, 0.003, z);
  parent.add(shadowMesh);
}

export function disposeShadowCache() {
  if (shadowTexCache.current) {
    shadowTexCache.current.dispose();
    shadowTexCache.current = null;
  }
}
