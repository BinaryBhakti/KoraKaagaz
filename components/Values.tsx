"use client";

import { useEffect, useRef, useState } from "react";
import { VALUES } from "@/lib/content";
import { h2Big } from "./ui";

export function Values() {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step)); }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    list.current?.querySelectorAll("[data-step]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section data-screen-label="07 How we work" aria-labelledby="values-h" className="bg-sand px-[clamp(20px,4vw,56px)] py-[clamp(88px,12vw,168px)]">
      <div className="grid grid-cols-1 items-start gap-x-[clamp(32px,6vw,96px)] gap-y-12 nav:grid-cols-[1.2fr_1fr]">
        <div data-reveal="" className="static top-[120px] flex flex-col gap-7 nav:sticky">
          <p className="eyebrow text-cobalt">07 — How we work</p>
          <h2 id="values-h" data-mask="" className={h2Big}>You bring the idea.<br /><em>We give it a form.</em></h2>
        </div>
        <ol ref={list} className="m-0 list-none border-t border-ink p-0">
          {VALUES.map((t, i) => {
            const on = i === active;
            return (
              <li
                key={t}
                data-step={i}
                className="grid grid-cols-[56px_1fr_auto] items-baseline gap-3 border-b border-rule py-[clamp(22px,3.4vw,40px)] transition-[opacity,padding] duration-500 ease-kk hover:pl-3.5"
                style={{ opacity: on ? 1 : 0.3 }}
              >
                <span className="text-[11px] font-semibold tracking-[.2em] text-cobalt">0{i + 1}</span>
                <span className="font-serif text-[clamp(28px,3.4vw,52px)] leading-[1.05]">{t}</span>
                <span
                  aria-hidden="true"
                  className="block h-[18px] w-[18px] border-t-[1.5px] border-r-[1.5px] border-cobalt transition-transform duration-500"
                  style={{ transform: on ? "rotate(45deg)" : "rotate(-45deg)" }}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
