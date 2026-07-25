import styles from "./Ticker.module.css";

const WORDS = [
  { text: "Composed", em: true },
  { text: "Edited", em: false },
  { text: "Remembered", em: true },
  { text: "Inherited", em: false },
];

/** Marquee ticker — ported from ~line 552. Duplicated once for the seamless -50% loop. */
export function Ticker() {
  const sequence = [...WORDS, ...WORDS];
  return (
    <section className={styles.ticker} aria-hidden="true">
      <div className={styles.inner}>
        {sequence.map((w, i) => (
          <span key={i}>
            {w.em ? <em>{w.text}</em> : <span className="upright">{w.text}</span>}
            <span className={styles.dot}>·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
