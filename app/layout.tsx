import type { Metadata, Viewport } from "next";
import {
  DM_Serif_Display,
  Manrope,
  Mrs_Saint_Delafield,
  Noto_Sans_Devanagari,
  Tiro_Devanagari_Hindi,
} from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const manrope = Manrope({
  variable: "--font-manrope",
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
});
const tiro = Tiro_Devanagari_Hindi({
  variable: "--font-tiro",
  weight: "400",
  subsets: ["devanagari", "latin"],
});
const notoDeva = Noto_Sans_Devanagari({
  variable: "--font-noto-deva",
  weight: ["400", "500"],
  subsets: ["devanagari"],
});
const delafield = Mrs_Saint_Delafield({
  variable: "--font-delafield",
  weight: "400",
  subsets: ["latin"],
});

const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL("https://korakaagaz.co"),
  title: "Kora Kaagaz — A creative studio for ideas in any form",
  description:
    "Kora Kaagaz is an independent creative studio in India working across brand, digital, motion and studio production. Nothing fixed. Everything possible.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://korakaagaz.co/",
    title: "Kora Kaagaz — Nothing fixed. Everything possible.",
    description: "An independent creative studio for ideas in any form.",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image" },
  robots: isProduction ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#071A43",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kora Kaagaz",
  url: "https://korakaagaz.co",
  slogan: "Nothing fixed. Everything possible.",
  description: "An independent creative studio for ideas in any form.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${manrope.variable} ${tiro.variable} ${notoDeva.variable} ${delafield.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
