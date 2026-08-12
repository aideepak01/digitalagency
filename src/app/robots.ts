import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/db/settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteConfig = await getSiteConfig();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin is behind auth, but there is no reason to spend crawl budget
      // on it or on the form endpoints.
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
