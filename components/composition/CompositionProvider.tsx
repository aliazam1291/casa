"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * "My Composition" — the visitor's own shortlist of pieces.
 *
 * WHY THIS IS THE FEATURE THAT MATTERS: the site's one conversion is "begin a
 * consultation", and until now a visitor arrived at that form with nothing but
 * a blank message box. Saving pieces while browsing means the enquiry arrives
 * already carrying what they actually want, which is a qualified lead instead
 * of a name and a phone number. It is also exactly the brand's own argument —
 * a room is composed, so the visitor composes one.
 *
 * STORAGE: localStorage, deliberately. There is no auth on this site and no
 * database configured; a board that survives a refresh and a return visit is
 * the whole requirement. No cookie, no PII, nothing to consent to — it is a
 * list of public slugs.
 *
 * WHY useSyncExternalStore AND NOT useState + useEffect: localStorage IS an
 * external store, and it is mutated from outside React by other tabs. The
 * hook is built for exactly this — it gives a separate server snapshot (so
 * SSR renders the empty board and hydration matches), and it subscribes
 * without the read-after-mount `setState`-inside-an-effect that would render
 * once with the wrong value and then again to correct it.
 */

const STORAGE_KEY = "wolfcasa.composition.v1";
const MAX_ITEMS = 24;

// The snapshot MUST be referentially stable between reads or
// useSyncExternalStore re-renders forever. So the parsed array is cached and
// only replaced when the serialised string actually changes.
let cachedRaw: string | null = null;
let cachedValue: string[] = [];
const EMPTY: string[] = [];

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function readSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedValue;
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  if (!raw) {
    cachedValue = EMPTY;
    return cachedValue;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    // Anything could be in storage — another tab, an older build, a person
    // editing it by hand. Only keep what is actually a list of strings.
    cachedValue = Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string").slice(0, MAX_ITEMS)
      : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }
  return cachedValue;
}

/** The server has no localStorage, so it always renders the empty board. */
function serverSnapshot(): string[] {
  return EMPTY;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // `storage` fires in every OTHER tab, which is what keeps two open tabs in
  // agreement. Same-tab writes notify through emit() in write().
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode / quota exceeded. Fall through and still notify, so the
    // board works for this session even if it cannot be persisted.
  }
  emit();
}

type CompositionContextValue = {
  /** Saved piece slugs, oldest first. */
  slugs: string[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  /** False during SSR and the first client render, so UI can avoid a flash. */
  ready: boolean;
};

const CompositionContext = createContext<CompositionContextValue | null>(null);

export function useComposition(): CompositionContextValue {
  const ctx = useContext(CompositionContext);
  if (!ctx) throw new Error("useComposition must be used within a CompositionProvider");
  return ctx;
}

export function CompositionProvider({ children }: { children: ReactNode }) {
  const slugs = useSyncExternalStore(subscribe, readSnapshot, serverSnapshot);
  // `true` only once the client store is being read — the server snapshot is
  // the shared EMPTY reference, so this is a safe identity check and needs no
  // extra state.
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const toggle = useCallback((slug: string) => {
    const current = readSnapshot();
    if (current.includes(slug)) {
      write(current.filter((s) => s !== slug));
    } else if (current.length < MAX_ITEMS) {
      write([...current, slug]);
    }
  }, []);

  const remove = useCallback((slug: string) => {
    write(readSnapshot().filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => write([]), []);

  const value = useMemo(
    () => ({
      slugs,
      count: slugs.length,
      has: (slug: string) => slugs.includes(slug),
      toggle,
      remove,
      clear,
      ready,
    }),
    [slugs, toggle, remove, clear, ready],
  );

  return <CompositionContext.Provider value={value}>{children}</CompositionContext.Provider>;
}
