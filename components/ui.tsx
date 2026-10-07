import type { ComponentProps } from "react";

/** The studio's "blank canvas" corner brackets. */
export function Brackets({ inset, insetX = inset, size, weight = "1px" }: { inset: string; insetX?: string; size: number; weight?: string }) {
  const base = "absolute border-paper";
  const s = { width: size, height: size, borderWidth: 0 } as const;
  return (
    <>
      <span className={base} style={{ ...s, top: inset, left: insetX, borderTopWidth: weight, borderLeftWidth: weight }} />
      <span className={base} style={{ ...s, top: inset, right: insetX, borderTopWidth: weight, borderRightWidth: weight }} />
      <span className={base} style={{ ...s, bottom: inset, left: insetX, borderBottomWidth: weight, borderLeftWidth: weight }} />
      <span className={base} style={{ ...s, bottom: inset, right: insetX, borderBottomWidth: weight, borderRightWidth: weight }} />
    </>
  );
}

/** Uppercase text link with an underline that turns cobalt on hover. */
export function UnderlineLink({ className = "", children, ...rest }: ComponentProps<"a">) {
  return (
    <a
      className={`flex min-h-11 items-center gap-3 self-start border-b border-ink text-xs font-semibold tracking-[.14em] uppercase hover:border-cobalt hover:text-cobalt ${className}`}
      {...rest}
    >
      {children} <span aria-hidden="true" className="glyph">→</span>
    </a>
  );
}

export const sectionX = "px-[clamp(20px,4vw,56px)]";
export const h2Big = "m-0 font-serif text-[clamp(48px,6.4vw,104px)] leading-[.92] font-normal tracking-[-.02em]";
