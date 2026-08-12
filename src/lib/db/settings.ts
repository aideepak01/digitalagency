import { cache } from "react";
import { asc, eq } from "drizzle-orm";

import type { FooterLinkGroups, NavLink, SiteConfig } from "@/types";

import { safeQuery } from "./client";
import { footerLinks, navLinks, siteSettings } from "./schema";

/**
 * Used only when the database is unreachable or unseeded.
 *
 * Unlike list content — which degrades harmlessly to an empty array — site
 * settings feed `metadataBase`, canonical URLs, robots.txt, and JSON-LD. An
 * empty value there produces a build that emits broken metadata, so these keep
 * the shell coherent until the database answers.
 */
export const FALLBACK_SITE_CONFIG: SiteConfig = {
  name: "Sbabu AI",
  legalName: "Sbabu AI Technologies",
  tagline: "Production-Grade AI Agents & Software Platforms",
  description:
    "Sbabu AI architects, builds, and scales production-grade AI agents, workflow automation, and full-stack platforms for enterprise teams — prototype to production in weeks, staffed by senior engineers only.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbabuai.com",
  ogImage: "/og-image.png",
  email: "sbabu@sbabuai.com",
  salesEmail: "sales@sbabuai.com",
  phone: "+91 93102 49299",
  whatsapp: "919310249299",
  founded: "2019",
  address: {
    street: "Gali No. 3, Sector 44",
    city: "Noida",
    state: "Uttar Pradesh",
    zip: "201301",
    country: "India",
    full: "Gali No. 3, Sector 44, Noida, Uttar Pradesh – 201301, India",
  },
  social: {
    twitter: "https://twitter.com/sbabuai",
    linkedin: "https://linkedin.com/company/sbabuai",
    github: "https://github.com/sbabuai",
    instagram: "https://instagram.com/sbabuai",
    dribbble: "https://dribbble.com/sbabuai",
  },
  stats: [],
};

const FALLBACK_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", megaMenu: null },
  { label: "Services", href: "/services", megaMenu: "services" },
  { label: "Industries", href: "/industries", megaMenu: "industries" },
  { label: "Portfolio", href: "/portfolio", megaMenu: null },
  { label: "Pricing", href: "/pricing", megaMenu: null },
  { label: "Blog", href: "/blog", megaMenu: null },
  { label: "About", href: "/about", megaMenu: null },
];

/** `cache` dedupes repeated reads within a single render pass. */
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const row = await safeQuery(
    "siteSettings",
    async (db) => {
      const [record] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
      return record ?? null;
    },
    null,
  );

  if (!row) return FALLBACK_SITE_CONFIG;

  return {
    name: row.name,
    legalName: row.legalName,
    tagline: row.tagline,
    description: row.description,
    url: row.url,
    ogImage: row.ogImage,
    email: row.email,
    salesEmail: row.salesEmail,
    phone: row.phone,
    whatsapp: row.whatsapp,
    founded: row.founded,
    address: row.address,
    social: row.social,
    stats: row.stats,
  };
});

export const getNavLinks = cache(async (): Promise<NavLink[]> => {
  const rows = await safeQuery(
    "navLinks",
    (db) =>
      db
        .select({ label: navLinks.label, href: navLinks.href, megaMenu: navLinks.megaMenu })
        .from(navLinks)
        .where(eq(navLinks.isPublished, true))
        .orderBy(asc(navLinks.sortOrder)),
    [] as NavLink[],
  );

  return rows.length > 0 ? rows : FALLBACK_NAV_LINKS;
});

export const getFooterLinks = cache(async (): Promise<FooterLinkGroups> => {
  const rows = await safeQuery(
    "footerLinks",
    (db) =>
      db
        .select({
          group: footerLinks.group,
          label: footerLinks.label,
          href: footerLinks.href,
        })
        .from(footerLinks)
        .where(eq(footerLinks.isPublished, true))
        .orderBy(asc(footerLinks.group), asc(footerLinks.sortOrder)),
    [] as { group: string; label: string; href: string }[],
  );

  const grouped: FooterLinkGroups = { services: [], company: [], legal: [] };
  for (const row of rows) {
    if (row.group in grouped) {
      grouped[row.group as keyof FooterLinkGroups].push({ label: row.label, href: row.href });
    }
  }
  return grouped;
});
