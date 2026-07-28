"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/catalogue";
import { ROOMS_BY_SLUG } from "@/lib/rooms";
import { useCursor } from "@/components/cursor/CursorProvider";
import styles from "./CatalogueIndex.module.css";

/**
 * The catalogue as an index you can read, rather than eight tiles that only
 * told you a category existed and made you navigate to learn what was in it.
 * The rail keeps all eight categories in view; the panel gives the selected
 * one its photography, its five sub-types WITH their descriptions, and the
 * rooms each sub-type is actually drawn on — which is the whole argument of
 * this taxonomy ("an index over the same rooms, not a parallel catalogue").
 *
 * Radix Tabs rather than shadcn/ui: shadcn ships Tailwind-classed source and
 * this project has no Tailwind. Radix is the primitive shadcn is built on, so
 * roving-focus arrow-key navigation, correct aria-selected/controls wiring and
 * the tab/panel relationship all come for free, styled with our own CSS.
 */
export function CatalogueIndex({
  categories,
  images,
}: {
  categories: Category[];
  images: Record<string, string>;
}) {
  const [active, setActive] = useState(categories[0].slug);
  const { setCursor, resetCursor } = useCursor();

  return (
    <Tabs.Root
      value={active}
      onValueChange={setActive}
      orientation="vertical"
      className={styles.root}
    >
      <Tabs.List className={styles.rail} aria-label="Catalogue categories">
        {categories.map((category, i) => (
          <Tabs.Trigger
            key={category.slug}
            value={category.slug}
            className={styles.railItem}
            onMouseEnter={() => setCursor("hover", category.name)}
            onMouseLeave={resetCursor}
          >
            <span className={styles.railNum}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.railName}>{category.name}</span>
            <span className={styles.railCount}>{category.subtypes.length}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {categories.map((category) => (
        <Tabs.Content key={category.slug} value={category.slug} className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelImage}>
              <Image
                src={images[category.slug]}
                alt={category.name}
                fill
                sizes="(max-width: 900px) 100vw, 46vw"
                priority={category.slug === categories[0].slug}
              />
            </div>
            <div className={styles.panelIntro}>
              <h2 className={styles.panelTitle}>{category.name}</h2>
              <p className={styles.panelDesc}>{category.description}</p>
              <Link
                href={`/catalogue/${category.slug}`}
                className={styles.panelLink}
                onMouseEnter={() => setCursor("hover", "Open")}
                onMouseLeave={resetCursor}
              >
                Open {category.name} →
              </Link>
            </div>
          </div>

          <ul className={styles.subtypes}>
            {category.subtypes.map((subtype, i) => {
              const rooms = subtype.rooms
                .map((slug) => ROOMS_BY_SLUG[slug])
                .filter(Boolean)
                .slice(0, 3);
              return (
                <li key={subtype.slug}>
                  <Link
                    href={`/catalogue/${category.slug}/${subtype.slug}`}
                    className={styles.subtype}
                    onMouseEnter={() => setCursor("hover", "View")}
                    onMouseLeave={resetCursor}
                  >
                    <span className={styles.subtypeNum}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.subtypeBody}>
                      <span className={styles.subtypeName}>{subtype.name}</span>
                      <span className={styles.subtypeDesc}>{subtype.description}</span>
                      {rooms.length > 0 && (
                        <span className={styles.subtypeRooms}>
                          Drawn on in {rooms.map((r) => r.name).join(", ")}
                          {subtype.rooms.length > rooms.length ? ` +${subtype.rooms.length - rooms.length}` : ""}
                        </span>
                      )}
                    </span>
                    <span className={styles.subtypeArrow} aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
