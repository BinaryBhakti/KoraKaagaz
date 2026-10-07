"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { NAV } from "@/lib/content";

const MenuCtx = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });
export const useMenu = () => useContext(MenuCtx);

/** Owns the mobile menu state and renders the sticky bar + menu dialog around the page. */
export function Chrome({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
  return (
    <MenuCtx.Provider value={{ open, setOpen }}>
      <StickyBar />
      {open && <MobileMenu />}
      {children}
    </MenuCtx.Provider>
  );
}

function StickyBar() {
  const { setOpen } = useMenu();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onS = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const hero = document.getElementById("top");
        setShown(scrollY > (hero ? hero.offsetHeight : innerHeight) * 0.85);
      });
    };
    addEventListener("scroll", onS, { passive: true });
    onS();
    return () => { removeEventListener("scroll", onS); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div
      className="fixed inset-x-0 top-0 z-[55] px-[clamp(12px,3vw,24px)] py-2.5 transition-transform duration-[.6s] ease-kk"
      style={{ transform: shown ? "none" : "translateY(-130%)" }}
    >
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 rounded border border-[rgba(138,168,255,.22)] bg-[rgba(23,23,23,.74)] py-2 pr-2 pl-[18px] text-paper backdrop-blur-[18px] backdrop-saturate-[1.4]">
        <a href="#top" aria-label="Kora Kaagaz — back to top" className="font-serif text-xl tracking-[.02em] uppercase">Kora Kaagaz</a>
        <nav aria-label="Sticky" className="hidden items-center gap-[clamp(18px,2.4vw,34px)] text-[11px] font-medium tracking-[.16em] uppercase nav:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="border-b border-transparent py-1.5 hover:border-paper">{n.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#contact" className="btn-shimmer flex min-h-11 items-center gap-2.5 rounded-[3px] px-4 text-[11px] font-semibold tracking-[.14em] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,.25)]">
            Start a project <span aria-hidden="true" className="glyph">→</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-[3px] border border-[rgba(250,248,243,.3)] bg-transparent text-paper nav:hidden"
          >
            <span aria-hidden="true" className="flex flex-col gap-[5px]">
              <span className="block h-px w-[18px] bg-current" />
              <span className="block h-px w-[18px] bg-current" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileMenu() {
  const { setOpen } = useMenu();
  const close = () => setOpen(false);
  return (
    <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[80] flex flex-col bg-ink px-5 pt-[18px] pb-7 text-paper">
      <div className="flex items-center justify-between">
        <span className="flex flex-col font-serif text-[23px] leading-[.82] uppercase"><span>Kora</span><span>Kaagaz</span></span>
        <button type="button" onClick={close} autoFocus className="min-h-11 min-w-11 cursor-pointer border-0 bg-transparent text-xs font-medium tracking-[.14em] text-inherit uppercase">
          Close <span className="glyph">✕</span>
        </button>
      </div>
      <nav aria-label="Mobile" className="mt-auto flex flex-col border-t border-[#333]">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={close} className="flex items-baseline justify-between border-b border-[#333] py-4 font-serif text-[44px] leading-none">
            <span>{n.label}</span>
            <span className="font-sans text-[11px] font-medium tracking-[.14em] text-stone-4">{n.n}</span>
          </a>
        ))}
      </nav>
      <a href="#contact" onClick={close} className="mt-7 flex min-h-14 items-center justify-between bg-cobalt px-5 text-[13px] font-semibold tracking-[.14em] text-paper uppercase">
        <span>Start a project</span><span aria-hidden="true" className="glyph">→</span>
      </a>
    </div>
  );
}
