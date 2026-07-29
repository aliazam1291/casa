"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { ConsultationDialog } from "@/components/consultation/ConsultationDialog";
import styles from "./ConsultationPage.module.css";

const STAGES = [
  { tag: "Before", title: "Bring the evidence", body: "Plans, pictures, material samples and honest notes about what is not working." },
  { tag: "During", title: "Read the proportions", body: "We map light, circulation, rituals and the objects already worth keeping." },
  { tag: "After", title: "Receive a direction", body: "Leave with a clear next step, material direction and a considered shortlist." },
  { tag: "Next", title: "Add the composition", body: "Before the number — value is argued through the room, not the price tag." },
];

export function ConsultationPage() {
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/light-form-atrium.webp"
          alt="A refined home interior with shadows, wood and marble"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>Signature Consultation</p>
          <h1>The room audit.</h1>
        </div>
      </section>

      <section className={styles.problem}>
        <p>Customers do not struggle to buy furniture. They struggle to imagine completion.</p>
        <p>
          They walk in looking for certainty, not wood and fabric. Wolf Casa removes the doubt by showing the finished
          room — so the decision is felt, not calculated.
        </p>
      </section>

      <section className={styles.timeline}>
        <div ref={ref} className={`reveal ${inView ? "in" : ""}`}>
          <p className={styles.sectionLabel}>The Room Audit / Four Stages</p>
        </div>
        <div className={styles.stages}>
          {STAGES.map((s) => (
            <div key={s.tag} className={styles.stage}>
              <span>{s.tag}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.cta} leather`}>
        <p>There are no generic solutions. Good decisions make a room feel quieter.</p>
        <div className={styles.ctaActions}>
          <ConsultationDialog>
            <button
              type="button"
              className={styles.ctaPrimary}
              onMouseEnter={() => setCursor("hover", "Book")}
              onMouseLeave={resetCursor}
            >
              Book the room audit
            </button>
          </ConsultationDialog>
          <Link href="/visit" onMouseEnter={() => setCursor("hover", "Plan")} onMouseLeave={resetCursor}>
            Plan your visit
          </Link>
        </div>
      </section>
    </main>
  );
}
