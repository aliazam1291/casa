"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { WORLDS } from "@/lib/worlds";
import styles from "./TheWolfWay.module.css";

const WORLD_SLUGS = ["heirloom", "low-house", "courtyard", "monastic", "ritual"];

const DNA = [
  { tag: "01", title: "Instinct", body: "Order felt before it is read." },
  { tag: "02", title: "Territory", body: "Every zone is a claimed space." },
  { tag: "03", title: "Shelter", body: "Furniture as the architecture of refuge." },
  { tag: "04", title: "Silence", body: "Empty space is part of the value." },
  { tag: "05", title: "Pack", body: "Pieces move as one composition." },
  { tag: "06", title: "Precision", body: "Nothing accidental. Everything placed." },
];

const PRINCIPLES = [
  { title: "Begin with light", body: "Light decides mood before furniture." },
  { title: "Anchor the room", body: "One dominant form per composition." },
  { title: "Layer material", body: "Wood, fabric, stone, brass converse." },
  { title: "Create a quiet edge", body: "Premium rooms need breathing space." },
  { title: "Comfort & command", body: "Invite use, but hold presence." },
  { title: "Sell the composition", body: "Never the sofa alone." },
  { title: "Texture as memory", body: "The hand confirms what the eye believes." },
  { title: "Let silence work", body: "Empty space carries value." },
  { title: "Design for ritual", body: "Every room suggests a way of living." },
  { title: "Place them inside", body: "The sale begins in the imagination." },
];

export function TheWolfWay() {
  const { setCursor, resetCursor } = useCursor();
  const { ref: dnaRef, inView: dnaIn } = useReveal<HTMLDivElement>();
  const { ref: prinRef, inView: prinIn } = useReveal<HTMLDivElement>();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/villa-hero.png"
          alt="A composed, layered contemporary living room"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>The Method</p>
          <h1>The Wolf Way.</h1>
          <p>
            Ten principles. Our method of selling, styling and explaining complete rooms instead of isolated products —
            the wolf does not decorate, it marks territory.
          </p>
        </div>
      </section>

      <section className={styles.dna}>
        <div ref={dnaRef} className={`reveal ${dnaIn ? "in" : ""}`}>
          <p className={styles.sectionLabel}>Wolf DNA</p>
          <h2>Not a mascot — a way of holding a room.</h2>
        </div>
        <div className={styles.dnaGrid}>
          {DNA.map((item) => (
            <article key={item.tag}>
              <span>{item.tag}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.worlds}>
        <p className={styles.sectionLabel}>Five Worlds</p>
        <h2>One doctrine, five atmospheres.</h2>
        <div className={styles.worldList}>
          {WORLDS.map((world, index) => (
            <article key={world.name} id={WORLD_SLUGS[index]} className={styles.worldRow}>
              <span>{String(index + 1).padStart(2, "0")} / 05</span>
              <h3>{world.name}</h3>
              <p>{world.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.principles}>
        <div ref={prinRef} className={`reveal ${prinIn ? "in" : ""}`}>
          <div className={styles.principlesHead}>
            <h2>Ten principles, in sequence.</h2>
            <p className={styles.sectionLabel}>The Wolf Way / The Method</p>
          </div>
        </div>
        <div className={styles.index}>
          {PRINCIPLES.map((item, index) => (
            <div
              key={item.title}
              className={styles.row}
              onMouseEnter={() => setCursor("hover", String(index + 1).padStart(2, "0"))}
              onMouseLeave={resetCursor}
            >
              <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.desc}>{item.body}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.manifesto}>
        <p>&ldquo;The wolf does not decorate. It marks territory.&rdquo;</p>
        <Link href="/experiences" onMouseEnter={() => setCursor("hover", "Explore")} onMouseLeave={resetCursor}>
          Explore the experiences
        </Link>
      </section>
    </main>
  );
}
