"use client";

import { useEffect, useRef } from "react";
import { config } from "@/lib/config";
import { HERO_STRIP, NAV } from "@/lib/content";
import { mountField } from "@/lib/kk-motion";
import { useMenu } from "./Chrome";

const wordMask = "inline-block align-top [clip-path:inset(-80%_-30%_0_-30%)] pb-[.12em] -mb-[.12em]";

function Word({ children, italic }: { children: string; italic?: boolean }) {
  return (
    <span className={`${wordMask} ${italic ? "pr-[.08em]" : "pr-[.04em]"}`}>
      <span data-rise="" className={`inline-block ${italic ? "text-ice italic" : ""}`}>{children}</span>
    </span>
  );
}

export function Hero() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { open, setOpen } = useMenu();
  useEffect(() => {
    const hero = canvas.current?.parentElement;
    // Crest the arc in the gap between the CTAs and the bottom strip so it never runs behind the copy.
    const arcApex = () => {
      const cta = hero?.querySelector<HTMLElement>("[data-hero-out]")?.lastElementChild as HTMLElement | null;
      const strip = hero?.querySelector<HTMLElement>("ul");
      return cta && strip ? (cta.offsetTop + cta.offsetHeight + strip.offsetTop) / 2 : null;
    };
    return mountField(canvas.current, { layout: "sheet", arcApex });
  }, []);

  return (
    <section
      id="top"
      data-screen-label="01 Hero"
      aria-label="Introduction"
      className="relative isolate flex min-h-[max(680px,100svh)] flex-col overflow-hidden bg-navy px-[clamp(20px,4vw,56px)] pt-5 pb-6 text-paper"
    >
      <canvas ref={canvas} data-shape={config.heroField} aria-hidden="true" className="absolute inset-0 -z-20 block h-full w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden min-[760px]:block"
        style={{
          background:
            "radial-gradient(ellipse 46% 26% at 50% 62%,rgba(7,26,67,.82) 0%,rgba(7,26,67,0) 100%),radial-gradient(ellipse 58% 50% at 50% 50%,rgba(7,26,67,.9) 0%,rgba(7,26,67,.5) 60%,rgba(7,26,67,0) 88%),linear-gradient(180deg,rgba(7,26,67,.75) 0%,rgba(7,26,67,0) 16%)",
        }}
      />
      {/* Small screens: the arc sits below the copy, so only the header fade is kept and the arc stays at full strength. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 min-[760px]:hidden"
        style={{ background: "linear-gradient(180deg,rgba(7,26,67,.75) 0%,rgba(7,26,67,0) 16%)" }}
      />

      <header data-fade="" className="flex min-h-[52px] w-full items-center justify-between gap-6">
        <a href="#top" aria-label="Kora Kaagaz — home" className="flex items-start gap-0.5 font-serif text-[23px] leading-[.82] tracking-[.01em] uppercase">
          <span className="flex flex-col"><span>Kora</span><span>Kaagaz</span></span>
          <span className="mt-0.5 font-sans text-[7px] tracking-[.05em]">TM</span>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-[clamp(20px,2.6vw,40px)] text-xs font-medium tracking-[.14em] uppercase nav:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="border-b border-transparent py-1.5 transition-[border-color] duration-300 hover:border-current">{n.label}</a>
          ))}
          <a
            href="#contact"
            className="flex items-center gap-2.5 border border-[rgba(250,248,243,.6)] px-[18px] py-[11px] transition-[background,color,border-color] duration-300 hover:border-paper hover:bg-paper hover:text-navy"
          >
            Start a project <span aria-hidden="true" className="glyph">→</span>
          </a>
        </nav>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex min-h-11 cursor-pointer items-center gap-3 border-0 bg-transparent px-1 text-xs font-medium tracking-[.14em] text-inherit uppercase nav:hidden"
        >
          Menu
          <span aria-hidden="true" className="flex flex-col gap-1.5">
            <span className="block h-px w-6 bg-current" />
            <span className="ml-2 block h-px w-4 bg-current" />
          </span>
        </button>
      </header>

      <div
        data-hero-out=""
        className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col items-center justify-center gap-[clamp(18px,3svh,30px)] py-[clamp(32px,6svh,72px)] text-center"
      >
        <span
          data-fade=""
          className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(138,168,255,.35)] bg-[rgba(7,26,67,.55)] px-3.5 py-2 text-[10.5px] font-semibold tracking-[.2em] text-haze uppercase backdrop-blur-[10px]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-periwinkle shadow-[0_0_10px_#8AA8FF]" />
          Independent creative studio · Est. 2025 · India
        </span>
        <h1 className="m-0 font-serif text-[clamp(32px,min(10.4vw,15svh),136px)] leading-[.86] font-normal tracking-[-.035em] text-balance [text-shadow:0_2px_24px_rgba(7,26,67,.85)]">
          <Word>Nothing</Word> <Word>fixed.</Word>
          <br />
          <Word italic>Everything</Word> <Word>possible.</Word>
        </h1>
        <p
          data-fade=""
          className="m-0 max-w-[40ch] text-[clamp(17px,1.7vw,21px)] leading-normal font-medium text-pretty text-paper [text-shadow:0_1px_2px_rgba(7,26,67,.9),0_0_28px_rgba(7,26,67,.95),0_0_60px_rgba(7,26,67,.8)]"
        >
          We turn ambitious ideas into identities, digital experiences, and things worth remembering.
        </p>
        <div data-fade="" className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3.5">
          <a
            href="#contact"
            className="btn-shimmer flex min-h-[60px] items-stretch overflow-hidden rounded-[3px] text-[13px] font-semibold tracking-[.14em] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_16px_50px_-14px_rgba(6,75,255,.9)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_20px_56px_-12px_rgba(6,75,255,1)]"
          >
            <span className="flex items-center px-6">Start a project</span>
            <span aria-hidden="true" className="glyph flex w-[60px] items-center justify-center border-l border-[rgba(250,248,243,.28)] text-lg">→</span>
          </a>
          <a href="#services" className="flex min-h-11 items-center gap-2.5 border-b border-[rgba(250,248,243,.45)] text-xs font-semibold tracking-[.14em] uppercase hover:border-paper">
            Explore our work <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <ul data-fade="" aria-label="What we work with" className="mx-auto grid w-full max-w-[980px] list-none grid-cols-3 border-t border-[rgba(138,168,255,.25)] p-0 max-[759px]:bg-[rgba(7,26,67,.6)] max-[759px]:backdrop-blur-[6px] sm:grid-cols-6">
        {HERO_STRIP.map((s, i) => (
          <li
            key={s}
            className={`py-[15px] text-center text-[10.5px] font-medium tracking-[.22em] text-mist uppercase ${i ? "border-l border-[rgba(138,168,255,.2)]" : ""}`}
          >
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
