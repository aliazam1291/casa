"use client";

import { COMPOSED_ROOM } from "./data/manifest";
import styles from "./ComposedRoomSection.module.css";

/** Mobile / no-WebGL fallback: no canvas, no shadows — just the composition and its links. */
export function ComposedRoomPoster() {
  const links = COMPOSED_ROOM.filter((o) => o.label && o.href);

  return (
    <div className={styles.poster}>
      <div className={styles.posterLegend}>
        {links.map((obj) => (
          <a key={obj.id} href={obj.href!}>
            {obj.label}
          </a>
        ))}
      </div>
    </div>
  );
}
