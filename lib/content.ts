export const NAV = [
  { href: "#work", label: "Work", n: "03" },
  { href: "#services", label: "Services", n: "02" },
  { href: "#studio", label: "Studio", n: "06" },
  { href: "#people", label: "About", n: "05" },
  { href: "#journal", label: "Journal", n: "08" },
];

export const HERO_STRIP = ["Ideas", "People", "Technology", "Design", "Motion", "And beyond"];

export type Service = {
  label: string;
  title: string;
  italic?: boolean;
  items: string[];
  img: { src: string; alt: string; position?: string; bg: string; grayscale?: boolean };
  cta?: boolean;
};

export const SERVICES: Service[] = [
  {
    label: "01 / Digital",
    title: "Digital",
    items: ["Websites", "Digital Products", "UI/UX Design", "Web Development", "AI Experiences"],
    img: { src: "/assets/site-portrait.png", alt: "Cobalt-lit portrait from a Kora Kaagaz website hero study", position: "50% 80%", bg: "#071A43" },
  },
  {
    label: "02 / Brand",
    title: "Brand",
    items: ["Brand Strategy", "Visual Identity", "Packaging", "Merchandise", "Campaigns"],
    img: { src: "/assets/stationery.png", alt: "Kora Kaagaz business cards and envelope on black stock", position: "28% 50%", bg: "#171717" },
  },
  {
    label: "03 / Motion",
    title: "Motion",
    italic: true,
    items: ["Motion Design", "Film and Editing", "3D and Animation", "Product Films", "Digital Storytelling"],
    img: { src: "/assets/photo-hands.png", alt: "Clasped hands emerging from darkness in blue light", bg: "#071A43" },
  },
  {
    label: "04 / Studio",
    title: "Studio",
    items: ["Photography", "Creative Direction", "Studio Shoots", "Art Direction", "Visual Production"],
    img: { src: "/assets/photo-concrete.png", alt: "A lone figure in a concrete room cut by a diagonal of light", bg: "#222222", grayscale: true },
    cta: true,
  },
];

export const VALUES = [
  "Creative without limits",
  "People over process",
  "Thoughtful & impactful work",
  "Rooted, yet modern",
  "Built for the real world",
];

export const MARQ: [string, "normal" | "italic"][] = [
  ["Ideas", "normal"],
  ["People", "italic"],
  ["Technology", "normal"],
  ["Design", "italic"],
  ["Motion", "normal"],
  ["And beyond", "italic"],
];

export const PHOTOS = [
  { src: "/assets/hero-portrait.png", alt: "Profile of a young man looking upward in cobalt light", cap: "Portrait" },
  { src: "/assets/photo-concrete.png", alt: "Figure in a concrete room cut by light", cap: "Architecture" },
  { src: "/assets/photo-chair.png", alt: "Black chair caught in a shaft of light", cap: "Object" },
  { src: "/assets/photo-hands.png", alt: "Clasped hands in blue light", cap: "Gesture" },
  { src: "/assets/treat-vase.png", alt: "Ceramic vase silhouetted against cobalt", cap: "Still life" },
  { src: "/assets/merch.png", alt: "Kora Kaagaz T-shirt and swing tag", cap: "Merchandise" },
  { src: "/assets/emboss-card.png", alt: "Kora Kaagaz wordmark debossed on black card", cap: "Material" },
];

export const JOURNAL = [
  { tag: "Brand", title: "What makes a brand feel expensive?", preview: "/assets/stationery.png" },
  { tag: "Typography", title: "Why typography changes how a brand feels.", preview: "/assets/emboss-card.png" },
  { tag: "Digital", title: "What makes a website memorable?", preview: "/assets/site-portrait.png" },
];

export const PROJECT_TYPES = [
  "Brand identity",
  "Website or digital product",
  "Motion or film",
  "Photography or studio shoot",
  "Something else",
];
export const BUDGETS = ["Under ₹5 lakh", "₹5–15 lakh", "₹15–40 lakh", "₹40 lakh +"];
export const TIMELINES = ["Within a month", "1–3 months", "3–6 months", "6 months +"];
