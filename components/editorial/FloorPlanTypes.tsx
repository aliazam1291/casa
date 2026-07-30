"use client";

import { useState } from "react";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { COMPOSITIONS_BY_SLUG } from "@/lib/compositions";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./FloorPlanTypes.module.css";

/**
 * A room in the plan drawing. Coordinates are in a 100 × 62 viewBox so the
 * plans stay comparable to each other — a 2 BHK is visibly smaller than a
 * villa because its rectangles are smaller, not because the drawing is scaled.
 */
type PlanRoom = { x: number; y: number; w: number; h: number; label: string; anchor?: boolean };

type PlanType = {
  slug: string;
  /** Italian, like the pieces — see the naming note in lib/pieces.ts. */
  name: string;
  /** The spec a customer in Indore actually searches for. Never translated. */
  spec: string;
  area: string;
  blurb: string;
  /** Where the composition starts. The book's second principle: one anchor. */
  anchor: string;
  compositions: string[];
  lead: string;
  tone: string;
  rooms: PlanRoom[];
};

/**
 * THE PLAN TYPES — which homes the Wolf Way is applied to.
 *
 * The site described the method and the thirteen rooms of one villa, and never
 * said what happens when the customer lives in a 3 BHK, which is most of them.
 * These five are the plan types the Indore floor actually quotes against.
 *
 * BHK STAYS IN ENGLISH/LOCAL. The pieces take Italian and German names because
 * they are products; "3 BHK" is a specification and the single most-searched
 * term in Indian residential interiors. Translating it would be brand language
 * defeating its own purpose — so each plan gets an Italian name AND keeps the
 * spec, the same pattern as a piece and its subtitle.
 *
 * The areas and lead times are planning ranges for the composition work, not
 * quotations — the CTA goes to a consultation for exactly that reason.
 */
const PLANS: PlanType[] = [
  {
    slug: "primo",
    name: "Primo",
    spec: "2 BHK",
    area: "650 – 900 sq ft",
    blurb:
      "The first room. One composition done completely beats four done partially, so this plan resolves the living room whole and leaves the rest deliberately bare until it can be composed properly.",
    anchor: "The living room",
    compositions: ["luxe-minimal", "nocturne"],
    lead: "4 – 6 weeks",
    tone: "#c9bda6",
    rooms: [
      { x: 6, y: 8, w: 34, h: 30, label: "Living", anchor: true },
      { x: 42, y: 8, w: 20, h: 18, label: "Kitchen" },
      { x: 42, y: 28, w: 20, h: 10, label: "Bath" },
      { x: 6, y: 40, w: 26, h: 16, label: "Bed 1" },
      { x: 34, y: 40, w: 28, h: 16, label: "Bed 2" },
    ],
  },
  {
    slug: "casa-media",
    name: "Casa Media",
    spec: "3 BHK",
    area: "1,100 – 1,600 sq ft",
    blurb:
      "The commonest plan we compose, and the one where the mistake is always the same: five rooms styled to five different ideas. One mood carries the shared floor, and the bedrooms are allowed to differ from it — not from each other.",
    anchor: "The living–dining run",
    compositions: ["golden-hour", "terra-form", "monochrome"],
    lead: "6 – 9 weeks",
    tone: "#c9a87e",
    rooms: [
      { x: 5, y: 7, w: 32, h: 26, label: "Living", anchor: true },
      { x: 39, y: 7, w: 24, h: 26, label: "Dining", anchor: true },
      { x: 65, y: 7, w: 18, h: 14, label: "Kitchen" },
      { x: 65, y: 23, w: 18, h: 10, label: "Utility" },
      { x: 5, y: 35, w: 26, h: 20, label: "Master" },
      { x: 33, y: 35, w: 24, h: 20, label: "Bed 2" },
      { x: 59, y: 35, w: 24, h: 20, label: "Bed 3" },
    ],
  },
  {
    slug: "casa-grande",
    name: "Casa Grande",
    spec: "4 BHK",
    area: "1,800 – 2,600 sq ft",
    blurb:
      "Enough floor that the composition needs a hierarchy: one room that commands, one that hosts, and two that recede. Without that ranking a large flat reads as a hotel corridor with furniture either side.",
    anchor: "The formal living room",
    compositions: ["artisan-layer", "monochrome", "luxe-minimal"],
    lead: "9 – 14 weeks",
    tone: "#a78657",
    rooms: [
      { x: 4, y: 6, w: 30, h: 24, label: "Formal living", anchor: true },
      { x: 36, y: 6, w: 22, h: 24, label: "Family" },
      { x: 60, y: 6, w: 22, h: 14, label: "Dining" },
      { x: 84, y: 6, w: 12, h: 14, label: "Kit." },
      { x: 60, y: 22, w: 36, h: 8, label: "Foyer" },
      { x: 4, y: 32, w: 24, h: 22, label: "Master" },
      { x: 30, y: 32, w: 22, h: 22, label: "Bed 2" },
      { x: 54, y: 32, w: 20, h: 22, label: "Bed 3" },
      { x: 76, y: 32, w: 20, h: 22, label: "Bed 4" },
    ],
  },
  {
    slug: "duplice",
    name: "Duplice",
    spec: "Duplex / Villa",
    area: "3,000 – 5,000 sq ft",
    blurb:
      "Two floors, so light changes twice and the composition has to change with it. The lower floor is composed for company and the upper for withdrawal — the villa on this site is a Duplice, and its thirteen rooms are what that looks like resolved.",
    anchor: "The double-height atrium",
    compositions: ["urban-oasis", "terra-form", "forest-silence"],
    lead: "14 – 22 weeks",
    tone: "#7d9682",
    rooms: [
      { x: 4, y: 4, w: 40, h: 24, label: "Atrium living", anchor: true },
      { x: 46, y: 4, w: 26, h: 14, label: "Dining" },
      { x: 74, y: 4, w: 22, h: 14, label: "Kitchen" },
      { x: 46, y: 20, w: 50, h: 8, label: "Courtyard" },
      { x: 4, y: 32, w: 28, h: 12, label: "Study" },
      { x: 34, y: 32, w: 30, h: 12, label: "Master suite" },
      { x: 66, y: 32, w: 30, h: 12, label: "Bed 2 / 3" },
      { x: 4, y: 46, w: 44, h: 10, label: "Cellar" },
      { x: 50, y: 46, w: 46, h: 10, label: "Material vault" },
    ],
  },
  {
    slug: "attico",
    name: "Attico",
    spec: "Penthouse",
    area: "2,400 sq ft and up",
    blurb:
      "Glass on more than two sides, which means the room is lit differently every hour and cannot be composed for one of them. The furniture is placed for the view it frames rather than the wall it sits against, and the terrace is treated as a room, not a balcony.",
    anchor: "The skyline salon",
    compositions: ["nocturne", "golden-hour", "monochrome"],
    lead: "12 – 20 weeks",
    tone: "#c98a5e",
    rooms: [
      { x: 6, y: 6, w: 44, h: 28, label: "Skyline salon", anchor: true },
      { x: 52, y: 6, w: 26, h: 16, label: "Dining" },
      { x: 80, y: 6, w: 14, h: 16, label: "Bar" },
      { x: 52, y: 24, w: 42, h: 10, label: "Kitchen" },
      { x: 6, y: 36, w: 30, h: 18, label: "Master" },
      { x: 38, y: 36, w: 24, h: 18, label: "Guest" },
      { x: 64, y: 36, w: 30, h: 18, label: "Terrace" },
    ],
  },
];

/** The plan drawing. Registration ticks and a hairline grid, per §GL. */
function PlanDrawing({ plan }: { plan: PlanType }) {
  return (
    <svg
      className={styles.drawing}
      viewBox="0 0 100 62"
      role="img"
      aria-label={`Indicative plan for the ${plan.name} — ${plan.spec}: ${plan.rooms
        .map((r) => r.label)
        .join(", ")}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id={`grid-${plan.slug}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M4 0H0v4" fill="none" stroke="currentColor" strokeWidth="0.15" opacity="0.25" />
        </pattern>
      </defs>
      <rect width="100" height="62" fill={`url(#grid-${plan.slug})`} />
      {plan.rooms.map((room) => (
        <g key={room.label} className={room.anchor ? styles.roomAnchor : styles.room}>
          <rect x={room.x} y={room.y} width={room.w} height={room.h} />
          <text x={room.x + 2} y={room.y + 5.4}>
            {room.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function FloorPlanTypes() {
  const [active, setActive] = useState(PLANS[0].slug);
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();
  const plan = PLANS.find((p) => p.slug === active) ?? PLANS[0];

  return (
    <section
      className={styles.section}
      id="plan-types"
      style={{ "--plan-tone": plan.tone } as React.CSSProperties}
    >
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.label}>The Wolf Way / Applied</span>
        <h2>
          Five plans. <em>The same method.</em>
        </h2>
        <p>
          The thirteen rooms above are one villa. Most homes are not. These are the plan types the method
          is quoted against — pick yours and see where the composition starts.
        </p>
      </div>

      <Tabs.Root value={active} onValueChange={setActive} activationMode="automatic" className={styles.body}>
        <Tabs.List className={styles.rail} aria-label="Plan types">
          {PLANS.map((p, i) => (
            <Tabs.Trigger
              key={p.slug}
              value={p.slug}
              className={styles.railItem}
              style={{ "--item-tone": p.tone } as React.CSSProperties}
              onMouseEnter={() => setCursor("hover", p.spec)}
              onMouseLeave={resetCursor}
            >
              <span className={styles.railNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.railName}>{p.name}</span>
              <span className={styles.railSpec}>{p.spec}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value={active} asChild forceMount>
          <div className={styles.panel} key={plan.slug}>
            <div className={styles.drawingWrap}>
              <PlanDrawing plan={plan} />
              <span className={styles.drawingCaption}>
                {plan.spec} · indicative plan · anchor room filled
              </span>
            </div>

            <div className={styles.info}>
              <h3>
                <span lang="it">{plan.name}</span>
                <em>{plan.spec}</em>
              </h3>
              <p className={styles.blurb}>{plan.blurb}</p>

              <dl className={styles.specs}>
                <div>
                  <dt>Typical area</dt>
                  <dd>{plan.area}</dd>
                </div>
                <div>
                  <dt>Rooms composed</dt>
                  <dd>{plan.rooms.length}</dd>
                </div>
                <div>
                  <dt>Anchor</dt>
                  <dd>{plan.anchor}</dd>
                </div>
                <div>
                  <dt>Composition time</dt>
                  <dd>{plan.lead}</dd>
                </div>
              </dl>

              <div className={styles.suits}>
                <span className={styles.suitsLabel}>Composes well as</span>
                <div className={styles.suitsList}>
                  {plan.compositions.map((slug) => {
                    const comp = COMPOSITIONS_BY_SLUG[slug];
                    if (!comp) return null;
                    return (
                      <Link
                        key={slug}
                        href={`#${slug}`}
                        className={styles.suitsChip}
                        onMouseEnter={() => setCursor("hover", comp.name)}
                        onMouseLeave={resetCursor}
                      >
                        {comp.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/experiences/consultation"
                className={styles.cta}
                onMouseEnter={() => setCursor("hover", "Book")}
                onMouseLeave={resetCursor}
              >
                Compose a {plan.spec} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}
