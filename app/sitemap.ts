import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://korakaagaz.co/", changeFrequency: "monthly", priority: 1 }];
}
