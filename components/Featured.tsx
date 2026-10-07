import { Brackets, UnderlineLink } from "./ui";

export function Featured() {
  return (
    <section id="featured" data-screen-label="04 Featured case" aria-labelledby="featured-h" className="bg-paper px-[clamp(20px,4vw,56px)] py-[clamp(72px,10vw,144px)]">
      <div className="grid grid-cols-1 items-center gap-x-[clamp(32px,6vw,96px)] gap-y-10 nav:grid-cols-[7fr_5fr]">
        <div data-wipe="" className="relative aspect-[4/5] overflow-hidden bg-cobalt text-paper">
          <img src="/assets/texture-blue.png" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover blur-[1px] saturate-[1.1]" />
          <Brackets inset="22%" insetX="20%" size={44} weight="1.5px" />
          <span className="absolute inset-0 flex items-center justify-center font-serif text-[clamp(64px,8vw,132px)] tracking-[-.02em] italic">Aeris</span>
          <span className="absolute bottom-5 left-[22px] text-[10px] tracking-[.22em] uppercase">A clearer, calmer tomorrow</span>
        </div>
        <div data-reveal="" data-parallax="-0.06" className="flex max-w-[520px] flex-col gap-7">
          <p className="eyebrow text-cobalt">04 — Featured project</p>
          <h2 id="featured-h" data-mask="" className="m-0 font-serif text-[clamp(64px,8vw,128px)] leading-[.88] font-normal tracking-[-.03em]">Aeris</h2>
          <p className="m-0 font-serif text-[clamp(24px,2.2vw,32px)] leading-[1.2] text-pretty">
            A considered identity and digital experience built around the idea of a clearer, calmer tomorrow.
          </p>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-t border-rule pt-5 text-[13px]">
            {[["Type", "Studio concept"], ["Services", "Brand Identity / Digital Experience"], ["Case study", "In preparation"]].map(([t, d]) => (
              <div key={t} className="contents">
                <dt className="text-[11px] tracking-[.16em] text-stone-3 uppercase">{t}</dt>
                <dd className="m-0">{d}</dd>
              </div>
            ))}
          </dl>
          <UnderlineLink href="#contact">Talk to us about Aeris</UnderlineLink>
        </div>
      </div>
    </section>
  );
}
