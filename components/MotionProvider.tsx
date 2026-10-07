"use client";

import { useEffect, type ReactNode } from "react";
import { config } from "@/lib/config";
import { cursor, intro, magnetic, mountMotion, previews, riseIn, scrollFx } from "@/lib/kk-motion";

/** Mounts page-wide motion once the sections below have rendered (child effects run first). */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motion = config.motion && !reduce;
    const hero = document.getElementById("top");
    const off = motion && config.introCurtain ? intro() : 0;
    if (motion) riseIn(hero, off);
    const offs = motion
      ? [
          mountMotion(document),
          scrollFx(document),
          magnetic(document),
          previews(document),
          config.customCursor ? cursor(config.cursorStyle) : null,
        ]
      : [];
    return () => offs.forEach((f) => f?.());
  }, []);
  return <>{children}</>;
}
