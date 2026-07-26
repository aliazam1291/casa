"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HoverItem, Magnetic } from "@/components/cursor/HoverItem";
import { useStage } from "@/components/stage/StageProvider";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "/way-of-light-form", label: "The Way", cursor: "Read" },
  { href: "/the-wolf-way", label: "Worlds", cursor: "Enter" },
  { href: "/experiences", label: "Experiences", cursor: "Enter" },
  { href: "/journal", label: "Journal", cursor: "Read" },
  { href: "/visit", label: "Visit", cursor: "Visit" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { activeColor } = useStage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Only settle into the solid/normal-blend state once scrolled AND the
  // page is on the dark stage — over the cream diorama, difference-blend
  // must stay on or the nav becomes unreadable (off-white on cream).
  const solid = scrolled && activeColor === "dark";

  return (
    <nav className={`${styles.nav} ${solid ? styles.solid : ""} ${menuOpen ? styles.menuOpen : ""}`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.wordmark} onClick={() => setMenuOpen(false)}>Wolf Casa</Link>
        <div className={styles.links}>
          {LINKS.map((link) => (
            <HoverItem key={link.href} as="span" cursorLabel={link.cursor}>
              <Link href={link.href}>
                <Magnetic>{link.label}</Magnetic>
              </Link>
            </HoverItem>
          ))}
        </div>
        <HoverItem as="span" cursorLabel="Book">
          <Link href="/experiences/consultation" className={styles.cta}>
            <Magnetic>Consultation</Magnetic>
          </Link>
        </HoverItem>
        <button type="button" className={styles.menuToggle} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>
      </div>
      <div id="mobile-navigation" className={styles.mobilePanel} aria-hidden={!menuOpen}>
        <span className={styles.mobileKicker}>Wolf Casa / Navigation</span>
        <div className={styles.mobileLinks}>
          {LINKS.map((link, index) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              <span>{String(index + 1).padStart(2, "0")}</span>{link.label}<i>↗</i>
            </Link>
          ))}
        </div>
        <Link href="/experiences/consultation" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>Begin a consultation <span>→</span></Link>
      </div>
    </nav>
  );
}
