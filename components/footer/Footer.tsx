"use client";

import Link from "next/link";
import { HoverItem, Magnetic } from "@/components/cursor/HoverItem";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Footer.module.css";

const COLUMNS = [
  {
    title: "The House",
    links: [
      { label: "Way of Light & Form", href: "/way-of-light-form" },
      { label: "The Wolf Way", href: "/the-wolf-way" },
      { label: "The House", href: "/the-house" },
      { label: "Trade Desk", href: "/trade" },
    ],
  },
  {
    title: "Experiences",
    links: [
      { label: "Consultation", href: "/experiences/consultation" },
      { label: "Casa Sojourn", href: "/experiences/furniture-tourism" },
      { label: "Materials Library", href: "/experiences/materials-library" },
      { label: "All Experiences", href: "/experiences" },
    ],
  },
  {
    title: "Visit",
    links: [
      { label: "Indore Showroom", href: "/visit" },
      { label: "The Journal", href: "/journal" },
      { label: "Contact", href: "/visit" },
      { label: "Book a Consultation", href: "/experiences/consultation" },
    ],
  },
];

/** Ported from wolf-casa-homepage-v3.html <footer> (~line 586). */
export function Footer() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div ref={ref} className={`${styles.hero} reveal ${inView ? "in" : ""}`}>
          <em>Homes</em> <span className="upright">with</span>
          <br />
          <em>Quiet</em> <span className="upright">Signatures.</span>
        </div>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.wordmark}>Wolf Casa</div>
            <p>Modern Indian living, carefully composed. Indore, Central India — 2011 to now.</p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              {col.links.map((link) => (
                <HoverItem key={link.label} as="span" cursorLabel="→">
                  <Link href={link.href}>
                    <Magnetic>{link.label}</Magnetic>
                  </Link>
                </HoverItem>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <span>© 2026 — Wolf Casa</span>
          <span>Way of Light & Form — Vol. I</span>
        </div>
      </div>
    </footer>
  );
}
