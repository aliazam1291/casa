"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCursor } from "@/components/cursor/CursorProvider";
import { useReveal } from "@/hooks/useReveal";
import { MATERIALS, MATERIAL_FAMILIES } from "@/lib/materials";
import { PRODUCT_UNIVERSE } from "@/lib/product-universe";
import { PIECES } from "@/lib/pieces";
// One palette, one place — this array was declared verbatim here AND in
// WayOfLightForm.tsx. See the note in lib/tokens.ts.
import { BRAND_COLOURS } from "@/lib/tokens";
import styles from "./ArchitectHub.module.css";

const SPEC = [
  { num: "01", title: "Access the materials", body: "Request finishes, dimensions and curated material support for your project." },
  { num: "02", title: "Build a project edit", body: "Work with our team to create a composition that fits the brief and the room." },
  { num: "03", title: "Confirm the timeline", body: "Get visibility into lead times, craft and scale before you commit." },
  { num: "04", title: "Install with support", body: "Placement, sequencing and the small pauses that make it feel resolved." },
];

/**
 * What a specifier can actually request. The page's one CTA used to be
 * "Request project access" pointing at /visit — a consumer showroom page — so
 * the trade door led to the same place as the retail door and asked for
 * nothing. Wolf_Casa_Website_IA.md §3.7 is explicit that Trade is a distinct
 * door with a request step, and that it "can launch as a request-access form
 * before the full portal is built".
 *
 * This is that request step: pick what you need, then carry it into the
 * consultation form. Counts are read off the real data so the page cannot
 * promise a library it does not have.
 */
const REQUESTS = [
  { id: "samples", label: "Material samples", detail: `${MATERIALS.length} materials across ${MATERIAL_FAMILIES.length} families` },
  { id: "specs", label: "Dimensions & specs", detail: `${PIECES.length} named pieces, drawings on request` },
  { id: "universe", label: "The full product universe", detail: `${PRODUCT_UNIVERSE.length} stages, twenty parts of a room` },
  { id: "leadtimes", label: "Lead times & scheduling", detail: "Per plan type, from four weeks" },
  { id: "site", label: "A site visit", detail: "Indore & Dewas, or your project address" },
  { id: "install", label: "Install support", detail: "Placement, sequencing and hand-over" },
];

export function ArchitectHub() {
  const { setCursor, resetCursor } = useCursor();
  const { ref, inView } = useReveal<HTMLDivElement>();
  const [wanted, setWanted] = useState<string[]>([]);

  const toggle = (id: string) =>
    setWanted((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // The selection rides to the consultation form as a query string rather than
  // being collected here — there is one lead-capture endpoint on this site
  // (app/api/consultation) and a second half-form on the trade page would be a
  // second thing to maintain and a second place for a lead to go missing.
  const requestHref = wanted.length
    ? `/experiences/consultation?from=trade&needs=${encodeURIComponent(wanted.join(","))}`
    : "/experiences/consultation?from=trade";

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/editorial/materials.webp"
          alt="Material samples and interior finishes curated for a project"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroFrame}>
          <p className={styles.kicker}>Architect Hub</p>
          <h1>For architects of atmosphere.</h1>
          <p>A dedicated Wolf Casa partnership for architects, designers and builders — technical detail without catalogue language.</p>
        </div>
      </section>

      <section className={styles.dossier}>
        <div ref={ref} className={`reveal ${inView ? "in" : ""}`}>
          <p className={styles.sectionLabel}>Project Dossier</p>
          <h2>A clear route from concept to installation.</h2>
        </div>
        <div className={styles.spec}>
          {SPEC.map((item) => (
            <div key={item.num}>
              <small>{item.num}</small>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
        <div className={styles.swatches} aria-label="Material colour reference">
          {BRAND_COLOURS.map((c) => (
            <div key={c.hex} title={c.role}>
              <i style={{ background: c.hex }} aria-hidden />
              <span>{c.name}</span>
              <small>{c.hex}</small>
            </div>
          ))}
        </div>
      </section>

      {/* ── The request desk ──────────────────────────────────────────────
          The trade door now asks for something. See REQUESTS above for why
          this is a picker that hands off rather than a second form. */}
      <section className={styles.desk} aria-labelledby="specifier-desk">
        <div className={styles.deskHead}>
          <p className={styles.sectionLabel}>Specifier Desk</p>
          <h2 id="specifier-desk">Tell us what the project needs.</h2>
          <p className={styles.deskBody}>
            Pick anything relevant and it travels with your enquiry — no account, no portal, no waiting on
            a login.
          </p>
        </div>

        <div className={styles.deskGrid}>
          {REQUESTS.map((r) => {
            const on = wanted.includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={on}
                className={`${styles.request} ${on ? styles.requestOn : ""}`}
                onClick={() => toggle(r.id)}
                onMouseEnter={() => setCursor("hover", on ? "Remove" : "Add")}
                onMouseLeave={resetCursor}
              >
                <span className={styles.requestMark} aria-hidden>
                  {on ? "✓" : "+"}
                </span>
                <span className={styles.requestLabel}>{r.label}</span>
                <span className={styles.requestDetail}>{r.detail}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.deskFoot}>
          <p aria-live="polite" className={styles.deskCount}>
            {wanted.length === 0
              ? "Nothing selected — you can still send a general enquiry."
              : `${wanted.length} item${wanted.length === 1 ? "" : "s"} will travel with your enquiry.`}
          </p>
          <Link
            href={requestHref}
            className={styles.deskCta}
            onMouseEnter={() => setCursor("hover", "Request")}
            onMouseLeave={resetCursor}
          >
            Request project access <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className={`${styles.cta} leather`}>
        <p>Made for ambitious rooms — reach the Architect Hub for project support.</p>
        <Link href="/visit" onMouseEnter={() => setCursor("hover", "Visit")} onMouseLeave={resetCursor}>
          Visit the showroom
        </Link>
      </section>
    </main>
  );
}
