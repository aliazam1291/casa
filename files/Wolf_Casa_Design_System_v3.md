# Wolf Casa — Design System (v3, final direction)
### Stark editorial, dark, interactive — the language behind `wolf-casa-homepage-v3.html`

This replaces earlier design-system drafts. The tokens, type, motion, and component behavior below are what the production build should ship. Do not reinterpret color values, type weights, or motion timings — they are calibrated to the working prototype.

---

## 1. Aesthetic direction

**Reference vibe:** high-fashion editorial (Balenciaga, Jacquemus, high-end magazine covers) — not boutique-hotel warm-luxury.

- Pure dark canvas, off-white ink, no warm neutrals in the global UI.
- Brutal display type: Fraunces at weight 200 in italic, sized 100–170px, sitting next to 10–11px monospace labels. The size contrast *is* the aesthetic.
- Motion is everywhere but never decorative — every interaction communicates something (cursor context, mood switching, position in a journey).
- Dark, moody, low-lit editorial photography for all imagery. No bright/airy stock, no product-on-white shots.

---

## 2. Color tokens

```css
--bg:        #0A0A0A;   /* primary background, near-black */
--bg-2:      #111;      /* raised surface / row hover */
--fg:        #F5F5F0;   /* primary text, off-white */
--fg-dim:    rgba(245,245,240,.5);
--fg-faint:  rgba(245,245,240,.22);
--line:      rgba(245,245,240,.14);
```

**World mood accents** — used only inside the 3D hero's key light and the vase's emissive glow. Never appear in global UI, buttons, or type:

| World | Accent hex | Emissive hex |
|---|---|---|
| Heirloom Way | `#C9963F` | `#3a2410` |
| Low House Way | `#8B4A34` | `#2c1610` |
| Courtyard Way | `#6E7A5C` | `#1e2418` |
| Monastic Way | `#D8D2C4` | `#1a1815` |
| Ritual Way | `#B8813C` | `#33220f` |

There are no other colors in the system. No red/green/blue for status states either — errors and warnings render in `--fg` with an italic serif treatment, not chromatic.

---

## 3. Typography

- **Display:** `Fraunces` variable serif. Weight 200 for headlines, 300 for card titles/body serif. Italic is the default expressive form; upright (`.up` class in the prototype) is used deliberately for contrast within a headline.
- **Functional:** `IBM Plex Mono` at weights 300/400/500. Every label, kicker, section number (`§ 01`, `01 / 05`), stat suffix, nav link, and CTA is in Plex Mono.
- Never mix a third family.

| Step | Family | Size | Weight | Case |
|---|---|---|---|---|
| Hero display | Fraunces italic | 56–172px clamp | 200 | sentence |
| Section H2 | Fraunces italic | 48–108px clamp | 200 | sentence |
| Card title | Fraunces italic | 22–24px | 300 | sentence |
| Body serif | Fraunces | 17–22px | 300 | sentence |
| Kicker/label | Plex Mono | 10–11px | 400–500 | UPPERCASE, 0.2–0.28em tracking |
| Body mono | Plex Mono | 12–13px | 300 | sentence, 0.04–0.06em tracking |

Line-height: 0.9–0.95 for display, 1.6–1.9 for mono labels (open, breathing).

---

## 4. Layout, spacing, motion

- **Section vertical rhythm:** `padding: 18vh–22vh` on major sections. This gives the scroll its slow, considered pace. Not 60–80px — vh-based, so it scales.
- **Radius:** `0px` almost universally. Sharp corners. The 3D hero's WebGL canvas is the only "round" moment in the whole page.
- **Borders:** 1px hairlines at 14% off-white opacity (`--line`). Never thicker.
- **Transitions:** cursor 0.18s cubic-bezier ease-out; hover states 0.35–0.6s; scroll reveals 1s; scrub-frame cross-fades 0.4s. The number matters — snappier and it feels twitchy, slower and it feels lazy.
- **No shadows.** Depth comes from a scene's light source (in the 3D hero), from photo vignetting, from `mix-blend-mode: difference` on the nav — never from drop-shadow blur.

---

## 5. Interactions (the core of this brand)

Every one of these ships in the v3 prototype and must ship in production:

### Custom cursor
Two-part cursor: 6px filled dot + 36px trailing ring. States:
- **default** — dot + ring, `mix-blend-mode: difference` so it inverts against any background
- **hover** (over links/cards) — dot vanishes, ring expands to 70px, contextual label appears below ("View" / "Read" / "Enter" / "Book" / "Set" — sourced from `data-cursor` attribute)
- **drag** (over 3D vase or gallery) — ring at 90px, semi-filled interior, dot shrinks to 2px
- **3D zone** — ring at 120px with dashed 1px border, no fill

Disabled entirely on touch devices (`@media (hover: none)`) and under `prefers-reduced-motion`.

### Magnetic buttons/links
Every nav link, footer link, and CTA has a `.magnetic` child span. On parent hover, the child translates toward the cursor at 40% of the offset. Returns to `translate(0,0)` on mouseleave with a 180ms ease-out.

### Hover-reveal stats
Four stat cards under the manifesto:
- Numbers count up (0 → target value, ~30ms per step, ~40 steps) when the section enters viewport
- Hover triggers a curtain wipe (white fill scales from bottom in 0.6s), inverting text to black on white

### Section-transition curtains
Soft `linear-gradient(180deg, transparent, --bg)` overlays at the top of each major section, 120px tall — makes the transition between sections feel like a fade-in rather than a hard cut.

### Nav blend mode
`mix-blend-mode: difference` on the nav in the hero (so it reads white on any photo underneath), switches to normal solid state after scrolling past 50vh.

### World hover linking
Hovering a world row anywhere on the page:
1. Fades in a background image of that world behind the row (0.8s)
2. Also lerps the hero 3D vase's key-light color to that world's accent
This cross-section coupling — hover a link, watch the hero react — is a signature interaction.

---

## 6. 3D language (see `Wolf_Casa_3D_Concept_v3.md` for full spec)

The hero 3D element is a **single sculpted vase**, floating in dark space with atmospheric particles.

- Built from a `LatheGeometry` — a curved profile revolved around the Y axis — so it looks sculpted, not primitive. This is why it doesn't read as "toy 3D."
- Material: `MeshStandardMaterial` with high metalness (0.75), moderate roughness (0.35), emissive tint that shifts by World.
- Three lights: a colored key point light (this is the mood system), a cool fill point light, a directional rim.
- Drag to rotate freely on X and Y; releases into slow auto-spin (0.003 rad/frame).
- 60 particle points drifting slowly for atmospheric depth.

---

## 7. Component state checklist (Claude Code review gate)

Every interactive component must ship all applicable states:

| Component | Required states |
|---|---|
| Custom cursor | default, hover, drag, 3D-zone, hidden (touch/reduced-motion) |
| Nav link | default, hover (magnetic + label), active/current-page |
| CTA button | default, hover (magnetic pull), focus-visible, disabled |
| World row | default, hover (bg image fade + hero 3D re-light), focus-visible |
| Stat card | default, on-scroll (count-up), hover (curtain wipe) |
| Gallery card | default, dragging (cursor state), snapping/resting |
| Scrub frame | default, active (progress dot on) |
| 3D vase | default (auto-spin), dragging, world-switching (color lerp), reduced-motion (static) |
| Form fields | default, focus, filled, error (italic serif helper), disabled |

Reduced motion (`prefers-reduced-motion: reduce`) must disable: custom cursor, magnetic buttons, ticker animation, scroll cue animation, 3D auto-spin, and stat count-ups. Static content shows in its final state, not mid-animation.

---

## 8. Sanctioned deviations

**The Composed Room** (`components/three/composed-room`, homepage, between the Manifesto and Stats sections) is a warm cream isometric diorama — `#E8DFC9` stage, `#D4C7A8` ground, `#DDD1B8` sculpture material — and breaks two rules above on purpose, scoped to that one section only:

- **§2's "no warm neutrals in the global UI."** The exception is the same shape as the World mood accents already carved out in §2: scoped color that never touches nav, buttons, or type. The four cream/brass hexes live only in `components/three/composed-room/data/tokens.ts`, never in the global token file or `:root`.
- **§4's "no shadows."** Read literally this bans CSS `drop-shadow`; §4 itself sanctions the alternative — "depth comes from a scene's light source (in the 3D hero)." The Composed Room's real shadow-mapped lighting is that same alternative, applied to a second scene.

It also revisits a decision recorded in `Wolf_Casa_3D_Concept_v3.md`: an earlier hero built from primitive shapes read as a toy and was rejected. This section is that shape again, so the mitigations are load-bearing: micro-bevelled edges, real soft shadows + contact shadows, ACES tone mapping, photographic marble/portrait textures, monochrome material discipline, and a single key light. If it still reads as a toy in review, the fix is fewer objects and more negative space — not more detail.

It stays scroll-*triggered* (one-shot assembly on scroll-in), not scroll-*scrubbed* — `Wolf_Casa_3D_Concept_v3.md`'s restriction on scroll-driven 3D applies to camera position bound to scroll, which this section never does.
