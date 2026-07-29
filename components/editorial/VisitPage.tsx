"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { useTilt } from "@/hooks/useTilt";
import { CONTACT, contactMapUrl } from "@/lib/contact";
import styles from "./VisitPage.module.css";

const OPTIONS = [
  { tag: "Indore", title: "The experience showroom", body: "Walk through fully composed rooms and see how materials change with the light.", href: "/the-wolf-way" },
  { tag: "By appointment", title: "Bring your plans", body: "Book time with a curator to talk through a room, a renovation or a whole house.", href: "/experiences/consultation" },
  { tag: "For professionals", title: "Visit the Architect Hub", body: "Arrange samples, drawings and project support in one conversation.", href: "/architects" },
  { tag: "Directions", title: CONTACT.region, body: "Full directions and appointment windows shared on request.", href: "/experiences/consultation" },
];

const JOURNEY = [
  { num: "01", label: "Discover", detail: "You find Wolf Casa the way we sell — by the room, not the object." },
  { num: "02", label: "Explore Site", detail: "Rooms, not products, as the entry point — the composed catalogue, browsed." },
  { num: "03", label: "WhatsApp", detail: "The showroom, in a thread — ask a question before you arrive." },
  { num: "04", label: "Book Visit", detail: "A curator's time reserved, against your own room and plan." },
  { num: "05", label: "Arrive", detail: "Walk the compositions in person. The room does the rest of the selling." },
];

function OptionCard({ item }: { item: (typeof OPTIONS)[number] }) {
  const { setCursor, resetCursor } = useCursor();
  const { ref, onPointerMove, onPointerLeave } = useTilt<HTMLAnchorElement>(6);
  return (
    <Link
      ref={ref}
      href={item.href}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        onPointerLeave();
        resetCursor();
      }}
      onMouseEnter={() => setCursor("hover", "Go")}
    >
      <span>{item.tag}</span>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </Link>
  );
}

export function VisitPage() {
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { ref: journeyRef, inView: journeyIn } = useReveal<HTMLDivElement>();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/light-form-atrium.webp"
          alt="Warmly lit residence with stone, wood and crafted interiors"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>Visit the House</p>
          <h1>Start in the room.</h1>
          <p>The showroom is designed for lingering. Come with a plan, a question, a room that is not yet right, or simply a curiosity about material.</p>
        </div>
      </section>

      <section className={styles.address} aria-label="Showroom address">
        <div>
          <span className={styles.sectionLabel}>{CONTACT.showroom.name}</span>
          <p>{CONTACT.showroom.line1}, {CONTACT.showroom.line2}</p>
          <p>{CONTACT.showroom.size} · {CONTACT.hours}</p>
          {CONTACT.phone && <p>{CONTACT.phone}</p>}
        </div>
        <div className={styles.addressActions}>
          {CONTACT.phone && (
            <a href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`} onMouseEnter={() => setCursor("hover", "Call")} onMouseLeave={resetCursor}>
              Call the showroom <span aria-hidden>→</span>
            </a>
          )}
          <a href={contactMapUrl()} target="_blank" rel="noreferrer" onMouseEnter={() => setCursor("hover", "Map")} onMouseLeave={resetCursor}>
            Get directions <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      <section className={styles.language}>
        <div ref={ref} className={`reveal ${inView ? "in" : ""}`}>
          <p className={styles.sectionLabel}>Sales Language</p>
          <h2>Sell the room, not the sofa.</h2>
        </div>
        <div className={styles.compare}>
          <article>
            <span>The Old Way</span>
            <p>&ldquo;This sofa comes in three fabrics and two sizes.&rdquo;</p>
          </article>
          <article className={styles.wolfWay}>
            <span>The Wolf Casa Way</span>
            <p>&ldquo;This sofa anchors the room. With the rug, the low light and the stone table, it becomes an evening you&rsquo;ll want to come home to.&rdquo;</p>
          </article>
        </div>
      </section>

      {/* The path in — an interactive route, walked step by step */}
      <section className={styles.journey} aria-label="How a visit unfolds">
        <div ref={journeyRef} className={`reveal ${journeyIn ? "in" : ""}`}>
          <p className={styles.sectionLabel}>The Path In</p>
          <h2>Five steps, from a screen to the room.</h2>
        </div>
        <div className={styles.track} role="tablist" aria-label="Visit steps">
          {JOURNEY.map((step, i) => (
            <button
              key={step.num}
              type="button"
              role="tab"
              aria-selected={i === activeStep}
              className={`${styles.step} ${i === activeStep ? styles.stepActive : ""}`}
              onClick={() => setActiveStep(i)}
              onMouseEnter={() => setCursor("hover", step.label)}
              onMouseLeave={resetCursor}
            >
              <span className={styles.stepNum}>{step.num}</span>
              <span className={styles.stepLabel}>{step.label}</span>
            </button>
          ))}
        </div>
        <p className={styles.stepDetail} key={activeStep}>
          {JOURNEY[activeStep].detail}
        </p>
      </section>

      <section className={styles.options} aria-label="Ways to visit">
        {OPTIONS.map((item) => (
          <OptionCard key={item.tag} item={item} />
        ))}
      </section>

      <section className={styles.note}>
        <p>A room is easier to understand in person. Bring the questions that matter.</p>
        <Link href="/experiences/consultation" onMouseEnter={() => setCursor("hover", "Book")} onMouseLeave={resetCursor}>
          Arrange a showroom visit
        </Link>
      </section>
    </main>
  );
}
