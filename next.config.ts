import type { NextConfig } from "next";

const config: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 85] },
  poweredByHeader: false,
};
export default config;
