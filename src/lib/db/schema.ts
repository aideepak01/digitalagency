import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Nested, order-sensitive value objects are stored as jsonb rather than child
 * tables: they are always read and written as a whole list alongside their
 * parent, they carry no identity of their own, and jsonb keeps array order for
 * free. `$type<>()` re-attaches the exact shapes from `src/types`.
 */
type TitleDescription = { title: string; description: string };
type QuestionAnswer = { question: string; answer: string };
type LabelValue = { label: string; value: string };
type ProcessStepShape = { step: string; title: string; description: string };
type ProjectTestimonial = { quote: string; author: string; role: string };

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

/** Every content table is orderable and draftable from the admin. */
const publishable = {
  isPublished: boolean("is_published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
};

/* ------------------------------------------------------------------ content */

export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    // Kept as text + an app-level union rather than a pg enum: adding a
    // category from the admin should not require a migration.
    category: text("category").notNull(),
    name: text("name").notNull(),
    shortName: text("short_name").notNull(),
    iconName: text("icon_name").notNull(),
    tagline: text("tagline").notNull(),
    overview: text("overview").notNull(),
    benefits: jsonb("benefits").$type<TitleDescription[]>().notNull().default([]),
    features: jsonb("features").$type<TitleDescription[]>().notNull().default([]),
    techStack: text("tech_stack").array().notNull().default([]),
    process: jsonb("process").$type<ProcessStepShape[]>().notNull().default([]),
    faqs: jsonb("faqs").$type<QuestionAnswer[]>().notNull().default([]),
    relatedIndustries: text("related_industries").array().notNull().default([]),
    ...publishable,
    ...timestamps,
  },
  (t) => [uniqueIndex("services_slug_idx").on(t.slug)],
);

export const industries = pgTable(
  "industries",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    iconName: text("icon_name").notNull(),
    tagline: text("tagline").notNull(),
    overview: text("overview").notNull(),
    challenges: jsonb("challenges").$type<TitleDescription[]>().notNull().default([]),
    solutions: jsonb("solutions").$type<TitleDescription[]>().notNull().default([]),
    services: text("services").array().notNull().default([]),
    stats: jsonb("stats").$type<LabelValue[]>().notNull().default([]),
    ...publishable,
    ...timestamps,
  },
  (t) => [uniqueIndex("industries_slug_idx").on(t.slug)],
);

export const portfolioProjects = pgTable(
  "portfolio_projects",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    client: text("client").notNull(),
    industry: text("industry").notNull(),
    services: text("services").array().notNull().default([]),
    summary: text("summary").notNull(),
    challenge: text("challenge").notNull(),
    solution: text("solution").notNull(),
    outcomes: jsonb("outcomes").$type<LabelValue[]>().notNull().default([]),
    technologies: text("technologies").array().notNull().default([]),
    year: text("year").notNull(),
    // A gradient *key* resolved through src/lib/gradients.ts — never a raw
    // Tailwind class string. Tailwind only emits classes it finds in source, so
    // a class that exists solely in the database renders unstyled.
    gradientKey: text("gradient_key").notNull().default("violet-fuchsia-cyan"),
    testimonial: jsonb("testimonial").$type<ProjectTestimonial | null>(),
    ...publishable,
    ...timestamps,
  },
  (t) => [uniqueIndex("portfolio_projects_slug_idx").on(t.slug)],
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    // Preserved as an ordered paragraph array, matching BlogPost["content"].
    content: text("content").array().notNull().default([]),
    category: text("category").notNull(),
    authorName: text("author_name").notNull(),
    authorRole: text("author_role").notNull(),
    // Display/sort date as authored (YYYY-MM-DD); distinct from created_at.
    date: text("date").notNull(),
    readTime: text("read_time").notNull(),
    gradientKey: text("gradient_key").notNull().default("violet-fuchsia-cyan"),
    ...publishable,
    ...timestamps,
  },
  (t) => [uniqueIndex("blog_posts_slug_idx").on(t.slug), index("blog_posts_date_idx").on(t.date)],
);

export const blogCategories = pgTable(
  "blog_categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    ...publishable,
    ...timestamps,
  },
  (t) => [uniqueIndex("blog_categories_name_idx").on(t.name)],
);

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  rating: integer("rating").notNull().default(5),
  ...publishable,
  ...timestamps,
});

export const pricingPlans = pgTable("pricing_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  period: text("period").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull().default([]),
  cta: text("cta").notNull(),
  highlighted: boolean("highlighted").notNull().default(false),
  ...publishable,
  ...timestamps,
});

/** homeFaqs and pricingFaqs share one table, separated by `group`. */
export const faqs = pgTable(
  "faqs",
  {
    id: serial("id").primaryKey(),
    group: text("group").notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    ...publishable,
    ...timestamps,
  },
  (t) => [index("faqs_group_idx").on(t.group)],
);

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  initials: text("initials").notNull(),
  ...publishable,
  ...timestamps,
});

export const jobOpenings = pgTable(
  "job_openings",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    department: text("department").notNull(),
    location: text("location").notNull(),
    type: text("type").notNull(),
    description: text("description").notNull(),
    requirements: text("requirements").array().notNull().default([]),
    ...publishable,
    ...timestamps,
  },
  (t) => [uniqueIndex("job_openings_slug_idx").on(t.slug)],
);

export const coreValues = pgTable("core_values", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ...publishable,
  ...timestamps,
});

export const technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ...publishable,
  ...timestamps,
});

export const processSteps = pgTable("process_steps", {
  id: serial("id").primaryKey(),
  step: text("step").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ...publishable,
  ...timestamps,
});

export const whyChooseUs = pgTable("why_choose_us", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  metric: text("metric").notNull(),
  metricLabel: text("metric_label").notNull(),
  description: text("description").notNull(),
  ...publishable,
  ...timestamps,
});

/* ----------------------------------------------------------------- settings */

/** Single row, id = 1. See src/lib/db/settings.ts. */
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  legalName: text("legal_name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  ogImage: text("og_image").notNull(),
  email: text("email").notNull(),
  salesEmail: text("sales_email").notNull(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  founded: text("founded").notNull(),
  address: jsonb("address")
    .$type<{
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      full: string;
    }>()
    .notNull(),
  social: jsonb("social").$type<Record<string, string>>().notNull(),
  stats: jsonb("stats").$type<{ label: string; value: string; suffix: string }[]>().notNull(),
  ...timestamps,
});

export const navLinks = pgTable("nav_links", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  megaMenu: text("mega_menu"), // null | "services" | "industries"
  ...publishable,
  ...timestamps,
});

export const footerLinks = pgTable(
  "footer_links",
  {
    id: serial("id").primaryKey(),
    group: text("group").notNull(), // "services" | "company" | "legal"
    label: text("label").notNull(),
    href: text("href").notNull(),
    ...publishable,
    ...timestamps,
  },
  (t) => [index("footer_links_group_idx").on(t.group)],
);

/* -------------------------------------------------------------- submissions */

/** Columns every lead table carries, for triage in the admin inbox. */
const submissionMeta = {
  sourcePath: text("source_path"),
  ipHash: text("ip_hash"),
  userAgent: text("user_agent"),
  isRead: boolean("is_read").notNull().default(false),
  emailSent: boolean("email_sent").notNull().default(false),
  emailError: text("email_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
};

export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    ...submissionMeta,
  },
  (t) => [index("contact_submissions_created_idx").on(t.createdAt)],
);

export const consultationRequests = pgTable(
  "consultation_requests",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    company: text("company"),
    service: text("service").notNull(),
    preferredDate: text("preferred_date").notNull(),
    notes: text("notes"),
    ...submissionMeta,
  },
  (t) => [index("consultation_requests_created_idx").on(t.createdAt)],
);

export const quoteRequests = pgTable(
  "quote_requests",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    projectType: text("project_type").notNull(),
    budget: text("budget").notNull(),
    timeline: text("timeline").notNull(),
    description: text("description").notNull(),
    ...submissionMeta,
  },
  (t) => [index("quote_requests_created_idx").on(t.createdAt)],
);

export const newsletterSubscribers = pgTable(
  "newsletter_subscribers",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    unsubscribeToken: text("unsubscribe_token").notNull(),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true }).notNull().defaultNow(),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
    ...submissionMeta,
  },
  (t) => [
    uniqueIndex("newsletter_subscribers_email_idx").on(t.email),
    uniqueIndex("newsletter_subscribers_token_idx").on(t.unsubscribeToken),
  ],
);

export const jobApplications = pgTable(
  "job_applications",
  {
    id: serial("id").primaryKey(),
    jobSlug: text("job_slug").notNull(),
    jobTitle: text("job_title"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    linkedin: text("linkedin"),
    coverNote: text("cover_note").notNull(),
    // Only the stored path/URL lives in the DB. Files are written outside the
    // repo (UPLOAD_DIR) because the deploy rebuilds the project tree in place.
    resumePath: text("resume_path"),
    resumeOriginalName: text("resume_original_name"),
    resumeMimeType: text("resume_mime_type"),
    resumeSize: integer("resume_size"),
    ...submissionMeta,
  },
  (t) => [index("job_applications_created_idx").on(t.createdAt)],
);

/* -------------------------------------------------------- abuse control + auth */

/**
 * Fixed-window rate limiting. Postgres-backed rather than in-memory so limits
 * survive restarts and hold across multiple app instances.
 */
export const rateLimits = pgTable(
  "rate_limits",
  {
    id: serial("id").primaryKey(),
    bucket: text("bucket").notNull(),
    count: integer("count").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex("rate_limits_bucket_idx").on(t.bucket), index("rate_limits_expires_idx").on(t.expiresAt)],
);

export const adminUsers = pgTable(
  "admin_users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [uniqueIndex("admin_users_email_idx").on(t.email)],
);
