import type { PgTable } from "drizzle-orm/pg-core";

import * as t from "@/lib/db/schema";

/**
 * Describes every editable content model once, so the admin can render list,
 * create, and edit screens generically instead of hand-writing seventeen
 * near-identical CRUD pages.
 *
 * A field's `type` decides both how it is rendered and how the server action
 * coerces the submitted string back into its column type — see
 * `src/lib/admin/actions.ts`.
 */

export type FieldType =
  | "text"
  | "textarea"
  /** Ordered paragraphs stored as text[] — one paragraph per blank-line block. */
  | "paragraphs"
  /** Flat string[] stored as a Postgres array — entered one per line. */
  | "tags"
  | "number"
  | "boolean"
  | "select"
  /** Name from the icon registry (`src/lib/icons.ts`). */
  | "icon"
  /** Key from the gradient map (`src/lib/gradients.ts`). */
  | "gradient"
  /** jsonb array of objects, edited as repeating rows. */
  | "repeater";

export interface SubField {
  name: string;
  label: string;
  type: "text" | "textarea";
}

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: readonly string[];
  subFields?: SubField[];
  /** Single object rather than an array (the optional project testimonial). */
  single?: boolean;
}

/**
 * Sidebar grouping. Sixteen collections in one flat list is unscannable, so
 * they are split by what an editor is actually trying to do:
 *   pages     — models that own a public route
 *   sections  — blocks that appear inside other pages
 *   structure — navigation and taxonomy
 */
export type CollectionGroup = "pages" | "sections" | "structure";

export interface Collection {
  key: string;
  label: string;
  singular: string;
  group: CollectionGroup;
  /** Key into the admin nav icon map in `components/admin/admin-sidebar.tsx`. */
  icon: string;
  table: PgTable;
  /** Unique slug column, if the model has one — validated on save. */
  slugField?: string;
  /** Columns shown in the list view. */
  listColumns: { name: string; label: string }[];
  fields: Field[];
  /** Public paths to revalidate after any mutation. */
  revalidate: string[];
}

const titleDescription: SubField[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
];

const questionAnswer: SubField[] = [
  { name: "question", label: "Question", type: "text" },
  { name: "answer", label: "Answer", type: "textarea" },
];

const labelValue: SubField[] = [
  { name: "label", label: "Label", type: "text" },
  { name: "value", label: "Value", type: "text" },
];

const processShape: SubField[] = [
  { name: "step", label: "Step", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
];

const publishFields: Field[] = [
  { name: "isPublished", label: "Published", type: "boolean" },
  { name: "sortOrder", label: "Sort order", type: "number", help: "Lower numbers appear first." },
];

export const collections: Collection[] = [
  {
    key: "services",
    label: "Services",
    singular: "Service",
    group: "pages",
    icon: "Layers",
    table: t.services,
    slugField: "slug",
    listColumns: [
      { name: "name", label: "Name" },
      { name: "category", label: "Category" },
      { name: "slug", label: "Slug" },
    ],
    revalidate: ["/", "/services"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "shortName", label: "Short name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["AI", "Development", "Design", "Infrastructure"],
      },
      { name: "iconName", label: "Icon", type: "icon", required: true },
      { name: "tagline", label: "Tagline", type: "text", required: true },
      { name: "overview", label: "Overview", type: "textarea", required: true },
      { name: "benefits", label: "Benefits", type: "repeater", subFields: titleDescription },
      { name: "features", label: "Features", type: "repeater", subFields: titleDescription },
      { name: "process", label: "Process", type: "repeater", subFields: processShape },
      { name: "faqs", label: "FAQs", type: "repeater", subFields: questionAnswer },
      { name: "techStack", label: "Tech stack", type: "tags", help: "One per line." },
      {
        name: "relatedIndustries",
        label: "Related industries",
        type: "tags",
        help: "Industry slugs, one per line.",
      },
      ...publishFields,
    ],
  },
  {
    key: "industries",
    label: "Industries",
    singular: "Industry",
    group: "pages",
    icon: "Building2",
    table: t.industries,
    slugField: "slug",
    listColumns: [
      { name: "name", label: "Name" },
      { name: "slug", label: "Slug" },
    ],
    revalidate: ["/", "/industries"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "iconName", label: "Icon", type: "icon", required: true },
      { name: "tagline", label: "Tagline", type: "text", required: true },
      { name: "overview", label: "Overview", type: "textarea", required: true },
      { name: "challenges", label: "Challenges", type: "repeater", subFields: titleDescription },
      { name: "solutions", label: "Solutions", type: "repeater", subFields: titleDescription },
      { name: "stats", label: "Stats", type: "repeater", subFields: labelValue },
      {
        name: "services",
        label: "Related services",
        type: "tags",
        help: "Service slugs, one per line.",
      },
      ...publishFields,
    ],
  },
  {
    key: "portfolio",
    label: "Portfolio",
    singular: "Project",
    group: "pages",
    icon: "Briefcase",
    table: t.portfolioProjects,
    slugField: "slug",
    listColumns: [
      { name: "title", label: "Title" },
      { name: "client", label: "Client" },
      { name: "year", label: "Year" },
    ],
    revalidate: ["/", "/portfolio"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "client", label: "Client", type: "text", required: true },
      {
        name: "industry",
        label: "Industry slug",
        type: "text",
        required: true,
        help: "Must match an industry slug.",
      },
      { name: "year", label: "Year", type: "text", required: true },
      { name: "gradientKey", label: "Cover gradient", type: "gradient", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "challenge", label: "Challenge", type: "textarea", required: true },
      { name: "solution", label: "Solution", type: "textarea", required: true },
      { name: "outcomes", label: "Outcomes", type: "repeater", subFields: labelValue },
      { name: "technologies", label: "Technologies", type: "tags", help: "One per line." },
      { name: "services", label: "Services", type: "tags", help: "Service slugs, one per line." },
      {
        name: "testimonial",
        label: "Testimonial",
        type: "repeater",
        single: true,
        subFields: [
          { name: "quote", label: "Quote", type: "textarea" },
          { name: "author", label: "Author", type: "text" },
          { name: "role", label: "Role", type: "text" },
        ],
      },
      ...publishFields,
    ],
  },
  {
    key: "blog",
    label: "Blog posts",
    singular: "Post",
    group: "pages",
    icon: "FileText",
    table: t.blogPosts,
    slugField: "slug",
    listColumns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
      { name: "date", label: "Date" },
    ],
    revalidate: ["/", "/blog"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      {
        name: "content",
        label: "Body",
        type: "paragraphs",
        required: true,
        help: "Separate paragraphs with a blank line.",
      },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "authorName", label: "Author name", type: "text", required: true },
      { name: "authorRole", label: "Author role", type: "text", required: true },
      { name: "date", label: "Date", type: "text", required: true, help: "YYYY-MM-DD" },
      { name: "readTime", label: "Read time", type: "text", required: true },
      { name: "gradientKey", label: "Cover gradient", type: "gradient", required: true },
      ...publishFields,
    ],
  },
  {
    key: "blog-categories",
    label: "Blog categories",
    singular: "Category",
    group: "structure",
    icon: "Tags",
    table: t.blogCategories,
    listColumns: [{ name: "name", label: "Name" }],
    revalidate: ["/blog"],
    fields: [{ name: "name", label: "Name", type: "text", required: true }, ...publishFields],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    group: "sections",
    icon: "Quote",
    table: t.testimonials,
    listColumns: [
      { name: "author", label: "Author" },
      { name: "company", label: "Company" },
      { name: "rating", label: "Rating" },
    ],
    revalidate: ["/"],
    fields: [
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "author", label: "Author", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      { name: "rating", label: "Rating", type: "number", required: true },
      ...publishFields,
    ],
  },
  {
    key: "pricing",
    label: "Pricing plans",
    singular: "Plan",
    group: "pages",
    icon: "CreditCard",
    table: t.pricingPlans,
    listColumns: [
      { name: "name", label: "Name" },
      { name: "price", label: "Price" },
    ],
    revalidate: ["/pricing"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "price", label: "Price", type: "text", required: true },
      { name: "period", label: "Period", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "features", label: "Features", type: "tags", help: "One per line." },
      { name: "cta", label: "Call to action", type: "text", required: true },
      { name: "highlighted", label: "Highlighted", type: "boolean" },
      ...publishFields,
    ],
  },
  {
    key: "faqs",
    label: "FAQs",
    singular: "FAQ",
    group: "sections",
    icon: "CircleHelp",
    table: t.faqs,
    listColumns: [
      { name: "question", label: "Question" },
      { name: "group", label: "Group" },
    ],
    revalidate: ["/", "/pricing"],
    fields: [
      { name: "group", label: "Group", type: "select", required: true, options: ["home", "pricing"] },
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true },
      ...publishFields,
    ],
  },
  {
    key: "team",
    label: "Team",
    singular: "Team member",
    group: "sections",
    icon: "Users",
    table: t.teamMembers,
    listColumns: [
      { name: "name", label: "Name" },
      { name: "role", label: "Role" },
    ],
    revalidate: ["/about"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "initials", label: "Initials", type: "text", required: true },
      { name: "bio", label: "Bio", type: "textarea", required: true },
      ...publishFields,
    ],
  },
  {
    key: "jobs",
    label: "Job openings",
    singular: "Job",
    group: "pages",
    icon: "BriefcaseBusiness",
    table: t.jobOpenings,
    slugField: "slug",
    listColumns: [
      { name: "title", label: "Title" },
      { name: "department", label: "Department" },
      { name: "location", label: "Location" },
    ],
    revalidate: ["/careers"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "type", label: "Type", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "requirements", label: "Requirements", type: "tags", help: "One per line." },
      ...publishFields,
    ],
  },
  {
    key: "core-values",
    label: "Core values",
    singular: "Core value",
    group: "sections",
    icon: "Heart",
    table: t.coreValues,
    listColumns: [{ name: "title", label: "Title" }],
    revalidate: ["/about", "/careers"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      ...publishFields,
    ],
  },
  {
    key: "technologies",
    label: "Technologies",
    singular: "Technology",
    group: "sections",
    icon: "Cpu",
    table: t.technologies,
    listColumns: [{ name: "name", label: "Name" }],
    revalidate: ["/"],
    fields: [{ name: "name", label: "Name", type: "text", required: true }, ...publishFields],
  },
  {
    key: "process-steps",
    label: "Process steps",
    singular: "Process step",
    group: "sections",
    icon: "GitBranch",
    table: t.processSteps,
    listColumns: [
      { name: "step", label: "Step" },
      { name: "title", label: "Title" },
    ],
    revalidate: ["/"],
    fields: [
      { name: "step", label: "Step", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      ...publishFields,
    ],
  },
  {
    key: "why-choose-us",
    label: "Why choose us",
    singular: "Reason",
    group: "sections",
    icon: "Award",
    table: t.whyChooseUs,
    listColumns: [
      { name: "title", label: "Title" },
      { name: "metric", label: "Metric" },
    ],
    revalidate: ["/"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "metric", label: "Metric", type: "text", required: true },
      { name: "metricLabel", label: "Metric label", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      ...publishFields,
    ],
  },
  {
    key: "nav-links",
    label: "Navigation links",
    singular: "Nav link",
    group: "structure",
    icon: "Menu",
    table: t.navLinks,
    listColumns: [
      { name: "label", label: "Label" },
      { name: "href", label: "Href" },
    ],
    revalidate: ["/"],
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "href", label: "Href", type: "text", required: true },
      {
        name: "megaMenu",
        label: "Mega menu",
        type: "select",
        options: ["", "services", "industries"],
        help: "Leave blank for a plain link.",
      },
      ...publishFields,
    ],
  },
  {
    key: "footer-links",
    label: "Footer links",
    singular: "Footer link",
    group: "structure",
    icon: "PanelBottom",
    table: t.footerLinks,
    listColumns: [
      { name: "label", label: "Label" },
      { name: "group", label: "Group" },
      { name: "href", label: "Href" },
    ],
    revalidate: ["/"],
    fields: [
      {
        name: "group",
        label: "Group",
        type: "select",
        required: true,
        options: ["services", "company", "legal"],
      },
      { name: "label", label: "Label", type: "text", required: true },
      { name: "href", label: "Href", type: "text", required: true },
      ...publishFields,
    ],
  },
];

export function getCollection(key: string): Collection | undefined {
  return collections.find((collection) => collection.key === key);
}
