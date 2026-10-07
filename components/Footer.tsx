import { config } from "@/lib/config";
import { NAV } from "@/lib/content";
import { BackToTop } from "./BackToTop";

const link = "hover:text-periwinkle";
const heading = "mb-1.5 text-[11px] tracking-[.2em] text-stone-4 uppercase";
const letter = "inline-block transition-[transform,color] duration-[.6s] ease-kk hover:-translate-y-[8%] hover:text-periwinkle";

export function Footer() {
  const { studioEmail: email, instagramUrl: ig, linkedinUrl: li, behanceUrl: be } = config;
  const social = [[ig, "Instagram"], [li, "LinkedIn"], [be, "Behance"]].filter(([u]) => u);
  return (
    <footer data-screen-label="10 Footer" className="overflow-hidden bg-ink px-[clamp(20px,4vw,56px)] pt-[clamp(72px,9vw,128px)] pb-7 text-paper">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-8 gap-y-12 pb-[clamp(56px,7vw,96px)]">
        <div className="flex flex-col gap-[18px]">
          <p className="m-0 font-serif text-[28px] leading-[1.1]">A creative studio for<br />ideas in any form.</p>
          {config.showScriptAccent && (
            <p aria-hidden="true" className="mt-1 mb-0 origin-left -rotate-6 font-script text-[40px] leading-none text-periwinkle">More than an agency. A canvas.</p>
          )}
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
          <span className={heading}>Index</span>
          {NAV.map((n) => <a key={n.href} href={n.href} className={link}>{n.label}</a>)}
          <a href="#contact" className={link}>Start a project</a>
        </nav>
        <div className="flex flex-col gap-3 text-sm">
          <span className={heading}>Contact</span>
          {email && <a href={`mailto:${email}`} className={link}>{email}</a>}
          <a href="#contact" className={link}>Project enquiry form</a>
          {social.map(([u, name]) => (
            <a key={name} href={u} target="_blank" rel="noopener" className={link}>{name} <span className="glyph">↗</span></a>
          ))}
        </div>
        <div className="flex flex-col items-start gap-3">
          <span className={heading}>Studio</span>
          <span className="text-sm">Est. 2025 · India</span>
          <span lang="hi" className="font-hindi text-[22px]">कोरा कागज़</span>
        </div>
      </div>
      <p aria-hidden="true" data-letters="" className="m-0 flex items-start font-serif text-[clamp(64px,18.5vw,320px)] leading-[.78] tracking-[-.02em] whitespace-nowrap uppercase">
        {"Kora Kaagaz".split("").map((ch, i) =>
          ch === " " ? <span key={i} className="inline-block w-[.22em]" /> : <span key={i} className={letter}>{ch}</span>,
        )}
        <span className="mt-[.6em] font-sans text-[max(9px,1.2vw)] tracking-[.05em]">TM</span>
      </p>
      <div className="mt-[clamp(32px,4vw,56px)] flex flex-wrap items-center justify-between gap-4 border-t border-[#333] pt-5 text-xs text-stone-4">
        <span>© {new Date().getFullYear()} Kora Kaagaz. All rights reserved.</span>
        <span>Nothing fixed. Everything possible.</span>
        <BackToTop />
      </div>
    </footer>
  );
}
