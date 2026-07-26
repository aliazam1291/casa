"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Journal.module.css";

const ARTICLES = [
  {
    num: "01 · Way of Light",
    title: "Why light is the material you never pay for.",
    href: "/journal/why-light-is-the-material",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    num: "02 · Material Intelligence",
    title: "Reading stone, wood and leather as evidence.",
    href: "/journal/reading-stone-wood-leather",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
  },
  {
    num: "03 · The Signature Reveal",
    title: "Inside a completed home, Indore, 2026.",
    href: "/journal/the-chair-you-return-to",
    img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85",
  },
];

/** Ported from wolf-casa-homepage-v3.html <section class="journal"> (~line 559). */
export function Journal() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const { setCursor, resetCursor } = useCursor();

  return (
    <section className={styles.journal} id="journal">
      <div className={styles.inner}>
        <div ref={ref} className={`${styles.head} reveal ${inView ? "in" : ""}`}>
          <h2 className={styles.heading}>
            <span className="upright">The</span> <em>Journal.</em>
          </h2>
          <div className={styles.meta}>
            § 06
            <br />
            Teaching taste,
            <br />
            before selling product
          </div>
        </div>
        <div className={styles.grid}>
          {ARTICLES.map((a) => (
            <Link
              key={a.num}
              href={a.href}
              className={styles.item}
              onMouseEnter={() => setCursor("hover", "Read")}
              onMouseLeave={resetCursor}
            >
              <div className={styles.thumb}>
                <Image
                  src={a.img}
                  alt={a.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
              <span className={styles.num}>{a.num}</span>
              <h3 className={styles.title}>{a.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
