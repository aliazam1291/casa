import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATALOGUE, getCategory } from "@/lib/catalogue";
import { piecesInSubtype } from "@/lib/pieces";
import styles from "./page.module.css";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return CATALOGUE.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return {
    title: `${category.name} — Wolf Casa`,
    description: category.description,
    alternates: { canonical: `/catalogue/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link href="/catalogue">Catalogue</Link>
        <span>/</span>
        <span>{category.name}</span>
      </nav>
      <section className={styles.hero}>
        <p className={styles.kicker}>Category</p>
        <h1>{category.name}.</h1>
        <p>{category.description}</p>
      </section>

      <nav className={styles.grid} aria-label={`${category.name} sub-types`}>
        {category.subtypes.map((sub) => {
          const pieceCount = piecesInSubtype(category.slug, sub.slug).length;
          return (
            <Link key={sub.slug} href={`/catalogue/${category.slug}/${sub.slug}`} className={styles.card}>
              <h2>{sub.name}</h2>
              <p>{sub.description}</p>
              <b>{pieceCount > 0 ? `${pieceCount} named piece${pieceCount === 1 ? "" : "s"}` : `${sub.rooms.length} room${sub.rooms.length === 1 ? "" : "s"}`}</b>
            </Link>
          );
        })}
      </nav>

      <section className={styles.note}>
        <p>See {category.name.toLowerCase()} composed inside a real room, not shelved on its own.</p>
        <Link href="/the-house-and-rooms">Browse the rooms</Link>
      </section>
    </main>
  );
}
