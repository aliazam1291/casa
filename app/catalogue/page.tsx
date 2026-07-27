import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CATALOGUE } from "@/lib/catalogue";
import { STOCK_PIECES } from "@/lib/products";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Catalogue — Wolf Casa",
  description: "Eight categories Wolf Casa composes with — bespoke interiors, seating, kitchen & bath, lighting, doors, office & outdoor, décor and greenery.",
  alternates: { canonical: "/catalogue" },
};

export default function CataloguePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>What A Composition Draws On</p>
        <h1>Eight categories.</h1>
        <p>Not a shop menu — the material and product language every Wolf Casa room is composed from. Each category indexes into the same rooms and named pieces, not a separate catalogue.</p>
      </section>

      <nav className={styles.grid} aria-label="Catalogue categories">
        {CATALOGUE.map((cat, i) => (
          <Link key={cat.slug} href={`/catalogue/${cat.slug}`} className={styles.card}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <h2>{cat.name}</h2>
            <p>{cat.description}</p>
            <b>{cat.subtypes.length} sub-types &rarr;</b>
          </Link>
        ))}
      </nav>

      <section className={styles.stock} aria-label="Currently in stock">
        <div className={styles.stockHead}>
          <span className={styles.sectionLabel}>On The Floor Now</span>
          <h2>Real pieces, in stock this week.</h2>
          <p>A rotating edit of accent seating currently on the Indore showroom floor — priced and ready, not a composed room.</p>
        </div>
        <div className={styles.stockGrid}>
          {STOCK_PIECES.map((item) => (
            <a key={item.name} href={item.href} target="_blank" rel="noreferrer" className={styles.stockCard}>
              <div className={styles.stockImage}>
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 900px) 45vw, 16vw" />
              </div>
              <span className={styles.stockName}>{item.name}</span>
              <span className={styles.stockPrice}>&#8377;{item.price.toLocaleString("en-IN")}</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.note}>
        <p>Every category is drawn on inside a real room — see them composed, not shelved.</p>
        <Link href="/rooms">Browse the rooms</Link>
      </section>
    </main>
  );
}
