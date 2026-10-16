import type { NextConfig } from "next";

// Only production is indexable; previews and the dev/staging deployment are not.
const isProduction = process.env.VERCEL_ENV === "production";

const nextConfig: NextConfig = {
  // The site is the static Broadsheet bundle in public/broadsheet. Serve it at / and keep the URL
  // as /, so its relative `img/<name>.webp` requests land on /img/* and are mapped back here.
  async rewrites() {
    return [
      { source: "/", destination: "/broadsheet/index.html" },
      { source: "/img/:path*", destination: "/broadsheet/img/:path*" },
    ];
  },
  // The static page can't carry the layout's robots meta tag, so send the header instead.
  async headers() {
    if (isProduction) return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
