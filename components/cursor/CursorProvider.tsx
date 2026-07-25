"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CursorState = "default" | "hover" | "drag" | "3d";

type CursorContextValue = {
  state: CursorState;
  label: string;
  /** Set the cursor state and optional label (e.g. "View" / "Enter" / a Named Object name). */
  setCursor: (state: CursorState, label?: string) => void;
  /** Convenience: return to default state, clearing the label. */
  resetCursor: () => void;
};

const CursorContext = createContext<CursorContextValue | null>(null);

export function useCursor(): CursorContextValue {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return ctx;
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const lastCall = useRef(0);

  const setCursor = useCallback((next: CursorState, nextLabel = "") => {
    lastCall.current += 1;
    setState(next);
    setLabel(nextLabel);
  }, []);

  const resetCursor = useCallback(() => {
    setState("default");
    setLabel("");
  }, []);

  const value = useMemo(
    () => ({ state, label, setCursor, resetCursor }),
    [state, label, setCursor, resetCursor],
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}
