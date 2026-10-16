import type { Metadata, Viewport } from "next";

// The homepage is the static Broadsheet bundle (see next.config.ts). This layout only wraps
// Next-rendered routes such as the 404 page.

const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL("https://korakaagaz.co"),
  title: "Kora Kaagaz — Independent Creative Studio, India",
  description:
    "Kora Kaagaz is an independent creative studio in India working across brand identity, digital experiences, motion, photography and visual production. Rooted, not nostalgic.",
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
  description: "An independent creative studio in India. An open world for ideas.",
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
