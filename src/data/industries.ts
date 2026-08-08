import {
  Plane,
  HardHat,
  HeartPulse,
  GraduationCap,
  Home,
  Hotel,
  ShoppingBag,
  Landmark,
} from "lucide-react";
import type { Industry } from "@/types";

export const industries: Industry[] = [
  {
    slug: "travel",
    name: "Travel",
    icon: Plane,
    tagline: "Booking engines and AI trip planning that convert browsers into travelers.",
    overview:
      "We build booking platforms, itinerary planners, and AI travel assistants for tour operators, OTAs, and hospitality groups — systems that handle real-time inventory, dynamic pricing, and multi-currency transactions at scale.",
    challenges: [
      { title: "Fragmented booking systems", description: "Legacy reservation systems that don't talk to modern channels or mobile experiences." },
      { title: "Complex real-time inventory", description: "Managing availability, pricing, and overbooking risk across multiple suppliers." },
      { title: "High cart abandonment", description: "Booking flows with too much friction lose travelers before checkout." },
    ],
    solutions: [
      { title: "Unified booking engines", description: "Real-time inventory synced across web, mobile, and partner channels." },
      { title: "AI itinerary assistants", description: "Conversational planning tools that recommend and book in one flow." },
      { title: "Streamlined checkout", description: "Conversion-optimized booking flows with saved preferences and fast payment." },
    ],
    services: ["ai-chatbots", "web-application-development", "mobile-app-development", "api-development"],
    stats: [
      { label: "Avg. booking conversion lift", value: "34%" },
      { label: "Faster itinerary planning", value: "5x" },
    ],
  },
  {
    slug: "construction",
    name: "Construction",
    icon: HardHat,
    tagline: "Project management and field operations software built for job sites, not offices.",
    overview:
      "We build project tracking, resource management, and field reporting tools for construction and engineering firms — software that works reliably on job sites with intermittent connectivity, not just in the office.",
    challenges: [
      { title: "Disconnected field and office data", description: "Progress updates and change orders trapped in paper or spreadsheets." },
      { title: "Resource and budget overruns", description: "Poor visibility into labor, materials, and equipment allocation." },
      { title: "Compliance documentation", description: "Manual tracking of safety and regulatory documentation." },
    ],
    solutions: [
      { title: "Offline-first field apps", description: "Mobile apps that capture progress, photos, and issues even without signal." },
      { title: "Real-time project dashboards", description: "Budget, timeline, and resource visibility for project managers." },
      { title: "Automated compliance tracking", description: "Digital forms and audit trails for safety and regulatory requirements." },
    ],
    services: ["mobile-app-development", "erp-development", "ai-automation", "cloud-solutions"],
    stats: [
      { label: "Reduction in reporting delays", value: "60%" },
      { label: "Projects tracked in real time", value: "100%" },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: HeartPulse,
    tagline: "Patient-centric platforms built for compliance and trust.",
    overview:
      "We build patient portals, scheduling systems, and AI-assisted intake tools for clinics, telehealth providers, and healthcare networks — with security and compliance treated as a first-class requirement, not an afterthought.",
    challenges: [
      { title: "Fragmented patient data", description: "Records scattered across systems that don't communicate with each other." },
      { title: "Scheduling inefficiency", description: "High no-show rates and manual scheduling coordination." },
      { title: "Compliance burden", description: "Strict data privacy requirements that slow down product development." },
    ],
    solutions: [
      { title: "Unified patient portals", description: "Secure, single access point for records, scheduling, and communication." },
      { title: "AI-assisted intake", description: "Conversational intake that reduces administrative burden on staff." },
      { title: "Compliant-by-design architecture", description: "Systems built with encryption, access controls, and audit logging from day one." },
    ],
    services: ["ai-chatbots", "web-application-development", "api-development", "cloud-solutions"],
    stats: [
      { label: "Reduction in no-shows", value: "28%" },
      { label: "Faster patient intake", value: "3x" },
    ],
  },
  {
    slug: "education",
    name: "Education",
    icon: GraduationCap,
    tagline: "Learning platforms that keep students engaged and educators informed.",
    overview:
      "We build learning management systems, admissions platforms, and AI tutoring tools for schools, universities, and edtech companies — designed around real classroom and administrative workflows.",
    challenges: [
      { title: "Low engagement in digital learning", description: "Generic LMS platforms that don't adapt to how students actually learn." },
      { title: "Administrative overload", description: "Admissions, grading, and communication scattered across disconnected tools." },
      { title: "Limited personalization", description: "One-size-fits-all content that doesn't meet students where they are." },
    ],
    solutions: [
      { title: "Adaptive learning platforms", description: "Content and pacing that adjust to individual student progress." },
      { title: "AI tutoring assistants", description: "On-demand help that scales beyond instructor availability." },
      { title: "Unified admin dashboards", description: "Admissions, grading, and communication in one connected system." },
    ],
    services: ["ai-agent-development", "web-application-development", "mobile-app-development"],
    stats: [
      { label: "Increase in course completion", value: "41%" },
      { label: "Admin hours saved weekly", value: "15+" },
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    icon: Home,
    tagline: "Property platforms with search that actually converts.",
    overview:
      "We build property listing platforms, CRM systems, and AI-powered search tools for real estate agencies, developers, and proptech startups — engineered for fast, accurate search across large inventories.",
    challenges: [
      { title: "Poor search experience", description: "Slow, imprecise search that loses buyers before they find the right property." },
      { title: "Lead management chaos", description: "Inquiries scattered across email, phone, and multiple listing platforms." },
      { title: "Manual valuation processes", description: "Time-consuming comparative market analysis done by hand." },
    ],
    solutions: [
      { title: "AI-powered property search", description: "Natural language and image-based search across large listing inventories." },
      { title: "Custom real estate CRM", description: "Unified lead tracking from inquiry to closing." },
      { title: "Automated valuation tools", description: "Data-driven pricing recommendations powered by market data." },
    ],
    services: ["crm-development", "ai-agent-development", "web-application-development"],
    stats: [
      { label: "Faster lead response time", value: "70%" },
      { label: "Increase in qualified inquiries", value: "45%" },
    ],
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    icon: Hotel,
    tagline: "Guest experiences that feel effortless, from booking to checkout.",
    overview:
      "We build reservation systems, guest experience apps, and AI concierge tools for hotels, resorts, and restaurant groups — designed to delight guests while streamlining staff operations behind the scenes.",
    challenges: [
      { title: "Disjointed guest experience", description: "Booking, check-in, and service requests handled through separate disconnected tools." },
      { title: "Staff coordination overhead", description: "Manual coordination between front desk, housekeeping, and service teams." },
      { title: "Missed upsell opportunities", description: "No systematic way to offer relevant upgrades and add-ons at the right moment." },
    ],
    solutions: [
      { title: "Unified guest apps", description: "Booking, digital check-in, and service requests in a single guest experience." },
      { title: "AI concierge assistants", description: "24/7 guest support that handles requests instantly and escalates when needed." },
      { title: "Operations dashboards", description: "Real-time coordination across front desk, housekeeping, and service staff." },
    ],
    services: ["ai-chatbots", "mobile-app-development", "web-application-development"],
    stats: [
      { label: "Increase in guest satisfaction scores", value: "32%" },
      { label: "Upsell revenue increase", value: "18%" },
    ],
  },
  {
    slug: "retail",
    name: "Retail",
    icon: ShoppingBag,
    tagline: "Commerce platforms and AI shopping experiences that drive revenue.",
    overview:
      "We build e-commerce platforms, inventory systems, and AI shopping assistants for retail brands — engineered for conversion, performance at scale during peak traffic, and seamless omnichannel operations.",
    challenges: [
      { title: "Cart abandonment", description: "Friction-heavy checkout flows that lose customers at the final step." },
      { title: "Inventory visibility gaps", description: "Disconnected online and in-store inventory leading to overselling." },
      { title: "Generic shopping experiences", description: "One-size-fits-all storefronts that don't adapt to individual shoppers." },
    ],
    solutions: [
      { title: "High-converting commerce platforms", description: "Optimized checkout flows and performance-tuned product pages." },
      { title: "Real-time inventory sync", description: "Unified stock visibility across online and physical channels." },
      { title: "AI shopping assistants", description: "Personalized product recommendations and conversational search." },
    ],
    services: ["ai-chatbots", "web-application-development", "mobile-app-development", "ai-automation"],
    stats: [
      { label: "Reduction in cart abandonment", value: "22%" },
      { label: "Increase in average order value", value: "19%" },
    ],
  },
  {
    slug: "finance",
    name: "Finance",
    icon: Landmark,
    tagline: "Secure, compliant platforms for the demands of modern finance.",
    overview:
      "We build fintech platforms, internal risk and reporting tools, and AI-powered document processing systems for financial institutions and fintech startups — with security, auditability, and regulatory compliance built in from the start.",
    challenges: [
      { title: "Regulatory complexity", description: "Strict compliance requirements that slow product development if not designed for from the start." },
      { title: "Manual document processing", description: "Time-consuming review of statements, applications, and compliance documents." },
      { title: "Legacy system constraints", description: "Core banking and processing systems that are costly and risky to change." },
    ],
    solutions: [
      { title: "Compliant-by-design platforms", description: "Architecture built around your regulatory requirements from day one." },
      { title: "AI document processing", description: "Automated extraction and validation for statements and applications." },
      { title: "Modern API layers", description: "Clean integration layers that sit in front of legacy core systems." },
    ],
    services: ["ai-automation", "api-development", "cloud-solutions", "ai-agent-development"],
    stats: [
      { label: "Faster document processing", value: "8x" },
      { label: "Reduction in manual review hours", value: "65%" },
    ],
  },
];

export function getIndustryBySlug(slug: string) {
  return industries.find((i) => i.slug === slug);
}
