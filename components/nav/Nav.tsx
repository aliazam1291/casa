"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HoverItem, Magnetic } from "@/components/cursor/HoverItem";
import { useStage } from "@/components/stage/StageProvider";
import { WolfMark } from "@/components/brand/WolfMark";
import styles from "./Nav.module.css";

// The crossbar-less A — Brand Book §09/§IC: "We stripped the crossbar so the
// bare apex reads as the wolf's muzzle. The letter becomes the mark." It is the
// book's own motif for the method, so it is what marks The Wolf Way in the nav.
function IconApex() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      <path d="M2.6 13.4 8 2.6l5.4 10.8" />
    </svg>
  );
}
function IconCatalogue() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      <rect x="2.2" y="2.2" width="4.8" height="4.8" /><rect x="9" y="2.2" width="4.8" height="4.8" />
      <rect x="2.2" y="9" width="4.8" height="4.8" /><rect x="9" y="9" width="4.8" height="4.8" />
    </svg>
  );
}
function IconJournal() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      <path d="M3 2.8h10v10.4H5.4a2.4 2.4 0 0 1-2.4-2.4V2.8Z" /><path d="M5.6 5.6h5M5.6 8.2h5M5.6 10.8h3" />
    </svg>
  );
}
function IconVisit() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      <path d="M8 14s4.6-4.2 4.6-7.6A4.6 4.6 0 0 0 3.4 6.4C3.4 9.8 8 14 8 14Z" />
      <circle cx="8" cy="6.4" r="1.5" />
    </svg>
  );
}

// "Rooms" and "The House" were separate entries pointing at two pages that
// have since merged into /the-house-and-rooms.
//
// "All Pieces" and "By Category" were two routes onto the same 38 photographs
// in the same grid, and the category tree behind the second was invented. Both
// are now one destination: /shop, the book's "Interio Mall".
//
// THE WOLF WAY TAKES THE "ROOMS" SLOT. It is the book's own name for the
// method — one of the five phrases §02 lists as language Wolf Casa owns, and
// §10 files under IP alongside The Interio Mall and Composed Living — and it
// had a full page with no way to reach it. "Rooms" was a generic furniture-site
// word sitting in front of it. Wolf_Casa_Website_IA.md §2 lists no Rooms entry
// either: The Wolf Way *is* the browse section in that plan.
//
// /the-house-and-rooms is not orphaned by this — it is the first link out of
// The Wolf Way's closing section, it is in two footer columns, and /shop's
// index links every one of the thirteen rooms individually.
const LINKS = [
  { href: "/the-wolf-way", label: "The Wolf Way", cursor: "Enter", Icon: IconApex },
  { href: "/shop", label: "Shop", cursor: "Enter", Icon: IconCatalogue },
  { href: "/journal", label: "Journal", cursor: "Read", Icon: IconJournal },
  { href: "/visit", label: "Visit", cursor: "Visit", Icon: IconVisit },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { activeColor } = useStage();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

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
        <Link href="/" className={styles.wordmark} onClick={() => setMenuOpen(false)}>
          <WolfMark className={styles.wordmarkIcon} />
          Wolf Casa
        </Link>
        <div className={styles.links}>
          {LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <HoverItem key={link.href} as="span" cursorLabel={link.cursor}>
                <Link href={link.href} className={active ? styles.linkActive : ""} aria-current={active ? "page" : undefined}>
                  <link.Icon />
                  <Magnetic>{link.label}</Magnetic>
                </Link>
              </HoverItem>
            );
          })}
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
          {LINKS.map((link, index) => {
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href} className={active ? styles.linkActive : ""} aria-current={active ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.mobileLinkLabel}><link.Icon />{link.label}</span>
                <i>↗</i>
              </Link>
            );
          })}
        </div>
        <Link href="/experiences/consultation" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>Begin a consultation <span>→</span></Link>
      </div>
    </nav>
  );
}
