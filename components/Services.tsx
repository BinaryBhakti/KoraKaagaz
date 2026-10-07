"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICES } from "@/lib/content";

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Pinned sequence: the section is ~4 viewports tall and its sticky stage swaps services as you scroll. */
export function Services() {
  const ref = useRef<HTMLElement>(null);
  const [k, setK] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onS = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = clamp01(-r.top / Math.max(1, r.height - innerHeight));
        setK(p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3);
      });
    };
    addEventListener("scroll", onS, { passive: true });
    onS();
    return () => { removeEventListener("scroll", onS); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section
      id="services"
      ref={ref}
      data-screen-label="02 What we make (pinned)"
      aria-labelledby="services-h"
      className="relative h-[380svh] bg-sand sm:h-[440svh]"
    >
      <div className="sticky top-0 flex h-svh flex-col gap-[clamp(16px,3svh,32px)] overflow-hidden px-[clamp(20px,4vw,56px)] pt-[clamp(76px,11svh,112px)] pb-[clamp(24px,4svh,40px)]">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="flex flex-col gap-3">
            <p className="eyebrow text-cobalt">02 — What we make</p>
            <h2 id="services-h" className="m-0 font-serif text-[clamp(34px,4.2vw,64px)] leading-[.95] font-normal tracking-[-.02em]">
              Ideas take <em>many forms.</em>
            </h2>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="text-[11px] font-semibold tracking-[.2em] text-stone-3">0{k + 1} / 04</span>
            <div className="flex gap-1.5">
              {SERVICES.map((_, i) => (
                <span key={i} className="h-0.5 w-7 transition-[background] duration-[.4s]" style={{ background: i <= k ? "#064BFF" : "#D6D5D1" }} />
              ))}
            </div>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 border-t border-ink">
          {SERVICES.map((s, i) => {
            const on = i === k;
            return (
              <article
                key={s.title}
                aria-hidden={!on}
                className="absolute inset-0 grid grid-cols-1 items-center gap-[clamp(20px,4vw,72px)] pt-[clamp(16px,3svh,32px)] nav:grid-cols-[5fr_6fr]"
                style={{
                  opacity: on ? 1 : 0,
                  pointerEvents: on ? "auto" : "none",
                  transform: i < k ? "translateY(-6%) scale(.97)" : i > k ? "translateY(6%)" : "none",
                  filter: on ? "none" : "blur(10px)",
                  transition: "opacity .6s,transform .9s cubic-bezier(.2,.7,.2,1),filter .6s",
                }}
              >
                <div className="flex flex-col gap-[clamp(14px,2.4svh,26px)]">
                  <span className="text-[11px] font-semibold tracking-[.2em] text-cobalt">{s.label}</span>
                  <h3 className="m-0 font-serif text-[clamp(72px,20vw,120px)] leading-[.85] font-normal tracking-[-.035em] nav:text-[clamp(96px,11vw,200px)]">
                    {s.italic ? <em>{s.title}</em> : s.title}
                  </h3>
                  <ul className="m-0 grid max-w-[460px] list-none grid-cols-2 gap-x-6 gap-y-2.5 border-t border-rule p-0 pt-4 text-[15px] text-stone-1">
                    {s.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                  {s.cta && (
                    <a href="#contact" tabIndex={on ? 0 : -1} className="flex min-h-11 items-center gap-2.5 self-start border-b border-cobalt text-[11px] font-semibold tracking-[.16em] text-cobalt uppercase">
                      Start a project <span aria-hidden="true" className="glyph">→</span>
                    </a>
                  )}
                </div>
                <div
                  className="h-[32svh] overflow-hidden nav:h-[min(58svh,640px)]"
                  style={{
                    background: s.img.bg,
                    clipPath: on ? "inset(0 0 0 0)" : i < k ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)",
                    transition: "clip-path 1.1s cubic-bezier(.7,0,.2,1)",
                  }}
                >
                  <img
                    src={s.img.src}
                    alt={s.img.alt}
                    className="block h-full w-full object-cover"
                    style={{
                      objectPosition: s.img.position,
                      filter: s.img.grayscale ? "grayscale(1) contrast(1.05)" : undefined,
                      transform: on ? "scale(1)" : "scale(1.15)",
                      transition: "transform 1.6s cubic-bezier(.2,.7,.2,1)",
                    }}
                  />
                </div>
              </article>
            );
          })}
        </div>
        <p className="m-0 text-[10.5px] font-semibold tracking-[.22em] text-stone-3 uppercase">{k < 3 ? "Keep scrolling ↓" : "Ideas in any form."}</p>
      </div>
    </section>
  );
}
