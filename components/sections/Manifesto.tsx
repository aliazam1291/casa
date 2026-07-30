"use client";

import { useReveal } from "@/hooks/useReveal";
import { StickyScrollReveal, type StickyItem } from "@/components/motion/StickyScrollReveal";
import styles from "./Manifesto.module.css";

/** Ported from wolf-casa-homepage-v3.html <section class="manifesto"> (~line 482).
 *
 * The three principles used to be a static row of <article>s a visitor took in
 * at a glance and scrolled past. They are the doctrine — the reason the rest of
 * the site exists — so they now get the scroll distance to match: each takes
 * the viewport, highlights as it becomes active, and cross-fades the room
 * imagery beside it. Every word of the original copy is unchanged.
 */

// Imagery is paired to the principle it argues rather than being decorative:
// daylight for Light, the material board for Material, and the fully resolved
// room for Composition. The first two were already in this section; the
// material board is the one addition, because Material had no image of its own.
const PRINCIPLES: StickyItem[] = [
  {
    id: "light",
    label: "01 / Light",
    body: "Every room begins with the way daylight arrives and where it rests.",
    image: "/images/editorial/light-form-atrium.webp",
    alt: "Sunlight crossing a composed interior of wood and stone",
  },
  {
    id: "material",
    label: "02 / Material",
    body: "Stone, timber and textile are selected for tactility, not spectacle.",
    image: "/images/editorial/materials.webp",
    alt: "Stone, timber and textile samples laid out as a material board",
  },
  {
    id: "composition",
    label: "03 / Composition",
    body: "Seating, joinery, lighting, stone and greenery, resolved as one decision.",
    image: "/images/showroom/dining-room-mirrorwall.webp",
    alt: "A composed dining room with a mirrored feature wall",
  },
];

export function Manifesto() {
  const { ref, inView } = useReveal<HTMLElement>();

  return (
    <section id="manifesto" ref={ref} className={`${styles.manifesto} reveal ${inView ? "in" : ""}`}>
      <div className="curtain" />
      <span className={styles.num}>What we actually do</span>

      {/* Left in Cormorant deliberately. The hero already sets this exact
          sentence as kinetic display type under the lamp; running the same
          words through the same proximity effect a second time would spend the
          trick twice. Here it is the quiet restatement the doctrine hangs off. */}
      <h2 className={styles.heading}>
        A room is not furnished.
        <br />
        <span className="upright">It is</span> <em>composed.</em>
      </h2>

      {/* The measure and indent live on a wrapper this file owns rather than
          being passed into StickyScrollReveal's className. Both classes land on
          the same element there, at equal specificity, so which one wins any
          shared property depends on CSS-module bundle order — which is not
          something to bet the section's layout on. */}
      <div className={styles.doctrine}>
        <StickyScrollReveal items={PRINCIPLES} />
      </div>
    </section>
  );
}
