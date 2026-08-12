/**
 * Loads db/seed-data.json into Postgres.
 *
 * The JSON is a verbatim snapshot of the original `src/data/*.ts` modules (see
 * scripts/snapshot-data.mts), so a seeded database renders exactly what the
 * hardcoded site rendered.
 *
 * Content tables are replaced wholesale. Submissions, rate limits, and admin
 * users are never touched.
 *
 * Run: npm run db:seed
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../src/lib/db/schema";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set — cannot seed.");
  process.exit(1);
}

type Snapshot = {
  services: (typeof schema.services.$inferInsert)[];
  industries: (typeof schema.industries.$inferInsert)[];
  portfolioProjects: (typeof schema.portfolioProjects.$inferInsert)[];
  blogPosts: (typeof schema.blogPosts.$inferInsert)[];
  blogCategories: (typeof schema.blogCategories.$inferInsert)[];
  testimonials: (typeof schema.testimonials.$inferInsert)[];
  pricingPlans: (typeof schema.pricingPlans.$inferInsert)[];
  faqs: (typeof schema.faqs.$inferInsert)[];
  teamMembers: (typeof schema.teamMembers.$inferInsert)[];
  coreValues: (typeof schema.coreValues.$inferInsert)[];
  jobOpenings: (typeof schema.jobOpenings.$inferInsert)[];
  technologies: (typeof schema.technologies.$inferInsert)[];
  processSteps: (typeof schema.processSteps.$inferInsert)[];
  whyChooseUs: (typeof schema.whyChooseUs.$inferInsert)[];
  siteSettings: Omit<typeof schema.siteSettings.$inferInsert, "id">;
  navLinks: (typeof schema.navLinks.$inferInsert)[];
  footerLinks: (typeof schema.footerLinks.$inferInsert)[];
};

const snapshot = JSON.parse(
  readFileSync(resolve(process.cwd(), "db/seed-data.json"), "utf8"),
) as Snapshot;

const pool = new Pool({
  connectionString,
  max: 1,
  ssl: /sslmode=(disable|off)/.test(connectionString) ? false : { rejectUnauthorized: false },
});
const db = drizzle(pool, { schema });

try {
  await db.transaction(async (tx) => {
    // Sequential, not Promise.all: a transaction runs on a single connection,
    // and issuing overlapping queries on one pg client is deprecated (and will
    // throw in pg@9). Order is otherwise irrelevant — content tables carry no
    // cross-table foreign keys; relationships are by slug, as they were in the
    // original data modules.
    const contentTables = [
      schema.services,
      schema.industries,
      schema.portfolioProjects,
      schema.blogPosts,
      schema.blogCategories,
      schema.testimonials,
      schema.pricingPlans,
      schema.faqs,
      schema.teamMembers,
      schema.coreValues,
      schema.jobOpenings,
      schema.technologies,
      schema.processSteps,
      schema.whyChooseUs,
      schema.navLinks,
      schema.footerLinks,
      schema.siteSettings,
    ];
    for (const table of contentTables) {
      await tx.delete(table);
    }

    await tx.insert(schema.services).values(snapshot.services);
    await tx.insert(schema.industries).values(snapshot.industries);
    await tx.insert(schema.portfolioProjects).values(snapshot.portfolioProjects);
    await tx.insert(schema.blogPosts).values(snapshot.blogPosts);
    await tx.insert(schema.blogCategories).values(snapshot.blogCategories);
    await tx.insert(schema.testimonials).values(snapshot.testimonials);
    await tx.insert(schema.pricingPlans).values(snapshot.pricingPlans);
    await tx.insert(schema.faqs).values(snapshot.faqs);
    await tx.insert(schema.teamMembers).values(snapshot.teamMembers);
    await tx.insert(schema.coreValues).values(snapshot.coreValues);
    await tx.insert(schema.jobOpenings).values(snapshot.jobOpenings);
    await tx.insert(schema.technologies).values(snapshot.technologies);
    await tx.insert(schema.processSteps).values(snapshot.processSteps);
    await tx.insert(schema.whyChooseUs).values(snapshot.whyChooseUs);
    await tx.insert(schema.navLinks).values(snapshot.navLinks);
    await tx.insert(schema.footerLinks).values(snapshot.footerLinks);
    await tx.insert(schema.siteSettings).values({ ...snapshot.siteSettings, id: 1 });
  });

  console.log("Seed complete:");
  for (const [key, value] of Object.entries(snapshot)) {
    console.log(`  ${key}: ${Array.isArray(value) ? value.length : 1}`);
  }
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
