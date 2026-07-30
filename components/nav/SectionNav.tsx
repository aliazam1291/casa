"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SectionNav.module.css";

/**
 * A sticky in-page index for long merged pages.
 *
 * /the-house-and-rooms carries two audiences that used to have a URL each: a
 * visitor who wants to see rooms, and one who wants to know who Wolf Casa is.
 * Merging the pages means whichever one goes second is buried under a full
 * screen of the other. This restores direct access to both without splitting
 * the page again — nobody has to scroll through the manifesto to reach a room.
 *
 * The active item is derived from scroll position rather than click, so it
 * stays honest when the visitor scrolls manually or lands on a #hash.
 */
export type SectionNavItem = { id: string; label: string };

export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const targets = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    // rootMargin pins the trigger line just under the sticky bar, so a section
    // becomes active as its heading reaches the bar rather than when it merely
    // enters the viewport from the bottom.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  // Keeps the active chip in view on narrow screens, where the bar scrolls.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const chip = nav.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    chip?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <nav ref={navRef} className={styles.bar} aria-label="On this page">
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={active === item.id ? styles.active : ""}
              aria-current={active === item.id ? "true" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
