"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { COMPOSITIONS, type Composition, type TimeOfDay } from "@/lib/compositions";
import { useCursor } from "@/components/cursor/CursorProvider";
import styles from "./CompositionExhibit.module.css";

// "NOCTURNE" in the reference splits as bright "NOC" + brass "TURNE"; a
// two-word name (e.g. "Golden Hour") splits at the natural word break
// instead of an arbitrary character count.
function splitName(name: string): [string, string] {
  const spaceIndex = name.indexOf(" ");
  if (spaceIndex > -1) return [name.slice(0, spaceIndex), name.slice(spaceIndex + 1)];
  const cut = Math.max(2, Math.round(name.length * 0.4));
  return [name.slice(0, cut), name.slice(cut)];
}

function TimeOfDaySketch({ time }: { time: TimeOfDay }) {
  if (time === "night") {
    return (
      <svg viewBox="0 0 64 40" className={styles.sketchIcon} aria-hidden>
        <line x1="2" y1="34" x2="62" y2="34" />
        <path d="M40 10a11 11 0 1 0 9 17 9 9 0 0 1-9-17Z" />
        <circle cx="14" cy="12" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="22" cy="20" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="10" cy="22" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  const posByTime: Record<Exclude<TimeOfDay, "night">, number> = { dawn: 0.14, midday: 0.5, golden: 0.74, dusk: 0.9 };
  const t = posByTime[time];
  const x = 4 + t * 56;
  const y = 34 - Math.sin(Math.PI * t) * 26;
  return (
    <svg viewBox="0 0 64 40" className={styles.sketchIcon} aria-hidden>
      <line x1="2" y1="34" x2="62" y2="34" />
      <path d="M4 34 Q32 2 60 34" strokeDasharray="1.5 1.5" />
      <circle cx={x} cy={y} r="3.4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const TIME_LABEL: Record<TimeOfDay, string> = {
  dawn: "First light",
  midday: "Full daylight",
  golden: "Golden hour",
  dusk: "Dusk",
  night: "Night",
};

function ExhibitSlide({ composition, index }: { composition: Composition; index: number }) {
  const [bright, rest] = splitName(composition.name);
  const accentHex = `#${composition.accent.toString(16).padStart(6, "0")}`;

  return (
    <div className={styles.frame}>
      <div className={styles.frameImage}>
        <Image src={composition.img} alt={composition.name} fill sizes="(max-width: 1000px) 100vw, 55vw" />
        <span className={styles.imageIndex}>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className={styles.vertical} aria-hidden>
        Composition · {composition.name}
      </div>
      <div className={styles.frameContent}>
        <div className={styles.frameHead}>
          <span className={styles.sectionLabel}>Signature Composition</span>
          <span className={styles.counter}>{String(index + 1).padStart(2, "0")} / 08</span>
        </div>
        <h2 className={styles.splitHeading}>
          <span className={styles.bright}>{bright}</span>
          <span className={styles.accentText} style={{ color: accentHex }}>{rest}</span>
        </h2>
        <p className={styles.blurb}>{composition.blurb}</p>
        <blockquote className={styles.quote} style={{ color: accentHex }}>
          &ldquo;{composition.pullQuote}&rdquo;
        </blockquote>
        <div className={styles.sketchRow}>
          <div className={styles.sketchCell}>
            <TimeOfDaySketch time={composition.timeOfDay} />
            <span>{TIME_LABEL[composition.timeOfDay]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The eight Signature Compositions, presented as an art exhibition rather
 * than a product list — one large frame at a time, a vertical gallery
 * plaque, a split-tone name, and a small sketch strip (floor plan, time of
 * day, materials) instead of more photography we don't have.
 */
// ── THE URL IS THE STATE ─────────────────────────────────────────────────────
// This was `useState(0)` plus an effect that called setActive(indexFromHash())
// on mount — which is a cascading render (React flags it) and, worse, two
// sources of truth for one thing: the hash and the state could disagree, and
// which won depended on render order.
//
// There is only one piece of state here and it already lives in the URL, so
// useSyncExternalStore reads it directly. The server snapshot is 0 because
// there is no hash during SSR; React reconciles on hydration.
//
// The subscription covers `hashchange` AND our own writes: replaceState is
// deliberately silent (see `show`), so nothing would re-render without emit().

/** #golden-hour etc. — the composition named in the URL, or the first. */
function indexFromHash(): number {
  if (typeof window === "undefined") return 0;
  const slug = window.location.hash.replace(/^#/, "");
  const i = COMPOSITIONS.findIndex((c) => c.slug === slug);
  return i < 0 ? 0 : i;
}

const listeners = new Set<() => void>();

function subscribeToHash(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("hashchange", onChange);
  };
}

export function CompositionExhibit() {
  const { setCursor, resetCursor } = useCursor();
  // The section used to carry id={composition.slug}, so only the ACTIVE
  // composition had an anchor — /the-wolf-way#golden-hour resolved to nothing
  // unless Golden Hour happened to be the one on screen. All eight slugs now
  // exist as permanent anchors, and the exhibit follows whichever is named.
  const active = useSyncExternalStore(
    subscribeToHash,
    indexFromHash,
    () => 0
  );
  const composition = COMPOSITIONS[active];

  const show = (i: number) => {
    // replaceState, not a hash assignment: this keeps the URL shareable without
    // pushing a history entry per click or re-triggering anchor scrolling. It
    // also fires no hashchange, which is why we notify subscribers ourselves.
    window.history.replaceState(null, "", `#${COMPOSITIONS[i].slug}`);
    for (const onChange of listeners) onChange();
  };
  const next = () => show((active + 1) % COMPOSITIONS.length);

  return (
    <section
      className={styles.exhibit}
      id="compositions"
      /* Each composition brings its own colour, so the eight stop sharing one
         brass accent and the page actually changes as you move through them. */
      style={
        {
          "--comp-accent": `#${composition.accent.toString(16).padStart(6, "0")}`,
          "--comp-glow": `#${composition.emissive.toString(16).padStart(6, "0")}`,
        } as React.CSSProperties
      }
    >
      {/* Permanent anchor targets — one per composition, all eight always in
          the DOM regardless of which is showing. */}
      {COMPOSITIONS.map((c) => (
        <span key={c.slug} id={c.slug} className={styles.anchor} aria-hidden />
      ))}

      <div className={styles.exhibitHead}>
        <span className={styles.sectionLabel}>Eight Signature Compositions</span>
        <h2>One doctrine, eight named rooms.</h2>
      </div>

      <div className={styles.stage}>
        <ExhibitSlide composition={composition} index={active} />
        <button
          type="button"
          className={styles.nextArrow}
          onClick={next}
          onMouseEnter={() => setCursor("hover", "Next")}
          onMouseLeave={resetCursor}
          aria-label="Next composition"
        >
          <ArrowIcon />
        </button>
      </div>

      <nav className={styles.dots} aria-label="Choose a composition">
        {COMPOSITIONS.map((c, i) => (
          <button
            key={c.slug}
            type="button"
            className={i === active ? styles.dotActive : styles.dot}
            onClick={() => show(i)}
            onMouseEnter={() => setCursor("hover", c.name)}
            onMouseLeave={resetCursor}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {c.name}
          </button>
        ))}
      </nav>
    </section>
  );
}
