"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { JOURNAL_ARTICLES } from "@/lib/journal";
import styles from "./Journal.module.css";

const ARTICLES = JOURNAL_ARTICLES.map((a, i) => ({
  num: `${String(i + 1).padStart(2, "0")} · ${a.category}`,
  title: a.title,
  href: `/journal/${a.slug}`,
  img: a.image,
  imageAlt: a.imageAlt,
}));

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
            § 08
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
                  alt={a.imageAlt}
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
