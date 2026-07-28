"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Sojourn.module.css";

const STEPS = [
  {
    label: "Material Audit",
    meta: "01 / Before buying",
    title: "Start with what the room is missing.",
    body: "We read light, scale, storage, circulation and existing pieces before suggesting furniture or finishes.",
    image: "/images/showroom/living-room-sectional.webp",
  },
  {
    label: "Sourcing Edit",
    meta: "02 / Furniture + objects",
    title: "Choose fewer, better pieces.",
    body: "Furniture, lighting, beds, dining and accessories are edited into one composition rather than bought as separate objects.",
    image: "/images/showroom/dining-set-black-gold.webp",
  },
  {
    label: "Material Library",
    meta: "03 / Wood + marble",
    title: "Touch the form before it enters the home.",
    body: "Wood, marble, stone, textile, metal and finishes are compared by grain, reflection, warmth and ageing.",
    image: "/images/editorial/materials.png",
  },
  {
    label: "Home Install",
    meta: "04 / Final composition",
    title: "Bring the mall into the house, calmly.",
    body: "The final room is planned through placement, styling, installation sequence and the small pauses that make it feel lived in.",
    image: "/images/showroom/bedroom-suite-warm.webp",
  },
] as const;

const DEPARTMENTS = [
  { title: "Furniture Gallery", detail: "Sofas, beds, dining, lounge chairs, consoles and accents." },
  { title: "Material Bar", detail: "Wood, marble, stone, metal, textile and finish consultations." },
  { title: "Room Planning", detail: "Floor-plan thinking for living, bedrooms, kitchens, baths and terraces." },
  { title: "Architect Hub", detail: "Support for architects, designers and whole-home projects." },
];

export function Sojourn() {
  const [active, setActive] = useState(0);
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();
  const step = STEPS[active];

  return (
    <section className={styles.section} id="sojourn">
      <div ref={ref} className={`${styles.header} reveal ${inView ? "in" : ""}`}>
        <p className={styles.eyebrow}>§ 07 — How A Room Gets Made</p>
        <h2>
          Source the home as a
          <span> complete composition.</span>
        </h2>
        <p>
          Wolf Casa brings furniture, material selection, room planning and sourcing into one considered process, so each decision belongs to the same home.
        </p>
      </div>

      <div className={styles.composer}>
        <div className={styles.steps} role="tablist" aria-label="Casa Sojourn steps">
          {STEPS.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={index === active ? styles.activeStep : ""}
              onClick={() => setActive(index)}
              onMouseEnter={() => setCursor("hover", "View")}
              onMouseLeave={resetCursor}
            >
              <span>{item.meta}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>

        <article className={styles.feature}>
          <div className={styles.imageWrap}>
            <Image src={step.image} alt={step.title} fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div className={styles.featureCopy}>
            <span>{step.meta}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <Link
              href="/experiences/furniture-tourism"
              onMouseEnter={() => setCursor("hover", "Enter")}
              onMouseLeave={resetCursor}
            >
              Plan Casa Sojourn
            </Link>
          </div>
        </article>
      </div>

      <div className={styles.departments} aria-label="Wolf Casa departments">
        {DEPARTMENTS.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
