"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PIECES } from "@/lib/pieces";
import { ROOMS } from "@/lib/rooms";
import { JOURNAL_ARTICLES } from "@/lib/journal";
import { useCursor } from "@/components/cursor/CursorProvider";
import styles from "./SearchPalette.module.css";

/**
 * Site search over the pieces, the rooms and the journal.
 *
 * WHY IT EARNS ITS PLACE: someone arriving from Instagram or a search result
 * lands mid-site with no way to find one specific thing except scrolling a
 * wall of 41 photographs. The 41 pieces also carry Italian and German names,
 * so "floating vanity" has to find "Schwebewaschtisch" — which is exactly why
 * `subtitle` exists in lib/pieces.ts, and why it is searched here alongside
 * the name, the room and the materials.
 *
 * Built on Radix Dialog (already a dependency) rather than adding a command-
 * palette library: the whole behaviour is a filtered list plus arrow keys.
 */

type Result = {
  id: string;
  href: string;
  group: "Pieces" | "Rooms" | "Journal";
  title: string;
  sub: string;
  /** Everything matched against, lowercased once at module load. */
  haystack: string;
};

// Built once at module scope, not per keystroke and not per render.
const INDEX: Result[] = [
  ...PIECES.map((p) => ({
    id: `piece-${p.slug}`,
    href: `/pieces/${p.slug}`,
    group: "Pieces" as const,
    title: p.name,
    sub: p.subtitle,
    haystack: [p.name, p.subtitle, p.roomSlug, p.categorySlug, ...p.materials]
      .join(" ")
      .toLowerCase(),
  })),
  ...ROOMS.map((r) => ({
    id: `room-${r.slug}`,
    href: `/rooms/${r.slug}`,
    group: "Rooms" as const,
    title: r.name,
    sub: r.eyebrow,
    haystack: [r.name, r.eyebrow, r.detail, ...(r.materials ?? [])].join(" ").toLowerCase(),
  })),
  ...JOURNAL_ARTICLES.map((j) => ({
    id: `journal-${j.slug}`,
    href: `/journal/${j.slug}`,
    group: "Journal" as const,
    title: j.title,
    sub: j.dek,
    // The body is searched too — a journal piece is the one place on the site
    // where the useful match is often a phrase inside the article.
    haystack: [j.title, j.dek, j.category, ...j.body].join(" ").toLowerCase(),
  })),
];

const GROUP_ORDER: Result["group"][] = ["Pieces", "Rooms", "Journal"];

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  // Cmd/Ctrl+K anywhere, and "/" when the visitor isn't already typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    // Every whitespace-separated term must appear, so "marble foyer" narrows
    // rather than widening the way a plain substring match would.
    const terms = q.split(/\s+/);
    return INDEX.filter((r) => terms.every((t) => r.haystack.includes(t))).slice(0, 24);
  }, [query]);

  // Typing resets the highlight (otherwise the arrow keys resume from wherever
  // the previous, now-gone result was) and closing clears the palette. Both
  // are done in the handlers that cause them rather than in effects watching
  // the state afterwards — an effect here would render once with the stale
  // highlight and then again to correct it.
  const onQueryChange = (value: string) => {
    setQuery(value);
    setActive(0);
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
      setActive(0);
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      // Drive the real anchor so Next's client navigation is used rather than
      // a full page load from window.location.
      listRef.current
        ?.querySelector<HTMLAnchorElement>(`[data-index="${active}"]`)
        ?.click();
    }
  };

  let flatIndex = -1;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={styles.trigger}
          aria-label="Search Wolf Casa"
          onMouseEnter={() => setCursor("hover", "Search")}
          onMouseLeave={resetCursor}
        >
          <svg viewBox="0 0 16 16" aria-hidden>
            <circle cx="7.2" cy="7.2" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10.6 10.6 13.4 13.4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.panel} aria-describedby={undefined}>
          <Dialog.Title className={styles.srOnly}>Search Wolf Casa</Dialog.Title>

          <div className={styles.field}>
            <svg viewBox="0 0 16 16" aria-hidden className={styles.fieldIcon}>
              <circle cx="7.2" cy="7.2" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10.6 10.6 13.4 13.4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <input
              autoFocus
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search pieces, rooms, journal…"
              aria-label="Search pieces, rooms and journal"
              className={styles.input}
            />
            <kbd className={styles.kbd}>Esc</kbd>
          </div>

          <div className={styles.results} ref={listRef} data-lenis-prevent>
            {query.trim() === "" ? (
              <p className={styles.hint}>
                Try a material, a room, or an English name — “marble”, “foyer”, “floating vanity”.
              </p>
            ) : results.length === 0 ? (
              <p className={styles.hint}>Nothing matches “{query.trim()}”.</p>
            ) : (
              GROUP_ORDER.map((group) => {
                const inGroup = results.filter((r) => r.group === group);
                if (inGroup.length === 0) return null;
                return (
                  <section key={group} className={styles.group}>
                    <h2 className={styles.groupTitle}>{group}</h2>
                    {inGroup.map((r) => {
                      flatIndex += 1;
                      const index = flatIndex;
                      return (
                        <Link
                          key={r.id}
                          href={r.href}
                          data-index={index}
                          className={index === active ? `${styles.row} ${styles.rowOn}` : styles.row}
                          onMouseEnter={() => setActive(index)}
                          onClick={() => onOpenChange(false)}
                        >
                          <span className={styles.rowTitle}>{r.title}</span>
                          <span className={styles.rowSub}>{r.sub}</span>
                        </Link>
                      );
                    })}
                  </section>
                );
              })
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
