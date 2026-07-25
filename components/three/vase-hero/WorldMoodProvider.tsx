"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { WORLDS } from "@/lib/worlds";

type WorldMoodContextValue = {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
};

const WorldMoodContext = createContext<WorldMoodContextValue | null>(null);

/**
 * Single source of truth for "which World is currently active," shared by
 * the hero index buttons, the world rows section, and the vase's key
 * light — this is the cross-section coupling described in
 * Design_System_v3.md §5 "World hover linking."
 */
export function WorldMoodProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const value = useMemo(() => ({ activeIndex, setActiveIndex }), [activeIndex]);
  return <WorldMoodContext.Provider value={value}>{children}</WorldMoodContext.Provider>;
}

export function useWorldMood() {
  const ctx = useContext(WorldMoodContext);
  if (!ctx) throw new Error("useWorldMood must be used within a WorldMoodProvider");
  return ctx;
}

export function useActiveWorld() {
  const { activeIndex } = useWorldMood();
  return WORLDS[activeIndex];
}
