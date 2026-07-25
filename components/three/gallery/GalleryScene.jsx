'use client';
/* eslint-disable */
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FLOORS, ROOM_SPACING } from './galleryData';

const gltfLoader = typeof window !== 'undefined' ? new GLTFLoader() : null;

// --- Helper Procedural Geometries for Curved Luxury Furniture ---
function createRoundedBoxGeometry(width, height, depth, radius = 0.06, smoothness = 4) {
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

function createFlutedCylinderGeometry(radius, height, numFlutes = 24, radialSegments = 64) {
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

const GalleryScene = forwardRef(function GalleryScene({ onRoomChange, onFloorChange }, ref) {
  const mountRef = useRef(null);
  const internals = useRef(null);

  useImperativeHandle(ref, () => ({
    goToRoom(index) {
      const s = internals.current;
      if (!s) return;
      const max = FLOORS[s.currentFloor].rooms.length - 1;
      s.beginRoom?.(Math.max(0, Math.min(max, index)));
    },
    nextRoom() {
      const s = internals.current;
      if (!s) return;
      if (s.currentRoom < FLOORS[s.currentFloor].rooms.length - 1) s.beginRoom?.(s.currentRoom + 1);
    },
    prevRoom() {
      const s = internals.current;
      if (!s) return;
      if (s.currentRoom > 0) s.beginRoom?.(s.currentRoom - 1);
    },
    setFloor(floorIndex) {
      const s = internals.current;
      if (!s) return;
      s.beginFloor?.(Math.max(0, Math.min(FLOORS.length - 1, floorIndex)));
    },
    get currentRoom() { return internals.current?.currentRoom ?? 0; },
    get currentFloor() { return internals.current?.currentFloor ?? 1; },
    get roomCount() { return FLOORS[internals.current?.currentFloor ?? 1].rooms.length; },
    get floorCount() { return FLOORS.length; },
    getFloorData() { return FLOORS; },
    getRoomNames() { return FLOORS[internals.current?.currentFloor ?? 1].rooms.map(r => r.name); },
  }));

  // --- Procedural artwork textures ---
  const artTextures = useRef(new Map());

  function getArtTexture(key, seed) {
    const cache = artTextures.current;
    if (cache.has(key)) return cache.get(key);
    const tex = createArtTexture(seed);
    cache.set(key, tex);
    return tex;
  }

  function createArtTexture(seed) {
    const cv = document.createElement('canvas');
    cv.width = 600;
    cv.height = 760;
    const ctx = cv.getContext('2d');
    const Wc = cv.width, Hc = cv.height;

    let st = (seed * 9973 + 7) >>> 0;
    const rnd = () => { st = (st * 1664525 + 1013904223) >>> 0; return st / 4294967296; };
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

    const palettes = [
      ['#e8d9bf', '#c9a36b', '#8a5a36', '#4a3526', '#2b1d14'],
      ['#dfe3d8', '#a8b29a', '#6f7d5e', '#414b33', '#23291b'],
      ['#e7dcc8', '#cbb08a', '#9a7e5a', '#5c4836', '#322419'],
      ['#dde2e6', '#9fb0b8', '#5f7882', '#36464e', '#1d262b'],
      ['#efe4d4', '#d7a98a', '#b06a4e', '#6e3a2c', '#3a1d16'],
    ];
    const pal = pick(palettes);
    const style = Math.floor(rnd() * 3);

    if (style === 0) {
      const sky = ctx.createLinearGradient(0, 0, 0, Hc * 0.65);
      sky.addColorStop(0, pal[0]);
      sky.addColorStop(1, pal[1]);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, Wc, Hc);

      const sx = Wc * (0.3 + rnd() * 0.4);
      const sy = Hc * (0.2 + rnd() * 0.18);
      const glow = ctx.createRadialGradient(sx, sy, 4, sx, sy, Wc * 0.4);
      glow.addColorStop(0, 'rgba(255,244,222,0.9)');
      glow.addColorStop(1, 'rgba(255,244,222,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, Wc, Hc);
      ctx.beginPath();
      ctx.arc(sx, sy, Wc * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,248,232,0.95)';
      ctx.fill();

      for (let l = 0; l < 4; l++) {
        const baseY = Hc * (0.5 + l * 0.12);
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let i = 0; i <= 6; i++) {
          const x = (Wc / 6) * i;
          const y = baseY + Math.sin(i * 1.3 + l * 2 + seed) * (30 - l * 4) - rnd() * 18;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(Wc, Hc);
        ctx.lineTo(0, Hc);
        ctx.closePath();
        ctx.fillStyle = pal[Math.min(2 + l, pal.length - 1)];
        ctx.globalAlpha = 0.92;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    } else if (style === 1) {
      ctx.fillStyle = pal[1];
      ctx.fillRect(0, 0, Wc, Hc);
      const blocks = 2 + Math.floor(rnd() * 2);
      let yCursor = Hc * 0.08;
      for (let b = 0; b < blocks; b++) {
        const bh = (Hc * 0.82) / blocks;
        const col = pal[2 + (b % 3)];
        const pad = Wc * (0.08 + rnd() * 0.04);
        for (let pass = 0; pass < 14; pass++) {
          ctx.globalAlpha = 0.10;
          ctx.fillStyle = col;
          const inset = pass * 2;
          ctx.fillRect(pad + inset, yCursor + inset, Wc - pad * 2 - inset * 2, bh - 24 - inset * 2);
        }
        ctx.globalAlpha = 1;
        yCursor += bh;
      }
    } else {
      ctx.fillStyle = pal[0];
      ctx.fillRect(0, 0, Wc, Hc);
      for (let i = 0; i < 26; i++) {
        ctx.save();
        ctx.translate(rnd() * Wc, rnd() * Hc);
        ctx.rotate((rnd() - 0.5) * 1.4);
        ctx.globalAlpha = 0.25 + rnd() * 0.4;
        ctx.fillStyle = pick(pal);
        ctx.fillRect(-(40 + rnd() * 160) / 2, -(12 + rnd() * 34) / 2, 40 + rnd() * 160, 12 + rnd() * 34);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    const grain = ctx.getImageData(0, 0, Wc, Hc);
    const d = grain.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    ctx.putImageData(grain, 0, 0);

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }

  function addFramedArt(parent, sm, artTex, { x, y, z, w, h, ry = 0 }) {
    const g = new THREE.Group();
    const fw = Math.min(w, h) * 0.06;
    const matPad = Math.min(w, h) * 0.1;

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 0.35, metalness: 0.35 });

    const bars = [
      { bw: w + fw * 2, bh: fw, bx: 0, by: h / 2 + fw / 2 },
      { bw: w + fw * 2, bh: fw, bx: 0, by: -h / 2 - fw / 2 },
      { bw: fw, bh: h, bx: -w / 2 - fw / 2, by: 0 },
      { bw: fw, bh: h, bx: w / 2 + fw / 2, by: 0 },
    ];
    bars.forEach(({ bw, bh, bx, by }) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.06), frameMat);
      bar.position.set(bx, by, 0);
      g.add(bar);
    });

    const mat = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshStandardMaterial({ color: 0xf2ece0, roughness: 0.9 })
    );
    mat.position.set(0, 0, 0.032);
    g.add(mat);

    const painting = new THREE.Mesh(
      new THREE.PlaneGeometry(w - matPad * 2, h - matPad * 2),
      new THREE.MeshBasicMaterial({ map: artTex })
    );
    painting.position.set(0, 0, 0.04);
    g.add(painting);

    g.position.set(x, y, z);
    g.rotation.y = ry;
    parent.add(g);
    return g;
  }

  // --- Real GLTF models loader ---
  const gltfCache = useRef(new Map());
  function loadGLTF(url) {
    const cache = gltfCache.current;
    if (cache.has(url)) return cache.get(url);
    const p = new Promise((resolve, reject) => {
      if (!gltfLoader) return reject(new Error('no loader'));
      gltfLoader.load(url, resolve, undefined, reject);
    });
    cache.set(url, p);
    return p;
  }

  function placeModel(group, { url, x = 0, z = 0, ry = 0, w = 2, h = null }) {
    loadGLTF(url)
      .then((gltf) => {
        const obj = gltf.scene.clone(true);
        obj.rotation.y = ry;
        obj.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(obj);
        const size = new THREE.Vector3();
        box.getSize(size);
        const scale = h ? h / (size.y || 1) : w / (Math.max(size.x, size.z) || 1);
        obj.scale.setScalar(scale);
        obj.updateMatrixWorld(true);

        const box2 = new THREE.Box3().setFromObject(obj);
        const center = new THREE.Vector3();
        box2.getCenter(center);
        obj.position.x += x - center.x;
        obj.position.z += z - center.z;
        obj.position.y += -box2.min.y;

        obj.traverse((o) => {
          if (o.isMesh) {
            o.userData.isModel = true;
            if (o.material) o.material.envMapIntensity = 1.25;
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        obj.userData.isModel = true;
        group.add(obj);
      })
      .catch(() => {});
  }

  // --- Photorealistic Procedural Surface & Normal Map Generator ---
  const surfBundle = useRef(new Map());

  function hexRGB(hex) {
    return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
  }
  function shade([r, g, b], f) {
    const m = (v) => Math.max(0, Math.min(255, Math.round(v)));
    return `rgb(${m(r * f)},${m(g * f)},${m(b * f)})`;
  }

  function getSurfBundle(kind, color, repeatX = 1, repeatY = 1) {
    const key = `${kind}-${color}-${repeatX}-${repeatY}`;
    const cache = surfBundle.current;
    if (cache.has(key)) return cache.get(key);

    const diffCv = document.createElement('canvas');
    diffCv.width = 512; diffCv.height = 512;
    const dCtx = diffCv.getContext('2d');
    const rgb = hexRGB(color);

    if (kind === 'wood') paintWood(dCtx, rgb);
    else if (kind === 'marble') paintMarble(dCtx, rgb);
    else if (kind === 'boucle') paintBoucle(dCtx, rgb);
    else paintPlaster(dCtx, rgb);

    // Normal Map from diffuse height derivatives
    const normCv = document.createElement('canvas');
    normCv.width = 512; normCv.height = 512;
    const nCtx = normCv.getContext('2d');
    const dData = dCtx.getImageData(0, 0, 512, 512).data;
    const nImgData = nCtx.createImageData(512, 512);
    const nData = nImgData.data;

    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const idx = (y * 512 + x) * 4;
        const getV = (px, py) => {
          const cx = (px + 512) % 512;
          const cy = (py + 512) % 512;
          const i = (cy * 512 + cx) * 4;
          return (dData[i] + dData[i + 1] + dData[i + 2]) / 765;
        };

        const dx = (getV(x + 1, y) - getV(x - 1, y)) * (kind === 'boucle' ? 4.5 : 2.2);
        const dy = (getV(x, y + 1) - getV(x, y - 1)) * (kind === 'boucle' ? 4.5 : 2.2);
        const len = Math.sqrt(dx * dx + dy * dy + 1.0);
        nData[idx] = Math.floor(((dx / len) * 0.5 + 0.5) * 255);
        nData[idx + 1] = Math.floor(((dy / len) * 0.5 + 0.5) * 255);
        nData[idx + 2] = Math.floor(((1.0 / len) * 0.5 + 0.5) * 255);
        nData[idx + 3] = 255;
      }
    }
    nCtx.putImageData(nImgData, 0, 0);

    const map = new THREE.CanvasTexture(diffCv);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(repeatX, repeatY);
    map.anisotropy = 8;

    const normalMap = new THREE.CanvasTexture(normCv);
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(repeatX, repeatY);
    normalMap.anisotropy = 8;

    const bundle = { map, normalMap };
    cache.set(key, bundle);
    return bundle;
  }

  function paintWood(ctx, rgb) {
    const planks = 4;
    const pw = 512 / planks;
    ctx.fillStyle = shade(rgb, 0.98);
    ctx.fillRect(0, 0, 512, 512);
    for (let p = 0; p < planks; p++) {
      const f = 0.9 + Math.random() * 0.18;
      const grad = ctx.createLinearGradient(p * pw, 0, (p + 1) * pw, 0);
      grad.addColorStop(0, shade(rgb, f * 0.96));
      grad.addColorStop(0.5, shade(rgb, f * 1.04));
      grad.addColorStop(1, shade(rgb, f * 0.94));
      ctx.fillStyle = grad;
      ctx.fillRect(p * pw, 0, pw, 512);
      for (let g = 0; g < 9; g++) {
        ctx.strokeStyle = shade(rgb, f * (0.82 + Math.random() * 0.16));
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        const x = p * pw + 8 + Math.random() * (pw - 16);
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + (Math.random() - 0.5) * 4, 170, x + (Math.random() - 0.5) * 4, 340, x + (Math.random() - 0.5) * 3, 512);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = shade(rgb, 0.42);
      ctx.fillRect(p * pw, 0, 1.2, 512);
    }
  }

  function paintMarble(ctx, rgb) {
    ctx.fillStyle = shade(rgb, 1.02);
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 16; i++) {
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = shade(rgb, 0.9 + Math.random() * 0.18);
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, 90 + Math.random() * 180, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (let v = 0; v < 3; v++) {
      ctx.strokeStyle = shade(rgb, v === 0 ? 0.5 : 0.75);
      ctx.globalAlpha = v === 0 ? 0.45 : 0.28;
      ctx.lineWidth = v === 0 ? 1.4 : 0.8;
      ctx.beginPath();
      let x = Math.random() * 512, y = -10;
      ctx.moveTo(x, y);
      for (let s = 0; s < 5; s++) {
        const nx = x + (Math.random() - 0.5) * 120;
        const ny = y + 100 + Math.random() * 30;
        ctx.bezierCurveTo(x + (Math.random() - 0.5) * 80, y + 50, nx + (Math.random() - 0.5) * 80, ny - 50, nx, ny);
        x = nx; y = ny;
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function paintBoucle(ctx, rgb) {
    ctx.fillStyle = shade(rgb, 1.0);
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 8) {
      for (let x = 0; x < 512; x += 8) {
        const f = 0.88 + Math.random() * 0.24;
        ctx.fillStyle = shade(rgb, f);
        ctx.beginPath();
        ctx.arc(x + 4 + (Math.random() - 0.5) * 2, y + 4 + (Math.random() - 0.5) * 2, 3 + Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function paintPlaster(ctx, rgb) {
    ctx.fillStyle = shade(rgb, 1.0);
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 24; i++) {
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = shade(rgb, 0.9 + Math.random() * 0.18);
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, 60 + Math.random() * 140, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // --- Soft Grounded Contact Shadows Helper ---
  const contactTexRef = useRef(null);
  function getContactShadowTexture() {
    if (!contactTexRef.current) {
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
      contactTexRef.current = new THREE.CanvasTexture(cv);
    }
    return contactTexRef.current;
  }

  function addContactShadow(parent, x, z, width, depth, opacity = 0.45) {
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

  // Shared Materials
  const sharedMats = useRef(null);
  function getSharedMats() {
    if (!sharedMats.current) {
      const woodB = getSurfBundle('wood', 0x4a3828, 1.5, 1.5);
      const marbB = getSurfBundle('marble', 0xe8ddd0, 1, 1);
      const boucB = getSurfBundle('boucle', 0xede6dc, 2, 2);
      const fabricB = getSurfBundle('boucle', 0xb8aba0, 2, 2);

      sharedMats.current = {
        ceiling: new THREE.MeshStandardMaterial({ color: 0xf4eee4, roughness: 0.75 }),
        glow: new THREE.MeshBasicMaterial({ color: 0xfffaee, transparent: true, opacity: 0.85 }),
        glowDim: new THREE.MeshBasicMaterial({ color: 0xfff8e8, transparent: true, opacity: 0.45 }),
        fixtureGlow: new THREE.MeshBasicMaterial({ color: 0xfffaee }),
        darkWood: new THREE.MeshStandardMaterial({ color: 0xffffff, map: woodB.map, normalMap: woodB.normalMap, normalScale: new THREE.Vector2(0.6, 0.6), roughness: 0.35, metalness: 0.02 }),
        marble: new THREE.MeshStandardMaterial({ color: 0xffffff, map: marbB.map, normalMap: marbB.normalMap, normalScale: new THREE.Vector2(0.4, 0.4), roughness: 0.12, metalness: 0.08, envMapIntensity: 1.4 }),
        boucle: new THREE.MeshStandardMaterial({ color: 0xffffff, map: boucB.map, normalMap: boucB.normalMap, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 0.85 }),
        fabricDark: new THREE.MeshStandardMaterial({ color: 0xffffff, map: fabricB.map, normalMap: fabricB.normalMap, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.82 }),
        metal: new THREE.MeshStandardMaterial({ color: 0xc4a980, roughness: 0.22, metalness: 0.88, envMapIntensity: 1.5 }),
        metalDark: new THREE.MeshStandardMaterial({ color: 0x55483c, roughness: 0.28, metalness: 0.82 }),
        glass: new THREE.MeshStandardMaterial({ color: 0xd0d8d5, roughness: 0.04, metalness: 0.92, transparent: true, opacity: 0.55 }),
        rugMat: new THREE.MeshStandardMaterial({ color: 0xc8baa0, roughness: 0.92, transparent: true, opacity: 0.45 }),
        pebble: new THREE.MeshStandardMaterial({ color: 0xbdb2a0, roughness: 0.92, metalness: 0.02 }),
        foliage: new THREE.MeshStandardMaterial({ color: 0x4a5a3a, roughness: 0.85 }),
      };
    }
    return sharedMats.current;
  }

  function rebuildRooms(s) {
    while (s.roomsGroup.children.length) {
      const child = s.roomsGroup.children[0];
      child.traverse((obj) => {
        if (obj.geometry && !obj.userData.isModel) obj.geometry.dispose();
      });
      s.roomsGroup.remove(child);
    }
    const floor = FLOORS[s.currentFloor];
    floor.rooms.forEach((roomDef, i) => {
      const room = buildRoom(roomDef, i, s.currentFloor);
      const pos = roomDef.pos || { x: i * ROOM_SPACING, y: 0, z: 0, ry: 0 };
      room.position.set(pos.x, pos.y, pos.z);
      room.rotation.y = pos.ry;
      s.roomsGroup.add(room);
    });
  }

  function addCommonDecor(group, sm, matAccent, W, H, D, seed) {
    let st = (seed * 2654435761 + 12345) >>> 0;
    const rnd = () => { st = (st * 1664525 + 1013904223) >>> 0; return st / 4294967296; };
    const side = rnd() < 0.5 ? -1 : 1;

    // Organic stone poufs on rug
    const poufGeo = new THREE.SphereGeometry(0.42, 18, 12);
    const cx = side * (2.0 + rnd() * 0.6);
    const cz = 1.8 + (rnd() - 0.5) * 0.8;
    for (let i = 0; i < 3; i++) {
      const s = (0.34 + rnd() * 0.18) / 0.42;
      const p = new THREE.Mesh(poufGeo, sm.pebble);
      p.scale.set(s, s * 0.55, s);
      p.position.set(cx + (rnd() - 0.5) * 1.6, s * 0.42 * 0.55, cz + (rnd() - 0.5) * 1.4);
      p.castShadow = true; p.receiveShadow = true;
      group.add(p);
    }
    addContactShadow(group, cx, cz, 3.4, 2.4, 0.35);

    // Potted Architectural Plant
    const px = -side * (W / 2 - 1.2);
    const planter = new THREE.Mesh(createFlutedCylinderGeometry(0.25, 0.6, 16), sm.marble);
    planter.position.set(px, 0.3, -1.0);
    planter.castShadow = true;
    group.add(planter);
    addContactShadow(group, px, -1.0, 0.7, 0.7, 0.4);
    for (let l = 0; l < 7; l++) {
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.9 + rnd() * 0.6, 5), sm.foliage);
      blade.position.set(px + (rnd() - 0.5) * 0.34, 0.85 + rnd() * 0.28, -1.0 + (rnd() - 0.5) * 0.34);
      blade.rotation.z = (rnd() - 0.5) * 0.55;
      group.add(blade);
    }

    // Sculptural Marble Plinth with Brass Torus Knot Sculpture
    const plx = side * (W / 2 - 1.4);
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.0, 0.5), sm.marble);
    plinth.position.set(plx, 0.5, -2.4);
    plinth.castShadow = true;
    group.add(plinth);
    addContactShadow(group, plx, -2.4, 0.8, 0.8, 0.45);

    const sculp = new THREE.Mesh(new THREE.TorusKnotGeometry(0.16, 0.055, 64, 10), sm.metal);
    sculp.position.set(plx, 1.22, -2.4);
    sculp.castShadow = true;
    group.add(sculp);

    // Architectural Arc Lamp
    const lx = -side * (2.8 + rnd() * 0.4);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 1.8, 8), sm.metal);
    pole.position.set(lx, 0.9, 2.6);
    group.add(pole);
    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.22, 0.3, 16),
      new THREE.MeshBasicMaterial({ color: 0xfff5e0, transparent: true, opacity: 0.6 })
    );
    shade.position.set(lx, 1.85, 2.6);
    group.add(shade);
    addContactShadow(group, lx, 2.6, 0.5, 0.5, 0.3);
  }

  function buildRoom(def, roomIndex, floorIndex) {
    const group = new THREE.Group();
    const sm = getSharedMats();
    const W = 12, H = 4.5, D = 10;
    const lastIndex = FLOORS[floorIndex].rooms.length - 1;

    const marbleFloor = floorIndex === 0 || (roomIndex % 2 === 1);
    const wallB = getSurfBundle('plaster', def.wallColor, 3, 1.4);
    const floorB = getSurfBundle(marbleFloor ? 'marble' : 'wood', def.floorColor, marbleFloor ? 1.5 : 2, marbleFloor ? 1.5 : 3);
    const panelB = getSurfBundle('wood', def.panelColor, 1, 2);

    const matWall = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: wallB.map, normalMap: wallB.normalMap, normalScale: new THREE.Vector2(0.3, 0.3), roughness: 0.85,
    });
    const matFloor = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: floorB.map, normalMap: floorB.normalMap, normalScale: new THREE.Vector2(0.5, 0.5),
      roughness: marbleFloor ? 0.08 : 0.34, metalness: marbleFloor ? 0.15 : 0.02, envMapIntensity: marbleFloor ? 1.6 : 0.7,
    });
    const matPanel = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: panelB.map, normalMap: panelB.normalMap, normalScale: new THREE.Vector2(0.5, 0.5), roughness: 0.45, metalness: 0.02,
    });
    const matAccent = new THREE.MeshStandardMaterial({ color: def.accent, roughness: 0.3, metalness: 0.25 });

    // Floor & Ceiling
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), sm.ceiling);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = H;
    group.add(ceil);

    // Warm ceiling cove strips
    const cove = new THREE.Mesh(new THREE.BoxGeometry(W * 0.65, 0.04, 0.25), sm.glow);
    cove.position.set(0, H - 0.02, -2);
    group.add(cove);
    for (const side of [-1, 1]) {
      const sc = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.04, D * 0.45), sm.glowDim);
      sc.position.set(side * W * 0.35, H - 0.02, 0);
      group.add(sc);
    }

    // Walls
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), matWall);
    backWall.position.set(0, H / 2, -D / 2);
    backWall.receiveShadow = true;
    group.add(backWall);

    if (roomIndex === 0) {
      const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), matWall);
      leftWall.rotation.y = Math.PI / 2;
      leftWall.position.set(-W / 2, H / 2, 0);
      group.add(leftWall);
    }
    if (roomIndex === lastIndex) {
      const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), matWall);
      rightWall.rotation.y = -Math.PI / 2;
      rightWall.position.set(W / 2, H / 2, 0);
      group.add(rightWall);
    }

    // Slatted wood acoustic wall feature
    {
      const slatCount = 18;
      const slatGap = 0.035;
      const slatW = (W - slatGap * (slatCount + 1)) / slatCount;
      const slatH = H - 0.5;
      for (let i = 0; i < slatCount; i++) {
        const sx = -W / 2 + slatGap + slatW / 2 + i * (slatW + slatGap);
        const slat = new THREE.Mesh(new THREE.BoxGeometry(slatW, slatH, 0.04), matPanel);
        slat.position.set(sx, H / 2, -D / 2 + 0.025);
        slat.castShadow = true;
        group.add(slat);
      }
    }

    // Architectural Moldings
    const baseRail = new THREE.Mesh(new THREE.BoxGeometry(W, 0.12, 0.04), sm.darkWood);
    baseRail.position.set(0, 0.06, -D / 2 + 0.05);
    group.add(baseRail);
    const crown = new THREE.Mesh(new THREE.BoxGeometry(W, 0.1, 0.06), matPanel);
    crown.position.set(0, H - 0.05, -D / 2 + 0.04);
    group.add(crown);

    // Hero Framed Painting
    const heroTex = getArtTexture(`${floorIndex}-${roomIndex}-hero`, floorIndex * 17 + roomIndex * 3 + 1);
    addFramedArt(group, sm, heroTex, { x: 0, y: 2.1, z: -D / 2 + 0.05, w: 1.8, h: 2.2 });

    // Console Ledge
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.05, 0.35), sm.marble);
    ledge.position.set(0, 0.9, -D / 2 + 0.2);
    ledge.castShadow = true;
    group.add(ledge);
    for (const lx of [-0.95, 0.95]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.28), sm.metalDark);
      leg.position.set(lx, 0.45, -D / 2 + 0.2);
      group.add(leg);
    }
    addContactShadow(group, 0, -D / 2 + 0.2, 2.4, 0.5, 0.4);

    // Staging Furniture Dispatch
    if (def.models && def.models.length) {
      addContactShadow(group, 0, -0.2, 4.8, 3.6, 0.35);
      def.models.forEach((m) => placeModel(group, m));
    } else if (floorIndex === 0) {
      addUndergroundFurniture(group, roomIndex, sm, matPanel, matAccent, W, H, D);
    } else {
      const n = (def.name || '').toLowerCase();
      if (n.includes('kitchen')) addKitchenFurniture(group, sm, matPanel, matAccent, W, H, D);
      else if (n.includes('dining')) addDiningFurniture(group, sm, matPanel, matAccent, W, H, D);
      else if (n.includes('bed') || n.includes('suite') || n.includes('master')) addBedroomFurniture(group, sm, matPanel, matAccent, W, H, D);
      else if (n.includes('bath') || n.includes('spa')) addBathFurniture(group, sm, matAccent, W, H, D);
      else if (n.includes('study')) addStudyFurniture(group, sm, matPanel, matAccent, W, H, D);
      else if (n.includes('gallery') || n.includes('terrace') || n.includes('skyline')) addGalleryFurniture(group, sm, matAccent, W, H, D);
      else addHallFurniture(group, sm, matAccent, W, H, D);
    }

    addCommonDecor(group, sm, matAccent, W, H, D, floorIndex * 10 + roomIndex);
    return group;
  }

  // --- Luxury Italian / Scandinavian Furniture Generators ---

  function addHallFurniture(group, sm, matAccent, W, H, D) {
    // Curved Bouclé Sectional Sofa
    const sofaGroup = new THREE.Group();

    // Curved seat geometry using Rounded Box
    const mainSeat = new THREE.Mesh(createRoundedBoxGeometry(3.2, 0.42, 1.2, 0.12, 5), sm.boucle);
    mainSeat.position.set(-1.2, 0.21, -0.8);
    mainSeat.castShadow = true; mainSeat.receiveShadow = true;
    sofaGroup.add(mainSeat);

    const backrest = new THREE.Mesh(createRoundedBoxGeometry(3.2, 0.48, 0.28, 0.1, 4), sm.boucle);
    backrest.position.set(-1.2, 0.62, -1.32);
    backrest.castShadow = true;
    sofaGroup.add(backrest);

    // Chaise section
    const chaise = new THREE.Mesh(createRoundedBoxGeometry(1.2, 0.42, 1.4, 0.12, 5), sm.boucle);
    chaise.position.set(-2.2, 0.21, -0.3);
    chaise.castShadow = true;
    sofaGroup.add(chaise);

    // Lumbar pillows
    for (let i = 0; i < 3; i++) {
      const pillow = new THREE.Mesh(createRoundedBoxGeometry(0.55, 0.35, 0.15, 0.06, 4), sm.fabricDark);
      pillow.position.set(-2.4 + i * 0.85, 0.52, -1.15);
      pillow.rotation.y = (Math.random() - 0.5) * 0.2;
      sofaGroup.add(pillow);
    }
    group.add(sofaGroup);
    addContactShadow(group, -1.2, -0.7, 3.6, 2.2, 0.55);

    // Fluted Marble Coffee Table
    const tableGeo = createFlutedCylinderGeometry(0.65, 0.38, 20);
    const coffeeTable = new THREE.Mesh(tableGeo, sm.marble);
    coffeeTable.position.set(0.6, 0.19, 0.3);
    coffeeTable.castShadow = true; coffeeTable.receiveShadow = true;
    group.add(coffeeTable);
    addContactShadow(group, 0.6, 0.3, 1.5, 1.5, 0.5);

    // Coffee Table Book + Ceramic Vase
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.24), sm.darkWood);
    book.position.set(0.48, 0.395, 0.2);
    group.add(book);
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.22, 16), matAccent);
    vase.position.set(0.72, 0.49, 0.35);
    group.add(vase);

    // Designer Lounge Chair (Brushed Metallic Frame + Curved Leather Cushion)
    const chairGroup = new THREE.Group();
    const cSeat = new THREE.Mesh(createRoundedBoxGeometry(0.75, 0.12, 0.7, 0.05, 4), sm.fabricDark);
    cSeat.position.set(2.4, 0.28, -1.2);
    cSeat.rotation.y = -0.4;
    cSeat.castShadow = true;
    chairGroup.add(cSeat);

    const cBack = new THREE.Mesh(createRoundedBoxGeometry(0.75, 0.65, 0.1, 0.05, 4), sm.fabricDark);
    cBack.position.set(2.25, 0.64, -1.48);
    cBack.rotation.y = -0.4;
    cBack.castShadow = true;
    chairGroup.add(cBack);

    for (const legX of [-0.32, 0.32]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.52, 10), sm.metal);
      leg.position.set(2.4 + legX, 0.26, -1.2);
      chairGroup.add(leg);
    }
    group.add(chairGroup);
    addContactShadow(group, 2.4, -1.3, 1.1, 1.1, 0.45);
  }

  function addKitchenFurniture(group, sm, matPanel, matAccent, W, H, D) {
    // Waterfall Marble Kitchen Island
    const island = new THREE.Mesh(createRoundedBoxGeometry(3.6, 0.94, 1.2, 0.03, 3), sm.marble);
    island.position.set(0, 0.47, 0);
    island.castShadow = true; island.receiveShadow = true;
    group.add(island);
    addContactShadow(group, 0, 0, 3.9, 1.5, 0.55);

    // Fluted Wood Backing on Island
    const islandPanel = new THREE.Mesh(createFlutedCylinderGeometry(0.55, 0.88, 32), sm.darkWood);
    islandPanel.scale.set(3.2, 1, 0.2);
    islandPanel.position.set(0, 0.44, 0.52);
    group.add(islandPanel);

    // Leather Counter Stools with Brass Footrest
    for (let i = 0; i < 3; i++) {
      const sx = -1.1 + i * 1.1;
      const seat = new THREE.Mesh(createRoundedBoxGeometry(0.4, 0.06, 0.38, 0.03, 3), sm.fabricDark);
      seat.position.set(sx, 0.72, 1.05);
      seat.castShadow = true;
      group.add(seat);

      const footrest = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.01, 8, 16), sm.metal);
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

  function addBedroomFurniture(group, sm, matPanel, matAccent, W, H, D) {
    const bedW = 2.6, bedD = 3.1;
    // Platform Bed with Channel-Tufted Velvet Headboard
    const headboard = new THREE.Mesh(createRoundedBoxGeometry(bedW + 0.5, 1.45, 0.12, 0.04, 4), sm.boucle);
    headboard.position.set(0, 1.05, -D / 2 + 0.2);
    headboard.castShadow = true;
    group.add(headboard);

    const bedBase = new THREE.Mesh(createRoundedBoxGeometry(bedW, 0.3, bedD), sm.darkWood);
    bedBase.position.set(0, 0.15, -D / 2 + bedD / 2 + 0.3);
    bedBase.castShadow = true;
    group.add(bedBase);

    const mattress = new THREE.Mesh(createRoundedBoxGeometry(bedW - 0.06, 0.22, bedD - 0.1), sm.boucle);
    mattress.position.set(0, 0.38, -D / 2 + bedD / 2 + 0.3);
    group.add(mattress);

    // Layered Linen Throw / Pillows
    for (const px of [-0.48, 0.48]) {
      const pillow = new THREE.Mesh(createRoundedBoxGeometry(0.6, 0.12, 0.34, 0.05, 4), sm.fabricDark);
      pillow.position.set(px, 0.52, -D / 2 + 0.7);
      group.add(pillow);
    }
    const duvet = new THREE.Mesh(createRoundedBoxGeometry(bedW - 0.04, 0.1, 1.4), sm.fabricDark);
    duvet.position.set(0, 0.44, -D / 2 + bedD - 0.4);
    group.add(duvet);
    addContactShadow(group, 0, -D / 2 + bedD / 2 + 0.3, bedW + 0.6, bedD + 0.6, 0.5);

    // Nightstands + Spherical Glass Lamps
    for (const nx of [-1, 1]) {
      const ns = new THREE.Mesh(createRoundedBoxGeometry(0.55, 0.48, 0.42, 0.03, 3), sm.marble);
      ns.position.set(nx * (bedW / 2 + 0.52), 0.24, -D / 2 + 0.5);
      ns.castShadow = true;
      group.add(ns);
      addContactShadow(group, nx * (bedW / 2 + 0.52), -D / 2 + 0.5, 0.7, 0.6, 0.35);

      const lampGlobe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), sm.fixtureGlow);
      lampGlobe.position.set(nx * (bedW / 2 + 0.52), 0.62, -D / 2 + 0.5);
      group.add(lampGlobe);
    }
  }

  function addBathFurniture(group, sm, matAccent, W, H, D) {
    // Freestanding Oval Soaking Tub
    const tubShape = new THREE.Shape();
    tubShape.absellipse(0, 0, 1.0, 0.55, 0, Math.PI * 2, false, 0);
    const extrudeSettings = { depth: 0.55, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
    const tubGeo = new THREE.ExtrudeGeometry(tubShape, extrudeSettings);
    tubGeo.rotateX(Math.PI / 2);
    tubGeo.center();

    const tub = new THREE.Mesh(tubGeo, sm.marble);
    tub.position.set(-2.2, 0.3, -1.2);
    tub.castShadow = true; tub.receiveShadow = true;
    group.add(tub);
    addContactShadow(group, -2.2, -1.2, 2.4, 1.4, 0.5);

    // Floor-Mounted Brass Tapware
    const tapStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.85, 10), sm.metal);
    tapStem.position.set(-1.1, 0.425, -1.2);
    group.add(tapStem);

    // Floating Marble Vanity with Vessel Sink
    const vanity = new THREE.Mesh(createRoundedBoxGeometry(2.4, 0.45, 0.55, 0.02, 3), sm.darkWood);
    vanity.position.set(2.2, 0.65, -D / 2 + 0.32);
    vanity.castShadow = true;
    group.add(vanity);

    const sink = new THREE.Mesh(createFlutedCylinderGeometry(0.22, 0.12, 16), sm.marble);
    sink.position.set(2.2, 0.94, -D / 2 + 0.32);
    sink.castShadow = true;
    group.add(sink);

    // Backlit Architectural Arch Mirror
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.03), sm.metal);
    mirrorFrame.position.set(2.2, 2.05, -D / 2 + 0.02);
    group.add(mirrorFrame);
    const mirror = new THREE.Mesh(new THREE.PlaneGeometry(1.32, 1.52), sm.glass);
    mirror.position.set(2.2, 2.05, -D / 2 + 0.04);
    group.add(mirror);
  }

  function addDiningFurniture(group, sm, matPanel, matAccent, W, H, D) {
    // Capsule Marble Dining Table Top
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

    // Twin Fluted Pedestal Bases
    for (const bx of [-1.1, 1.1]) {
      const base = new THREE.Mesh(createFlutedCylinderGeometry(0.32, 0.72, 20), sm.darkWood);
      base.position.set(bx, 0.36, 0);
      base.castShadow = true;
      group.add(base);
    }
    addContactShadow(group, 0, 0, 4.0, 1.8, 0.5);

    // Upholstered Curved Dining Chairs (6)
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
        addContactShadow(group, cx, cz, 0.6, 0.6, 0.35);
      }
    }

    // Sculptural Brass Chandelier
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

  function addStudyFurniture(group, sm, matPanel, matAccent, W, H, D) {
    // Executive Dark Walnut Desk with Leather Inlay
    const desk = new THREE.Mesh(createRoundedBoxGeometry(2.3, 0.06, 0.95, 0.03, 3), sm.darkWood);
    desk.position.set(-0.5, 0.78, -0.4);
    desk.castShadow = true;
    group.add(desk);

    const inlay = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.65), sm.fabricDark);
    inlay.rotation.x = -Math.PI / 2;
    inlay.position.set(-0.5, 0.811, -0.4);
    group.add(inlay);

    for (const dx of [-0.95, 0.95]) {
      const leg = new THREE.Mesh(createRoundedBoxGeometry(0.06, 0.75, 0.8, 0.02, 2), sm.darkWood);
      leg.position.set(-0.5 + dx, 0.38, -0.4);
      group.add(leg);
    }
    addContactShadow(group, -0.5, -0.4, 2.6, 1.2, 0.45);

    // Ergonomic Leather Desk Lounge Chair
    const chair = new THREE.Mesh(createRoundedBoxGeometry(0.65, 0.1, 0.6, 0.04, 3), sm.fabricDark);
    chair.position.set(-0.5, 0.48, 0.45);
    chair.castShadow = true;
    group.add(chair);

    const back = new THREE.Mesh(createRoundedBoxGeometry(0.65, 0.75, 0.08, 0.04, 3), sm.fabricDark);
    back.position.set(-0.5, 0.88, 0.72);
    group.add(back);
    addContactShadow(group, -0.5, 0.5, 0.8, 0.8, 0.4);

    // Architectural Slatted Timber Library Shelving
    for (let r = 0; r < 4; r++) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 2.8), sm.darkWood);
      shelf.position.set(W / 2 - 0.25, 0.6 + r * 0.72, -0.8);
      group.add(shelf);
    }
  }

  function addGalleryFurniture(group, sm, matAccent, W, H, D) {
    const benchTop = new THREE.Mesh(createRoundedBoxGeometry(3.2, 0.08, 0.6, 0.03, 3), sm.darkWood);
    benchTop.position.set(0, 0.44, 1.4);
    benchTop.castShadow = true;
    group.add(benchTop);

    for (const bx of [-1.3, 1.3]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.52), sm.metalDark);
      leg.position.set(bx, 0.2, 1.4);
      group.add(leg);
    }
    addContactShadow(group, 0, 1.4, 3.4, 0.8, 0.45);
  }

  function addUndergroundFurniture(group, roomIndex, sm, matPanel, matAccent, W, H, D) {
    if (roomIndex === 0) {
      for (let r = 0; r < 3; r++) {
        const rack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 0.35), sm.darkWood);
        rack.position.set(-3 + r * 3, 1.2, -D / 2 + 0.2);
        rack.castShadow = true;
        group.add(rack);
      }
      addContactShadow(group, 0, -D / 2 + 0.2, 7.5, 0.6, 0.5);
    } else {
      for (let sh = 0; sh < 4; sh++) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(W * 0.75, 0.03, 0.45), sm.darkWood);
        shelf.position.set(0, 0.75 + sh * 0.75, -D / 2 + 0.25);
        group.add(shelf);
      }
    }
  }

  // --- Spatial 3D Camera Anchor Computation ---
  function getRoomCamAnchor(floorIndex, roomIndex) {
    const roomDef = FLOORS[floorIndex].rooms[roomIndex];
    const pos = roomDef.pos || { x: roomIndex * ROOM_SPACING, y: 0, z: 0, ry: 0 };
    const cam = roomDef.cam || { px: 0, py: 1.6, pz: 6.5, tx: 0, ty: 1.3, tz: -1.5 };
    const cos = Math.cos(pos.ry), sin = Math.sin(pos.ry);

    const Wpx = pos.x + (cam.px * cos - cam.pz * sin);
    const Wpy = pos.y + cam.py;
    const Wpz = pos.z + (cam.px * sin + cam.pz * cos);

    const Wtx = pos.x + (cam.tx * cos - cam.tz * sin);
    const Wty = pos.y + cam.ty;
    const Wtz = pos.z + (cam.tx * sin + cam.tz * cos);

    return { p: [Wpx, Wpy, Wpz], t: [Wtx, Wty, Wtz] };
  }


  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const onContextLost = (e) => { e.preventDefault(); };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xece3d2);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 1.25;

    const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 140);
    const initialCam = getRoomCamAnchor(1, 0);
    camera.position.set(...initialCam.p);

    // Quiet-Luxury Lighting Rig
    const ambient = new THREE.AmbientLight(0xfff1dc, 0.22);
    scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0xfff6e6, 0xb8a890, 0.6);
    scene.add(hemi);

    const dirKey = new THREE.DirectionalLight(0xfff0d4, 1.85);
    dirKey.position.set(4, 9, 5);
    dirKey.castShadow = true;
    dirKey.shadow.mapSize.set(2048, 2048);
    dirKey.shadow.camera.near = 1;
    dirKey.shadow.camera.far = 28;
    dirKey.shadow.camera.left = -10;
    dirKey.shadow.camera.right = 10;
    dirKey.shadow.camera.top = 10;
    dirKey.shadow.camera.bottom = -7;
    dirKey.shadow.bias = -0.0004;
    dirKey.shadow.normalBias = 0.02;
    dirKey.shadow.radius = 4;
    scene.add(dirKey);
    scene.add(dirKey.target);

    const dirRim = new THREE.DirectionalLight(0xffd9a8, 0.75);
    dirRim.position.set(-3, 5, -4);
    scene.add(dirRim);
    scene.add(dirRim.target);

    const dirFill = new THREE.DirectionalLight(0xe8edf2, 0.4);
    dirFill.position.set(-4, 4, 3);
    scene.add(dirFill);

    const spotOffsets = [-3.6, -1.2, 1.2, 3.6];
    const spots = spotOffsets.map((ox) => {
      const sp = new THREE.SpotLight(0xfff1d8, 24, 14, Math.PI * 0.24, 0.7, 1.3);
      sp.position.set(ox, 4.3, -3.2);
      sp.target.position.set(ox, 1.1, -5.2);
      scene.add(sp);
      scene.add(sp.target);
      return sp;
    });

    const roomsGroup = new THREE.Group();
    scene.add(roomsGroup);

    const s = {
      currentRoom: 0,
      currentFloor: 1,
      camP: [...initialCam.p],
      camT: [...initialCam.t],
      pointerX: 0, pointerY: 0, ptrTx: 0, ptrTy: 0,
      isDragging: false, dragStartX: 0, dragDelta: 0,
      roomsGroup,
      transit: null,
    };
    internals.current = s;

    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    s.beginRoom = (index) => {
      if (index === s.currentRoom && !s.transit) return;
      const fromAnchor = { p: [...s.camP], t: [...s.camT] };
      const toAnchor = getRoomCamAnchor(s.currentFloor, index);
      s.currentRoom = index;
      s.transit = { fromAnchor, toAnchor, dur: 1.1, t: 0 };
      onRoomChange?.(index);
    };

    s.beginFloor = (floorIndex) => {
      if (floorIndex === s.currentFloor && !s.transit) return;
      const fromAnchor = { p: [...s.camP], t: [...s.camT] };
      const toAnchor = getRoomCamAnchor(floorIndex, 0);
      s.transit = { fromAnchor, toAnchor, dur: 1.5, t: 0, rebuildFloor: floorIndex };
    };

    rebuildRooms(s);
    onFloorChange?.(s.currentFloor);
    onRoomChange?.(0);

    const onPointerMove = (e) => {
      s.ptrTx = (e.clientX / window.innerWidth) * 2 - 1;
      s.ptrTy = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onPointerDown = (e) => {
      s.isDragging = true;
      s.dragStartX = e.clientX;
    };
    const onPointerUp = () => {
      s.isDragging = false;
    };
    const onWheel = (e) => {
      if (s.transit || s.isDragging) return;
      const max = FLOORS[s.currentFloor].rooms.length - 1;
      if (e.deltaY > 15 && s.currentRoom < max) {
        e.preventDefault();
        s.beginRoom(s.currentRoom + 1);
      } else if (e.deltaY < -15 && s.currentRoom > 0) {
        e.preventDefault();
        s.beginRoom(s.currentRoom - 1);
      }
    };
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    let raf = 0;
    let lastT = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      s.pointerX += (s.ptrTx - s.pointerX) * 0.04;
      s.pointerY += (s.ptrTy - s.pointerY) * 0.04;
      s.time = (s.time || 0) + dt;

      if (s.transit) {
        const tr = s.transit;
        tr.t = Math.min(tr.t + dt / tr.dur, 1);
        const e = easeInOut(tr.t);

        for (let k = 0; k < 3; k++) {
          s.camP[k] = tr.fromAnchor.p[k] + (tr.toAnchor.p[k] - tr.fromAnchor.p[k]) * e;
          s.camT[k] = tr.fromAnchor.t[k] + (tr.toAnchor.t[k] - tr.fromAnchor.t[k]) * e;
        }

        if (tr.rebuildFloor != null && tr.t >= 0.5) {
          s.currentFloor = tr.rebuildFloor;
          s.currentRoom = 0;
          tr.rebuildFloor = null;
          rebuildRooms(s);
          onFloorChange?.(s.currentFloor);
          onRoomChange?.(0);
        }
        if (tr.t >= 1) s.transit = null;
      }

      const idleX = Math.sin(s.time * 0.16) * 0.18;
      const idleY = Math.sin(s.time * 0.11 + 1.7) * 0.08;
      const idleZ = Math.cos(s.time * 0.09) * 0.12;

      camera.position.x = s.camP[0] + s.pointerX * 0.35 + idleX;
      camera.position.y = s.camP[1] + s.pointerY * -0.12 + idleY;
      camera.position.z = s.camP[2] + idleZ;

      const activeRoomDef = FLOORS[s.currentFloor]?.rooms[s.currentRoom];
      const rPos = activeRoomDef?.pos || { x: 0, y: 0, z: 0, ry: 0 };
      const cosR = Math.cos(rPos.ry), sinR = Math.sin(rPos.ry);

      dirKey.position.set(rPos.x + 4 * cosR + 5 * sinR, 9, rPos.z - 4 * sinR + 5 * cosR);
      dirKey.target.position.set(rPos.x, 1, rPos.z);
      dirRim.position.set(rPos.x - 3 * cosR - 4 * sinR, 5, rPos.z + 3 * sinR - 4 * cosR);
      dirRim.target.position.set(rPos.x, 1.4, rPos.z);
      dirFill.position.set(rPos.x - 4 * cosR + 3 * sinR, 4, rPos.z + 4 * sinR + 3 * cosR);

      for (let i = 0; i < spots.length; i++) {
        const ox = spotOffsets[i];
        spots[i].position.set(rPos.x + ox * cosR + 3.2 * sinR, 4.3, rPos.z + ox * sinR - 3.2 * cosR);
        spots[i].target.position.set(rPos.x + ox * cosR + 5.2 * sinR, 1.1, rPos.z + ox * sinR - 5.2 * cosR);
      }

      camera.lookAt(s.camT[0] + s.pointerX * 0.1, s.camT[1], s.camT[2]);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();


    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
      });
      const mats = sharedMats.current;
      if (mats) Object.values(mats).forEach(m => m.dispose());
      artTextures.current.forEach(t => t.dispose());
      artTextures.current.clear();
      surfBundle.current.forEach(b => {
        if (b.map) b.map.dispose();
        if (b.normalMap) b.normalMap.dispose();
      });
      surfBundle.current.clear();
      gltfCache.current.forEach((p) => {
        p.then((gltf) => gltf.scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) {
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            mats.forEach((m) => {
              Object.values(m).forEach((v) => { if (v && v.isTexture) v.dispose(); });
              m.dispose();
            });
          }
        })).catch(() => {});
      });
      gltfCache.current.clear();
      envRT.dispose();
      pmrem.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [onRoomChange, onFloorChange]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        height: '100%',
        width: '100%',
        cursor: 'grab',
        touchAction: 'none',
      }}
    />
  );
});

GalleryScene.displayName = 'GalleryScene';
export default GalleryScene;
