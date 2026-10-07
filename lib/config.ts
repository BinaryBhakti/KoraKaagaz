// Site settings (formerly the design tool's editor props). Set via NEXT_PUBLIC_* env vars.
const bool = (v: string | undefined, d: boolean) => (v === undefined || v === "" ? d : v !== "false" && v !== "0");

const HERO_FIELDS = ["auto", "brackets", "horizon", "terrain", "silk", "ink", "glyphs", "lines", "ripple", "spotlight"] as const;
const CURSORS = ["ring", "dot", "brackets", "glow"] as const;
export type HeroField = (typeof HERO_FIELDS)[number];
export type CursorStyle = (typeof CURSORS)[number];

const pick = <T extends string>(v: string | undefined, opts: readonly T[], d: T): T =>
  (opts as readonly string[]).includes(v ?? "") ? (v as T) : d;

export const config = {
  heroField: pick<HeroField>(process.env.NEXT_PUBLIC_HERO_FIELD, HERO_FIELDS, "horizon"),
  cursorStyle: pick<CursorStyle>(process.env.NEXT_PUBLIC_CURSOR_STYLE, CURSORS, "ring"),
  customCursor: bool(process.env.NEXT_PUBLIC_CUSTOM_CURSOR, true),
  introCurtain: bool(process.env.NEXT_PUBLIC_INTRO, true),
  motion: bool(process.env.NEXT_PUBLIC_MOTION, true),
  showScriptAccent: bool(process.env.NEXT_PUBLIC_SCRIPT_ACCENT, true),
  formEndpoint: (process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "").trim(),
  studioEmail: (process.env.NEXT_PUBLIC_STUDIO_EMAIL ?? "").trim(),
  instagramUrl: (process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "").trim(),
  linkedinUrl: (process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "").trim(),
  behanceUrl: (process.env.NEXT_PUBLIC_BEHANCE_URL ?? "").trim(),
};
