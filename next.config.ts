import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Design assets are often replaced in place under the same filename.
        // Force revalidation on every request so Safari/Chrome don't keep a
        // stale copy after a file swap (no immutable / long max-age).
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
