/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Image optimization configuration.
   * Allows images served from Supabase Storage and common CDN/upload sources.
   */
  images: {
    remotePatterns: [
      {
        // Supabase Storage (project-specific bucket URL)
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Supabase Storage (custom domain variant)
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Allow placeholder/avatar services during development
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  /**
   * Experimental features required for App Router patterns.
   */
  experimental: {
    // Server Actions are stable in Next 14 — no flag needed, but we keep
    // typedRoutes for better DX when navigating between pages.
    typedRoutes: false,
  },

  /**
   * Custom headers for security hardening.
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  /**
   * Redirect bare "www" to apex domain, and ensure consistent trailing-slash
   * behaviour. Custom domains for wedding sites are handled entirely in
   * middleware (src/middleware.ts) via hostname inspection.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.everafter.com" }],
        destination: "https://everafter.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
