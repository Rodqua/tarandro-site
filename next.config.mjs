/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisations SEO
  poweredByHeader: false,
  compress: true,

  // Configuration API
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },

  // Images optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Headers pour SEO et sécurité
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
