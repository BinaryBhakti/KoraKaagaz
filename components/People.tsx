import { PHOTOS } from "@/lib/content";
import { FilmStrip } from "./FilmStrip";
import { UnderlineLink, h2Big } from "./ui";

export function People() {
  return (
    <section id="people" data-screen-label="05 People" aria-labelledby="people-h" className="border-t border-rule bg-sand pt-[clamp(88px,12vw,168px)] pb-[clamp(72px,9vw,128px)]">
      <div className="grid grid-cols-1 items-center gap-x-[clamp(32px,6vw,96px)] gap-y-14 px-[clamp(20px,4vw,56px)] nav:grid-cols-[5fr_7fr]">
        <div data-reveal="" data-parallax="-0.05" className="flex flex-col gap-7">
          <p className="eyebrow text-cobalt">05 — People</p>
          <h2 id="people-h" data-mask="" className={h2Big}>The people<br /><em>behind the work.</em></h2>
          <p className="m-0 max-w-[400px] text-[clamp(16px,1.25vw,18px)] leading-[1.6] text-pretty text-stone-2">
            Different perspectives. Shared curiosity. A belief in making things with care.
          </p>
          <p className="m-0 font-serif text-2xl leading-[1.2] italic">Curious people. Building what excites us.</p>
          <UnderlineLink href="#studio">About the studio</UnderlineLink>
        </div>
        <div data-wipe="" className="aspect-[4/3] overflow-hidden bg-char">
          <img
            src="/assets/figure-frame.png"
            alt="A figure walking through a concrete corridor, framed by the studio's canvas brackets"
            loading="lazy"
            className="block h-full w-full object-cover object-[40%_45%] grayscale contrast-[1.06]"
          />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-4 px-[clamp(20px,4vw,56px)] pt-[clamp(64px,8vw,112px)] pb-5">
        <p className="eyebrow">Visual language</p>
        <p className="m-0 text-[11px] tracking-[.2em] text-stone-3 uppercase">Drag <span className="glyph">→</span></p>
      </div>
      <FilmStrip>
        {PHOTOS.map((ph, i) => (
          <figure key={ph.src} className="group m-0 flex flex-[0_0_clamp(220px,24vw,320px)] snap-start flex-col gap-2.5">
            <div className="aspect-[3/4] overflow-hidden bg-ink">
              <img
                src={ph.src}
                alt={ph.alt}
                loading="lazy"
                draggable={false}
                className="block h-full w-full object-cover transition-transform duration-[1.2s] ease-kk group-hover:scale-[1.05]"
              />
            </div>
            <figcaption className="flex justify-between text-[10.5px] tracking-[.2em] text-stone-2 uppercase">
              <span>{ph.cap}</span><span>0{i + 1}</span>
            </figcaption>
          </figure>
        ))}
      </FilmStrip>
    </section>
  );
}
