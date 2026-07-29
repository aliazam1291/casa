"use client";

import Link from "next/link";
import { HoverItem, Magnetic } from "@/components/cursor/HoverItem";
import { useReveal } from "@/hooks/useReveal";
import { CONTACT, contactMapUrl } from "@/lib/contact";
import styles from "./Footer.module.css";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "House & Rooms", href: "/the-house-and-rooms" },
      { label: "Catalogue", href: "/catalogue" },
      { label: "All Products", href: "/products" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    title: "The House",
    links: [
      { label: "Way of Light & Form", href: "/way-of-light-form" },
      { label: "The Wolf Way", href: "/the-wolf-way" },
      { label: "The House", href: "/the-house-and-rooms" },
      { label: "Architect Hub", href: "/architects" },
    ],
  },
  {
    title: "Visit",
    links: [
      { label: "Indore Showroom", href: "/visit" },
      { label: "Book a Consultation", href: "/experiences/consultation" },
      { label: "Get Directions", href: contactMapUrl() },
      { label: "All Experiences", href: "/experiences" },
    ],
  },
];

/** Ported from wolf-casa-homepage-v3.html <footer> (~line 586). */
export function Footer() {
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <footer className={`${styles.footer} leather`}>
      <div className={styles.inner}>
        <div ref={ref} className={`${styles.hero} reveal ${inView ? "in" : ""}`}>
          <em>Homes</em> <span className="upright">with</span>
          <br />
          <em>Quiet</em> <span className="upright">Signatures.</span>
        </div>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.wordmark}>Wolf Casa</div>
            <p>Modern Indian living, carefully composed. Indore &amp; Dewas — since {CONTACT.founded}.</p>
            <p className={styles.address}>
              {CONTACT.showroom.line1}, {CONTACT.showroom.line2}
            </p>
            {CONTACT.phone && (
              <a href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`} className={styles.address}>
                {CONTACT.phone}
              </a>
            )}
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
          <span>© {new Date().getFullYear()} — Wolf Casa</span>
          <span>Way of Light & Form — Vol. I</span>
        </div>
      </div>
    </footer>
  );
}
