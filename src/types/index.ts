/**
 * Shapes returned by the `src/lib/db/*` query modules and consumed by pages.
 *
 * Two fields differ from the pre-database version of this file:
 *  - `iconName` replaces `icon: LucideIcon`. A database cannot store a React
 *    component; resolve with `getIcon()` from `@/lib/icons`.
 *  - `gradientKey` replaces `coverGradient`, which held raw Tailwind classes.
 *    Resolve with `getGradient()` from `@/lib/gradients`. See the comment in
 *    `src/lib/gradients.ts` for why the classes cannot live in the database.
 */

export type ServiceCategory = "AI" | "Development" | "Design" | "Infrastructure";

export interface Service {
  id: number;
  slug: string;
  category: ServiceCategory;
  name: string;
  shortName: string;
  iconName: string;
  tagline: string;
  overview: string;
  benefits: { title: string; description: string }[];
  features: { title: string; description: string }[];
  techStack: string[];
  process: { step: string; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedIndustries: string[];
}

export interface Industry {
  id: number;
  slug: string;
  name: string;
  iconName: string;
  tagline: string;
  overview: string;
  challenges: { title: string; description: string }[];
  solutions: { title: string; description: string }[];
  services: string[];
  stats: { label: string; value: string }[];
}

export interface PortfolioProject {
  id: number;
  slug: string;
  title: string;
  client: string;
  industry: string;
  services: string[];
  summary: string;
  challenge: string;
  solution: string;
  outcomes: { label: string; value: string }[];
  technologies: string[];
  year: string;
  gradientKey: string;
  testimonial?: { quote: string; author: string; role: string } | null;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: { name: string; role: string };
  date: string;
  readTime: string;
  gradientKey: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface JobOpening {
  id: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CoreValue {
  title: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface WhyChooseUsItem {
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  email: string;
  salesEmail: string;
  phone: string;
  whatsapp: string;
  founded: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    full: string;
  };
  social: Record<string, string>;
  stats: { label: string; value: string; suffix: string }[];
}

export interface NavLink {
  label: string;
  href: string;
  megaMenu: string | null;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroups {
  services: FooterLink[];
  company: FooterLink[];
  legal: FooterLink[];
}
