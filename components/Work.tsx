import { Brackets } from "./ui";

function Caption({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-[#333] pt-3.5">
      <h3 className="m-0 font-serif text-[30px] font-normal">{title}</h3>
      <p className="m-0 text-right text-[11px] tracking-[.16em] text-stone-4 uppercase">
        {meta} · <span className="text-paper">Concept</span>
      </p>
    </div>
  );
}

export function Work() {
  return (
    <section id="work" data-screen-label="03 Selected work" aria-labelledby="work-h" className="bg-ink px-[clamp(20px,4vw,56px)] py-[clamp(88px,12vw,168px)] text-paper">
      <div data-reveal="" className="grid grid-cols-1 items-end gap-x-[clamp(32px,6vw,96px)] gap-y-8 pb-[clamp(56px,7vw,104px)] nav:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-7">
          <p className="eyebrow text-periwinkle">03 — Selected work</p>
          <h2 id="work-h" data-mask="" className="m-0 font-serif text-[clamp(48px,7vw,112px)] leading-[.92] font-normal tracking-[-.02em]">
            Things<br /><em>we&apos;ve made.</em>
          </h2>
        </div>
        <div className="flex max-w-[420px] flex-col gap-4">
          <p className="m-0 text-[clamp(16px,1.25vw,18px)] leading-[1.6] text-stone-5">Selected collaborations, ideas, and experiments.</p>
          <p className="m-0 text-xs leading-[1.6] text-stone-4">
            Projects marked <span className="text-paper">Concept</span> are self-initiated studio explorations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-x-[clamp(20px,3vw,48px)] gap-y-[clamp(40px,4vw,64px)] nav:grid-cols-[7fr_5fr]">
        <article data-reveal="snap" className="flex flex-col gap-[18px]">
          <a href="#featured" data-tilt="" data-cursor="View" aria-label="Aeris — view featured project" className="group relative block aspect-[5/4] overflow-hidden bg-cobalt">
            <img
              src="/assets/texture-blue.png"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-[1.05] object-cover blur-[2px] transition-transform duration-[1.4s] ease-kk group-hover:scale-[1.12]"
            />
            <Brackets inset="18px" size={28} />
            <span className="absolute inset-0 flex items-center justify-center font-serif text-[clamp(72px,10vw,168px)] tracking-[-.03em] text-paper">Aeris</span>
          </a>
          <Caption title="Aeris" meta="Brand Identity / Digital" />
        </article>

        <article data-reveal="snap" data-parallax="-0.07" className="flex flex-col gap-[18px] nav:mt-[clamp(80px,12vw,200px)]">
          <div data-tilt="" data-cursor="Soon" className="relative aspect-[4/5] overflow-hidden bg-sand text-ink">
            <span className="absolute top-[18px] left-[18px] text-[11px] font-semibold tracking-[.2em]">02</span>
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="font-serif text-[clamp(64px,7vw,120px)] leading-none tracking-[-.02em] italic">Nimba</span>
              <span className="h-px w-8 bg-ink" />
            </span>
            <span className="absolute right-[18px] bottom-[18px] left-[18px] flex justify-between text-[10px] tracking-[.2em] text-stone-3 uppercase">
              <span>Imagery in preparation</span><span>—</span>
            </span>
          </div>
          <Caption title="Nimba" meta="Case study soon" />
        </article>
      </div>

      <div className="mt-[clamp(56px,7vw,112px)] grid grid-cols-1 items-end gap-x-[clamp(20px,3vw,48px)] gap-y-[clamp(40px,4vw,64px)] nav:grid-cols-[5fr_7fr]">
        <article data-reveal="snap" className="flex flex-col gap-[18px]">
          <div data-tilt="" data-cursor="Soon" className="relative aspect-square overflow-hidden bg-navy">
            <span className="absolute top-[18px] left-[18px] text-[11px] font-semibold tracking-[.2em] text-periwinkle">03</span>
            <span className="absolute inset-0 flex items-center justify-center font-serif text-[clamp(64px,7vw,120px)] tracking-[.04em] text-paper uppercase">Veerha</span>
            <span className="absolute bottom-[18px] left-[18px] text-[10px] tracking-[.2em] text-[#A9B6D8] uppercase">Imagery in preparation</span>
          </div>
          <Caption title="Veerha" meta="Case study soon" />
        </article>
        <article data-reveal="snap" className="flex flex-col gap-[18px]">
          <div data-tilt="" data-cursor="Soon" className="relative aspect-[16/10] overflow-hidden bg-char">
            <span className="absolute top-[18px] left-[18px] text-[11px] font-semibold tracking-[.2em] text-periwinkle">04</span>
            <span className="absolute bottom-[clamp(16px,3vw,40px)] left-[clamp(20px,4vw,56px)] font-serif text-[clamp(80px,12vw,200px)] leading-[.8] tracking-[-.04em] text-paper">
              Sayzo<span className="text-cobalt">.</span>
            </span>
            <span className="absolute top-[18px] right-[18px] text-[10px] tracking-[.2em] text-stone-4 uppercase">Imagery in preparation</span>
          </div>
          <Caption title="Sayzo" meta="Case study soon" />
        </article>
      </div>
    </section>
  );
}
