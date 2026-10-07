import type { MetadataRoute } from "next";

// Only production is indexable; previews and the dev/staging deployment are not.
const isProduction = process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://korakaagaz.co/sitemap.xml",
  };
}
