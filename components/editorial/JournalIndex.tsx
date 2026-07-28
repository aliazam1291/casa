"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { useTilt } from "@/hooks/useTilt";
import { JOURNAL_ARTICLES } from "@/lib/journal";
import styles from "./JournalIndex.module.css";

const ARTICLES = JOURNAL_ARTICLES.map((a, i) => ({
  tag: `${String(i + 1).padStart(2, "0")} · ${a.category}`,
  category: a.category,
  title: a.title,
  href: `/journal/${a.slug}`,
  img: a.image,
  imageAlt: a.imageAlt,
  lead: i === 0,
}));

const CATEGORIES = ["All", ...Array.from(new Set(ARTICLES.map((a) => a.category)))];

const SEASONS = [
  { tag: "01", title: "Monsoon Layer" },
  { tag: "02", title: "Winter Den" },
  { tag: "03", title: "Guest Room Season" },
  { tag: "04", title: "Festival of Form" },
  { tag: "05", title: "Sunday Room Edit" },
];

function JournalCard({ article, lead }: { article: (typeof ARTICLES)[number]; lead?: boolean }) {
  const { setCursor, resetCursor } = useCursor();
  const { ref, onPointerMove, onPointerLeave } = useTilt<HTMLAnchorElement>(4);
  return (
    <Link
      ref={ref}
      href={article.href}
      className={`${lead ? styles.lead : styles.minor} ${styles.card}`}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        onPointerLeave();
        resetCursor();
      }}
      onMouseEnter={() => setCursor("hover", "Read")}
    >
      <div className={styles.thumb}>
        <Image src={article.img} alt={article.imageAlt} fill sizes={lead ? "(max-width: 1000px) 100vw, 56vw" : "(max-width: 1000px) 100vw, 44vw"} />
      </div>
      <div className={styles.copy}>
        <span>{article.tag}</span>
        {lead ? <h2>{article.title}</h2> : <h3>{article.title}</h3>}
      </div>
    </Link>
  );
}

export function JournalIndex() {
  const { setCursor, resetCursor } = useCursor();
  const { ref: seasonRef, inView: seasonIn } = useReveal<HTMLDivElement>();
  const [activeCategory, setActiveCategory] = useState("All");
  const visible = activeCategory === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === activeCategory);
  const lead = visible.find((a) => a.lead) ?? visible[0];
  const minor = visible.filter((a) => a !== lead);

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

      <nav className={styles.categories} aria-label="Filter journal by category">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={activeCategory === c ? styles.categoryActive : ""}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </nav>

      <section className={styles.grid} aria-label="Latest stories">
        {lead && <JournalCard article={lead} lead />}
        {minor.map((a) => (
          <JournalCard key={a.href} article={a} />
        ))}
        {visible.length === 0 && <p className={styles.empty}>No stories filed under this category yet.</p>}
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
