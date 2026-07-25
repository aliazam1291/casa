"use client";

import { useEffect, useState } from "react";
import { HoverItem, Magnetic } from "@/components/cursor/HoverItem";
import { useStage } from "@/components/stage/StageProvider";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "#manifesto", label: "The Way", cursor: "Read" },
  { href: "#worlds", label: "Worlds", cursor: "Enter" },
  { href: "#sojourn", label: "Casa Sojourn", cursor: "Enter" },
  { href: "#journal", label: "Journal", cursor: "Read" },
  { href: "/visit", label: "Visit", cursor: "Visit" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { activeColor } = useStage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Only settle into the solid/normal-blend state once scrolled AND the
  // page is on the dark stage — over the cream diorama, difference-blend
  // must stay on or the nav becomes unreadable (off-white on cream).
  const solid = scrolled && activeColor === "dark";

  return (
    <nav className={`${styles.nav} ${solid ? styles.solid : ""}`}>
      <div className={styles.wordmark}>Wolf Casa</div>
      <div className={styles.links}>
        {LINKS.map((link) => (
          <HoverItem key={link.href} as="span" cursorLabel={link.cursor}>
            <a href={link.href}>
              <Magnetic>{link.label}</Magnetic>
            </a>
          </HoverItem>
        ))}
      </div>
      <HoverItem as="span" cursorLabel="Book">
        <a href="/experiences/consultation" className={styles.cta}>
          <Magnetic>Consultation</Magnetic>
        </a>
      </HoverItem>
    </nav>
  );
}
