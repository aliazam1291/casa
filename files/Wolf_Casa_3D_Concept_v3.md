# Wolf Casa — 3D Concept (v3, final direction)
### The rotating vase hero, plus the wider motion system

Replaces earlier 3D concept drafts. This is the direction that ships.

---

## The concept in one line

A single sculpted brass-ceramic vase floats in a dark room. You can drag it in any direction to turn it. Its key light shifts color to match whichever of the five Worlds you're currently hovering.

## Why a vase, not a room

The first attempt at this hero — a miniature composed room built from primitive shapes (extruded rounded rects for a sofa, cylinders for a table) — read as a toy. Primitive geometry masquerading as furniture always will. The vase reverses the problem:

- A vase built from `LatheGeometry` (a curved 2D profile revolved 360° around an axis) is *actually* how vases are modeled in real 3D pipelines. It's the honest primitive for this shape.
- With good lighting and material properties, a lathed vase looks expensive — it's why every "product configurator" demo online uses one.
- One object is easier to art-direct than a full room, so mood-lighting variations actually read.
- Symbolically it fits the brand: an artefact, an heirloom, an object earning its place — the whole thesis of "composed, not decorated."

## Full spec (as built in `wolf-casa-homepage-v3.html`)

### Scene
- Renderer: Three.js WebGL, `alpha: true`, pixel ratio clamped to `[1, 2]`
- Fog: `FogExp2(0x0A0A0A, 0.08)` — matches the page background, so the vase fades into darkness rather than sitting on a visible boundary
- Camera: 35° FOV perspective, positioned at `(0, 0.4, 5)`, looking at origin

### The vase geometry
14-point profile revolved 96 segments. Coordinates in the working file (`profile` array); key silhouette moments:
- Wide flat base at y = -1.2
- Widest belly at y = 0.1–0.45 (radius 0.68–0.7)
- Narrow neck at y = 0.9 (radius 0.55)
- Slight flare at the rim at y = 1.15–1.28

Scale 0.9× uniform. A thin dark torus ring sits below as a base plinth.

### Material
`MeshStandardMaterial`:
- `color: 0x1a1512` (deep warm charcoal)
- `roughness: 0.35`
- `metalness: 0.75`
- `emissive: 0x3a2410` (per-world, lerp target)
- `emissiveIntensity: 0.15`

The high metalness + moderate roughness is what makes it read as brass-fired ceramic rather than plastic. Don't lower metalness below 0.5.

### Lighting (three-light rig)
- **Key point light** — `PointLight(worldAccentColor, 3.2, 10, 2)` at `(1.8, 1.6, 2)`. **This light's color is the mood system.** When a World is hovered, the key light color lerps at 0.04 per frame to that World's accent hex. This is the whole trick.
- **Fill point light** — `PointLight(0x6a5a4a, 0.9, 8, 2)` at `(-2, -0.5, 1)`. Cool, dim, opposite side. Fixed color.
- **Rim directional** — `DirectionalLight(0xffffff, 0.15)` from `(-2, 3, -2)`. Just a hair of edge separation from the fog.
- **Ambient** — `AmbientLight(0x1a1512, 0.5)` for global lift.

Do not add more lights. Each additional real-time light multiplies shader cost, and the composition doesn't need them.

### Atmosphere particles
`Points` geometry, 60 particles, positions randomized in `(±4, ±3, ±2)`, `PointsMaterial({ color: 0xC9963F, size: 0.015, opacity: 0.6, sizeAttenuation: true })`. Slow rotation on Y (0.0005 rad/frame) and X (0.0002 rad/frame). Gives the black space a sense of dust motes in low light.

### Interaction
- Pointer down on the hero mount starts drag, sets `cursor-drag` state on body
- Drag deltas add to `targetRotY` at 0.008× and `targetRotX` at 0.005×, `rotX` clamped to `[-0.6, 0.6]` so the vase can't flip
- Actual rotation lerps at 0.08 toward target (feels weighty)
- When not dragging, `targetRotY` increments by 0.003 rad/frame (slow auto-spin)
- Base ring counter-rotates at 0.5× to feel like it's grounded, not glued

### Mood system
Five worlds, each with an accent color and emissive tint. Hovering a world number (right edge of hero) or a world row (later in the page) calls `setWorld(i)`, which:
1. Updates the "Currently viewing" label
2. Sets `targetAccent.setHex()` and `targetEmissive.setHex()`
3. The animation loop lerps `keyLight.color` and `vaseMat.emissive` toward the targets at 0.04 per frame (feels ~600ms to settle)

This is what makes the hover-a-link-and-see-the-hero-react moment work.

---

## Production upgrade path (for Claude Code)

### Phase 1 — Port to React Three Fiber (ship this)
- Wrap the scene in `<Canvas>` from `@react-three/fiber`
- The vase becomes a component with the same profile array, drag handlers via `useDrag` from `@use-gesture/react`
- World state moves to a React context so the world index (hero-right), world rows (worlds section), and hero 3D all read from one source of truth
- Replace the three manual lights with `<Environment preset="warehouse" background={false}>` from drei plus a single accent point light for the mood system — cheaper and more physically believable

### Phase 2 — Better material and post-processing
- Swap to `MeshPhysicalMaterial` for `clearcoat` + `sheen` — makes the vase look glazed rather than painted
- Add `<EffectComposer>` with `<Bloom intensity={0.4} luminanceThreshold={0.6}>` — softens the emissive glow into an actual light-bloom
- Add `<ChromaticAberration offset={[0.0006, 0.0006]}>` — subtle lens cue, keeps it feeling shot, not rendered

### Phase 3 — When real assets exist
The vase is a placeholder for whatever hero object the brand team decides to feature — potentially rotating through The Shadow Lamp, The Object Cabinet artefact, or any actual named object from the catalogue as glTF models become available. The interaction pattern (drag + mood-switch key light) stays; the mesh swaps.

Deeper down the roadmap: individual Named Object PDPs can each have their own configurator-style 3D viewer (this is where OrbitControls belong — inspection, not the homepage hero).

---

## Non-negotiables

- `prefers-reduced-motion: reduce` freezes the vase in its rest orientation, disables auto-spin, disables particle rotation, disables the mood-lerp — hover still updates the "Currently viewing" label but the scene doesn't animate
- Mobile: on viewports below 768px, either drop the WebGL layer entirely (fallback to a still image with the mood-shift becoming a CSS filter on a background image) or aggressively reduce particle count to 20 and pixel ratio to 1. Decide on device testing.
- Lazy-init: don't create the renderer/scene until the hero is in viewport or after first meaningful paint — protects LCP
- Dispose the geometry, material, and renderer on unmount / route change — mandatory for a Next.js App Router build where the homepage will be one of many routes

---

## Out of scope

- No OrbitControls on the homepage hero. Free-orbit belongs on product pages, not on the "welcome, this is Wolf Casa" first impression.
- No scroll-scrubbed 3D on the hero — the hero is self-contained above the fold. Scroll-scrubbed *photo* sequences work elsewhere on the page (see Casa Sojourn section in v3); scroll-driven 3D belongs on individual World landing pages when those get built as their own scenes.
