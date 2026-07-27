import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNAL_ARTICLES, getArticle } from "@/lib/journal";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return JOURNAL_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return {
    title: `${article.title} — Wolf Casa Journal`,
    description: article.dek,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: { title: article.title, description: article.dek, images: [{ url: article.image, alt: article.imageAlt }] },
  };
}

export default async function JournalArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const related = JOURNAL_ARTICLES.filter((a) => a.slug !== article.slug);
  const published = new Date(article.published).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image src={article.image} alt={article.imageAlt} fill priority sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>{article.category}</p>
          <h1>{article.title}</h1>
          <p className={styles.meta}>{published}</p>
        </div>
      </section>

      <article className={styles.body}>
        <p className={styles.dek}>{article.dek}</p>
        {article.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>

      <section className={styles.related}>
        <p>Also in The Journal</p>
        <div className={styles.relatedGrid}>
          {related.map((a) => (
            <Link key={a.slug} href={`/journal/${a.slug}`} className={styles.relatedCard}>
              <span>{a.category}</span>
              <h3>{a.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
