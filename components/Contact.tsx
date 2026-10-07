"use client";

import { useEffect, useRef } from "react";
import { config } from "@/lib/config";
import { mountField } from "@/lib/kk-motion";
import { ContactForm } from "./ContactForm";

export function Contact() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => mountField(canvas.current, { layout: "full", intensity: 0.8 }), []);
  const email = config.studioEmail;

  return (
    <section id="contact" data-screen-label="09 Contact" aria-labelledby="contact-h" className="relative isolate overflow-hidden bg-navy px-[clamp(20px,4vw,56px)] py-[clamp(88px,12vw,168px)] text-paper">
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 -z-20 block h-full w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,26,67,.35)_0%,rgba(7,26,67,.88)_55%,rgba(7,26,67,.92)_100%)]"
      />
      <div className="grid grid-cols-1 items-start gap-x-[clamp(40px,7vw,120px)] gap-y-16 nav:grid-cols-2">
        <div data-reveal="" className="flex flex-col gap-8">
          <p className="eyebrow text-mist">09 — Start a project</p>
          <h2 id="contact-h" data-mask="" className="m-0 font-serif text-[clamp(56px,8vw,136px)] leading-[.88] font-normal tracking-[-.03em]">
            Got something<br /><em className="text-ice">in mind?</em>
          </h2>
          <p className="m-0 max-w-[420px] text-[clamp(16px,1.25vw,18px)] leading-[1.6] text-pretty text-haze">
            You don&apos;t need a finished brief. You don&apos;t need all the answers. Just tell us what you&apos;re thinking about.
          </p>
          {email && (
            <a href={`mailto:${email}`} className="flex min-h-11 items-center gap-3 self-start border-b border-[rgba(250,248,243,.6)] text-xs font-semibold tracking-[.14em] uppercase hover:border-paper">
              Email the studio <span aria-hidden="true" className="glyph">→</span>
            </a>
          )}
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
