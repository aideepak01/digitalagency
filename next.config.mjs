/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allows the Next.js dev server to accept requests proxied through
  // Laravel Herd's local HTTPS domains (e.g. https://digitalagency.test).
  allowedDevOrigins: ["digitalagency.test", "*.test"],
};

export default nextConfig;
