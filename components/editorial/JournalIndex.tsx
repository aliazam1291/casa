"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { JOURNAL_ARTICLES } from "@/lib/journal";
import styles from "./JournalIndex.module.css";

const CATEGORIES = ["Compositions", "The Wolf Way", "Material Intelligence", "Room Rituals", "Walkthroughs"];

const ARTICLES = JOURNAL_ARTICLES.map((a, i) => ({
  tag: `${String(i + 1).padStart(2, "0")} · ${a.category}`,
  title: a.title,
  href: `/journal/${a.slug}`,
  img: a.image,
  imageAlt: a.imageAlt,
  lead: i === 0,
}));

const SEASONS = [
  { tag: "01", title: "Monsoon Layer" },
  { tag: "02", title: "Winter Den" },
  { tag: "03", title: "Guest Room Season" },
  { tag: "04", title: "Festival of Form" },
  { tag: "05", title: "Sunday Room Edit" },
];

export function JournalIndex() {
  const { setCursor, resetCursor } = useCursor();
  const { ref: seasonRef, inView: seasonIn } = useReveal<HTMLDivElement>();
  const lead = ARTICLES.find((a) => a.lead)!;
  const minor = ARTICLES.filter((a) => !a.lead);

  return (
    <main className={styles.page}>
      <section className={styles.masthead}>
        <p className={styles.kicker}>Wolf Casa / The Journal</p>
        <h1>The Journal.</h1>
        <p>
          Every post teaches the room. No catalogue spam — each piece earns attention by explaining why a space works,
          then names the season it belongs to.
        </p>
      </section>

      <nav className={styles.categories} aria-label="Journal categories">
        {CATEGORIES.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </nav>

      <section className={styles.grid} aria-label="Latest stories">
        <Link
          href={lead.href}
          className={`${styles.lead} ${styles.card}`}
          onMouseEnter={() => setCursor("hover", "Read")}
          onMouseLeave={resetCursor}
        >
          <div className={styles.thumb}>
            <Image src={lead.img} alt={lead.imageAlt} fill sizes="(max-width: 1000px) 100vw, 56vw" />
          </div>
          <div className={styles.copy}>
            <span>{lead.tag}</span>
            <h2>{lead.title}</h2>
          </div>
        </Link>
        {minor.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`${styles.minor} ${styles.card}`}
            onMouseEnter={() => setCursor("hover", "Read")}
            onMouseLeave={resetCursor}
          >
            <div className={styles.thumb}>
              <Image src={a.img} alt={a.imageAlt} fill sizes="(max-width: 1000px) 100vw, 44vw" />
            </div>
            <div className={styles.copy}>
              <span>{a.tag}</span>
              <h3>{a.title}</h3>
            </div>
          </Link>
        ))}
      </section>

      <section className={styles.seasonal}>
        <div ref={seasonRef} className={`reveal ${seasonIn ? "in" : ""}`}>
          <p className={styles.sectionLabel}>Seasonal IP</p>
          <h2>A calendar of composed rooms.</h2>
        </div>
        <div className={styles.seasonRow}>
          {SEASONS.map((s) => (
            <article key={s.tag}>
              <span>{s.tag}</span>
              <strong>{s.title}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.note}>
        <p>Notice before you acquire. Taste is a practice — a home can be edited slowly.</p>
        <Link href="/journal/why-light-is-the-material" onMouseEnter={() => setCursor("hover", "Read")} onMouseLeave={resetCursor}>
          Read the latest story
        </Link>
      </section>
    </main>
  );
}
