'use client';
/* eslint-disable */
// Vendored from the Wolf Casa handoff (wolf casa-handoff/wolf-casa) — the
// immersive "Step Inside" gallery engine: imperative Three.js, PMREM
// RoomEnvironment IBL, procedural wood/marble/plaster + canvas artwork,
// per-room furniture staging, GLB models, dolly-between-rooms navigation.
// Kept close to source so it stays easy to diff against the original.

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FLOORS, ROOM_SPACING } from './galleryData';

const gltfLoader = typeof window !== 'undefined' ? new GLTFLoader() : null;

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

  // --- Procedural artwork textures (canvas-painted, look like real art) ---
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

    // seeded RNG
    let st = (seed * 9973 + 7) >>> 0;
    const rnd = () => { st = (st * 1664525 + 1013904223) >>> 0; return st / 4294967296; };
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

    // warm gallery-friendly palettes
    const palettes = [
      ['#e8d9bf', '#c9a36b', '#8a5a36', '#4a3526', '#2b1d14'], // terracotta earth
      ['#dfe3d8', '#a8b29a', '#6f7d5e', '#414b33', '#23291b'], // sage
      ['#e7dcc8', '#cbb08a', '#9a7e5a', '#5c4836', '#322419'], // ochre
      ['#dde2e6', '#9fb0b8', '#5f7882', '#36464e', '#1d262b'], // slate blue
      ['#efe4d4', '#d7a98a', '#b06a4e', '#6e3a2c', '#3a1d16'], // clay rose
    ];
    const pal = pick(palettes);
    const style = Math.floor(rnd() * 3);

    if (style === 0) {
      // Abstract landscape — sky, sun, layered hills
      const sky = ctx.createLinearGradient(0, 0, 0, Hc * 0.65);
      sky.addColorStop(0, pal[0]);
      sky.addColorStop(1, pal[1]);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, Wc, Hc);

      // sun glow
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

      // layered hills
      const layers = 4;
      for (let l = 0; l < layers; l++) {
        const baseY = Hc * (0.5 + l * 0.12);
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        const steps = 6;
        for (let i = 0; i <= steps; i++) {
          const x = (Wc / steps) * i;
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
      // Rothko-style soft color field
      ctx.fillStyle = pal[1];
      ctx.fillRect(0, 0, Wc, Hc);
      const blocks = 2 + Math.floor(rnd() * 2);
      let yCursor = Hc * 0.08;
      for (let b = 0; b < blocks; b++) {
        const bh = (Hc * 0.82) / blocks;
        const col = pal[2 + (b % 3)];
        const pad = Wc * (0.08 + rnd() * 0.04);
        // feathered rectangle via multiple translucent passes
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
      // Abstract brushstrokes
      ctx.fillStyle = pal[0];
      ctx.fillRect(0, 0, Wc, Hc);
      const strokes = 22 + Math.floor(rnd() * 14);
      for (let i = 0; i < strokes; i++) {
        ctx.save();
        const cx = rnd() * Wc;
        const cy = rnd() * Hc;
        ctx.translate(cx, cy);
        ctx.rotate((rnd() - 0.5) * 1.4);
        ctx.globalAlpha = 0.25 + rnd() * 0.4;
        ctx.fillStyle = pick(pal);
        const sw = 40 + rnd() * 160;
        const sh = 12 + rnd() * 34;
        ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    // canvas weave grain overlay for realism
    const grain = ctx.getImageData(0, 0, Wc, Hc);
    const d = grain.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    ctx.putImageData(grain, 0, 0);

    // subtle vignette
    const vig = ctx.createRadialGradient(Wc / 2, Hc / 2, Hc * 0.3, Wc / 2, Hc / 2, Hc * 0.75);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, Wc, Hc);

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }

  // Build a real-looking framed painting (dark frame + cream mat + canvas art).
  // Local space: painting faces +Z. Position/rotate the returned group.
  function addFramedArt(parent, sm, artTex, { x, y, z, w, h, ry = 0 }) {
    const g = new THREE.Group();
    const fw = Math.min(w, h) * 0.06; // frame bar width
    const matPad = Math.min(w, h) * 0.1; // mat border

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 0.45, metalness: 0.25 });

    // Frame bars
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

    // Mat board (cream)
    const mat = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshStandardMaterial({ color: 0xf2ece0, roughness: 0.9 })
    );
    mat.position.set(0, 0, 0.032);
    g.add(mat);

    // Painting canvas (unlit so colors stay vivid, like a spotlit artwork)
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

  // --- Real GLTF models (auto-fitted to room scale) ---
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

  // Load a model, auto-scale it to a target footprint, sit it on the floor,
  // and drop it into the room group at (x,z). Falls back silently on error.
  function placeModel(group, { url, x = 0, z = 0, ry = 0, w = 2, h = null }) {
    loadGLTF(url)
      .then((gltf) => {
        const obj = gltf.scene.clone(true);
        obj.rotation.y = ry;
        obj.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(obj);
        const size = new THREE.Vector3();
        box.getSize(size);
        // fit by height for tall objects, else by floor footprint
        const scale = h ? h / (size.y || 1) : w / (Math.max(size.x, size.z) || 1);
        obj.scale.setScalar(scale);
        obj.updateMatrixWorld(true);

        const box2 = new THREE.Box3().setFromObject(obj);
        const center = new THREE.Vector3();
        box2.getCenter(center);
        obj.position.x += x - center.x;
        obj.position.z += z - center.z;
        obj.position.y += -box2.min.y; // sit on the floor

        obj.traverse((o) => {
          if (o.isMesh) {
            o.userData.isModel = true; // don't dispose shared geo on rebuild
            if (o.material) o.material.envMapIntensity = 1.1;
          }
        });
        obj.userData.isModel = true;
        group.add(obj);
      })
      .catch(() => { /* model missing → procedural staging already present */ });
  }

  // --- Procedural surface textures (wood, marble, plaster) for realism ---
  const surfTextures = useRef(new Map());

  function hexRGB(hex) {
    return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
  }
  function shade([r, g, b], f) {
    const m = (v) => Math.max(0, Math.min(255, Math.round(v)));
    return `rgb(${m(r * f)},${m(g * f)},${m(b * f)})`;
  }

  function getSurfTexture(kind, color, repeatX, repeatY) {
    const key = `${kind}-${color}`;
    const cache = surfTextures.current;
    let tex = cache.get(key);
    if (!tex) {
      const cv = document.createElement('canvas');
      cv.width = 512; cv.height = 512;
      const ctx = cv.getContext('2d');
      const rgb = hexRGB(color);
      if (kind === 'wood') paintWood(ctx, rgb);
      else if (kind === 'marble') paintMarble(ctx, rgb);
      else paintPlaster(ctx, rgb);
      tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 8;
      tex.repeat.set(repeatX, repeatY);
      cache.set(key, tex);
    }
    return tex;
  }

  // Wide oak planks — subtle tonal variance, soft grain, hairline dark seams.
  // Calm and expensive-looking; no noisy speckle.
  function paintWood(ctx, rgb) {
    const planks = 4;
    const pw = 512 / planks;
    // base
    ctx.fillStyle = shade(rgb, 0.98);
    ctx.fillRect(0, 0, 512, 512);
    for (let p = 0; p < planks; p++) {
      const f = 0.9 + Math.random() * 0.18;
      // soft tonal band per plank
      const grad = ctx.createLinearGradient(p * pw, 0, (p + 1) * pw, 0);
      grad.addColorStop(0, shade(rgb, f * 0.96));
      grad.addColorStop(0.5, shade(rgb, f * 1.04));
      grad.addColorStop(1, shade(rgb, f * 0.94));
      ctx.fillStyle = grad;
      ctx.fillRect(p * pw, 0, pw, 512);
      // long grain — very faint, mostly parallel
      for (let g = 0; g < 7; g++) {
        ctx.strokeStyle = shade(rgb, f * (0.84 + Math.random() * 0.14));
        ctx.globalAlpha = 0.18;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        const x = p * pw + 8 + Math.random() * (pw - 16);
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(
          x + (Math.random() - 0.5) * 4, 170,
          x + (Math.random() - 0.5) * 4, 340,
          x + (Math.random() - 0.5) * 3, 512
        );
        ctx.stroke();
      }
      // occasional darker grain accent
      if (Math.random() < 0.6) {
        ctx.strokeStyle = shade(rgb, 0.55);
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        const x = p * pw + 6 + Math.random() * (pw - 12);
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + 3, 200, x - 3, 350, x + 1, 512);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // hairline plank seam
      ctx.fillStyle = shade(rgb, 0.42);
      ctx.fillRect(p * pw, 0, 1, 512);
    }
    // staggered end-seam halfway down each plank
    ctx.fillStyle = shade(rgb, 0.42);
    for (let p = 0; p < planks; p++) {
      const y = (p * 137) % 512;
      ctx.fillRect(p * pw, y, pw, 1);
    }
  }

  // Honed marble — soft cloud mottling and one or two confident veins.
  function paintMarble(ctx, rgb) {
    ctx.fillStyle = shade(rgb, 1.02);
    ctx.fillRect(0, 0, 512, 512);
    // large soft cloud
    for (let i = 0; i < 14; i++) {
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = shade(rgb, 0.92 + Math.random() * 0.14);
      const r = 90 + Math.random() * 180;
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // a few confident veins — smooth, not jagged
    const veins = 3;
    for (let v = 0; v < veins; v++) {
      ctx.strokeStyle = shade(rgb, v === 0 ? 0.55 : 0.78);
      ctx.globalAlpha = v === 0 ? 0.45 : 0.28;
      ctx.lineWidth = v === 0 ? 1.2 : 0.7;
      ctx.beginPath();
      let x = Math.random() * 512, y = -10;
      ctx.moveTo(x, y);
      // smooth cubic-bezier vein
      const segs = 5;
      for (let s = 0; s < segs; s++) {
        const dx1 = (Math.random() - 0.5) * 80;
        const dx2 = (Math.random() - 0.5) * 80;
        const nx = x + (Math.random() - 0.5) * 120;
        const ny = y + 100 + Math.random() * 30;
        ctx.bezierCurveTo(x + dx1, y + 50, x + nx + dx2 - x, ny - 50, nx, ny);
        x = nx; y = ny;
      }
      ctx.stroke();
      // hairline counter-vein
      ctx.strokeStyle = shade(rgb, 1.15);
      ctx.globalAlpha = 0.22;
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // Honed plaster — very faint mottling, no speckle.
  function paintPlaster(ctx, rgb) {
    ctx.fillStyle = shade(rgb, 1.0);
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 26; i++) {
      ctx.globalAlpha = 0.025;
      ctx.fillStyle = shade(rgb, 0.92 + Math.random() * 0.16);
      const r = 60 + Math.random() * 140;
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // extremely subtle grain (much less than before)
    const img = ctx.getImageData(0, 0, 512, 512);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 3;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    ctx.putImageData(img, 0, 0);
  }

  // Shared materials — created once
  const sharedMats = useRef(null);
  function getSharedMats() {
    if (!sharedMats.current) {
      sharedMats.current = {
        ceiling: new THREE.MeshStandardMaterial({ color: 0xf2ece0, roughness: 0.7 }),
        glow: new THREE.MeshBasicMaterial({ color: 0xfffaee, transparent: true, opacity: 0.8 }),
        glowDim: new THREE.MeshBasicMaterial({ color: 0xfff8e8, transparent: true, opacity: 0.4 }),
        fixtureGlow: new THREE.MeshBasicMaterial({ color: 0xfffaee }),
        darkWood: new THREE.MeshStandardMaterial({ color: 0xffffff, map: getSurfTexture('wood', 0x4a3828, 1.5, 1.5), roughness: 0.4, metalness: 0.02 }),
        marble: new THREE.MeshStandardMaterial({ color: 0xffffff, map: getSurfTexture('marble', 0xe8ddd0, 1, 1), roughness: 0.18, metalness: 0.08, envMapIntensity: 1.2 }),
        metal: new THREE.MeshStandardMaterial({ color: 0xa09080, roughness: 0.25, metalness: 0.75 }),
        metalDark: new THREE.MeshStandardMaterial({ color: 0x605040, roughness: 0.3, metalness: 0.8 }),
        fabric: new THREE.MeshStandardMaterial({ color: 0xffffff, map: getSurfTexture('plaster', 0xe0d5c4, 2, 2), roughness: 0.9 }),
        fabricDark: new THREE.MeshStandardMaterial({ color: 0xffffff, map: getSurfTexture('plaster', 0xb5a490, 2, 2), roughness: 0.85 }),
        glass: new THREE.MeshStandardMaterial({ color: 0xd0d8d5, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.6 }),
        ledge: new THREE.MeshStandardMaterial({ color: 0xd4caba, roughness: 0.5, metalness: 0.03 }),
        rugMat: new THREE.MeshStandardMaterial({ color: 0xc8baa0, roughness: 0.9, transparent: true, opacity: 0.45 }),
        pebble: new THREE.MeshStandardMaterial({ color: 0xbdb2a0, roughness: 0.92, metalness: 0.02 }),
        foliage: new THREE.MeshStandardMaterial({ color: 0x4a5a3a, roughness: 0.85 }),
        shadowMat: new THREE.MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0.06 }),
      };
    }
    return sharedMats.current;
  }

  function rebuildRooms(s) {
    while (s.roomsGroup.children.length) {
      const child = s.roomsGroup.children[0];
      child.traverse((obj) => {
        // model geometry is shared with the cached GLTF — don't dispose it
        if (obj.geometry && !obj.userData.isModel) obj.geometry.dispose();
      });
      s.roomsGroup.remove(child);
    }
    const floor = FLOORS[s.currentFloor];
    floor.rooms.forEach((roomDef, i) => {
      const room = buildRoom(roomDef, i, s.currentFloor);
      room.position.x = i * ROOM_SPACING;
      s.roomsGroup.add(room);
    });
  }

  // A shared pass of premium filler decor so no bay reads as empty — a
  // cluster of stone poufs on a rug (echoing the ICG ground floor), a potted
  // plant, a sculptural plinth, and a slim floor lamp. Seeded per room so
  // each bay varies. Placed in the foreground/corners to avoid the primary
  // staging furniture.
  function addCommonDecor(group, sm, matAccent, W, H, D, seed) {
    let st = (seed * 2654435761 + 12345) >>> 0;
    const rnd = () => { st = (st * 1664525 + 1013904223) >>> 0; return st / 4294967296; };
    const side = rnd() < 0.5 ? -1 : 1;

    // Stone poufs cluster on a rug (camera-side, fills the empty foreground)
    const poufGeo = new THREE.SphereGeometry(0.42, 18, 12);
    const cx = side * (1.8 + rnd() * 0.7);
    const cz = 1.8 + (rnd() - 0.5) * 0.8;
    for (let i = 0; i < 4; i++) {
      const s = (0.34 + rnd() * 0.18) / 0.42;
      const p = new THREE.Mesh(poufGeo, sm.pebble);
      p.scale.set(s, s * 0.6, s);
      p.position.set(cx + (rnd() - 0.5) * 1.9, s * 0.42 * 0.6, cz + (rnd() - 0.5) * 1.6);
      p.castShadow = true; p.receiveShadow = true;
      group.add(p);
    }
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.7), sm.rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(cx, 0.006, cz);
    group.add(rug);

    // Potted plant in a corner
    const px = -side * (W / 2 - 1.1);
    const planter = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.2, 0.6, 20), sm.marble);
    planter.position.set(px, 0.3, -1.0);
    planter.castShadow = true;
    group.add(planter);
    for (let l = 0; l < 7; l++) {
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.9 + rnd() * 0.6, 5), sm.foliage);
      blade.position.set(px + (rnd() - 0.5) * 0.34, 0.85 + rnd() * 0.28, -1.0 + (rnd() - 0.5) * 0.34);
      blade.rotation.z = (rnd() - 0.5) * 0.55;
      group.add(blade);
    }

    // Sculptural plinth with a brass form
    const plx = side * (W / 2 - 1.4);
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.0, 0.5), sm.marble);
    plinth.position.set(plx, 0.5, -2.4);
    plinth.castShadow = true;
    group.add(plinth);
    const sculp = new THREE.Mesh(new THREE.TorusKnotGeometry(0.16, 0.055, 48, 8), matAccent);
    sculp.position.set(plx, 1.2, -2.4);
    sculp.castShadow = true;
    group.add(sculp);

    // Slim floor lamp (emissive shade)
    const lx = -side * (2.6 + rnd());
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 1.7, 6), sm.metal);
    pole.position.set(lx, 0.85, 2.8);
    group.add(pole);
    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.2, 0.3, 16),
      new THREE.MeshBasicMaterial({ color: 0xfff5e0, transparent: true, opacity: 0.55 })
    );
    shade.position.set(lx, 1.8, 2.8);
    group.add(shade);
  }

  function buildRoom(def, roomIndex, floorIndex) {
    const group = new THREE.Group();
    const sm = getSharedMats();
    const W = 12, H = 4.5, D = 10;
    const lastIndex = FLOORS[floorIndex].rooms.length - 1;

    // Floor surface: marble for kitchen/bath/underground, wood elsewhere
    const type = roomIndex % 4;
    const marbleFloor = floorIndex === 0 || type === 1 || type === 3;
    const matWall = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: getSurfTexture('plaster', def.wallColor, 3, 1.4),
      roughness: 0.85,
    });
    const matFloor = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: getSurfTexture(marbleFloor ? 'marble' : 'wood', def.floorColor, marbleFloor ? 1.5 : 2, marbleFloor ? 1.5 : 3),
      roughness: marbleFloor ? 0.08 : 0.36,
      metalness: marbleFloor ? 0.15 : 0.02,
      envMapIntensity: marbleFloor ? 1.5 : 0.6,
    });
    const matPanel = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: getSurfTexture('wood', def.panelColor, 1, 2),
      roughness: 0.5,
      metalness: 0.02,
    });
    const matAccent = new THREE.MeshStandardMaterial({ color: def.accent, roughness: 0.35, metalness: 0.1 });

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    // Ceiling
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), sm.ceiling);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = H;
    group.add(ceil);

    // Ceiling cove light strips (emissive mesh, no actual light)
    const cove = new THREE.Mesh(new THREE.BoxGeometry(W * 0.65, 0.04, 0.25), sm.glow);
    cove.position.set(0, H - 0.02, -2);
    group.add(cove);
    for (const side of [-1, 1]) {
      const sc = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.04, D * 0.45), sm.glowDim);
      sc.position.set(side * W * 0.35, H - 0.02, 0);
      group.add(sc);
    }

    // Recessed fixture dots on ceiling (just visual, no actual lights)
    const fixPositions = [[-2.5, -1.5], [0, -2], [2.5, -1.5], [-1.5, 1.5], [1.5, 1.5]];
    fixPositions.forEach(([fx, fz]) => {
      const fix = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.03, 10), sm.fixtureGlow);
      fix.position.set(fx, H - 0.015, fz);
      group.add(fix);
    });

    // Walls
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), matWall);
    backWall.position.set(0, H / 2, -D / 2);
    backWall.receiveShadow = true;
    group.add(backWall);

    // Only the outermost bays get end walls — interior bays stay open so the
    // floor reads as one continuous enfilade you glide through.
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

    // Even vertical wood slats on back wall — calm, refined feature wall
    {
      const slatCount = 18;
      const slatGap = 0.035;
      const slatW = (W - slatGap * (slatCount + 1)) / slatCount;
      const slatH = H - 0.5;
      for (let i = 0; i < slatCount; i++) {
        const sx = -W / 2 + slatGap + slatW / 2 + i * (slatW + slatGap);
        const slat = new THREE.Mesh(new THREE.BoxGeometry(slatW, slatH, 0.04), matPanel);
        slat.position.set(sx, H / 2, -D / 2 + 0.025);
        group.add(slat);
      }
    }

    // Base molding + cornice (architectural baseboard / crown)
    const baseRail = new THREE.Mesh(new THREE.BoxGeometry(W, 0.12, 0.04), sm.darkWood);
    baseRail.position.set(0, 0.06, -D / 2 + 0.05);
    group.add(baseRail);
    const crown = new THREE.Mesh(new THREE.BoxGeometry(W, 0.1, 0.06), matPanel);
    crown.position.set(0, H - 0.05, -D / 2 + 0.04);
    group.add(crown);
    for (const side of [-1, 1]) {
      // Only the outermost bays keep side moldings — interior boundaries stay
      // seamless so the floor reads as one continuous home, not walled rooms.
      const isOuter = (side === -1 && roomIndex === 0) || (side === 1 && roomIndex === lastIndex);
      if (!isOuter) continue;
      const sideBase = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, D - 0.2), sm.darkWood);
      sideBase.position.set(side * (W / 2 - 0.02), 0.06, 0);
      group.add(sideBase);
      const sideCrown = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, D - 0.2), matPanel);
      sideCrown.position.set(side * (W / 2 - 0.03), H - 0.05, 0);
      group.add(sideCrown);
    }

    // Recessed niche backing (slightly inset, warm)
    const nicheW = 3.4, nicheH = 2.6;
    const nicheBack = new THREE.Mesh(
      new THREE.PlaneGeometry(nicheW, nicheH),
      new THREE.MeshStandardMaterial({ color: def.wallColor, roughness: 0.75 })
    );
    nicheBack.position.set(0, 2.1, -D / 2 + 0.006);
    group.add(nicheBack);

    // Polished marble pilasters flanking the niche (full height)
    for (const side of [-1, 1]) {
      const pilar = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, H - 0.3, 0.07),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: getSurfTexture('marble', def.floorColor, 0.5, 1.5),
          roughness: 0.12,
          metalness: 0.1,
          envMapIntensity: 1.3,
        })
      );
      pilar.position.set(side * (nicheW / 2 + 0.55), H / 2 - 0.05, -D / 2 + 0.08);
      group.add(pilar);
    }

    // Hero framed painting in the niche
    const heroTex = getArtTexture(`${floorIndex}-${roomIndex}-hero`, floorIndex * 17 + roomIndex * 3 + 1);
    addFramedArt(group, sm, heroTex, { x: 0, y: 2.1, z: -D / 2 + 0.05, w: 1.7, h: 2.2 });

    // Picture light above the painting (emissive bar, no real light)
    const picLight = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.04, 0.12),
      new THREE.MeshBasicMaterial({ color: 0xfff3da, transparent: true, opacity: 0.85 })
    );
    picLight.position.set(0, 3.5, -D / 2 + 0.18);
    group.add(picLight);

    // Console ledge below the painting
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.3), sm.marble);
    ledge.position.set(0, 0.9, -D / 2 + 0.2);
    group.add(ledge);
    for (const lx of [-0.85, 0.85]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.25), sm.metalDark);
      leg.position.set(lx, 0.45, -D / 2 + 0.2);
      group.add(leg);
    }

    // Smaller framed artworks on side walls (face inward)
    if (roomIndex === 0) {
      const leftTex = getArtTexture(`${floorIndex}-${roomIndex}-L`, floorIndex * 23 + roomIndex * 5 + 11);
      addFramedArt(group, sm, leftTex, { x: -W / 2 + 0.06, y: 2.2, z: 1.5, w: 1.2, h: 1.5, ry: Math.PI / 2 });
    }
    if (roomIndex === lastIndex) {
      const rightTex = getArtTexture(`${floorIndex}-${roomIndex}-R`, floorIndex * 31 + roomIndex * 7 + 19);
      addFramedArt(group, sm, rightTex, { x: W / 2 - 0.06, y: 2.2, z: -2.5, w: 1.2, h: 1.5, ry: -Math.PI / 2 });
    }

    // Room contents: real GLTF models when defined, else procedural staging
    if (def.models && def.models.length) {
      // soft rug to ground the real furniture
      const rug = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 3.2), sm.rugMat);
      rug.rotation.x = -Math.PI / 2;
      rug.position.set(0, 0.004, -0.2);
      group.add(rug);
      def.models.forEach((m) => placeModel(group, m));
    } else if (floorIndex === 0) {
      addUndergroundFurniture(group, roomIndex, sm, matPanel, matAccent, W, H, D);
    } else {
      // Name-based dispatch so each room gets the right staging
      const n = (def.name || '').toLowerCase();
      if (n.includes('kitchen')) addKitchenFurniture(group, sm, matPanel, matAccent, W, H, D);
      else if (n.includes('dining')) addDiningFurniture(group, sm, matPanel, matAccent, W, H, D);
      else if (n.includes('bed') || n.includes('suite') || n.includes('master')) addBedroomFurniture(group, sm, matPanel, matAccent, W, H, D);
      else if (n.includes('bath')) addBathFurniture(group, sm, matAccent, W, H, D);
      else if (n.includes('study')) addStudyFurniture(group, sm, matPanel, matAccent, W, H, D);
      else if (n.includes('gallery') || n.includes('terrace') || n.includes('pop')) addGalleryFurniture(group, sm, matAccent, W, H, D);
      else addHallFurniture(group, sm, matAccent, W, H, D);
    }

    // Every bay gets the shared premium decor so none reads as empty.
    addCommonDecor(group, sm, matAccent, W, H, D, floorIndex * 10 + roomIndex);

    return group;
  }

  function addHallFurniture(group, sm, matAccent, W, H, D) {
    // L-shaped sofa
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 1.1), sm.fabric);
    sofa.position.set(-2, 0.225, -1);
    sofa.castShadow = true;
    group.add(sofa);
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 0.14), sm.fabric);
    sofaBack.position.set(-2, 0.7, -1.48);
    group.add(sofaBack);
    for (const sx of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 1.1), sm.fabric);
      arm.position.set(-2 + sx * 1.54, 0.59, -1);
      group.add(arm);
    }
    // Cushions
    for (let ci = 0; ci < 3; ci++) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.8), sm.fabricDark);
      c.position.set(-3.05 + ci * 1.05, 0.5, -0.9);
      group.add(c);
    }

    // Coffee table
    const tt = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.03, 28), sm.marble);
    tt.position.set(-0.8, 0.44, 0.8);
    tt.castShadow = true;
    group.add(tt);
    const ts = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.42, 8), sm.metal);
    ts.position.set(-0.8, 0.22, 0.8);
    group.add(ts);
    const tb = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.02, 20), sm.metalDark);
    tb.position.set(-0.8, 0.01, 0.8);
    group.add(tb);

    // Side table
    const st = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.5), sm.darkWood);
    st.position.set(-3.8, 0.55, -1);
    group.add(st);
    const sl = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.54, 6), sm.metal);
    sl.position.set(-3.8, 0.27, -1);
    group.add(sl);

    // Pouf
    const pouf = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), sm.fabricDark);
    pouf.position.set(2.2, 0, 0.5);
    pouf.castShadow = true;
    group.add(pouf);

    // Chair
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.32, 0.65), sm.fabric);
    chair.position.set(2.8, 0.2, -2);
    chair.rotation.y = -0.3;
    chair.castShadow = true;
    group.add(chair);
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.08), sm.fabric);
    chairBack.position.set(2.7, 0.58, -2.28);
    chairBack.rotation.y = -0.3;
    group.add(chairBack);

    // Tall lamp (emissive shade, no light)
    const lp = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 1.8, 6), sm.metal);
    lp.position.set(3.8, 0.9, -3);
    group.add(lp);
    const ls = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.3, 14),
      new THREE.MeshBasicMaterial({ color: 0xfff8e6, transparent: true, opacity: 0.5 }));
    ls.position.set(3.8, 1.95, -3);
    group.add(ls);

    // Vases on niche ledge
    const v1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.28, 10), matAccent);
    v1.position.set(-0.4, 0.9 + 0.14, -D / 2 + 0.1);
    group.add(v1);
    const v2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.2, 10), sm.marble);
    v2.position.set(0.4, 0.9 + 0.1, -D / 2 + 0.1);
    group.add(v2);

    // Rug
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.5), sm.rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(-1.5, 0.004, 0);
    group.add(rug);
  }

  function addKitchenFurniture(group, sm, matPanel, matAccent, W, H, D) {
    // Island
    const island = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.95, 1.1), sm.marble);
    island.position.set(0, 0.475, 0);
    island.castShadow = true;
    group.add(island);
    const islandPanel = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.88, 0.03), sm.darkWood);
    islandPanel.position.set(0, 0.44, 0.54);
    group.add(islandPanel);

    // Stools
    for (let si = 0; si < 3; si++) {
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 14), matPanel);
      seat.position.set(-1.1 + si * 1.1, 0.72, 1.0);
      seat.castShadow = true;
      group.add(seat);
      for (const lx of [-0.08, 0.08]) {
        for (const lz of [-0.05, 0.05]) {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.7, 5), sm.metal);
          leg.position.set(-1.1 + si * 1.1 + lx, 0.35, 1.0 + lz);
          group.add(leg);
        }
      }
    }

    // Back wall cabinets
    for (let ci = 0; ci < 3; ci++) {
      const cab = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 0.35), sm.darkWood);
      cab.position.set(-2.5 + ci * 2.5, 2.6, -D / 2 + 0.2);
      group.add(cab);
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.015, 0.015), sm.metal);
      handle.position.set(-2.5 + ci * 2.5, 2.25, -D / 2 + 0.38);
      group.add(handle);
    }

    // Counter
    const counter = new THREE.Mesh(new THREE.BoxGeometry(W * 0.85, 0.04, 0.6), sm.marble);
    counter.position.set(0, 0.92, -D / 2 + 0.32);
    group.add(counter);
    const counterBase = new THREE.Mesh(new THREE.BoxGeometry(W * 0.85, 0.88, 0.55), sm.darkWood);
    counterBase.position.set(0, 0.44, -D / 2 + 0.3);
    group.add(counterBase);

    // Right wall shelves
    for (let sh = 0; sh < 3; sh++) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.025, 1.8), matPanel);
      shelf.position.set(W / 2 - 0.03, 1.4 + sh * 0.6, -1);
      group.add(shelf);
    }

    // Pendant lights (emissive spheres, no actual lights)
    for (let pl = 0; pl < 2; pl++) {
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1.1, 4), sm.metal);
      cord.position.set(-0.6 + pl * 1.2, H - 0.55, 0);
      group.add(cord);
      const pendant = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), matAccent);
      pendant.position.set(-0.6 + pl * 1.2, H - 1.2, 0);
      group.add(pendant);
    }
  }

  function addBedroomFurniture(group, sm, matPanel, matAccent, W, H, D) {
    const bedW = 2.5, bedD = 3.0;
    const bed = new THREE.Mesh(new THREE.BoxGeometry(bedW, 0.32, bedD), sm.fabric);
    bed.position.set(0, 0.16, -D / 2 + bedD / 2 + 0.3);
    bed.castShadow = true;
    group.add(bed);

    const mattress = new THREE.Mesh(new THREE.BoxGeometry(bedW - 0.04, 0.18, bedD - 0.08), sm.fabric);
    mattress.position.set(0, 0.41, -D / 2 + bedD / 2 + 0.3);
    group.add(mattress);

    for (const px of [-0.45, 0.45]) {
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.3), sm.fabricDark);
      pillow.position.set(px, 0.55, -D / 2 + 0.65);
      group.add(pillow);
    }

    const headboard = new THREE.Mesh(new THREE.BoxGeometry(bedW + 0.35, 1.5, 0.08), sm.fabricDark);
    headboard.position.set(0, 1.07, -D / 2 + 0.18);
    group.add(headboard);

    // Nightstands + lamps (emissive shades)
    for (const nx of [-1, 1]) {
      const ns = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.48, 0.38), sm.darkWood);
      ns.position.set(nx * (bedW / 2 + 0.48), 0.24, -D / 2 + 0.45);
      ns.castShadow = true;
      group.add(ns);

      const lb = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.03, 8), sm.metal);
      lb.position.set(nx * (bedW / 2 + 0.48), 0.5, -D / 2 + 0.45);
      group.add(lb);
      const lBody = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.25, 7), matAccent);
      lBody.position.set(nx * (bedW / 2 + 0.48), 0.65, -D / 2 + 0.45);
      group.add(lBody);
      const lShade = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.18, 12),
        new THREE.MeshBasicMaterial({ color: 0xfff5e0, transparent: true, opacity: 0.45 }));
      lShade.position.set(nx * (bedW / 2 + 0.48), 0.88, -D / 2 + 0.45);
      group.add(lShade);
    }

    // Bench
    const bench = new THREE.Mesh(new THREE.BoxGeometry(bedW - 0.3, 0.32, 0.45), sm.fabricDark);
    bench.position.set(0, 0.16, -D / 2 + bedD + 0.55);
    bench.castShadow = true;
    group.add(bench);

    // Dresser
    const dresser = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.95, 1.7), sm.darkWood);
    dresser.position.set(W / 2 - 0.25, 0.475, 0);
    group.add(dresser);

    // Rug
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(bedW + 1, bedD + 0.8), sm.rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.004, -D / 2 + bedD / 2 + 0.5);
    group.add(rug);
  }

  function addBathFurniture(group, sm, matAccent, W, H, D) {
    // Freestanding tub
    const tubOuter = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.55, 0.85), sm.marble);
    tubOuter.position.set(-2, 0.275, -1.5);
    tubOuter.castShadow = true;
    group.add(tubOuter);
    const tubInner = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.42, 0.6),
      new THREE.MeshStandardMaterial({ color: 0xddd5c8, roughness: 0.15, metalness: 0.08 }));
    tubInner.position.set(-2, 0.36, -1.5);
    group.add(tubInner);

    // Faucet
    const faucetPole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.65, 5), sm.metal);
    faucetPole.position.set(-1.05, 0.6, -1.5);
    group.add(faucetPole);
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.22, 5), sm.metal);
    spout.rotation.z = Math.PI / 2;
    spout.position.set(-1.16, 0.9, -1.5);
    group.add(spout);

    // Vanity
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.82, 0.55), sm.darkWood);
    vanity.position.set(2.2, 0.41, -D / 2 + 0.3);
    vanity.castShadow = true;
    group.add(vanity);
    const vanityTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.035, 0.6), sm.marble);
    vanityTop.position.set(2.2, 0.84, -D / 2 + 0.32);
    group.add(vanityTop);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.13, 0.08, 14), sm.marble);
    basin.position.set(2.2, 0.88, -D / 2 + 0.32);
    group.add(basin);

    // Mirror
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x8a7a60, roughness: 0.3, metalness: 0.5 }));
    mirrorFrame.position.set(2.2, 1.95, -D / 2 + 0.01);
    group.add(mirrorFrame);
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 0.02), sm.glass);
    mirror.position.set(2.2, 1.95, -D / 2 + 0.02);
    group.add(mirror);

    // Towel rack + towel
    const rack = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.7, 5), sm.metal);
    rack.rotation.z = Math.PI / 2;
    rack.position.set(-W / 2 + 0.45, 1.15, 2);
    group.add(rack);
    const towel = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.03), sm.fabric);
    towel.position.set(-W / 2 + 0.45, 0.95, 2);
    group.add(towel);

    // Stool
    const stoolTop = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 14), sm.darkWood);
    stoolTop.position.set(0, 0.44, 1);
    group.add(stoolTop);
    const stoolLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, 0.42, 5), sm.metal);
    stoolLeg.position.set(0, 0.22, 1);
    group.add(stoolLeg);
  }

  // Dining: long marble table, six upholstered chairs, brass chandelier
  function addDiningFurniture(group, sm, matPanel, matAccent, W, H, D) {
    const tableL = 3.8, tableW = 1.1;
    // Table top (marble slab)
    const top = new THREE.Mesh(new THREE.BoxGeometry(tableL, 0.06, tableW), sm.marble);
    top.position.set(0, 0.76, 0);
    top.castShadow = true;
    group.add(top);
    // Base — two pedestal slabs
    for (const bx of [-1.2, 1.2]) {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 0.8), sm.darkWood);
      base.position.set(bx, 0.38, 0);
      group.add(base);
    }
    // Chairs — 3 per side
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const cx = -1.4 + i * 1.4;
        const cz = side * (tableW / 2 + 0.42);
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), sm.fabric);
        seat.position.set(cx, 0.48, cz);
        group.add(seat);
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.78, 0.07), sm.fabric);
        back.position.set(cx, 0.85, cz + side * 0.22);
        group.add(back);
        for (const lx of [-0.22, 0.22]) {
          for (const lz of [-0.22, 0.22]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.46, 6), sm.metal);
            leg.position.set(cx + lx, 0.23, cz + lz);
            group.add(leg);
          }
        }
      }
    }
    // Chandelier — brass arms with frosted spheres
    const chandRod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6), sm.metal);
    chandRod.position.set(0, H - 0.25, 0);
    group.add(chandRod);
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), matAccent);
    hub.position.set(0, H - 0.55, 0);
    group.add(hub);
    const armCount = 5;
    for (let i = 0; i < armCount; i++) {
      const a = (i / armCount) * Math.PI * 2;
      const ax = Math.cos(a) * 0.5;
      const az = Math.sin(a) * 0.5;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.6, 6), matAccent);
      arm.position.set(ax * 0.5, H - 0.55 - 0.05, az * 0.5);
      arm.rotation.x = Math.PI / 2;
      arm.lookAt(ax, H - 0.85, az);
      group.add(arm);
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 14, 10),
        new THREE.MeshBasicMaterial({ color: 0xfff5dd, transparent: true, opacity: 0.9 })
      );
      bulb.position.set(ax, H - 0.85, az);
      group.add(bulb);
    }
    // Sideboard against right wall
    const sb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.85, 2.6), sm.darkWood);
    sb.position.set(W / 2 - 0.3, 0.425, -0.4);
    group.add(sb);
    const sbTop = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 2.7), sm.marble);
    sbTop.position.set(W / 2 - 0.3, 0.87, -0.4);
    group.add(sbTop);
    // Rug
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(tableL + 1.4, tableW + 1.4), sm.rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.004, 0);
    group.add(rug);
  }

  // Study: walnut desk, leather chair, tall bookshelf, sculptural lamp
  function addStudyFurniture(group, sm, matPanel, matAccent, W, H, D) {
    // Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.05, 0.9), sm.darkWood);
    desk.position.set(-0.5, 0.78, -0.5);
    group.add(desk);
    for (const dx of [-1.0, 1.0]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.76, 0.7), sm.darkWood);
      leg.position.set(-0.5 + dx, 0.38, -0.5);
      group.add(leg);
    }
    // Drawer block
    const drawers = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.5), sm.darkWood);
    drawers.position.set(0.2, 0.5, -0.5);
    group.add(drawers);
    // Chair
    const chSeat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.55), sm.fabricDark);
    chSeat.position.set(-0.5, 0.48, 0.4);
    group.add(chSeat);
    const chBack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.8, 0.08), sm.fabricDark);
    chBack.position.set(-0.5, 0.86, 0.65);
    group.add(chBack);
    const chPost = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8), sm.metalDark);
    chPost.position.set(-0.5, 0.24, 0.4);
    group.add(chPost);
    // Bookshelf — right wall
    for (let r = 0; r < 4; r++) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 2.6), sm.darkWood);
      shelf.position.set(W / 2 - 0.25, 0.7 + r * 0.7, -1);
      group.add(shelf);
      // books
      let bx = -1.2;
      while (bx < 1.2) {
        const bw = 0.06 + Math.random() * 0.04;
        const bh = 0.22 + Math.random() * 0.1;
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, bh, bw),
          new THREE.MeshStandardMaterial({
            color: [0x5a4030, 0x3a2a20, 0x806848, 0x4a3c30, 0xa8906a][Math.floor(Math.random() * 5)],
            roughness: 0.8,
          })
        );
        book.position.set(W / 2 - 0.25, 0.7 + r * 0.7 + bh / 2 + 0.02, -1 + bx + bw / 2);
        group.add(book);
        bx += bw + 0.005;
      }
    }
    const shelfSide = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.2, 0.05), sm.darkWood);
    shelfSide.position.set(W / 2 - 0.25, 1.7, -2.3);
    group.add(shelfSide);
    const shelfSide2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.2, 0.05), sm.darkWood);
    shelfSide2.position.set(W / 2 - 0.25, 1.7, 0.3);
    group.add(shelfSide2);
    // Sculptural lamp on desk
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.04, 14), sm.marble);
    lampBase.position.set(-1.3, 0.82, -0.5);
    group.add(lampBase);
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35, 6), matAccent);
    lampStem.position.set(-1.3, 1.02, -0.5);
    group.add(lampStem);
    const lampShade = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 14, 10),
      new THREE.MeshBasicMaterial({ color: 0xfff5dd, transparent: true, opacity: 0.85 })
    );
    lampShade.position.set(-1.3, 1.25, -0.5);
    group.add(lampShade);
    // Rug
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.6), sm.rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(-0.5, 0.004, 0);
    group.add(rug);
  }

  // Gallery / Terrace: minimal — long bench, sculpture plinth, big planter
  function addGalleryFurniture(group, sm, matAccent, W, H, D) {
    // Long bench
    const benchTop = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 0.55), sm.darkWood);
    benchTop.position.set(0, 0.44, 1.5);
    group.add(benchTop);
    for (const bx of [-1.3, 1.3]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.5), sm.metalDark);
      leg.position.set(bx, 0.2, 1.5);
      group.add(leg);
    }
    // Marble plinth with sculpture
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.1, 0.55), sm.marble);
    plinth.position.set(-2.6, 0.55, -0.5);
    group.add(plinth);
    const sculp = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.18, 0.06, 64, 8),
      matAccent
    );
    sculp.position.set(-2.6, 1.32, -0.5);
    sculp.rotation.x = 0.4;
    group.add(sculp);
    // Tall planter
    const planter = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.7, 18), sm.darkWood);
    planter.position.set(2.8, 0.35, 0.5);
    group.add(planter);
    // Plant stems (simple cones for foliage silhouette)
    for (let p = 0; p < 5; p++) {
      const stem = new THREE.Mesh(
        new THREE.ConeGeometry(0.18 - p * 0.02, 0.6 + p * 0.15, 6),
        new THREE.MeshStandardMaterial({ color: 0x4a5a3a, roughness: 0.85 })
      );
      stem.position.set(2.8 + (Math.random() - 0.5) * 0.2, 1.0 + p * 0.15, 0.5 + (Math.random() - 0.5) * 0.2);
      group.add(stem);
    }
    // Second small bench
    const stoolTop = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 16), sm.marble);
    stoolTop.position.set(0, 0.46, -2);
    group.add(stoolTop);
    const stoolBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.4, 12), sm.metalDark);
    stoolBase.position.set(0, 0.23, -2);
    group.add(stoolBase);
  }

  function addUndergroundFurniture(group, roomIndex, sm, matPanel, matAccent, W, H, D) {
    if (roomIndex === 0) {
      for (let r = 0; r < 3; r++) {
        const rack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 0.35), sm.darkWood);
        rack.position.set(-3 + r * 3, 1.2, -D / 2 + 0.2);
        group.add(rack);
        for (let bx = 0; bx < 4; bx++) {
          for (let by = 0; by < 6; by++) {
            const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.37, 6), sm.metal);
            hole.rotation.x = Math.PI / 2;
            hole.position.set(-3.42 + r * 3 + bx * 0.33, 0.28 + by * 0.36, -D / 2 + 0.22);
            group.add(hole);
          }
        }
      }
      const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.035, 0.9), sm.darkWood);
      table.position.set(0, 0.88, 1.5);
      table.castShadow = true;
      group.add(table);
    } else {
      for (let sh = 0; sh < 4; sh++) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(W * 0.75, 0.025, 0.45), sm.darkWood);
        shelf.position.set(0, 0.75 + sh * 0.75, -D / 2 + 0.25);
        group.add(shelf);
        for (let ti = 0; ti < 5; ti++) {
          const tile = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.45, 0.025),
            new THREE.MeshStandardMaterial({
              color: new THREE.Color().setHSL(0.08 + ti * 0.04, 0.2 + sh * 0.05, 0.5 + sh * 0.05),
              roughness: 0.3, metalness: 0.05,
            })
          );
          tile.position.set(-3 + ti * 1.5, 0.75 + sh * 0.75 + 0.26, -D / 2 + 0.27);
          group.add(tile);
        }
      }
    }
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
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Soft real shadows for grounded, photographed-looking renders.
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Keep the WebGL context resilient — dev HMR and GPU pressure can drop it.
    // Prevent the default (which makes the loss permanent) and re-render on restore.
    const onContextLost = (e) => { e.preventDefault(); };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xece3d2);

    // Image-based lighting so PBR materials reflect realistically.
    // Higher intensity = more pronounced reflections on marble/metal.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 1.12;

    const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 120);
    camera.position.set(0, 1.6, 7);

    // Quiet-luxury rig: low ambient, soft hemi sky-fill, warm key from upper-front,
    // cool side fill for shape, warm rim from behind for halo separation.
    const ambient = new THREE.AmbientLight(0xfff1dc, 0.18);
    scene.add(ambient);
    const hemi = new THREE.HemisphereLight(0xfff6e6, 0xb8a890, 0.55);
    scene.add(hemi);
    const dirKey = new THREE.DirectionalLight(0xfff0d4, 1.75);
    dirKey.position.set(4, 9, 5);
    dirKey.castShadow = true;
    dirKey.shadow.mapSize.set(2048, 2048);
    dirKey.shadow.camera.near = 1;
    dirKey.shadow.camera.far = 26;
    dirKey.shadow.camera.left = -9;
    dirKey.shadow.camera.right = 9;
    dirKey.shadow.camera.top = 9;
    dirKey.shadow.camera.bottom = -6;
    dirKey.shadow.bias = -0.0006;
    dirKey.shadow.normalBias = 0.02;
    dirKey.shadow.radius = 4;
    scene.add(dirKey);
    scene.add(dirKey.target);
    const dirRim = new THREE.DirectionalLight(0xffd9a8, 0.7);
    dirRim.position.set(-3, 5, -4);
    scene.add(dirRim);
    scene.add(dirRim.target);
    const dirFill = new THREE.DirectionalLight(0xe8edf2, 0.35);
    dirFill.position.set(-4, 4, 3);
    scene.add(dirFill);

    // Warm recessed ceiling spots that wash the back wall in soft light pools
    // — the signature ICG look. They follow the active room in the tick loop.
    const spotOffsets = [-3.6, -1.2, 1.2, 3.6];
    const spots = spotOffsets.map((ox) => {
      const sp = new THREE.SpotLight(0xfff1d8, 22, 13, Math.PI * 0.24, 0.7, 1.3);
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
      cameraX: 0,          // settled lateral position
      pointerX: 0,
      pointerY: 0,
      ptrTx: 0,
      ptrTy: 0,
      isDragging: false,
      dragStartX: 0,
      dragDelta: 0,
      roomsGroup,
      // transition state
      transit: null,       // { fromX, toX, lift, pull, dur, t, rebuildFloor }
    };
    internals.current = s;

    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    // Begin an eased lateral move to a room (rises over the dividing walls,
    // glides across, then settles — avoids clipping straight through walls).
    s.beginRoom = (index) => {
      if (index === s.currentRoom && !s.transit) return;
      const fromX = s.cameraX;
      const toX = index * ROOM_SPACING;
      const dist = Math.abs(index - s.currentRoom);
      s.currentRoom = index;
      // Continuous glide: only a whisper of lift/pull now that there are no
      // interior walls to rise over.
      s.transit = { fromX, toX, lift: 0.12, pull: 0.5 + dist * 0.25, dur: 0.9 + dist * 0.14, t: 0 };
      onRoomChange?.(index);
    };

    // Begin a floor change — big arc up, swap rooms at the apex, descend.
    s.beginFloor = (floorIndex) => {
      if (floorIndex === s.currentFloor && !s.transit) return;
      s.transit = { fromX: s.cameraX, toX: 0, lift: 6.5, pull: 5.5, dur: 1.5, t: 0, rebuildFloor: floorIndex };
    };

    rebuildRooms(s);
    onFloorChange?.(s.currentFloor);
    onRoomChange?.(0);

    // Events
    // Live drag-pan: while dragging, camera follows the cursor 1:1 in world units.
    // Release snaps to nearest room with an eased transition (like ICG).
    const WORLD_PER_PX = ROOM_SPACING / 360; // ~360px of drag = next room

    const onPointerMove = (e) => {
      s.ptrTx = (e.clientX / window.innerWidth) * 2 - 1;
      s.ptrTy = (e.clientY / window.innerHeight) * 2 - 1;
      if (s.isDragging) {
        s.dragDelta = e.clientX - s.dragStartX;
        const max = FLOORS[s.currentFloor].rooms.length - 1;
        const minX = 0;
        const maxX = max * ROOM_SPACING;
        let target = s.dragOriginX - s.dragDelta * WORLD_PER_PX;
        // soft rubber-band at edges
        if (target < minX) target = minX + (target - minX) * 0.35;
        if (target > maxX) target = maxX + (target - maxX) * 0.35;
        s.cameraX = target;
      }
    };
    const onPointerDown = (e) => {
      s.isDragging = true;
      s.dragStartX = e.clientX;
      s.dragDelta = 0;
      s.dragOriginX = s.cameraX;
      s.transit = null; // cancel any active eased move — drag takes over
    };
    const onPointerUp = () => {
      if (s.isDragging) {
        const max = FLOORS[s.currentFloor].rooms.length - 1;
        // snap to nearest room
        const target = Math.max(0, Math.min(max, Math.round(s.cameraX / ROOM_SPACING)));
        s.beginRoom(target);
      }
      s.isDragging = false;
      s.dragDelta = 0;
    };

    const onWheel = (e) => {
      if (s.transit || s.isDragging) return;
      const max = FLOORS[s.currentFloor].rooms.length - 1;
      const down = e.deltaY > 15;
      const up = e.deltaY < -15;
      // Consume the wheel to move between rooms, but RELEASE it at the
      // boundaries so scrolling past the last room continues down the page
      // (and scrolling up from the first room lets the page scroll up).
      if (down && s.currentRoom < max) {
        e.preventDefault();
        s.beginRoom(s.currentRoom + 1);
      } else if (up && s.currentRoom > 0) {
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

      // Continuous "living" camera drift so the scene is never truly static —
      // a slow cinematic breathing on top of the pointer parallax.
      s.time = (s.time || 0) + dt;

      let lift = 0, pull = 0;
      if (s.transit) {
        const tr = s.transit;
        tr.t = Math.min(tr.t + dt / tr.dur, 1);
        const e = easeInOut(tr.t);
        s.cameraX = tr.fromX + (tr.toX - tr.fromX) * e;
        const arc = Math.sin(Math.PI * tr.t);   // 0→1→0
        lift = arc * tr.lift;
        pull = arc * tr.pull;

        // swap floor geometry at the apex of a floor transition
        if (tr.rebuildFloor != null && tr.t >= 0.5) {
          s.currentFloor = tr.rebuildFloor;
          s.currentRoom = 0;
          s.cameraX = 0;
          tr.fromX = 0; tr.toX = 0;
          tr.rebuildFloor = null;
          rebuildRooms(s);
          onFloorChange?.(s.currentFloor);
          onRoomChange?.(0);
        }
        if (tr.t >= 1) { s.cameraX = tr.toX; s.transit = null; }
      }

      // dampen mouse parallax during transitions and active drag
      const par = (s.transit || s.isDragging) ? 0.1 : 1;
      const idleX = Math.sin(s.time * 0.16) * 0.2 * par;
      const idleY = Math.sin(s.time * 0.11 + 1.7) * 0.1 * par;
      const idleZ = (Math.cos(s.time * 0.09) + 1) * 0.14 * par;
      const idleTx = Math.sin(s.time * 0.13 + 0.6) * 0.16 * par;
      camera.position.x = s.cameraX + s.pointerX * 0.4 * par + idleX;
      camera.position.y = 1.6 + lift + s.pointerY * -0.12 * par + idleY;
      camera.position.z = 7 + pull + idleZ;

      // keep all rig lights anchored to the active room
      dirKey.position.set(s.cameraX + 4, 9, 5);
      dirKey.target.position.set(s.cameraX, 1, -2);
      dirRim.position.set(s.cameraX - 3, 5, -4);
      dirRim.target.position.set(s.cameraX, 1.4, -1);
      dirFill.position.set(s.cameraX - 4, 4, 3);
      for (let i = 0; i < spots.length; i++) {
        spots[i].position.x = s.cameraX + spotOffsets[i];
        spots[i].target.position.x = s.cameraX + spotOffsets[i];
      }

      // look toward the room we're settling into, easing the gaze down as we descend
      camera.lookAt(s.cameraX + s.pointerX * 0.1 * par + idleTx, 1.5 - lift * 0.12, 0);

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
      surfTextures.current.forEach(t => t.dispose());
      surfTextures.current.clear();
      // dispose loaded GLTF resources
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
