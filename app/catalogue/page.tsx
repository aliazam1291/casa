import type { Metadata } from "next";
import Link from "next/link";
import { CATALOGUE } from "@/lib/catalogue";
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

      <section className={styles.note}>
        <p>Every category is drawn on inside a real room — see them composed, not shelved.</p>
        <Link href="/rooms">Browse the rooms</Link>
      </section>
    </main>
  );
}
