"use client";

import { useEffect, useRef } from "react";
import { config } from "@/lib/config";
import { MARQ } from "@/lib/content";
import { marqueeV } from "@/lib/kk-motion";

/** Cobalt word band; speeds up, reverses and skews with scroll velocity. */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (config.motion ? marqueeV(ref.current, 60) : undefined), []);
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-cobalt-deep bg-cobalt py-[clamp(18px,2.4vw,32px)] text-paper">
      <div ref={ref} className="flex w-max will-change-transform">
        {[...MARQ, ...MARQ].map(([w, style], i) => (
          <span key={i} className="flex items-center gap-[clamp(24px,3vw,48px)] pr-[clamp(24px,3vw,48px)] font-serif text-[clamp(44px,6vw,96px)] leading-none whitespace-nowrap">
            <span style={{ fontStyle: style }}>{w}</span>
            <span className="block h-[clamp(18px,2vw,28px)] w-[clamp(18px,2vw,28px)] border-t-[1.5px] border-l-[1.5px] border-paper" />
          </span>
        ))}
      </div>
    </div>
  );
}
