/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allows the Next.js dev server to accept requests proxied through
  // Laravel Herd's local HTTPS domains (e.g. https://digitalagency.test).
  allowedDevOrigins: ["digitalagency.test", "*.test"],

  async headers() {
    return [
      {
        // Next defaults a fully prerendered page to `Cache-Control:
        // s-maxage=31536000`, so Hostinger's CDN pinned each deploy's HTML for
        // a year. The next deploy replaced /_next/static with freshly hashed
        // chunks, and the year-old HTML kept asking for the deleted ones — a
        // 404 on app/layout-*.js means React never hydrates and the root error
        // boundary renders "a client-side exception has occurred".
        //
        // Bound how long a CDN may serve a deploy's HTML. `_next` is excluded
        // so the immutable hashed assets below keep their long cache; Next only
        // applies its own Cache-Control when a route hasn't already set one.
        //
        // `api/` and `admin/` are excluded as well, and for a stronger reason
        // than staleness: both render per-request, authenticated content. A
        // shared CDN holding an admin page for 60s could serve one signed-in
        // admin's view — leads, applicant details — to the next requester.
        // They set their own no-store below and in their route handlers.
        source: "/:path((?!_next/|api/|admin).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, must-revalidate",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/admin",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
