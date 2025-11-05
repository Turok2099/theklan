import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dxbtafe9u/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  // Optimización de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Optimización de CSS
  experimental: {
    optimizeCss: true,
  },
  // Optimización de JavaScript moderno - SWC está activado por defecto en Next.js 15
  // Los navegadores modernos soportarán el código sin transpilación innecesaria
};

export default nextConfig;
