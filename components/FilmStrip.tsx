"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { dragScroll } from "@/lib/kk-motion";

export function FilmStrip({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => dragScroll(ref.current), []);
  return (
    <div
      ref={ref}
      data-cursor="Drag"
      role="region"
      aria-label="Visual language image strip"
      tabIndex={0}
      className="no-scrollbar flex snap-x snap-mandatory gap-[clamp(12px,1.4vw,20px)] overflow-x-auto px-[clamp(20px,4vw,56px)] pb-2 select-none"
    >
      {children}
    </div>
  );
}
