import { cache } from "react";
import { and, asc, desc, eq } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import type {
  BlogPost,
  CoreValue,
  FAQ,
  Industry,
  JobOpening,
  PortfolioProject,
  PricingPlan,
  ProcessStep,
  Service,
  ServiceCategory,
  TeamMember,
  Testimonial,
  WhyChooseUsItem,
} from "@/types";

import { safeQuery } from "./client";
import * as t from "./schema";

/**
 * Read side of the site. Every function mirrors an export that used to live in
 * `src/data/*.ts`, returns the same shape, and degrades to an empty result if
 * the database is unreachable (see `safeQuery`).
 *
 * `cache` is React's per-request memoisation: a page that reads services in
 * both its body and its `generateMetadata` issues one query, not two.
 */

const published = (table: { isPublished: PgColumn }) => eq(table.isPublished, true);

/* --------------------------------------------------------------- services */

function toService(row: typeof t.services.$inferSelect): Service {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category as ServiceCategory,
    name: row.name,
    shortName: row.shortName,
    iconName: row.iconName,
    tagline: row.tagline,
    overview: row.overview,
    benefits: row.benefits,
    features: row.features,
    techStack: row.techStack,
    process: row.process,
    faqs: row.faqs,
    relatedIndustries: row.relatedIndustries,
  };
}

export const getServices = cache(async (): Promise<Service[]> => {
  const rows = await safeQuery(
    "services",
    (db) => db.select().from(t.services).where(published(t.services)).orderBy(asc(t.services.sortOrder)),
    [] as (typeof t.services.$inferSelect)[],
  );
  return rows.map(toService);
});

export const getServiceBySlug = cache(async (slug: string): Promise<Service | null> => {
  const rows = await safeQuery(
    "serviceBySlug",
    (db) =>
      db
        .select()
        .from(t.services)
        .where(and(eq(t.services.slug, slug), published(t.services)))
        .limit(1),
    [] as (typeof t.services.$inferSelect)[],
  );
  return rows[0] ? toService(rows[0]) : null;
});

/* ------------------------------------------------------------- industries */

function toIndustry(row: typeof t.industries.$inferSelect): Industry {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    iconName: row.iconName,
    tagline: row.tagline,
    overview: row.overview,
    challenges: row.challenges,
    solutions: row.solutions,
    services: row.services,
    stats: row.stats,
  };
}

export const getIndustries = cache(async (): Promise<Industry[]> => {
  const rows = await safeQuery(
    "industries",
    (db) =>
      db.select().from(t.industries).where(published(t.industries)).orderBy(asc(t.industries.sortOrder)),
    [] as (typeof t.industries.$inferSelect)[],
  );
  return rows.map(toIndustry);
});

export const getIndustryBySlug = cache(async (slug: string): Promise<Industry | null> => {
  const rows = await safeQuery(
    "industryBySlug",
    (db) =>
      db
        .select()
        .from(t.industries)
        .where(and(eq(t.industries.slug, slug), published(t.industries)))
        .limit(1),
    [] as (typeof t.industries.$inferSelect)[],
  );
  return rows[0] ? toIndustry(rows[0]) : null;
});

/* -------------------------------------------------------------- portfolio */

function toProject(row: typeof t.portfolioProjects.$inferSelect): PortfolioProject {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    client: row.client,
    industry: row.industry,
    services: row.services,
    summary: row.summary,
    challenge: row.challenge,
    solution: row.solution,
    outcomes: row.outcomes,
    technologies: row.technologies,
    year: row.year,
    gradientKey: row.gradientKey,
    testimonial: row.testimonial ?? null,
  };
}

export const getPortfolioProjects = cache(async (): Promise<PortfolioProject[]> => {
  const rows = await safeQuery(
    "portfolioProjects",
    (db) =>
      db
        .select()
        .from(t.portfolioProjects)
        .where(published(t.portfolioProjects))
        .orderBy(asc(t.portfolioProjects.sortOrder)),
    [] as (typeof t.portfolioProjects.$inferSelect)[],
  );
  return rows.map(toProject);
});

export const getProjectBySlug = cache(async (slug: string): Promise<PortfolioProject | null> => {
  const rows = await safeQuery(
    "projectBySlug",
    (db) =>
      db
        .select()
        .from(t.portfolioProjects)
        .where(and(eq(t.portfolioProjects.slug, slug), published(t.portfolioProjects)))
        .limit(1),
    [] as (typeof t.portfolioProjects.$inferSelect)[],
  );
  return rows[0] ? toProject(rows[0]) : null;
});

/* ------------------------------------------------------------------- blog */

function toPost(row: typeof t.blogPosts.$inferSelect): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    author: { name: row.authorName, role: row.authorRole },
    date: row.date,
    readTime: row.readTime,
    gradientKey: row.gradientKey,
  };
}

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const rows = await safeQuery(
    "blogPosts",
    (db) =>
      db.select().from(t.blogPosts).where(published(t.blogPosts)).orderBy(desc(t.blogPosts.date)),
    [] as (typeof t.blogPosts.$inferSelect)[],
  );
  return rows.map(toPost);
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const rows = await safeQuery(
    "postBySlug",
    (db) =>
      db
        .select()
        .from(t.blogPosts)
        .where(and(eq(t.blogPosts.slug, slug), published(t.blogPosts)))
        .limit(1),
    [] as (typeof t.blogPosts.$inferSelect)[],
  );
  return rows[0] ? toPost(rows[0]) : null;
});

export const getBlogCategories = cache(async (): Promise<string[]> => {
  const rows = await safeQuery(
    "blogCategories",
    (db) =>
      db
        .select({ name: t.blogCategories.name })
        .from(t.blogCategories)
        .where(published(t.blogCategories))
        .orderBy(asc(t.blogCategories.sortOrder)),
    [] as { name: string }[],
  );
  return rows.map((row) => row.name);
});

/* ----------------------------------------------------------- testimonials */

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const rows = await safeQuery(
    "testimonials",
    (db) =>
      db
        .select()
        .from(t.testimonials)
        .where(published(t.testimonials))
        .orderBy(asc(t.testimonials.sortOrder)),
    [] as (typeof t.testimonials.$inferSelect)[],
  );
  return rows.map((row) => ({
    id: row.id,
    quote: row.quote,
    author: row.author,
    role: row.role,
    company: row.company,
    rating: row.rating,
  }));
});

/* ---------------------------------------------------------------- pricing */

export const getPricingPlans = cache(async (): Promise<PricingPlan[]> => {
  const rows = await safeQuery(
    "pricingPlans",
    (db) =>
      db
        .select()
        .from(t.pricingPlans)
        .where(published(t.pricingPlans))
        .orderBy(asc(t.pricingPlans.sortOrder)),
    [] as (typeof t.pricingPlans.$inferSelect)[],
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    price: row.price,
    period: row.period,
    description: row.description,
    features: row.features,
    cta: row.cta,
    highlighted: row.highlighted,
  }));
});

/* ------------------------------------------------------------------- faqs */

async function getFaqsByGroup(group: string): Promise<FAQ[]> {
  const rows = await safeQuery(
    `faqs:${group}`,
    (db) =>
      db
        .select({ question: t.faqs.question, answer: t.faqs.answer })
        .from(t.faqs)
        .where(and(eq(t.faqs.group, group), published(t.faqs)))
        .orderBy(asc(t.faqs.sortOrder)),
    [] as FAQ[],
  );
  return rows;
}

export const getHomeFaqs = cache(() => getFaqsByGroup("home"));
export const getPricingFaqs = cache(() => getFaqsByGroup("pricing"));

/* ------------------------------------------------------------------- misc */

export const getTeam = cache(async (): Promise<TeamMember[]> => {
  const rows = await safeQuery(
    "team",
    (db) =>
      db
        .select()
        .from(t.teamMembers)
        .where(published(t.teamMembers))
        .orderBy(asc(t.teamMembers.sortOrder)),
    [] as (typeof t.teamMembers.$inferSelect)[],
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    initials: row.initials,
  }));
});

export const getCoreValues = cache(async (): Promise<CoreValue[]> => {
  return safeQuery(
    "coreValues",
    (db) =>
      db
        .select({ title: t.coreValues.title, description: t.coreValues.description })
        .from(t.coreValues)
        .where(published(t.coreValues))
        .orderBy(asc(t.coreValues.sortOrder)),
    [] as CoreValue[],
  );
});

export const getJobOpenings = cache(async (): Promise<JobOpening[]> => {
  const rows = await safeQuery(
    "jobOpenings",
    (db) =>
      db
        .select()
        .from(t.jobOpenings)
        .where(published(t.jobOpenings))
        .orderBy(asc(t.jobOpenings.sortOrder)),
    [] as (typeof t.jobOpenings.$inferSelect)[],
  );
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    description: row.description,
    requirements: row.requirements,
  }));
});

export const getJobBySlug = cache(async (slug: string): Promise<JobOpening | null> => {
  const jobs = await getJobOpenings();
  return jobs.find((job) => job.slug === slug) ?? null;
});

export const getTechnologies = cache(async (): Promise<string[]> => {
  const rows = await safeQuery(
    "technologies",
    (db) =>
      db
        .select({ name: t.technologies.name })
        .from(t.technologies)
        .where(published(t.technologies))
        .orderBy(asc(t.technologies.sortOrder)),
    [] as { name: string }[],
  );
  return rows.map((row) => row.name);
});

export const getProcessSteps = cache(async (): Promise<ProcessStep[]> => {
  return safeQuery(
    "processSteps",
    (db) =>
      db
        .select({
          step: t.processSteps.step,
          title: t.processSteps.title,
          description: t.processSteps.description,
        })
        .from(t.processSteps)
        .where(published(t.processSteps))
        .orderBy(asc(t.processSteps.sortOrder)),
    [] as ProcessStep[],
  );
});

export const getWhyChooseUs = cache(async (): Promise<WhyChooseUsItem[]> => {
  return safeQuery(
    "whyChooseUs",
    (db) =>
      db
        .select({
          title: t.whyChooseUs.title,
          metric: t.whyChooseUs.metric,
          metricLabel: t.whyChooseUs.metricLabel,
          description: t.whyChooseUs.description,
        })
        .from(t.whyChooseUs)
        .where(published(t.whyChooseUs))
        .orderBy(asc(t.whyChooseUs.sortOrder)),
    [] as WhyChooseUsItem[],
  );
});
