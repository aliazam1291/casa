"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { SitePage } from "@/lib/site-content";
import styles from "./EditorialExplorer.module.css";

export function EditorialExplorer({ page }: { page: SitePage }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const card = page.cards[active];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image src={page.image} alt={page.imageAlt} fill priority sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroShade} />
        <div className={styles.heroCopy}>
          <p>{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <span>{page.description}</span>
        </div>
      </section>

      <section className={styles.intro}>
        <p className={styles.sectionLabel}>Wolf Casa / 2026</p>
        <h2>{page.intro}</h2>
        <Link href={page.cta.href} className={styles.primaryCta}>{page.cta.label} <span>→</span></Link>
      </section>

      <section className={styles.explorer}>
        <div className={styles.explorerHeader}>
          <p className={styles.sectionLabel}>Explore the composition</p>
          <p>Choose a chapter to reveal its direction.</p>
        </div>
        <div className={styles.chapterGrid}>
          <div className={styles.chapterList}>
            {page.cards.map((item, index) => (
              <button key={item.title} type="button" onClick={() => setActive(index)} className={index === active ? styles.activeChapter : ""}>
                <span>{item.eyebrow}</span><strong>{item.title}</strong><i>↗</i>
              </button>
            ))}
          </div>
          <article className={styles.chapterFeature}>
            <span>{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <Link href={card.href}>Explore this chapter <span>→</span></Link>
          </article>
        </div>
      </section>

      <section className={styles.principles}>
        <p className={styles.sectionLabel}>The Wolf Casa method</p>
        <div>
          {page.principles.map((principle, index) => (
            <button key={principle} type="button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{principle}</strong>
              <i>{open === index ? "−" : "+"}</i>
              {open === index && <p>Considered choices, made in sequence, create a room that works as beautifully as it feels.</p>}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
