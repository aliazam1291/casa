/* eslint-disable */
import * as THREE from 'three';

// Module-level caches
const surfBundleCache = new Map();
const artTextureCache = new Map();

// ─── Colour helpers ───────────────────────────────────────────────────────────
export function hexRGB(hex) {
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
}
export function shade([r, g, b], f) {
  const m = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${m(r * f)},${m(g * f)},${m(b * f)})`;
}

// ─── Diffuse painters ─────────────────────────────────────────────────────────
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
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, shade(rgb, 1.06));
  grad.addColorStop(0.35, shade(rgb, 0.96));
  grad.addColorStop(0.65, shade(rgb, 1.02));
  grad.addColorStop(1, shade(rgb, 0.92));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
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
  ctx.fillStyle = shade(rgb, 1.0);
  ctx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 3) {
    const bandF = 0.92 + Math.sin(y * 0.06) * 0.06 + Math.random() * 0.04;
    ctx.fillStyle = shade(rgb, bandF);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, y, 512, 3);
  }
  ctx.globalAlpha = 1;
  for (let y = 0; y < 512; y += 5) {
    for (let x = 0; x < 512; x += 5) {
      const f = 0.88 + Math.random() * 0.24;
      ctx.fillStyle = shade(rgb, f);
      ctx.globalAlpha = 0.28;
      ctx.fillRect(x + Math.random() * 3, y + Math.random() * 3, 1.5, 2.5);
    }
  }
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
  ctx.fillStyle = shade(rgb, 1.0);
  ctx.fillRect(0, 0, 512, 512);
  const step = 6;
  for (let y = 0; y < 512; y += step) {
    for (let x = 0; x < 512; x += step) {
      const f = 0.90 + Math.random() * 0.20;
      ctx.fillStyle = shade(rgb, f);
      ctx.globalAlpha = 0.3;
      ctx.fillRect(x, y + 1, step - 1, 1.5);
      ctx.fillRect(x + 1, y, 1.5, step - 1);
    }
  }
  ctx.globalAlpha = 1;
  for (let s = 0; s < 20; s++) {
    ctx.fillStyle = shade(rgb, 0.82 + Math.random() * 0.12);
    ctx.globalAlpha = 0.15;
    ctx.fillRect(Math.random() * 510, Math.random() * 510, 2 + Math.random() * 6, 1);
  }
  ctx.globalAlpha = 1;
}

function paintWood(ctx, rgb) {
  const planks = 4;
  const pw = 512 / planks;
  ctx.fillStyle = shade(rgb, 0.96);
  ctx.fillRect(0, 0, 512, 512);
  for (let p = 0; p < planks; p++) {
    const heartF = 0.88 + Math.random() * 0.22;
    const grad = ctx.createLinearGradient(p * pw, 0, (p + 1) * pw, 0);
    grad.addColorStop(0, shade(rgb, heartF * 0.92));
    grad.addColorStop(0.3, shade(rgb, heartF * 1.04));
    grad.addColorStop(0.7, shade(rgb, heartF * 1.06));
    grad.addColorStop(1, shade(rgb, heartF * 0.90));
    ctx.fillStyle = grad;
    ctx.fillRect(p * pw, 0, pw, 512);
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
    for (let m = 0; m < 6; m++) {
      ctx.fillStyle = shade(rgb, heartF * 1.14);
      ctx.globalAlpha = 0.09;
      const mx = p * pw + 10 + Math.random() * (pw - 20);
      const my = Math.random() * 512;
      ctx.fillRect(mx, my, 2 + Math.random() * 4, 1);
    }
    if (Math.random() < 0.25) {
      const kx = p * pw + pw * (0.3 + Math.random() * 0.4);
      const ky = 80 + Math.random() * 350;
      const kr = 4 + Math.random() * 6;
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = shade(rgb, 0.45);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(kx, ky, kr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = shade(rgb, 0.55);
      ctx.fill();
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
    ctx.fillStyle = shade(rgb, 0.38);
    ctx.fillRect(p * pw, 0, 1.2, 512);
    ctx.fillStyle = shade(rgb, 1.12);
    ctx.fillRect(p * pw + 1.2, 0, 0.6, 512);
  }
}

function paintMarble(ctx, rgb) {
  ctx.fillStyle = shade(rgb, 1.02);
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 24; i++) {
    ctx.globalAlpha = 0.045;
    ctx.fillStyle = shade(rgb, 0.88 + Math.random() * 0.22);
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, 60 + Math.random() * 200, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
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
        ctx.globalAlpha = isGold ? 0.35 : (v < 3 ? 0.40 : 0.22);
        ctx.lineWidth = isGold ? 1.6 : (v < 3 ? 1.2 : 0.7);
        ctx.beginPath();
        ctx.moveTo(nx, ny);
      }
      x = nx; y = ny;
    }
    ctx.stroke();
  }
  for (let sp = 0; sp < 40; sp++) {
    ctx.globalAlpha = 0.06 + Math.random() * 0.05;
    ctx.fillStyle = shade(rgb, 1.30 + Math.random() * 0.15);
    const sx = Math.random() * 512, sy = Math.random() * 512;
    ctx.fillRect(sx, sy, 1, 1);
  }
  ctx.globalAlpha = 1;
}

function paintBoucle(ctx, rgb) {
  ctx.fillStyle = shade(rgb, 0.96);
  ctx.fillRect(0, 0, 512, 512);
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
  ctx.fillStyle = shade(rgb, 1.0);
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 28; i++) {
    ctx.globalAlpha = 0.035;
    ctx.fillStyle = shade(rgb, 0.88 + Math.random() * 0.22);
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, 50 + Math.random() * 150, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let t = 0; t < 12; t++) {
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = shade(rgb, 0.90 + Math.random() * 0.16);
    ctx.save();
    ctx.translate(Math.random() * 512, Math.random() * 512);
    ctx.rotate((Math.random() - 0.5) * 0.6);
    ctx.fillRect(-120, -3, 240 + Math.random() * 80, 4 + Math.random() * 3);
    ctx.restore();
  }
  for (let b = 0; b < 6; b++) {
    ctx.globalAlpha = 0.03;
    ctx.fillStyle = shade(rgb, 1.15);
    ctx.beginPath();
    ctx.ellipse(Math.random() * 512, Math.random() * 512, 40 + Math.random() * 60, 20 + Math.random() * 30, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ─── Surface Bundle (diffuse + normal + roughness) ────────────────────────────
export function getSurfBundle(kind, color, repeatX = 1, repeatY = 1) {
  const key = `${kind}-${color}-${repeatX}-${repeatY}`;
  if (surfBundleCache.has(key)) return surfBundleCache.get(key);

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

  // Derived maps are generated at half the diffuse resolution. The loop below
  // is pure JS and runs per pixel, so 512² costs 4x what 256² does — and it
  // runs a dozen times before the gallery's first frame. Normal/roughness
  // carry low-frequency surface response, not detail, so the halving is not
  // visible once the maps are tiled and filtered.
  const N = 256;
  const normCv = document.createElement('canvas');
  normCv.width = N; normCv.height = N;
  const nCtx = normCv.getContext('2d');
  const roughCv = document.createElement('canvas');
  roughCv.width = N; roughCv.height = N;
  const rCtx = roughCv.getContext('2d');

  // Downsample the diffuse once (native, off the JS hot path) and derive from
  // that rather than sampling the full-size buffer.
  const srcCv = document.createElement('canvas');
  srcCv.width = N; srcCv.height = N;
  const sCtx = srcCv.getContext('2d');
  sCtx.drawImage(diffCv, 0, 0, N, N);

  const dData = sCtx.getImageData(0, 0, N, N).data;
  const nImgData = nCtx.createImageData(N, N);
  const nData = nImgData.data;
  const rImgData = rCtx.createImageData(N, N);
  const rData = rImgData.data;

  let normStr = 15.0, step = 1;
  if (kind === 'wood' || kind === 'herringbone') { normStr = 18.0; step = 2; }
  else if (kind === 'marble') { normStr = 12.0; step = 2; }
  else if (kind === 'boucle') { normStr = 28.0; step = 1; }
  else if (kind === 'leather') { normStr = 16.0; step = 1; }
  else if (kind === 'velvet') { normStr = 10.0; step = 1; }
  else if (kind === 'linen') { normStr = 22.0; step = 1; }
  else if (kind === 'plaster') { normStr = 14.0; step = 2; }

  // `step` above is expressed in full-size (512) pixels; the buffer is now N
  // wide. Halve it, clamp to one pixel, and rescale normStr by however much
  // the real sampling distance had to grow, so the derived slope is unchanged.
  const stepN = Math.max(1, Math.round(step / 2));
  normStr *= (step / 2) / stepN;

  const getV = (px, py) => {
    const cx = (px + N) % N;
    const cy = (py + N) % N;
    const i = (cy * N + cx) * 4;
    return (dData[i] + dData[i + 1] + dData[i + 2]) / 765;
  };

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const idx = (y * N + x) * 4;
      const dx = (getV(x + stepN, y) - getV(x - stepN, y)) * normStr;
      const dy = (getV(x, y + stepN) - getV(x, y - stepN)) * normStr;
      const len = Math.sqrt(dx * dx + dy * dy + 1.0);
      nData[idx] = Math.floor(((dx / len) * 0.5 + 0.5) * 255);
      nData[idx + 1] = Math.floor(((dy / len) * 0.5 + 0.5) * 255);
      nData[idx + 2] = Math.floor(((1.0 / len) * 0.5 + 0.5) * 255);
      nData[idx + 3] = 255;

      const val = getV(x, y);
      let rVal = 128;
      if (kind === 'wood' || kind === 'herringbone') rVal = Math.floor((0.22 + (1.0 - val) * 0.65) * 255);
      else if (kind === 'marble') rVal = Math.floor((0.05 + (1.0 - val) * 0.45) * 255);
      else if (kind === 'leather') rVal = Math.floor((0.28 + (1.0 - val) * 0.55) * 255);
      else if (kind === 'boucle' || kind === 'velvet' || kind === 'linen') rVal = Math.floor((0.80 + (1.0 - val) * 0.18) * 255);
      else rVal = Math.floor((0.72 + (1.0 - val) * 0.24) * 255);

      rData[idx] = rVal; rData[idx + 1] = rVal; rData[idx + 2] = rVal; rData[idx + 3] = 255;
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
  surfBundleCache.set(key, bundle);
  return bundle;
}

// ─── Art textures ─────────────────────────────────────────────────────────────
export function createArtTexture(seed) {
  const cv = document.createElement('canvas');
  cv.width = 600; cv.height = 760;
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
    sky.addColorStop(0, pal[0]); sky.addColorStop(1, pal[1]);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, Wc, Hc);
    const sx = Wc * (0.3 + rnd() * 0.4), sy = Hc * (0.2 + rnd() * 0.18);
    const glow = ctx.createRadialGradient(sx, sy, 4, sx, sy, Wc * 0.4);
    glow.addColorStop(0, 'rgba(255,244,222,0.9)'); glow.addColorStop(1, 'rgba(255,244,222,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, Wc, Hc);
    ctx.beginPath(); ctx.arc(sx, sy, Wc * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,248,232,0.95)'; ctx.fill();
    for (let l = 0; l < 4; l++) {
      const baseY = Hc * (0.5 + l * 0.12);
      ctx.beginPath(); ctx.moveTo(0, baseY);
      for (let i = 0; i <= 6; i++) {
        const x = (Wc / 6) * i;
        const y = baseY + Math.sin(i * 1.3 + l * 2 + seed) * (30 - l * 4) - rnd() * 18;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(Wc, Hc); ctx.lineTo(0, Hc); ctx.closePath();
      ctx.fillStyle = pal[Math.min(2 + l, pal.length - 1)];
      ctx.globalAlpha = 0.92; ctx.fill(); ctx.globalAlpha = 1;
    }
  } else if (style === 1) {
    ctx.fillStyle = pal[1]; ctx.fillRect(0, 0, Wc, Hc);
    const blocks = 2 + Math.floor(rnd() * 2);
    let yCursor = Hc * 0.08;
    for (let b = 0; b < blocks; b++) {
      const bh = (Hc * 0.82) / blocks;
      const col = pal[2 + (b % 3)];
      const pad = Wc * (0.08 + rnd() * 0.04);
      for (let pass = 0; pass < 14; pass++) {
        ctx.globalAlpha = 0.10; ctx.fillStyle = col;
        const inset = pass * 2;
        ctx.fillRect(pad + inset, yCursor + inset, Wc - pad * 2 - inset * 2, bh - 24 - inset * 2);
      }
      ctx.globalAlpha = 1; yCursor += bh;
    }
  } else {
    ctx.fillStyle = pal[0]; ctx.fillRect(0, 0, Wc, Hc);
    for (let i = 0; i < 26; i++) {
      ctx.save(); ctx.translate(rnd() * Wc, rnd() * Hc);
      ctx.rotate((rnd() - 0.5) * 1.4); ctx.globalAlpha = 0.25 + rnd() * 0.4;
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

export function getArtTexture(key, seed) {
  if (artTextureCache.has(key)) return artTextureCache.get(key);
  const tex = createArtTexture(seed);
  artTextureCache.set(key, tex);
  return tex;
}

export function addFramedArt(parent, sm, artTex, { x, y, z, w, h, ry = 0 }) {
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
  const mat = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color: 0xf2ece0, roughness: 0.9 }));
  mat.position.set(0, 0, 0.032);
  g.add(mat);
  const painting = new THREE.Mesh(new THREE.PlaneGeometry(w - matPad * 2, h - matPad * 2), new THREE.MeshBasicMaterial({ map: artTex }));
  painting.position.set(0, 0, 0.04);
  g.add(painting);
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  return g;
}

// ─── Disposal helpers ─────────────────────────────────────────────────────────
export function disposeSurfBundleCache() {
  surfBundleCache.forEach(b => {
    if (b.map) b.map.dispose();
    if (b.normalMap) b.normalMap.dispose();
    if (b.roughnessMap) b.roughnessMap.dispose();
  });
  surfBundleCache.clear();
}

export function disposeArtTextureCache() {
  artTextureCache.forEach(t => t.dispose());
  artTextureCache.clear();
}
