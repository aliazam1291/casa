"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { useCursor } from "./CursorProvider";

type HoverItemProps = {
  children: ReactNode;
  /** Label shown in the cursor while hovering, e.g. "View" / "Enter" / "Read". */
  cursorLabel?: string;
  className?: string;
  as?: "div" | "span";
  onClick?: () => void;
};

/**
 * Generic hover-tracking wrapper: sets the cursor to `hover` with a label
 * while the pointer is over it, and drives the `.magnetic` child (if any)
 * toward the cursor at 40% offset — Design_System_v3.md §5.
 */
export function HoverItem({
  children,
  cursorLabel = "View",
  className,
  as = "div",
  onClick,
}: HoverItemProps) {
  const { setCursor, resetCursor } = useCursor();
  const ref = useRef<HTMLDivElement & HTMLSpanElement>(null);

  const onMouseEnter = () => setCursor("hover", cursorLabel);
  const onMouseLeave = () => {
    resetCursor();
    const magnetic = ref.current?.querySelector<HTMLElement>("[data-magnetic]");
    if (magnetic) magnetic.style.transform = "translate(0,0)";
  };
  const onMouseMove = (e: MouseEvent) => {
    const magnetic = ref.current?.querySelector<HTMLElement>("[data-magnetic]");
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.4;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.4;
    magnetic.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span data-magnetic className={className} style={{ display: "inline-block", transition: "transform .18s ease-out" }}>
      {children}
    </span>
  );
}
