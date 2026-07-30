"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { CompositionExhibit } from "./CompositionExhibit";
import { FloorPlanTypes } from "./FloorPlanTypes";
import styles from "./TheWolfWay.module.css";

// Six traits, six of the book's colours. §08 gives Brass / Walnut / Green /
// Saddle / Sand distinct jobs and the site was reaching for Brass every time,
// so the six read as one. Colour lands as a hairline and a number here, never
// as a fill — "Brass punctuates, never a fill."
const DNA = [
  { tag: "01", title: "Instinct", body: "Order felt before it is read.", tone: "#a78657" },
  { tag: "02", title: "Territory", body: "Every zone is a claimed space.", tone: "#7d9682" },
  { tag: "03", title: "Shelter", body: "Furniture as the architecture of refuge.", tone: "#c9a87e" },
  { tag: "04", title: "Silence", body: "Empty space is part of the value.", tone: "#c9bda6" },
  { tag: "05", title: "Pack", body: "Pieces move as one composition.", tone: "#c98a5e" },
  { tag: "06", title: "Precision", body: "Nothing accidental. Everything placed.", tone: "#a78657" },
];

// Book-exact titles (Brand Book §03 The Wolf Way — Ten Principles).
const PRINCIPLES = [
  { title: "Begin with light", body: "Light decides mood before furniture." },
  { title: "Anchor the room with one form", body: "One dominant form per composition." },
  { title: "Layer the material", body: "Wood, fabric, stone, brass converse." },
  { title: "Create a quiet edge", body: "Composed rooms need breathing space." },
  { title: "Balance comfort and command", body: "Invite use, but hold presence." },
  { title: "Sell the composition", body: "Never the sofa alone." },
  { title: "Use texture as memory", body: "The hand confirms what the eye believes." },
  { title: "Let silence work", body: "Empty space carries value." },
  { title: "Design for ritual", body: "Every room suggests a way of living." },
  { title: "Place the customer inside it", body: "The sale begins in the imagination." },
];

export function TheWolfWay() {
  const { setCursor, resetCursor } = useCursor();
  const { ref: dnaRef, inView: dnaIn } = useReveal<HTMLDivElement>();
  const { ref: prinRef, inView: prinIn } = useReveal<HTMLDivElement>();
  const [principle, setPrinciple] = useState(0);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/villa-hero.webp"
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
            <article
              key={item.tag}
              style={{ "--dna-tone": item.tone } as React.CSSProperties}
              onMouseEnter={() => setCursor("hover", item.title)}
              onMouseLeave={resetCursor}
            >
              <span>{item.tag}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <CompositionExhibit />

      <section className={styles.principles}>
        <div ref={prinRef} className={`reveal ${prinIn ? "in" : ""}`}>
          <div className={styles.principlesHead}>
            <h2>Ten principles, in sequence.</h2>
            <p className={styles.sectionLabel}>The Wolf Way / The Method</p>
          </div>
        </div>

        {/* A DIAL, NOT A LIST. This was a ten-row accordion: ten full-width
            rows at ~90px each, so the method alone ran past a screen and a half
            before anyone had read a single principle. The ten now sit on one
            rail — "the index: numbers orient, they never shout" (§IC) — and one
            principle is open at a time underneath. Same ten principles, same
            book-exact titles, roughly a fifth of the height.

            Radix Tabs rather than buttons: roving tabindex, arrow/Home/End
            navigation and correct aria-selected/aria-controls come with it.
            activationMode="automatic" makes arrowing along the rail change the
            panel, which is the whole point of a dial. */}
        <Tabs.Root
          value={String(principle)}
          onValueChange={(v) => setPrinciple(Number(v))}
          activationMode="automatic"
          className={styles.dial}
        >
          <Tabs.List className={styles.dialRail} aria-label="The ten principles">
            {PRINCIPLES.map((item, index) => (
              <Tabs.Trigger
                key={item.title}
                value={String(index)}
                className={styles.dialTick}
                onMouseEnter={() => {
                  setPrinciple(index);
                  setCursor("hover", item.title);
                }}
                onMouseLeave={resetCursor}
              >
                {String(index + 1).padStart(2, "0")}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* One panel, re-keyed per principle so the reveal animation replays
              on change. Rendering ten panels would put the other nine in the
              accessibility tree for no reason. */}
          <Tabs.Content value={String(principle)} asChild forceMount>
            <div className={styles.dialPanel} key={principle}>
              <span className={styles.dialNum}>
                {String(principle + 1).padStart(2, "0")} / 10
              </span>
              <h3>{PRINCIPLES[principle].title}</h3>
              <p>{PRINCIPLES[principle].body}</p>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </section>

      <FloorPlanTypes />

      {/* This page is the nav's browse entry now (see components/nav/Nav.tsx),
          so its closing section has to be a junction rather than a single CTA:
          the method leads to the rooms it has already made, the parts those
          rooms are composed from, and the experiences that compose yours. */}
      <section className={styles.manifesto}>
        <p>&ldquo;The wolf does not decorate. It marks territory.&rdquo;</p>
        <div className={styles.manifestoActions}>
          <Link
            href="/the-house-and-rooms"
            className={styles.manifestoPrimary}
            onMouseEnter={() => setCursor("hover", "Enter")}
            onMouseLeave={resetCursor}
          >
            The thirteen rooms
          </Link>
          <Link href="/shop" onMouseEnter={() => setCursor("hover", "Enter")} onMouseLeave={resetCursor}>
            The Interio Mall
          </Link>
          <Link href="/experiences" onMouseEnter={() => setCursor("hover", "Explore")} onMouseLeave={resetCursor}>
            The experiences
          </Link>
        </div>
      </section>
    </main>
  );
}
