const LEAD = ["We", "don't", "start", "with", "the", "medium."];
const TAIL = ["We", "start", "with", "the", "idea."];

const words = (ws: string[]) => ws.flatMap((w, i) => [i ? " " : null, <span key={i} data-w="">{w}</span>]);

export function Studio() {
  return (
    <section id="studio" data-screen-label="06 Studio philosophy" aria-labelledby="studio-h" className="grid grid-cols-1 bg-cobalt text-paper nav:grid-cols-2">
      <div className="flex flex-col justify-between gap-14 px-[clamp(20px,4vw,56px)] py-[clamp(80px,10vw,152px)]">
        <p className="eyebrow">06 — The studio</p>
        <h2
          id="studio-h"
          data-scrub-root=""
          aria-label="We don't start with the medium. We start with the idea."
          className="m-0 font-serif text-[clamp(44px,5.6vw,96px)] leading-[.95] font-normal tracking-[-.02em]"
        >
          {words(LEAD)} <em>{words(TAIL)}</em>
        </h2>
        <div data-reveal="" className="flex max-w-[440px] flex-col gap-6">
          <span aria-hidden="true" className="block h-px w-10 bg-paper" />
          <p className="m-0 text-[clamp(16px,1.25vw,18px)] leading-[1.6] text-pretty">
            Kora Kaagaz is an independent creative studio. We build brands, digital experiences, films, products, and everything in between.
          </p>
        </div>
      </div>
      <div className="relative min-h-[clamp(520px,60vw,860px)] overflow-hidden bg-linen text-ink">
        <div data-wipe="" className="absolute inset-0">
          <img src="/assets/fabric.png" alt="Folds of blank white paper-like fabric" loading="lazy" className="absolute inset-0 h-full w-full object-cover brightness-[1.04] grayscale" />
        </div>
        <div
          data-reveal=""
          data-parallax="0.08"
          className="absolute right-[clamp(20px,4vw,56px)] bottom-[clamp(28px,4vw,56px)] left-[clamp(20px,4vw,56px)] flex flex-col gap-3.5 bg-[rgba(250,248,243,.92)] p-7"
        >
          <p lang="hi" className="m-0 font-hindi text-[clamp(44px,4.6vw,72px)] leading-[1.1]">कोरा कागज़</p>
          <p lang="hi" className="m-0 font-hindi-sans text-lg leading-normal">विचारों के लिए एक खुला संसार।</p>
          <p className="m-0 border-t border-rule pt-3 text-xs tracking-[.14em] text-stone-2 uppercase">A blank sheet of paper — an open world for ideas.</p>
        </div>
      </div>
    </section>
  );
}
