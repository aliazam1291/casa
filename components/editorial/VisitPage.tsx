"use client";

import Image from "next/image";
import Link from "next/link";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import styles from "./VisitPage.module.css";

const OPTIONS = [
  { tag: "Indore", title: "The experience showroom", body: "Walk through fully composed rooms and see how materials change with the light.", href: "/the-wolf-way" },
  { tag: "By appointment", title: "Bring your plans", body: "Book time with a curator to talk through a room, a renovation or a whole house.", href: "/experiences/consultation" },
  { tag: "For professionals", title: "Visit the Specifier Desk", body: "Arrange samples, drawings and project support in one conversation.", href: "/trade" },
  { tag: "Directions", title: "Central India", body: "Full directions and appointment windows shared on request.", href: "/experiences/consultation" },
];

export function VisitPage() {
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/light-form-atrium.png"
          alt="Warmly lit residence with stone, wood and crafted interiors"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>Visit the House</p>
          <h1>Start in the room.</h1>
          <p>The showroom is designed for lingering. Come with a plan, a question, a room that is not yet right, or simply a curiosity about material.</p>
        </div>
      </section>

      <section className={styles.language}>
        <div ref={ref} className={`reveal ${inView ? "in" : ""}`}>
          <p className={styles.sectionLabel}>Sales Language</p>
          <h2>Sell the room, not the sofa.</h2>
        </div>
        <div className={styles.compare}>
          <article>
            <span>The Old Way</span>
            <p>&ldquo;This sofa is available in this colour and size.&rdquo;</p>
          </article>
          <article className={styles.wolfWay}>
            <span>The Wolf Casa Way</span>
            <p>&ldquo;This sofa anchors the room. With the rug, brass lamp and wall texture, it becomes a complete evening lounge. You are buying the room&rsquo;s mood.&rdquo;</p>
          </article>
        </div>
      </section>

      <section className={styles.options} aria-label="Ways to visit">
        {OPTIONS.map((item) => (
          <Link
            key={item.tag}
            href={item.href}
            onMouseEnter={() => setCursor("hover", "Go")}
            onMouseLeave={resetCursor}
          >
            <span>{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </Link>
        ))}
      </section>

      <section className={styles.note}>
        <p>A room is easier to understand in person. Bring the questions that matter.</p>
        <Link href="/experiences/consultation" onMouseEnter={() => setCursor("hover", "Book")} onMouseLeave={resetCursor}>
          Arrange a showroom visit
        </Link>
      </section>
    </main>
  );
}
