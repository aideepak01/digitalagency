import type { MetadataRoute } from "next";

import {
  getBlogPosts,
  getIndustries,
  getJobOpenings,
  getPortfolioProjects,
  getServices,
} from "@/lib/db/content";
import { getSiteConfig } from "@/lib/db/settings";

/**
 * Built from the database. If it is unreachable the content queries return
 * empty lists and the sitemap still emits the static routes rather than
 * failing the build — see `safeQuery` in `src/lib/db/client.ts`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [siteConfig, services, industries, portfolioProjects, blogPosts, jobOpenings] =
    await Promise.all([
      getSiteConfig(),
      getServices(),
      getIndustries(),
      getPortfolioProjects(),
      getBlogPosts(),
      getJobOpenings(),
    ]);

  const baseUrl = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: `${baseUrl}/industries/${industry.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioProjects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const careerRoutes: MetadataRoute.Sitemap = jobOpenings.map((job) => ({
    url: `${baseUrl}/careers/${job.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...portfolioRoutes,
    ...blogRoutes,
    ...careerRoutes,
  ];
}
