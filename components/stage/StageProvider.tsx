"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type StageColor = "dark" | "cream";

type Claim = { id: string; color: StageColor };

type StageContextValue = {
  activeColor: StageColor;
  /** Push a claim for `color` while `active` is true; automatically pops on unmount or when `active` flips false. */
  claim: (id: string, color: StageColor, active: boolean) => void;
};

const StageContext = createContext<StageContextValue | null>(null);

/**
 * Claim-stack for the page background color. Sections push a claim while
 * they're the active "stage" (e.g. the Composed Room's cream diorama) and
 * pop it on exit/unmount. The resolved color is always the top of the
 * stack, defaulting to "dark" — so out-of-order enter/exit events from fast
 * scrolling can never strand the page in the wrong color.
 */
export function StageProvider({ children }: { children: ReactNode }) {
  const [activeColor, setActiveColor] = useState<StageColor>("dark");
  const stackRef = useRef<Claim[]>([]);

  const resolve = useCallback(() => {
    const top = stackRef.current[stackRef.current.length - 1];
    const next = top?.color ?? "dark";
    setActiveColor(next);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.stage = next;
    }
  }, []);

  const claim = useCallback(
    (id: string, color: StageColor, active: boolean) => {
      const stack = stackRef.current;
      const existingIndex = stack.findIndex((c) => c.id === id);

      if (active) {
        if (existingIndex >= 0) {
          stack[existingIndex] = { id, color };
        } else {
          stack.push({ id, color });
        }
      } else if (existingIndex >= 0) {
        stack.splice(existingIndex, 1);
      }

      resolve();
    },
    [resolve],
  );

  useEffect(() => {
    document.documentElement.dataset.stage = "dark";
  }, []);

  return (
    <StageContext.Provider value={{ activeColor, claim }}>{children}</StageContext.Provider>
  );
}

export function useStage(): StageContextValue {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("useStage must be used within a StageProvider");
  return ctx;
}

/** Claim the "cream" stage while `active` is true; releases automatically on unmount. */
export function useStageClaim(id: string, color: StageColor, active: boolean) {
  const { claim } = useStage();

  useEffect(() => {
    claim(id, color, active);
    return () => claim(id, color, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, color, active]);
}
