import type { Metadata, Viewport } from "next";

// The homepage is the static Broadsheet bundle (see next.config.ts). This layout only wraps
// Next-rendered routes such as the 404 page.

const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL("https://korakaagaz.co"),
  title: "Kora Kaagaz — A creative studio for ideas in any form",
  description:
    "Kora Kaagaz is an independent creative studio in India working across brand, digital, motion and studio production. Nothing fixed. Everything possible.",
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
    <html lang="en">
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
