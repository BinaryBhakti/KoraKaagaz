import { JOURNAL } from "@/lib/content";

export function Journal() {
  return (
    <section id="journal" data-screen-label="08 Journal" aria-labelledby="journal-h" className="bg-char px-[clamp(20px,4vw,56px)] py-[clamp(88px,12vw,168px)] text-paper">
      <div data-reveal="" className="grid grid-cols-1 items-end gap-x-[clamp(32px,6vw,96px)] gap-y-8 pb-[clamp(48px,6vw,80px)] nav:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-7">
          <p className="eyebrow text-periwinkle">08 — Journal</p>
          <h2 id="journal-h" data-mask="" className="m-0 font-serif text-[clamp(48px,7vw,112px)] leading-[.92] font-normal tracking-[-.02em]">
            From<br /><em>the blank.</em>
          </h2>
        </div>
        <p className="m-0 max-w-[420px] text-[clamp(16px,1.25vw,18px)] leading-[1.6] text-pretty text-stone-5">
          Notes on design, technology, branding and creative practice. The first entries are being written now.
        </p>
      </div>
      <ul className="m-0 list-none border-t border-paper p-0">
        {JOURNAL.map((j) => (
          <li
            key={j.title}
            data-reveal=""
            data-preview={j.preview}
            className="grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-[#3A3A3A] py-7 transition-[padding] duration-500 ease-kk hover:pl-4 sm:grid-cols-[160px_1fr_auto]"
          >
            <span className="text-[11px] tracking-[.2em] text-stone-4 uppercase">{j.tag}</span>
            <span className="font-serif text-[clamp(28px,3.2vw,48px)] leading-[1.05]">{j.title}</span>
            <span className="text-[11px] tracking-[.2em] text-periwinkle uppercase">In the works</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
