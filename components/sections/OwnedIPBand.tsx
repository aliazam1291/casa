"use client";

import Link from "next/link";
import { useState } from "react";
import { OWNED_IP } from "@/lib/owned-ip";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./OwnedIPBand.module.css";

/**
 * The five things Wolf Casa owns — Brand Book §10 "Language we own, not rent"
 * and §02 "Words we own".
 *
 * Definitions are near-verbatim from the book (see lib/owned-ip.ts) because
 * these are owned terms; rewording them is how owned language stops being
 * owned.
 *
 * Interactive rather than a static list: one is expanded at a time and the
 * band takes that entry's role colour, so the five read as five distinct
 * things instead of five paragraphs.
 */
const ROLE_TONE: Record<string, string> = {
  Philosophy: "var(--green-light)",
  Category: "var(--saddle-light)",
  Method: "var(--walnut)",
  Promise: "var(--sand)",
  Truth: "var(--gold)",
};

export function OwnedIPBand() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();
  const [open, setOpen] = useState(0);
  const tone = ROLE_TONE[OWNED_IP[open].role] ?? "var(--gold)";

  return (
    <section
      className={styles.band}
      id="what-we-own"
      style={{ "--ip-tone": tone } as React.CSSProperties}
    >
      <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
        <span className={styles.label}>Language we own, not rent</span>
        <h2>
          Five things <em>only we can say.</em>
        </h2>
      </div>

      <div className={styles.list}>
        {OWNED_IP.map((ip, i) => {
          const isOpen = i === open;
          return (
            <article
              key={ip.slug}
              className={`${styles.row} ${isOpen ? styles.rowOpen : ""}`}
              style={{ "--row-tone": ROLE_TONE[ip.role] ?? "var(--gold)" } as React.CSSProperties}
            >
              <button
                type="button"
                className={styles.trigger}
                onClick={() => setOpen(i)}
                onMouseEnter={() => setCursor("hover", ip.role)}
                onMouseLeave={resetCursor}
                aria-expanded={isOpen}
              >
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.role}>{ip.role}</span>
                <span className={styles.name}>{ip.name}</span>
                <span className={styles.mark} aria-hidden>
                  {isOpen ? "—" : "+"}
                </span>
              </button>
              <div className={styles.body} hidden={!isOpen}>
                <p>{ip.meaning}</p>
                {ip.href && (
                  <Link
                    href={ip.href}
                    className={styles.bodyLink}
                    onMouseEnter={() => setCursor("hover", "Open")}
                    onMouseLeave={resetCursor}
                  >
                    See it <span aria-hidden>&rarr;</span>
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className={styles.footnote}>
        The eight named compositions — Nocturne, Terra Form, Luxe Minimal and the rest — are owned too:
        moods a customer can ask for by name.
      </p>
    </section>
  );
}
