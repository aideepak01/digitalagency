import type { LucideIcon } from "lucide-react";

export interface Service {
  slug: string;
  category: "AI" | "Development" | "Design" | "Infrastructure";
  name: string;
  shortName: string;
  icon: LucideIcon;
  tagline: string;
  overview: string;
  benefits: { title: string; description: string }[];
  features: { title: string; description: string }[];
  techStack: string[];
  process: { step: string; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedIndustries?: string[];
}

export interface Industry {
  slug: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  overview: string;
  challenges: { title: string; description: string }[];
  solutions: { title: string; description: string }[];
  services: string[];
  stats: { label: string; value: string }[];
}

export interface PortfolioProject {
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
  coverGradient: string;
  testimonial?: { quote: string; author: string; role: string };
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: { name: string; role: string };
  date: string;
  readTime: string;
  coverGradient: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface JobOpening {
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
