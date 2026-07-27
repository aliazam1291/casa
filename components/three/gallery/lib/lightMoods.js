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
//
// Evening re-grade (Brand Book black-first pass): every room's `bg` was
// brought into the same charcoal family as the underground floor's, `env`
// (ambient IBL bounce) and `exposure` trimmed so the room reads as a lit
// space in a dark house rather than a daylit one. key/rim/fill/spot colours
// and intensities are untouched — those are what make the leather, walnut
// and marble materials read, and the brief was to change the mood, not the
// materials.

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
    key: { color: 0xfff0d6, intensity: 3.25 },
    rim: { color: 0xffd4a2, intensity: 0.42 },
    fill: { color: 0xdfe8f2, intensity: 0.16 },
    spot: { color: 0xffead0, intensity: 34, angle: 0.19, penumbra: 0.68 },
    ambient: 0.035, hemi: 0.16, exposure: 0.88, env: 0.32, bg: 0x231f18,
  },
  // Crisp task lighting over stone.
  kitchen: {
    key: { color: 0xfff1df, intensity: 3.15 },
    rim: { color: 0xffddb2, intensity: 0.38 },
    fill: { color: 0xdde7f0, intensity: 0.18 },
    spot: { color: 0xfff3e4, intensity: 38, angle: 0.2, penumbra: 0.62 },
    ambient: 0.04, hemi: 0.18, exposure: 0.89, env: 0.34, bg: 0x241f19,
  },
  // Golden-hour living room — the signature warm room.
  living: {
    key: { color: 0xffe6c2, intensity: 3.0 },
    rim: { color: 0xffc78c, intensity: 0.44 },
    fill: { color: 0xdfe7f0, intensity: 0.13 },
    spot: { color: 0xffdfbd, intensity: 34, angle: 0.19, penumbra: 0.7 },
    ambient: 0.035, hemi: 0.16, exposure: 0.87, env: 0.3, bg: 0x251f18,
  },
  // Candle-warm dining, tighter pools over the table.
  dining: {
    key: { color: 0xffddad, intensity: 2.65 },
    rim: { color: 0xffbd7b, intensity: 0.42 },
    fill: { color: 0xd9e2ec, intensity: 0.12 },
    spot: { color: 0xffd5a5, intensity: 32, angle: 0.18, penumbra: 0.72 },
    ambient: 0.035, hemi: 0.14, exposure: 0.87, env: 0.28, bg: 0x231d16,
  },
  // Soft, low, restful — light grazes rather than floods.
  bedroom: {
    key: { color: 0xffe5c7, intensity: 2.35 },
    rim: { color: 0xffc68f, intensity: 0.36 },
    fill: { color: 0xdfe7ef, intensity: 0.12 },
    spot: { color: 0xffddbe, intensity: 28, angle: 0.18, penumbra: 0.74 },
    ambient: 0.035, hemi: 0.15, exposure: 0.87, env: 0.28, bg: 0x241f19,
  },
  // Cool, clean, humid daylight — the one deliberately cool room.
  spa: {
    key: { color: 0xf0f7ff, intensity: 2.85 },
    rim: { color: 0xd4e6f3, intensity: 0.34 },
    fill: { color: 0xc7d9e7, intensity: 0.24 },
    spot: { color: 0xf3f8ff, intensity: 30, angle: 0.2, penumbra: 0.66 },
    ambient: 0.045, hemi: 0.2, exposure: 0.89, env: 0.36, bg: 0x1c211f,
  },
  // Focused, moody study — dark walnut, one warm task pool.
  study: {
    key: { color: 0xffd59d, intensity: 2.25 },
    rim: { color: 0xffb472, intensity: 0.34 },
    fill: { color: 0xd4dfe8, intensity: 0.1 },
    spot: { color: 0xffce96, intensity: 28, angle: 0.17, penumbra: 0.76 },
    ambient: 0.03, hemi: 0.12, exposure: 0.85, env: 0.24, bg: 0x1f1a14,
  },
  // Sky-level glazing: bright, open, slightly cool.
  pavilion: {
    key: { color: 0xfff2e2, intensity: 3.35 },
    rim: { color: 0xd2e0ee, intensity: 0.42 },
    fill: { color: 0xd5e5f2, intensity: 0.24 },
    spot: { color: 0xffecd8, intensity: 24, angle: 0.21, penumbra: 0.72 },
    ambient: 0.045, hemi: 0.22, exposure: 0.9, env: 0.38, bg: 0x1e2222,
  },
  // Open-air dusk: strong low sun, warm sky bounce, minimal ceiling spill.
  terrace: {
    key: { color: 0xffcf91, intensity: 3.15 },
    rim: { color: 0xffad68, intensity: 0.56 },
    fill: { color: 0xb4c9d8, intensity: 0.34 },
    spot: { color: 0xffd19a, intensity: 8, angle: 0.22, penumbra: 0.85 },
    ambient: 0.055, hemi: 0.32, exposure: 0.9, env: 0.42, bg: 0x1a2226,
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
