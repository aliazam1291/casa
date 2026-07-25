"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

function probe(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cached = !!gl;
  } catch {
    cached = false;
  }
  return cached;
}

function subscribe() {
  // One-time probe, nothing to subscribe to.
  return () => {};
}

function getServerSnapshot() {
  return true;
}

/** One-time WebGL support probe, cached for the session. */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribe, probe, getServerSnapshot);
}
