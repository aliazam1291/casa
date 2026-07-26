/* eslint-disable */
import * as THREE from 'three';

// Per-room lighting moods. Every room previously shared one global rig, so a
// wine cellar lit identically to a spa bath — which is the main reason the
// spaces read the same. Each mood retunes the key/rim/fill/spots and the
// background so a room's light does the storytelling before the furniture does.
//
// key      — warm directional sun/architectural key (the shadow caster)
// rim      — back separation light
// fill     — cool bounce
// spot     — the recessed ceiling wash on the feature wall
// exposure — per-room tone-mapping exposure
// env      — environment (IBL) intensity
// bg       — scene background tint

const MOODS = {
  // Deep, candle-lit cellar. Very low fill so the wine wall's own backlight
  // and the candelabra carry the room.
  cellar: {
    key: { color: 0xffc98a, intensity: 1.5 },
    rim: { color: 0xff9d52, intensity: 0.5 },
    fill: { color: 0x6a5f52, intensity: 0.1 },
    spot: { color: 0xffb163, intensity: 34, angle: 0.19, penumbra: 0.65 },
    ambient: 0.03, hemi: 0.1, exposure: 0.94, env: 0.42, bg: 0x241c15,
  },
  // Working vault: cooler, brighter, task-lit so materials read true.
  vault: {
    key: { color: 0xfff2de, intensity: 2.4 },
    rim: { color: 0xffd9a8, intensity: 0.5 },
    fill: { color: 0xdfe8f2, intensity: 0.35 },
    spot: { color: 0xfff4e2, intensity: 44, angle: 0.22, penumbra: 0.5 },
    ambient: 0.06, hemi: 0.2, exposure: 1.0, env: 0.62, bg: 0x2b241d,
  },
  // Library hush — warm pools, deep shadow between them.
  archive: {
    key: { color: 0xffdcae, intensity: 1.8 },
    rim: { color: 0xffbe7a, intensity: 0.45 },
    fill: { color: 0x8e8375, intensity: 0.16 },
    spot: { color: 0xffd9a0, intensity: 38, angle: 0.2, penumbra: 0.6 },
    ambient: 0.045, hemi: 0.16, exposure: 0.97, env: 0.5, bg: 0x2a2219,
  },
  // Daylight arrival hall — bright, airy, generous.
  foyer: {
    key: { color: 0xfff4e2, intensity: 3.1 },
    rim: { color: 0xffe0b4, intensity: 0.6 },
    fill: { color: 0xe8edf6, intensity: 0.3 },
    spot: { color: 0xfff1d8, intensity: 50, angle: 0.22, penumbra: 0.5 },
    ambient: 0.07, hemi: 0.28, exposure: 1.04, env: 0.78, bg: 0xece3d2,
  },
  // Crisp task lighting over stone.
  kitchen: {
    key: { color: 0xfff6ea, intensity: 3.0 },
    rim: { color: 0xffe3bc, intensity: 0.5 },
    fill: { color: 0xdfe9f4, intensity: 0.34 },
    spot: { color: 0xfffaf0, intensity: 54, angle: 0.23, penumbra: 0.45 },
    ambient: 0.07, hemi: 0.3, exposure: 1.03, env: 0.8, bg: 0xe9e1d1,
  },
  // Golden-hour living room — the signature warm room.
  living: {
    key: { color: 0xffeccd, intensity: 2.9 },
    rim: { color: 0xffcf94, intensity: 0.66 },
    fill: { color: 0xe4ecf6, intensity: 0.24 },
    spot: { color: 0xffeacb, intensity: 52, angle: 0.22, penumbra: 0.55 },
    ambient: 0.06, hemi: 0.24, exposure: 1.02, env: 0.72, bg: 0xece3d2,
  },
  // Candle-warm dining, tighter pools over the table.
  dining: {
    key: { color: 0xffe6c0, intensity: 2.5 },
    rim: { color: 0xffc98a, intensity: 0.6 },
    fill: { color: 0xdfe4ee, intensity: 0.2 },
    spot: { color: 0xffe2b8, intensity: 48, angle: 0.2, penumbra: 0.6 },
    ambient: 0.05, hemi: 0.2, exposure: 1.0, env: 0.66, bg: 0xe7dcc7,
  },
  // Soft, low, restful — light grazes rather than floods.
  bedroom: {
    key: { color: 0xffeed6, intensity: 2.2 },
    rim: { color: 0xffd2a0, intensity: 0.55 },
    fill: { color: 0xe6ecf6, intensity: 0.24 },
    spot: { color: 0xffe8cd, intensity: 40, angle: 0.21, penumbra: 0.62 },
    ambient: 0.06, hemi: 0.24, exposure: 1.0, env: 0.7, bg: 0xeee5d7,
  },
  // Cool, clean, humid daylight — the one deliberately cool room.
  spa: {
    key: { color: 0xf2f7ff, intensity: 2.7 },
    rim: { color: 0xdbeaf7, intensity: 0.5 },
    fill: { color: 0xcfe0f0, intensity: 0.45 },
    spot: { color: 0xf4f9ff, intensity: 46, angle: 0.23, penumbra: 0.5 },
    ambient: 0.09, hemi: 0.36, exposure: 1.05, env: 0.9, bg: 0xe6ebe9,
  },
  // Focused, moody study — dark walnut, one warm task pool.
  study: {
    key: { color: 0xffdfae, intensity: 2.1 },
    rim: { color: 0xffbe80, intensity: 0.5 },
    fill: { color: 0xd8dfe8, intensity: 0.18 },
    spot: { color: 0xffd9a4, intensity: 42, angle: 0.19, penumbra: 0.62 },
    ambient: 0.05, hemi: 0.18, exposure: 0.98, env: 0.58, bg: 0xe0d6c4,
  },
  // Sky-level glazing: bright, open, slightly cool.
  pavilion: {
    key: { color: 0xfff8ee, intensity: 3.2 },
    rim: { color: 0xd8e6f5, intensity: 0.66 },
    fill: { color: 0xdce9f8, intensity: 0.45 },
    spot: { color: 0xfff6e8, intensity: 40, angle: 0.24, penumbra: 0.5 },
    ambient: 0.09, hemi: 0.38, exposure: 1.06, env: 0.95, bg: 0xeef1f2,
  },
  // Open-air dusk: strong low sun, warm sky bounce, minimal ceiling spill.
  terrace: {
    key: { color: 0xffd9a0, intensity: 3.0 },
    rim: { color: 0xffb877, intensity: 0.8 },
    fill: { color: 0xbcd0de, intensity: 0.6 },
    spot: { color: 0xffdcae, intensity: 12, angle: 0.26, penumbra: 0.8 },
    ambient: 0.1, hemi: 0.5, exposure: 1.05, env: 1.0, bg: 0xc9d8e2,
  },
};

/** Pick a mood from the room name, falling back to the warm living default. */
export function moodForRoom(name = '') {
  const n = name.toLowerCase();
  if (n.includes('wine') || n.includes('cellar')) return MOODS.cellar;
  if (n.includes('vault')) return MOODS.vault;
  if (n.includes('archive')) return MOODS.archive;
  if (n.includes('foyer') || n.includes('hall')) return MOODS.foyer;
  if (n.includes('kitchen')) return MOODS.kitchen;
  if (n.includes('dining')) return MOODS.dining;
  if (n.includes('bath') || n.includes('spa')) return MOODS.spa;
  if (n.includes('study')) return MOODS.study;
  if (n.includes('bed') || n.includes('suite') || n.includes('master') || n.includes('guest')) return MOODS.bedroom;
  if (n.includes('terrace')) return MOODS.terrace;
  if (n.includes('pavilion') || n.includes('skyline') || n.includes('salon')) return MOODS.pavilion;
  return MOODS.living;
}

/**
 * Ease the live rig toward the active room's mood. Called every frame so
 * moving between rooms cross-fades the light instead of snapping.
 */
export function applyMood(rig, mood, alpha) {
  const { ambient, hemi, dirKey, dirRim, dirFill, spots, scene, renderer } = rig;

  ambient.intensity += (mood.ambient - ambient.intensity) * alpha;
  hemi.intensity += (mood.hemi - hemi.intensity) * alpha;

  dirKey.intensity += (mood.key.intensity - dirKey.intensity) * alpha;
  dirKey.color.lerp(_c(mood.key.color), alpha);

  dirRim.intensity += (mood.rim.intensity - dirRim.intensity) * alpha;
  dirRim.color.lerp(_c(mood.rim.color), alpha);

  dirFill.intensity += (mood.fill.intensity - dirFill.intensity) * alpha;
  dirFill.color.lerp(_c(mood.fill.color), alpha);

  for (const sp of spots) {
    sp.intensity += (mood.spot.intensity - sp.intensity) * alpha;
    sp.angle += (Math.PI * mood.spot.angle - sp.angle) * alpha;
    sp.penumbra += (mood.spot.penumbra - sp.penumbra) * alpha;
    sp.color.lerp(_c(mood.spot.color), alpha);
  }

  scene.background.lerp(_c(mood.bg), alpha);
  scene.environmentIntensity += (mood.env - scene.environmentIntensity) * alpha;
  renderer.toneMappingExposure += (mood.exposure - renderer.toneMappingExposure) * alpha;
}

// Scratch colour so we don't allocate one per light per frame.
const _scratch = new THREE.Color();
function _c(hex) {
  return _scratch.setHex(hex);
}
