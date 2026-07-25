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

  function paintHerringbone(ctx, rgb) {
    ctx.fillStyle = shade(rgb, 0.92);
    ctx.fillRect(0, 0, 512, 512);
    const bw = 64, bh = 18;
    for (let y = -64; y < 576; y += bh * 1.5) {
      for (let x = -64; x < 576; x += bw) {
        const isAlt = (Math.floor(x / bw) + Math.floor(y / bh)) % 2 === 0;
        const f = 0.86 + Math.random() * 0.28;
        ctx.fillStyle = shade(rgb, f);
        ctx.save();
        ctx.translate(x + bw / 2, y + bh / 2);
        ctx.rotate(isAlt ? Math.PI / 4 : -Math.PI / 4);
        ctx.fillRect(-bw / 2, -bh / 2, bw - 1.5, bh - 1.5);
        // grain lines inside each plank
        for (let g = 0; g < 3; g++) {
          ctx.strokeStyle = shade(rgb, f * (0.78 + Math.random() * 0.14));
          ctx.globalAlpha = 0.18;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          const gx = -bw / 2 + 6 + Math.random() * (bw - 12);
          ctx.moveTo(gx, -bh / 2);
          ctx.lineTo(gx + (Math.random() - 0.5) * 3, bh / 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }
  }

  function paintLeather(ctx, rgb) {
    // Realistic saddle leather with pores, creases, and patina variation
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, shade(rgb, 1.06));
    grad.addColorStop(0.35, shade(rgb, 0.96));
    grad.addColorStop(0.65, shade(rgb, 1.02));
    grad.addColorStop(1, shade(rgb, 0.92));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    // Micro pore grain
    for (let y = 0; y < 512; y += 4) {
      for (let x = 0; x < 512; x += 4) {
        const f = 0.90 + Math.random() * 0.20;
        ctx.fillStyle = shade(rgb, f);
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(x + Math.random() * 4, y + Math.random() * 4, 0.8 + Math.random() * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    // Creases / fold lines
    for (let c = 0; c < 8; c++) {
      ctx.strokeStyle = shade(rgb, 0.72 + Math.random() * 0.12);
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 0.8 + Math.random() * 0.6;
      ctx.beginPath();
      let x = Math.random() * 512, y = Math.random() * 100;
      ctx.moveTo(x, y);
      for (let s = 0; s < 4; s++) {
        x += (Math.random() - 0.5) * 140;
        y += 80 + Math.random() * 60;
        ctx.quadraticCurveTo(x + (Math.random() - 0.5) * 60, y - 40, x, y);
      }
      ctx.stroke();
    }
    // Patina warm spots
    for (let i = 0; i < 6; i++) {
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = shade(rgb, 1.12 + Math.random() * 0.08);
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, 50 + Math.random() * 90, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function paintVelvet(ctx, rgb) {
    // Velvet nap with directional sheen variation
    ctx.fillStyle = shade(rgb, 1.0);
    ctx.fillRect(0, 0, 512, 512);
    // Directional nap bands (like brushed velvet)
    for (let y = 0; y < 512; y += 3) {
      const bandF = 0.92 + Math.sin(y * 0.06) * 0.06 + Math.random() * 0.04;
      ctx.fillStyle = shade(rgb, bandF);
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, y, 512, 3);
    }
    ctx.globalAlpha = 1;
    // Fine fiber texture
    for (let y = 0; y < 512; y += 5) {
      for (let x = 0; x < 512; x += 5) {
        const f = 0.88 + Math.random() * 0.24;
        ctx.fillStyle = shade(rgb, f);
        ctx.globalAlpha = 0.28;
        ctx.fillRect(x + Math.random() * 3, y + Math.random() * 3, 1.5, 2.5);
      }
    }
    // Sheen highlight areas
    for (let i = 0; i < 8; i++) {
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = shade(rgb, 1.25);
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 512, 60 + Math.random() * 80, 30 + Math.random() * 40, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function paintLinen(ctx, rgb) {
    // Crosshatch linen weave
    ctx.fillStyle = shade(rgb, 1.0);
    ctx.fillRect(0, 0, 512, 512);
    const step = 6;
    for (let y = 0; y < 512; y += step) {
      for (let x = 0; x < 512; x += step) {
        const f = 0.90 + Math.random() * 0.20;
        ctx.fillStyle = shade(rgb, f);
        ctx.globalAlpha = 0.3;
        // Horizontal thread
        ctx.fillRect(x, y + 1, step - 1, 1.5);
        // Vertical thread
        ctx.fillRect(x + 1, y, 1.5, step - 1);
      }
    }
    ctx.globalAlpha = 1;
    // Subtle slubs
    for (let s = 0; s < 20; s++) {
      ctx.fillStyle = shade(rgb, 0.82 + Math.random() * 0.12);
      ctx.globalAlpha = 0.15;
      ctx.fillRect(Math.random() * 510, Math.random() * 510, 2 + Math.random() * 6, 1);
    }
    ctx.globalAlpha = 1;
  }

  function getSurfBundle(kind, color, repeatX = 1, repeatY = 1) {
    const key = `${kind}-${color}-${repeatX}-${repeatY}`;
    const cache = surfBundle.current;
    if (cache.has(key)) return cache.get(key);

    const diffCv = document.createElement('canvas');
    diffCv.width = 512; diffCv.height = 512;
    const dCtx = diffCv.getContext('2d');
    const rgb = hexRGB(color);

    if (kind === 'herringbone') paintHerringbone(dCtx, rgb);
    else if (kind === 'wood') paintWood(dCtx, rgb);
    else if (kind === 'marble') paintMarble(dCtx, rgb);
    else if (kind === 'boucle') paintBoucle(dCtx, rgb);
    else if (kind === 'leather') paintLeather(dCtx, rgb);
    else if (kind === 'velvet') paintVelvet(dCtx, rgb);
    else if (kind === 'linen') paintLinen(dCtx, rgb);
    else paintPlaster(dCtx, rgb);

    const normCv = document.createElement('canvas');
    normCv.width = 512; normCv.height = 512;
    const nCtx = normCv.getContext('2d');

    const roughCv = document.createElement('canvas');
    roughCv.width = 512; roughCv.height = 512;
    const rCtx = roughCv.getContext('2d');

    const dData = dCtx.getImageData(0, 0, 512, 512).data;
    const nImgData = nCtx.createImageData(512, 512);
    const nData = nImgData.data;

    const rImgData = rCtx.createImageData(512, 512);
    const rData = rImgData.data;

    // Richer, deeper normal map strength factors based on material type
    let normStr = 15.0;
    let step = 1;
    if (kind === 'wood' || kind === 'herringbone') { normStr = 18.0; step = 2; }
    else if (kind === 'marble') { normStr = 12.0; step = 2; }
    else if (kind === 'boucle') { normStr = 28.0; step = 1; }
    else if (kind === 'leather') { normStr = 16.0; step = 1; }
    else if (kind === 'velvet') { normStr = 10.0; step = 1; }
    else if (kind === 'linen') { normStr = 22.0; step = 1; }
    else if (kind === 'plaster') { normStr = 14.0; step = 2; }

    const getV = (px, py) => {
      const cx = (px + 512) % 512;
      const cy = (py + 512) % 512;
      const i = (cy * 512 + cx) * 4;
      return (dData[i] + dData[i + 1] + dData[i + 2]) / 765;
    };

    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const idx = (y * 512 + x) * 4;

        // Sobel-like tangent space normal mapping
        const dx = (getV(x + step, y) - getV(x - step, y)) * normStr;
        const dy = (getV(x, y + step) - getV(x, y - step)) * normStr;
        const len = Math.sqrt(dx * dx + dy * dy + 1.0);
        nData[idx] = Math.floor(((dx / len) * 0.5 + 0.5) * 255);
        nData[idx + 1] = Math.floor(((dy / len) * 0.5 + 0.5) * 255);
        nData[idx + 2] = Math.floor(((1.0 / len) * 0.5 + 0.5) * 255);
        nData[idx + 3] = 255;

        // Custom roughness map logic - wood grain, marble veins, leather pores are rougher
        const val = getV(x, y);
        let rVal = 128;
        if (kind === 'wood' || kind === 'herringbone') {
          // Grain lines are darker in diffuse, make them rougher/less glossy
          rVal = Math.floor((0.22 + (1.0 - val) * 0.65) * 255);
        } else if (kind === 'marble') {
          // Dark veins are rougher than the highly polished marble surface
          rVal = Math.floor((0.05 + (1.0 - val) * 0.45) * 255);
        } else if (kind === 'leather') {
          // Creases and pores are rougher
          rVal = Math.floor((0.28 + (1.0 - val) * 0.55) * 255);
        } else if (kind === 'boucle' || kind === 'velvet' || kind === 'linen') {
          // Fabrics are rough overall, shadows/indentations are even rougher
          rVal = Math.floor((0.80 + (1.0 - val) * 0.18) * 255);
        } else {
          // Plaster trowel markings create subtle matte/shine variation
          rVal = Math.floor((0.72 + (1.0 - val) * 0.24) * 255);
        }
        rData[idx] = rVal;
        rData[idx + 1] = rVal;
        rData[idx + 2] = rVal;
        rData[idx + 3] = 255;
      }
    }
    nCtx.putImageData(nImgData, 0, 0);
    rCtx.putImageData(rImgData, 0, 0);

    const map = new THREE.CanvasTexture(diffCv);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(repeatX, repeatY);
    map.anisotropy = 8;

    const normalMap = new THREE.CanvasTexture(normCv);
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(repeatX, repeatY);
    normalMap.anisotropy = 8;

    const roughnessMap = new THREE.CanvasTexture(roughCv);
    roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.repeat.set(repeatX, repeatY);
    roughnessMap.anisotropy = 8;

    const bundle = { map, normalMap, roughnessMap };
    cache.set(key, bundle);
    return bundle;
  }


  function paintWood(ctx, rgb) {
    const planks = 4;
    const pw = 512 / planks;
    // Base fill with heartwood-to-sapwood gradient per plank
    ctx.fillStyle = shade(rgb, 0.96);
    ctx.fillRect(0, 0, 512, 512);
    for (let p = 0; p < planks; p++) {
      const heartF = 0.88 + Math.random() * 0.22;
      // Heartwood to sapwood horizontal gradient
      const grad = ctx.createLinearGradient(p * pw, 0, (p + 1) * pw, 0);
      grad.addColorStop(0, shade(rgb, heartF * 0.92));
      grad.addColorStop(0.3, shade(rgb, heartF * 1.04));
      grad.addColorStop(0.7, shade(rgb, heartF * 1.06));
      grad.addColorStop(1, shade(rgb, heartF * 0.90));
      ctx.fillStyle = grad;
      ctx.fillRect(p * pw, 0, pw, 512);

      // Cathedral grain arches
      for (let a = 0; a < 3; a++) {
        ctx.strokeStyle = shade(rgb, heartF * (0.78 + Math.random() * 0.10));
        ctx.globalAlpha = 0.14;
        ctx.lineWidth = 1.0 + Math.random() * 0.5;
        ctx.beginPath();
        const cx = p * pw + pw * (0.3 + Math.random() * 0.4);
        const cy = 60 + a * 160 + Math.random() * 40;
        ctx.ellipse(cx, cy, pw * 0.28, 55 + Math.random() * 35, 0, Math.PI, 0);
        ctx.stroke();
      }

      // Fine grain lines
      for (let g = 0; g < 14; g++) {
        ctx.strokeStyle = shade(rgb, heartF * (0.78 + Math.random() * 0.18));
        ctx.globalAlpha = 0.18;
        ctx.lineWidth = 0.4 + Math.random() * 0.5;
        ctx.beginPath();
        const x = p * pw + 6 + Math.random() * (pw - 12);
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + (Math.random() - 0.5) * 6, 128, x + (Math.random() - 0.5) * 5, 256, x + (Math.random() - 0.5) * 4, 384);
        ctx.bezierCurveTo(x + (Math.random() - 0.5) * 3, 448, x + (Math.random() - 0.5) * 3, 480, x + (Math.random() - 0.5) * 2, 512);
        ctx.stroke();
      }

      // Medullary ray flecks (quarter-sawn shimmer)
      for (let m = 0; m < 6; m++) {
        ctx.fillStyle = shade(rgb, heartF * 1.14);
        ctx.globalAlpha = 0.09;
        const mx = p * pw + 10 + Math.random() * (pw - 20);
        const my = Math.random() * 512;
        ctx.fillRect(mx, my, 2 + Math.random() * 4, 1);
      }

      // Knot hole (rare per plank)
      if (Math.random() < 0.25) {
        const kx = p * pw + pw * (0.3 + Math.random() * 0.4);
        const ky = 80 + Math.random() * 350;
        const kr = 4 + Math.random() * 6;
        // Dark ring
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = shade(rgb, 0.45);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(kx, ky, kr, 0, Math.PI * 2);
        ctx.stroke();
        // Inner dark fill
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = shade(rgb, 0.55);
        ctx.fill();
        // Concentric grain rings
        for (let ring = 1; ring < 3; ring++) {
          ctx.globalAlpha = 0.08;
          ctx.strokeStyle = shade(rgb, 0.60 + ring * 0.08);
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(kx, ky, kr + ring * 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      // Plank edge groove shadow
      ctx.fillStyle = shade(rgb, 0.38);
      ctx.fillRect(p * pw, 0, 1.2, 512);
      ctx.fillStyle = shade(rgb, 1.12);
      ctx.fillRect(p * pw + 1.2, 0, 0.6, 512);
    }
  }

  function paintMarble(ctx, rgb) {
    // Multi-pass marble with depth fog, vein network, and crystalline shimmer
    // Base color with cloudy depth variation
    ctx.fillStyle = shade(rgb, 1.02);
    ctx.fillRect(0, 0, 512, 512);
    // Depth fog clouds (gives translucency illusion)
    for (let i = 0; i < 24; i++) {
      ctx.globalAlpha = 0.045;
      ctx.fillStyle = shade(rgb, 0.88 + Math.random() * 0.22);
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, 60 + Math.random() * 200, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Primary veins with secondary branching
    for (let v = 0; v < 5; v++) {
      const isGold = v < 2;
      ctx.strokeStyle = isGold ? shade(rgb, 0.55) : shade(rgb, v < 3 ? 0.5 : 0.72);
      ctx.globalAlpha = isGold ? 0.35 : (v < 3 ? 0.40 : 0.22);
      ctx.lineWidth = isGold ? 1.6 : (v < 3 ? 1.2 : 0.7);
      ctx.beginPath();
      let x = Math.random() * 512, y = -10;
      ctx.moveTo(x, y);
      const segments = 5 + Math.floor(Math.random() * 3);
      for (let s = 0; s < segments; s++) {
        const nx = x + (Math.random() - 0.5) * 140;
        const ny = y + 70 + Math.random() * 40;
        ctx.bezierCurveTo(x + (Math.random() - 0.5) * 90, y + 35, nx + (Math.random() - 0.5) * 90, ny - 35, nx, ny);
        // Secondary branch fork
        if (Math.random() < 0.5) {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          const bx = nx + (Math.random() - 0.5) * 60;
          const by = ny + 20 + Math.random() * 30;
          ctx.globalAlpha *= 0.6;
          ctx.lineWidth *= 0.6;
          ctx.quadraticCurveTo(nx + (Math.random() - 0.5) * 30, ny + 15, bx, by);
          ctx.stroke();
          // Restore for main trunk
          ctx.globalAlpha = isGold ? 0.35 : (v < 3 ? 0.40 : 0.22);
          ctx.lineWidth = isGold ? 1.6 : (v < 3 ? 1.2 : 0.7);
          ctx.beginPath();
          ctx.moveTo(nx, ny);
        }
        x = nx; y = ny;
      }
      ctx.stroke();
    }

    // Crystalline sparkle flecks
    for (let sp = 0; sp < 40; sp++) {
      ctx.globalAlpha = 0.06 + Math.random() * 0.05;
      ctx.fillStyle = shade(rgb, 1.30 + Math.random() * 0.15);
      const sx = Math.random() * 512, sy = Math.random() * 512;
      ctx.fillRect(sx, sy, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  function paintBoucle(ctx, rgb) {
    // Loopy yarn cluster bouclé with highlight halos
    ctx.fillStyle = shade(rgb, 0.96);
    ctx.fillRect(0, 0, 512, 512);
    // First pass: base yarn loops
    for (let y = 0; y < 512; y += 7) {
      for (let x = 0; x < 512; x += 7) {
        const f = 0.86 + Math.random() * 0.28;
        ctx.fillStyle = shade(rgb, f);
        ctx.globalAlpha = 0.8;
        const cx = x + 3.5 + (Math.random() - 0.5) * 3;
        const cy = y + 3.5 + (Math.random() - 0.5) * 3;
        const r = 2.5 + Math.random() * 2.0;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Second pass: highlight halos on random loops (light catching top of yarn)
    for (let y = 0; y < 512; y += 14) {
      for (let x = 0; x < 512; x += 14) {
        if (Math.random() < 0.4) {
          ctx.globalAlpha = 0.10;
          ctx.fillStyle = shade(rgb, 1.22);
          ctx.beginPath();
          ctx.arc(x + 7 + (Math.random() - 0.5) * 4, y + 5 + (Math.random() - 0.5) * 4, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    // Third pass: shadow between loops
    for (let y = 0; y < 512; y += 7) {
      for (let x = 0; x < 512; x += 7) {
        if (Math.random() < 0.3) {
          ctx.globalAlpha = 0.12;
          ctx.fillStyle = shade(rgb, 0.68);
          ctx.fillRect(x + 2, y + 5, 3, 1.5);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  function paintPlaster(ctx, rgb) {
    // Venetian plaster with layered trowel marks and burnished highlights
    ctx.fillStyle = shade(rgb, 1.0);
    ctx.fillRect(0, 0, 512, 512);
    // Depth clouds
    for (let i = 0; i < 28; i++) {
      ctx.globalAlpha = 0.035;
      ctx.fillStyle = shade(rgb, 0.88 + Math.random() * 0.22);
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, 50 + Math.random() * 150, 0, Math.PI * 2);
      ctx.fill();
    }
    // Trowel strokes (broad sweeping marks)
    for (let t = 0; t < 12; t++) {
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = shade(rgb, 0.90 + Math.random() * 0.16);
      ctx.save();
      ctx.translate(Math.random() * 512, Math.random() * 512);
      ctx.rotate((Math.random() - 0.5) * 0.6);
      ctx.fillRect(-120, -3, 240 + Math.random() * 80, 4 + Math.random() * 3);
      ctx.restore();
    }
    // Burnished sheen spots
    for (let b = 0; b < 6; b++) {
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = shade(rgb, 1.15);
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 512, 40 + Math.random() * 60, 20 + Math.random() * 30, Math.random() * Math.PI, 0, Math.PI * 2);
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

  // Shared Materials with Interior Designer Depth & Textures
  const sharedMats = useRef(null);
  function getSharedMats() {
    if (!sharedMats.current) {
      const woodB = getSurfBundle('wood', 0x3a2b1f, 1.5, 1.5);
      const walnutB = getSurfBundle('wood', 0x5c3d28, 1.5, 1.5);
      const marbCalB = getSurfBundle('marble', 0xd6c8b4, 1, 1);
      const marbNeroB = getSurfBundle('marble', 0x221d18, 1, 1);
      const boucB = getSurfBundle('boucle', 0xf2ede4, 2, 2);
      const fabricB = getSurfBundle('boucle', 0xb8aba0, 2, 2);
      const leatherB = getSurfBundle('leather', 0x8a4b28, 2, 2);
      const velvetTerraB = getSurfBundle('velvet', 0xb85d43, 2, 2);
      const velvetForB = getSurfBundle('velvet', 0x2e3d30, 2, 2);
      const velvetNavyB = getSurfBundle('velvet', 0x1e2a3a, 2, 2);
      const linenB = getSurfBundle('linen', 0xe8ddd0, 3, 3);

      sharedMats.current = {
        ceiling: new THREE.MeshStandardMaterial({ color: 0xf5efe6, roughness: 0.78 }),
        glow: new THREE.MeshBasicMaterial({ color: 0xfffaee, transparent: true, opacity: 0.88 }),
        glowDim: new THREE.MeshBasicMaterial({ color: 0xfff8e8, transparent: true, opacity: 0.45 }),
        fixtureGlow: new THREE.MeshBasicMaterial({ color: 0xfffaee }),
        // Wood + stone use MeshPhysicalMaterial so the clearcoat actually
        // renders — a real lacquer sheen on wood and a polished coat on marble.
        darkWood: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: woodB.map, normalMap: woodB.normalMap, roughnessMap: woodB.roughnessMap, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 1.0, metalness: 0.02, clearcoat: 0.45, clearcoatRoughness: 0.18 }),
        walnutWood: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: walnutB.map, normalMap: walnutB.normalMap, roughnessMap: walnutB.roughnessMap, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 1.0, metalness: 0.02, clearcoat: 0.5, clearcoatRoughness: 0.2 }),
        marble: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: marbCalB.map, normalMap: marbCalB.normalMap, roughnessMap: marbCalB.roughnessMap, normalScale: new THREE.Vector2(0.5, 0.5), roughness: 1.0, metalness: 0.08, envMapIntensity: 2.0, clearcoat: 0.9, clearcoatRoughness: 0.06 }),
        marbleNero: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: marbNeroB.map, normalMap: marbNeroB.normalMap, roughnessMap: marbNeroB.roughnessMap, normalScale: new THREE.Vector2(0.5, 0.5), roughness: 1.0, metalness: 0.12, envMapIntensity: 1.8, clearcoat: 0.9, clearcoatRoughness: 0.06 }),
        // Upholstery uses MeshPhysicalMaterial sheen so fabrics catch a soft
        // grazing highlight — this is what reads as real boucle / velvet.
        boucle: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: boucB.map, normalMap: boucB.normalMap, roughnessMap: boucB.roughnessMap, normalScale: new THREE.Vector2(1.2, 1.2), roughness: 1.0, sheen: 0.6, sheenRoughness: 0.85, sheenColor: new THREE.Color(0xfff4e6) }),
        fabricDark: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: fabricB.map, normalMap: fabricB.normalMap, roughnessMap: fabricB.roughnessMap, normalScale: new THREE.Vector2(1.0, 1.0), roughness: 1.0, sheen: 0.5, sheenRoughness: 0.85, sheenColor: new THREE.Color(0xe8dccb) }),
        velvetTerracotta: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: velvetTerraB.map, normalMap: velvetTerraB.normalMap, roughnessMap: velvetTerraB.roughnessMap, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 1.0, sheen: 1.0, sheenRoughness: 0.4, sheenColor: new THREE.Color(0xe6a683) }),
        velvetForest: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: velvetForB.map, normalMap: velvetForB.normalMap, roughnessMap: velvetForB.roughnessMap, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 1.0, sheen: 1.0, sheenRoughness: 0.4, sheenColor: new THREE.Color(0x8fae8c) }),
        velvetNavy: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: velvetNavyB.map, normalMap: velvetNavyB.normalMap, roughnessMap: velvetNavyB.roughnessMap, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 1.0, sheen: 1.0, sheenRoughness: 0.4, sheenColor: new THREE.Color(0x8093b8) }),
        leatherCognac: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: leatherB.map, normalMap: leatherB.normalMap, roughnessMap: leatherB.roughnessMap, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 1.0, metalness: 0.04, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
        linen: new THREE.MeshStandardMaterial({ color: 0xffffff, map: linenB.map, normalMap: linenB.normalMap, roughnessMap: linenB.roughnessMap, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 1.0 }),
        metal: new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.15, metalness: 0.92, envMapIntensity: 2.0 }),
        metalDark: new THREE.MeshStandardMaterial({ color: 0x4a3e2e, roughness: 0.28, metalness: 0.84 }),
        glass: new THREE.MeshStandardMaterial({ color: 0x3a342c, roughness: 0.02, metalness: 0.94, transparent: true, opacity: 0.50 }),
        rugMat: new THREE.MeshStandardMaterial({ color: 0xffffff, map: linenB.map, normalMap: linenB.normalMap, roughnessMap: linenB.roughnessMap, normalScale: new THREE.Vector2(0.6, 0.6), roughness: 1.0, transparent: true, opacity: 0.55 }),
        pebble: new THREE.MeshStandardMaterial({ color: 0xbdb2a0, roughness: 0.92, metalness: 0.02 }),
        ceramicPot: new THREE.MeshStandardMaterial({ color: 0xc86a4b, roughness: 0.86, metalness: 0.03 }),
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

    // Woven Linen Area Rug under seating area
    const rugW = 4.5, rugD = 3.2;
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(rugW, rugD), sm.rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(-0.5, 0.005, 0.2);
    rug.receiveShadow = true;
    group.add(rug);
    // Rug border trim
    const rugBorder = new THREE.Mesh(new THREE.PlaneGeometry(rugW + 0.06, rugD + 0.06), new THREE.MeshStandardMaterial({ color: 0x8a7a64, roughness: 0.9, transparent: true, opacity: 0.25 }));
    rugBorder.rotation.x = -Math.PI / 2;
    rugBorder.position.set(-0.5, 0.004, 0.2);
    group.add(rugBorder);

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

    // Potted Ceramic Architectural Plant
    const px = -side * (W / 2 - 1.2);
    const planter = new THREE.Mesh(createFlutedCylinderGeometry(0.25, 0.6, 16), sm.ceramicPot);
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

    // Sculptural Marble Plinth with Champagne Brass Torus Knot Sculpture
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

    // Architectural Arc Lamp with Brass Stem & Heavy Marble Disk Base
    const lx = -side * (2.8 + rnd() * 0.4);
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 18), sm.marble);
    lampBase.position.set(lx, 0.02, 2.6);
    group.add(lampBase);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 1.8, 8), sm.metal);
    pole.position.set(lx, 0.9, 2.6);
    group.add(pole);

    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.22, 0.3, 16),
      new THREE.MeshBasicMaterial({ color: 0xfff5e0, transparent: true, opacity: 0.65 })
    );
    shade.position.set(lx, 1.85, 2.6);
    group.add(shade);
    addContactShadow(group, lx, 2.6, 0.6, 0.6, 0.35);
  }

  function buildRoom(def, roomIndex, floorIndex) {
    const group = new THREE.Group();
    const sm = getSharedMats();
    const W = 12, H = 4.5, D = 10;
    const lastIndex = FLOORS[floorIndex].rooms.length - 1;

    const marbleFloor = floorIndex === 0 || (roomIndex % 2 === 1);
    const wallB = getSurfBundle('plaster', def.wallColor, 3, 1.4);
    const floorB = getSurfBundle(marbleFloor ? 'marble' : 'herringbone', def.floorColor, marbleFloor ? 1.5 : 3, marbleFloor ? 1.5 : 3);
    const panelB = getSurfBundle('wood', def.panelColor, 1, 2);

    const matWall = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: wallB.map, normalMap: wallB.normalMap, roughnessMap: wallB.roughnessMap, normalScale: new THREE.Vector2(0.35, 0.35), roughness: 1.0,
    });
    const matFloor = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: floorB.map, normalMap: floorB.normalMap, roughnessMap: floorB.roughnessMap, normalScale: new THREE.Vector2(0.6, 0.6),
      roughness: 1.0, metalness: marbleFloor ? 0.08 : 0.02, envMapIntensity: marbleFloor ? 2.0 : 0.9,
      clearcoat: marbleFloor ? 0.85 : 0.2, clearcoatRoughness: marbleFloor ? 0.06 : 0.2,
    });
    const matPanel = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: panelB.map, normalMap: panelB.normalMap, roughnessMap: panelB.roughnessMap, normalScale: new THREE.Vector2(0.5, 0.5), roughness: 1.0, metalness: 0.02,
    });
    const matAccent = new THREE.MeshStandardMaterial({ color: def.accent, roughness: 0.35, metalness: 0.15 });

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

  // --- Luxury Multi-Textured Furniture & Decor Generators ---

  function addHallFurniture(group, sm, matAccent, W, H, D) {
    // Curved Bouclé Sectional Sofa with Multi-Toned Throw Cushions & Brass Tapered Feet
    const sofaGroup = new THREE.Group();

    const mainSeat = new THREE.Mesh(createRoundedBoxGeometry(3.2, 0.42, 1.2, 0.12, 5), sm.boucle);
    mainSeat.position.set(-1.2, 0.21, -0.8);
    mainSeat.castShadow = true; mainSeat.receiveShadow = true;
    sofaGroup.add(mainSeat);

    const backrest = new THREE.Mesh(createRoundedBoxGeometry(3.2, 0.48, 0.28, 0.1, 4), sm.boucle);
    backrest.position.set(-1.2, 0.62, -1.32);
    backrest.castShadow = true;
    sofaGroup.add(backrest);

    const chaise = new THREE.Mesh(createRoundedBoxGeometry(1.2, 0.42, 1.4, 0.12, 5), sm.boucle);
    chaise.position.set(-2.2, 0.21, -0.3);
    chaise.castShadow = true;
    sofaGroup.add(chaise);

    // Terracotta & Forest Velvet Lumbar Pillows
    const pMats = [sm.velvetTerracotta, sm.velvetForest, sm.velvetTerracotta];
    for (let i = 0; i < 3; i++) {
      const pillow = new THREE.Mesh(createRoundedBoxGeometry(0.55, 0.35, 0.15, 0.06, 4), pMats[i]);
      pillow.position.set(-2.4 + i * 0.85, 0.52, -1.15);
      pillow.rotation.y = (i - 1) * 0.15;
      pillow.castShadow = true;
      sofaGroup.add(pillow);
    }

    // Tapered Brass Feet
    const feetCoords = [[-2.7, -1.3], [-0.3, -1.3], [-2.7, 0.3], [-0.3, 0.3]];
    feetCoords.forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.012, 0.1, 8), sm.metal);
      foot.position.set(fx, 0.05, fz);
      sofaGroup.add(foot);
    });

    group.add(sofaGroup);
    addContactShadow(group, -1.2, -0.7, 3.6, 2.2, 0.55);

    // Fluted Marble Coffee Table with Brass Lip Trim & Walnut Pedestal
    const tableGroup = new THREE.Group();
    const coffeeTable = new THREE.Mesh(createFlutedCylinderGeometry(0.65, 0.36, 22), sm.walnutWood);
    coffeeTable.position.set(0.6, 0.18, 0.3);
    coffeeTable.castShadow = true; coffeeTable.receiveShadow = true;
    tableGroup.add(coffeeTable);

    const topSlab = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.04, 32), sm.marble);
    topSlab.position.set(0.6, 0.38, 0.3);
    topSlab.castShadow = true;
    tableGroup.add(topSlab);

    const brassLip = new THREE.Mesh(new THREE.TorusGeometry(0.685, 0.01, 8, 32), sm.metal);
    brassLip.rotation.x = Math.PI / 2;
    brassLip.position.set(0.6, 0.395, 0.3);
    tableGroup.add(brassLip);
    group.add(tableGroup);
    addContactShadow(group, 0.6, 0.3, 1.5, 1.5, 0.5);

    // Styled Hardcover Book Stack (3 books with colored spines)
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

    // Brass Candle Holder Trio on table
    for (let c = 0; c < 3; c++) {
      const ch = 0.10 + c * 0.06;
      const candleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, ch, 10), sm.metal);
      candleBase.position.set(0.35 + c * 0.12, 0.40 + ch / 2, 0.42);
      group.add(candleBase);
      const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.08, 8), sm.linen);
      wick.position.set(0.35 + c * 0.12, 0.40 + ch + 0.04, 0.42);
      group.add(wick);
    }

    // Designer Lounge Chair (Champagne Brass Frame + Cognac Saddle Leather Cushion)
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

    // Armrests
    for (const arm of [-0.34, 0.34]) {
      const armrest = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.55), sm.leatherCognac);
      armrest.position.set(2.32 + arm * 0.85, 0.42, -1.34);
      armrest.rotation.y = -0.4;
      chairGroup.add(armrest);
    }

    // Tubular Brass Skeleton Frame
    for (const legX of [-0.34, 0.34]) {
      for (const legZ of [-0.30, 0.30]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 10), sm.metal);
        leg.position.set(2.4 + legX, 0.14, -1.2 + legZ);
        chairGroup.add(leg);
      }
    }
    // Cushion on chair
    const chairCush = new THREE.Mesh(createRoundedBoxGeometry(0.42, 0.18, 0.1, 0.04, 3), sm.velvetNavy);
    chairCush.position.set(2.30, 0.50, -1.40);
    chairCush.rotation.y = -0.4;
    chairGroup.add(chairCush);

    group.add(chairGroup);
    addContactShadow(group, 2.4, -1.3, 1.2, 1.2, 0.45);
  }

  function addKitchenFurniture(group, sm, matPanel, matAccent, W, H, D) {
    // Nero Marquina Dark Marble Kitchen Island with Fluted Walnut Fascia & Brass Sink
    const island = new THREE.Mesh(createRoundedBoxGeometry(3.6, 0.94, 1.2, 0.03, 3), sm.marbleNero);
    island.position.set(0, 0.47, 0);
    island.castShadow = true; island.receiveShadow = true;
    group.add(island);
    addContactShadow(group, 0, 0, 3.9, 1.5, 0.55);

    // Calacatta marble countertop slab on top of dark island
    const counterTop = new THREE.Mesh(new THREE.BoxGeometry(3.66, 0.04, 1.26), sm.marble);
    counterTop.position.set(0, 0.94, 0);
    group.add(counterTop);

    const islandPanel = new THREE.Mesh(createFlutedCylinderGeometry(0.55, 0.88, 32), sm.walnutWood);
    islandPanel.scale.set(3.2, 1, 0.2);
    islandPanel.position.set(0, 0.44, 0.52);
    group.add(islandPanel);

    // Undermount Brass Sink Basin & Tapware
    const sink = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.4), sm.metal);
    sink.position.set(1.0, 0.941, 0);
    group.add(sink);

    const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 10), sm.metal);
    tap.position.set(1.0, 1.12, -0.22);
    group.add(tap);

    // Saddle Leather Counter Stools with Brass Footrest & Smoked Oak Legs
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

  function addBedroomFurniture(group, sm, matPanel, matAccent, W, H, D) {
    const bedW = 2.6, bedD = 3.1;
    // Platform Bed with Channel-Tufted Terracotta Velvet Headboard
    const headboard = new THREE.Mesh(createRoundedBoxGeometry(bedW + 0.5, 1.45, 0.12, 0.04, 4), sm.velvetTerracotta);
    headboard.position.set(0, 1.05, -D / 2 + 0.2);
    headboard.castShadow = true;
    group.add(headboard);

    // Channel-tufting stitch lines on headboard (horizontal grooves)
    for (let ch = 0; ch < 6; ch++) {
      const stitch = new THREE.Mesh(new THREE.BoxGeometry(bedW + 0.3, 0.008, 0.13), sm.metalDark);
      stitch.position.set(0, 0.48 + ch * 0.20, -D / 2 + 0.21);
      group.add(stitch);
    }

    const bedBase = new THREE.Mesh(createRoundedBoxGeometry(bedW, 0.3, bedD), sm.darkWood);
    bedBase.position.set(0, 0.15, -D / 2 + bedD / 2 + 0.3);
    bedBase.castShadow = true;
    group.add(bedBase);

    const mattress = new THREE.Mesh(createRoundedBoxGeometry(bedW - 0.06, 0.22, bedD - 0.1), sm.linen);
    mattress.position.set(0, 0.38, -D / 2 + bedD / 2 + 0.3);
    group.add(mattress);

    // Layered pillows (large linen, medium velvet)
    for (const px of [-0.48, 0.48]) {
      const pillow = new THREE.Mesh(createRoundedBoxGeometry(0.6, 0.14, 0.36, 0.06, 4), sm.linen);
      pillow.position.set(px, 0.52, -D / 2 + 0.65);
      pillow.castShadow = true;
      group.add(pillow);
      const accentPillow = new THREE.Mesh(createRoundedBoxGeometry(0.42, 0.12, 0.22, 0.05, 4), sm.velvetNavy);
      accentPillow.position.set(px, 0.54, -D / 2 + 0.85);
      accentPillow.rotation.y = (px > 0 ? 1 : -1) * 0.08;
      accentPillow.castShadow = true;
      group.add(accentPillow);
    }
    // Folded throw blanket at bed foot
    const duvet = new THREE.Mesh(createRoundedBoxGeometry(bedW - 0.3, 0.08, 0.8), sm.velvetForest);
    duvet.position.set(0, 0.42, -D / 2 + bedD + 0.05);
    duvet.castShadow = true;
    group.add(duvet);
    addContactShadow(group, 0, -D / 2 + bedD / 2 + 0.3, bedW + 0.6, bedD + 0.6, 0.5);

    // Calacatta Marble Nightstands + Walnut Drawer + Brass Handle + Lamp + Decor
    for (const nx of [-1, 1]) {
      const ns = new THREE.Mesh(createRoundedBoxGeometry(0.55, 0.48, 0.42, 0.03, 3), sm.marble);
      ns.position.set(nx * (bedW / 2 + 0.52), 0.24, -D / 2 + 0.5);
      ns.castShadow = true;
      group.add(ns);

      const drawerFront = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.2, 0.02), sm.walnutWood);
      drawerFront.position.set(nx * (bedW / 2 + 0.52), 0.24, -D / 2 + 0.72);
      group.add(drawerFront);

      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.015), sm.metal);
      handle.position.set(nx * (bedW / 2 + 0.52), 0.24, -D / 2 + 0.74);
      group.add(handle);

      addContactShadow(group, nx * (bedW / 2 + 0.52), -D / 2 + 0.5, 0.7, 0.6, 0.35);

      // Lamp with brass stem and frosted globe
      const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 8), sm.metal);
      lampStem.position.set(nx * (bedW / 2 + 0.52), 0.55, -D / 2 + 0.5);
      group.add(lampStem);
      const lampGlobe = new THREE.Mesh(new THREE.SphereGeometry(0.10, 16, 12), sm.fixtureGlow);
      lampGlobe.position.set(nx * (bedW / 2 + 0.52), 0.66, -D / 2 + 0.5);
      group.add(lampGlobe);

      // Small ceramic dish and book on nightstand
      if (nx > 0) {
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.015, 14), sm.ceramicPot);
        dish.position.set(nx * (bedW / 2 + 0.52) - 0.12, 0.495, -D / 2 + 0.45);
        group.add(dish);
      } else {
        const nightBook = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.02, 0.15), sm.velvetForest);
        nightBook.position.set(nx * (bedW / 2 + 0.52) + 0.10, 0.50, -D / 2 + 0.45);
        group.add(nightBook);
      }
    }
  }

  function addBathFurniture(group, sm, matAccent, W, H, D) {
    // Freestanding Oval Soaking Tub in Honed Travertine
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

    // Floor-Mounted Polished Brass Tapware
    const tapStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.85, 10), sm.metal);
    tapStem.position.set(-1.1, 0.425, -1.2);
    group.add(tapStem);

    // Floating Calacatta Marble Vanity with Fluted Walnut Cabinetry & Vessel Sink
    const vanity = new THREE.Mesh(createRoundedBoxGeometry(2.4, 0.45, 0.55, 0.02, 3), sm.walnutWood);
    vanity.position.set(2.2, 0.65, -D / 2 + 0.32);
    vanity.castShadow = true;
    group.add(vanity);

    const vanityTop = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.04, 0.58), sm.marble);
    vanityTop.position.set(2.2, 0.88, -D / 2 + 0.32);
    group.add(vanityTop);

    const sink = new THREE.Mesh(createFlutedCylinderGeometry(0.22, 0.12, 16), sm.marble);
    sink.position.set(2.2, 0.96, -D / 2 + 0.32);
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
    // Capsule Calacatta Marble Dining Table Top with Twin Fluted Walnut Pillars
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

    // Upholstered Curved Bouclé Dining Chairs with Brass Cap Feet (6)
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

  function addStudyFurniture(group, sm, matPanel, matAccent, W, H, D) {
    // Executive Caramel Walnut Desk with Saddle Leather Inlay & Brass Edge Trim
    const desk = new THREE.Mesh(createRoundedBoxGeometry(2.3, 0.06, 0.95, 0.03, 3), sm.walnutWood);
    desk.position.set(-0.5, 0.78, -0.4);
    desk.castShadow = true;
    group.add(desk);

    const inlay = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.65), sm.leatherCognac);
    inlay.rotation.x = -Math.PI / 2;
    inlay.position.set(-0.5, 0.811, -0.4);
    group.add(inlay);

    // Brass edge trim around desk top
    for (const [tw, td, tx, tz] of [[2.36, 0.015, 0, -0.88], [2.36, 0.015, 0, 0.08], [0.015, 0.98, -1.17, -0.4], [0.015, 0.98, 0.17, -0.4]]) {
      const trim = new THREE.Mesh(new THREE.BoxGeometry(tw, 0.065, td), sm.metal);
      trim.position.set(-0.5 + tx, 0.78, -0.4 + tz);
      group.add(trim);
    }

    for (const dx of [-0.95, 0.95]) {
      const leg = new THREE.Mesh(createRoundedBoxGeometry(0.06, 0.75, 0.8, 0.02, 2), sm.walnutWood);
      leg.position.set(-0.5 + dx, 0.38, -0.4);
      group.add(leg);
    }
    addContactShadow(group, -0.5, -0.4, 2.6, 1.2, 0.45);

    // Desk accessories: pen holder, small book, ceramic coaster
    const penHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.10, 10), sm.metal);
    penHolder.position.set(-0.1, 0.86, -0.55);
    group.add(penHolder);
    const deskBook = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.16), sm.velvetTerracotta);
    deskBook.position.set(-0.75, 0.825, -0.3);
    group.add(deskBook);

    // Ergonomic Saddle Leather Lounge Desk Chair
    const chair = new THREE.Mesh(createRoundedBoxGeometry(0.65, 0.1, 0.6, 0.04, 3), sm.leatherCognac);
    chair.position.set(-0.5, 0.48, 0.45);
    chair.castShadow = true;
    group.add(chair);

    const back = new THREE.Mesh(createRoundedBoxGeometry(0.65, 0.75, 0.08, 0.04, 3), sm.leatherCognac);
    back.position.set(-0.5, 0.88, 0.72);
    group.add(back);
    addContactShadow(group, -0.5, 0.5, 0.8, 0.8, 0.4);

    // Architectural Slatted Timber Library Shelving with Hardcover Spines
    const spineColors = [sm.velvetTerracotta, sm.velvetForest, sm.velvetNavy, sm.walnutWood, sm.leatherCognac];
    for (let r = 0; r < 4; r++) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 2.8), sm.walnutWood);
      shelf.position.set(W / 2 - 0.25, 0.6 + r * 0.72, -0.8);
      group.add(shelf);
      // Book spines on each shelf
      for (let b = 0; b < 8; b++) {
        const bw = 0.04 + Math.random() * 0.04;
        const bh = 0.20 + Math.random() * 0.12;
        const spine = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.14), spineColors[b % spineColors.length]);
        spine.position.set(W / 2 - 0.25, 0.62 + r * 0.72 + bh / 2, -2.0 + b * 0.32);
        spine.castShadow = true;
        group.add(spine);
      }
    }
  }

  function addGalleryFurniture(group, sm, matAccent, W, H, D) {
    const benchTop = new THREE.Mesh(createRoundedBoxGeometry(3.2, 0.08, 0.6, 0.03, 3), sm.walnutWood);
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
    renderer.toneMappingExposure = 1.02;
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
    // Lower env intensity: the IBL should give reflections and gentle fill,
    // not flood the room evenly — that flat flooding is what kills contrast.
    scene.environmentIntensity = 0.7;

    const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 140);
    const initialCam = getRoomCamAnchor(1, 0);
    camera.position.set(...initialCam.p);

    // Quiet-Luxury Lighting Rig — low ambient so the key light creates real
    // shape and shadow instead of a flat, evenly-lit clay look.
    const ambient = new THREE.AmbientLight(0xfff1dc, 0.06);
    scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0xfff6e6, 0xb8a890, 0.24);
    scene.add(hemi);

    const dirKey = new THREE.DirectionalLight(0xfff0d4, 2.9);
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
    dirKey.shadow.radius = 3;
    scene.add(dirKey);
    scene.add(dirKey.target);

    const dirRim = new THREE.DirectionalLight(0xffd9a8, 0.55);
    dirRim.position.set(-3, 5, -4);
    scene.add(dirRim);
    scene.add(dirRim.target);

    const dirFill = new THREE.DirectionalLight(0xe8edf2, 0.22);
    dirFill.position.set(-4, 4, 3);
    scene.add(dirFill);

    // Brighter, tighter recessed spots so they read as real light pools.
    const spotOffsets = [-3.6, -1.2, 1.2, 3.6];
    const spots = spotOffsets.map((ox) => {
      const sp = new THREE.SpotLight(0xfff1d8, 52, 14, Math.PI * 0.22, 0.5, 1.3);
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
    let wheelCooldown = 0;
    const onWheel = (e) => {
      const now = performance.now();
      if (s.transit || now - wheelCooldown < 550) return;
      const max = FLOORS[s.currentFloor].rooms.length - 1;
      const down = e.deltaY > 12;
      const up = e.deltaY < -12;

      if (down && s.currentRoom < max) {
        e.preventDefault();
        wheelCooldown = now;
        s.beginRoom(s.currentRoom + 1);
      } else if (up && s.currentRoom > 0) {
        e.preventDefault();
        wheelCooldown = now;
        s.beginRoom(s.currentRoom - 1);
      }
    };

    let touchStartX = 0, touchStartY = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchEnd = (e) => {
      if (!e.changedTouches.length || s.transit) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const max = FLOORS[s.currentFloor].rooms.length - 1;

      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0 && s.currentRoom < max) {
          s.beginRoom(s.currentRoom + 1);
        } else if (dx > 0 && s.currentRoom > 0) {
          s.beginRoom(s.currentRoom - 1);
        }
      }
    };

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      if (w / h < 1.0) {
        camera.fov = 48 + (1.0 - w / h) * 20;
      } else {
        camera.fov = 48;
      }
      camera.updateProjectionMatrix();
    };
    onResize();

    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('touchstart', onTouchStart, { passive: true });
    mount.addEventListener('touchend', onTouchEnd, { passive: true });
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
      mount.removeEventListener('touchstart', onTouchStart);
      mount.removeEventListener('touchend', onTouchEnd);
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
