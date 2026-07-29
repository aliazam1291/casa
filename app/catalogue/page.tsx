import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CATALOGUE } from "@/lib/catalogue";
import { STOCK_PIECES } from "@/lib/products";
import { KITCHEN_BATH_IMAGES, LIGHTING_IMAGES, DECOR_IMAGES, SEATING_IMAGES } from "@/lib/library-images";
import { CatalogueIndex } from "./CatalogueIndex";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Catalogue — Wolf Casa",
  description: "Eight categories Wolf Casa composes with — bespoke interiors, seating, kitchen & bath, lighting, doors, office & outdoor, décor and greenery.",
  alternates: { canonical: "/catalogue" },
};

const CATEGORY_IMAGES: Record<string, string> = {
  "bespoke-interiors": "/images/catalogue/bespoke-interiors-beds.webp",
  seating: "/images/catalogue/seating-sofas.webp",
  "kitchen-bath": KITCHEN_BATH_IMAGES[0],
  "lighting-smart-living": LIGHTING_IMAGES[0],
  "doors-windows": DECOR_IMAGES[5],
  "office-outdoor": DECOR_IMAGES[4],
  "decor-finishes": DECOR_IMAGES[0],
  "greenery-entertainment": SEATING_IMAGES[7],
};

export default function CataloguePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>What A Composition Draws On</p>
        <h1>Eight categories.</h1>
        <p>Not a shop menu — the material and product language every Wolf Casa room is composed from. Each category indexes into the same rooms and named pieces, not a separate catalogue.</p>
      </section>

      <section className={styles.indexWrap}>
        <CatalogueIndex categories={CATALOGUE} images={CATEGORY_IMAGES} />
      </section>

      <section className={styles.stock} aria-label="Currently in stock">
        <div className={styles.stockHead}>
          <span className={styles.sectionLabel}>On The Floor Now</span>
          <h2>Real pieces, in stock this week.</h2>
          <p>A rotating edit of accent seating currently on the Indore showroom floor — priced and ready, not a composed room.</p>
        </div>
        <div className={styles.stockGrid}>
          {STOCK_PIECES.map((item) => (
            <div key={item.name} className={styles.stockCard}>
              <div className={styles.stockImage}>
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 900px) 45vw, 16vw" />
              </div>
              <span className={styles.stockName}>{item.name}</span>
              <span className={styles.stockDesc}>{item.desc}</span>
              <span className={styles.stockPrice}>&#8377;{item.price.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
        <div className={styles.stockFoot}>
          <Link href="/visit">Enquire at the showroom &rarr;</Link>
        </div>
      </section>

      <section className={styles.note}>
        <p>Every category is drawn on inside a real room — see them composed, not shelved.</p>
        <Link href="/the-house-and-rooms">Browse the rooms</Link>
      </section>
    </main>
  );
}
