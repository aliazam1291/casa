"use client";

import Image from "next/image";
import { useState } from "react";
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
export function CompositionExhibit() {
  const [active, setActive] = useState(0);
  const { setCursor, resetCursor } = useCursor();
  const composition = COMPOSITIONS[active];
  const next = () => setActive((i) => (i + 1) % COMPOSITIONS.length);

  return (
    <section className={styles.exhibit} id={composition.slug}>
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
            onClick={() => setActive(i)}
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
