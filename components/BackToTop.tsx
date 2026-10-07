"use client";

export function BackToTop() {
  const toTop = () => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <button
      type="button"
      onClick={toTop}
      className="flex min-h-11 cursor-pointer items-center gap-2.5 border-0 bg-transparent text-[11px] font-semibold tracking-[.18em] text-paper uppercase hover:text-periwinkle"
    >
      Back to top <span aria-hidden="true">↑</span>
    </button>
  );
}
