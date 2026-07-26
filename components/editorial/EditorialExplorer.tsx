"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { SitePage } from "@/lib/site-content";
import styles from "./EditorialExplorer.module.css";

export function EditorialExplorer({ page }: { page: SitePage }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const [material, setMaterial] = useState(0);
  const card = page.cards[active];
  const selectedMaterial = page.palette[material];
  const accentStyle = useMemo(() => ({ "--page-accent": selectedMaterial.value } as CSSProperties), [selectedMaterial.value]);

  return (
    <main className={styles.page} style={accentStyle}>
      <section className={styles.hero}>
        <Image src={page.image} alt={page.imageAlt} fill priority sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <span>{page.description}</span>
          </div>
          <div className={styles.heroMetrics} aria-label="Wolf Casa signals">
            {page.metrics.map((item) => (
              <div key={`${item.value}-${item.label}`}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.intro}>
        <p className={styles.sectionLabel}>Wolf Casa / Home Interior Mall</p>
        <div>
          <h2>{page.intro}</h2>
          <div className={styles.actionRow}>
            <Link href={page.cta.href} className={styles.primaryCta}>{page.cta.label}<span aria-hidden>-&gt;</span></Link>
            <Link href="/experiences/materials-library" className={styles.secondaryCta}>Explore materials</Link>
          </div>
        </div>
      </section>

      <section className={styles.departments} aria-label="Interior mall departments">
        {page.departments.map((item, index) => (
          <article key={item.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.label}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className={styles.materialLab}>
        <div className={styles.materialCopy}>
          <p className={styles.sectionLabel}>Light + Form Lab</p>
          <h2>Light shapes the silence. Material gives it weight.</h2>
          <p>Use the palette to read how a Wolf Casa room is built: shadow first, then wood, marble, metal and textile in calm proportion.</p>
        </div>
        <div className={styles.swatchPanel}>
          <div className={styles.swatches} role="tablist" aria-label="Material palette">
            {page.palette.map((item, index) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={index === material}
                className={index === material ? styles.activeSwatch : ""}
                onClick={() => setMaterial(index)}
              >
                <i style={{ background: item.value }} aria-hidden />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          <article className={styles.materialCard}>
            <span>{selectedMaterial.material}</span>
            <h3>{selectedMaterial.name}</h3>
            <p>{selectedMaterial.note}</p>
          </article>
        </div>
      </section>

      <section className={styles.explorer}>
        <div className={styles.explorerHeader}>
          <p className={styles.sectionLabel}>Composition Chapters</p>
          <div className={styles.segmented} role="tablist" aria-label="Composition chapters">
            {page.cards.map((item, index) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={index === active}
                onClick={() => setActive(index)}
                className={index === active ? styles.activeSegment : ""}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.chapterGrid}>
          <div className={styles.chapterList}>
            {page.cards.map((item, index) => (
              <button key={item.title} type="button" onClick={() => setActive(index)} className={index === active ? styles.activeChapter : ""}>
                <span>{item.eyebrow}</span>
                <strong>{item.title}</strong>
                <i>{item.signal}</i>
              </button>
            ))}
          </div>
          <article className={styles.chapterFeature}>
            <div className={styles.featureImage}>
              <Image src={card.image} alt="" fill sizes="(max-width: 900px) 100vw, 42vw" />
            </div>
            <div className={styles.featureBody}>
              <span>{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <Link href={card.href}>Open chapter <span aria-hidden>-&gt;</span></Link>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.principles}>
        <p className={styles.sectionLabel}>The Wolf Casa Method</p>
        <div>
          {page.principles.map((principle, index) => (
            <button key={principle} type="button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{principle}</strong>
              <i>{open === index ? "-" : "+"}</i>
              {open === index && <p>Considered choices, made in sequence, create a room that works as beautifully as it feels.</p>}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
