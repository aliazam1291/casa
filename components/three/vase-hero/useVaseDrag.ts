"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "@/components/cursor/CursorProvider";

export type DragState = {
  rotY: number;
  rotX: number;
  targetRotY: number;
  targetRotX: number;
  dragging: boolean;
};

/**
 * Pointer-drag rotation for the vase — ported from wolf-casa-homepage-v3.html
 * (~line 757). State lives in a ref (not React state) so the render loop can
 * read it every frame without triggering re-renders.
 */
export function useVaseDrag(
  mountRef: React.RefObject<HTMLDivElement | null>,
  reducedMotion: boolean,
) {
  const drag = useRef<DragState>({
    rotY: 0,
    rotX: 0,
    targetRotY: 0,
    targetRotX: 0,
    dragging: false,
  });
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    if (reducedMotion) return;
    const mount = mountRef.current;
    if (!mount) return;

    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      drag.current.dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      setCursor("drag");
    };
    const onPointerUp = () => {
      if (!drag.current.dragging) return;
      drag.current.dragging = false;
      resetCursor();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drag.current.dragging) return;
      drag.current.targetRotY += (e.clientX - lastX) * 0.008;
      drag.current.targetRotX += (e.clientY - lastY) * 0.005;
      drag.current.targetRotX = Math.max(-0.6, Math.min(0.6, drag.current.targetRotX));
      lastX = e.clientX;
      lastY = e.clientY;
    };

    mount.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      mount.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return drag;
}
