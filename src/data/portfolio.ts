import type { PortfolioProject } from "@/types";

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "northwind-ai-shopping-assistant",
    title: "AI Shopping Assistant for a Multi-Brand Retailer",
    client: "Northwind Retail Group",
    industry: "retail",
    services: ["ai-chatbots", "ai-automation", "web-application-development"],
    summary:
      "A conversational shopping assistant that helps customers find products across 40,000+ SKUs using natural language, cutting search-to-purchase time dramatically.",
    challenge:
      "Northwind's customers were abandoning search after two or three queries because keyword search couldn't handle natural, descriptive requests like 'a waterproof jacket for winter hiking under $150.' Support tickets for product recommendations were also consuming significant staff time.",
    solution:
      "We built a retrieval-augmented AI assistant embedded directly in the storefront, trained on the full product catalog and updated in real time via a sync pipeline. The assistant understands natural language queries, asks clarifying questions, and hands off to a human agent when needed — all while tracking conversion analytics.",
    outcomes: [
      { label: "Support deflection", value: "40%" },
      { label: "Conversion rate lift", value: "23%" },
      { label: "Avg. search-to-purchase time", value: "-58%" },
    ],
    technologies: ["Next.js", "OpenAI", "Pinecone", "Node.js", "PostgreSQL"],
    year: "2025",
    coverGradient: "from-violet-500 via-fuchsia-500 to-cyan-400",
    testimonial: {
      quote:
        "Sbabu AI didn't just build what we asked for — they questioned our assumptions and shipped something better.",
      author: "Elena Marsh",
      role: "VP of Product, Northwind Retail Group",
    },
  },
  {
    slug: "fairbridge-patient-portal",
    title: "Unified Patient Portal & Intake Platform",
    client: "Fairbridge Health",
    industry: "healthcare",
    services: ["web-application-development", "ai-chatbots", "cloud-solutions"],
    summary:
      "A HIPAA-conscious patient portal consolidating scheduling, records, and AI-assisted intake across 12 clinic locations.",
    challenge:
      "Fairbridge operated on three disconnected legacy systems for scheduling, records, and billing, forcing patients to navigate multiple portals and staff to manually reconcile data. No-show rates were high and administrative overhead was growing with each new clinic location.",
    solution:
      "We designed and built a single patient portal unifying scheduling, records access, and secure messaging, backed by an AI intake assistant that pre-populates visit information before appointments. The platform was architected with encryption at rest and in transit, granular access controls, and full audit logging.",
    outcomes: [
      { label: "No-show reduction", value: "28%" },
      { label: "Faster patient intake", value: "3x" },
      { label: "Clinics onboarded", value: "12" },
    ],
    technologies: ["Next.js", "PostgreSQL", "AWS", "OpenAI"],
    year: "2025",
    coverGradient: "from-cyan-400 via-sky-500 to-indigo-600",
    testimonial: {
      quote:
        "The difference showed up immediately — technical depth, clear communication, and a genuine understanding of our business.",
      author: "Daniel Osei",
      role: "CTO, Fairbridge Health",
    },
  },
  {
    slug: "vantage-capital-document-automation",
    title: "AI Document Processing for Financial Statements",
    client: "Vantage Capital Partners",
    industry: "finance",
    services: ["ai-automation", "api-development", "cloud-solutions"],
    summary:
      "An AI-powered pipeline that extracts and validates data from thousands of monthly financial statements, replacing a manual review process.",
    challenge:
      "Vantage's finance team spent up to three full days each month manually extracting and cross-checking figures from client financial statements in varying formats — a slow, error-prone process that didn't scale as the client base grew.",
    solution:
      "We built a document intelligence pipeline combining OCR, LLM-based extraction, and rules-based validation. Low-confidence extractions are automatically routed to a review queue with the AI's reasoning attached, while high-confidence data flows straight into their reporting system.",
    outcomes: [
      { label: "Monthly processing time", value: "-92%" },
      { label: "Manual review hours saved", value: "65%" },
      { label: "Processing accuracy", value: "99.2%" },
    ],
    technologies: ["Python", "AWS Textract", "OpenAI", "PostgreSQL"],
    year: "2024",
    coverGradient: "from-emerald-400 via-teal-500 to-indigo-600",
    testimonial: {
      quote:
        "It now processes what used to take three full days in under twenty minutes. It paid for itself in the first quarter.",
      author: "Priya Nair",
      role: "Head of Operations, Vantage Capital Partners",
    },
  },
  {
    slug: "trailmark-booking-platform",
    title: "Real-Time Booking Platform for a Tour Operator",
    client: "Trailmark Travel",
    industry: "travel",
    services: ["web-application-development", "api-development", "mobile-app-development"],
    summary:
      "A booking engine unifying inventory from 200+ suppliers with real-time availability, dynamic pricing, and a companion mobile app.",
    challenge:
      "Trailmark managed bookings across spreadsheets and a patchwork of supplier portals, resulting in frequent overbookings and a checkout flow that lost nearly a third of users before payment.",
    solution:
      "We built a unified booking engine with a real-time inventory sync layer across all 200+ suppliers, a redesigned conversion-optimized checkout flow, and a companion mobile app for on-trip itinerary management and support.",
    outcomes: [
      { label: "Booking conversion lift", value: "34%" },
      { label: "Overbooking incidents", value: "0" },
      { label: "Time to launch", value: "9 weeks" },
    ],
    technologies: ["Next.js", "React Native", "Node.js", "Redis"],
    year: "2025",
    coverGradient: "from-amber-400 via-orange-500 to-rose-500",
    testimonial: {
      quote:
        "From discovery to launch in nine weeks, and the platform hasn't had a single major incident since.",
      author: "Marcus Webb",
      role: "Founder & CEO, Trailmark Travel",
    },
  },
  {
    slug: "coastline-properties-redesign",
    title: "Product Redesign for a Real Estate Platform",
    client: "Coastline Properties",
    industry: "real-estate",
    services: ["ui-ux-design", "web-application-development"],
    summary:
      "A full UX overhaul and AI-powered property search rebuild that nearly doubled user activation.",
    challenge:
      "Coastline's listing platform had grown organically over five years into a confusing, dated experience. Search was slow and imprecise, and new user activation had plateaued well below industry benchmarks.",
    solution:
      "We ran structured user research, rebuilt the design system from scratch, and replaced keyword search with an AI-powered natural language and filter-based search experience across the full listing inventory.",
    outcomes: [
      { label: "Activation rate", value: "+92%" },
      { label: "Qualified inquiries", value: "+45%" },
      { label: "Lead response time", value: "-70%" },
    ],
    technologies: ["Figma", "Next.js", "OpenAI", "PostgreSQL"],
    year: "2024",
    coverGradient: "from-rose-400 via-pink-500 to-violet-600",
    testimonial: {
      quote:
        "Their design team rebuilt our entire product experience and our activation rate nearly doubled.",
      author: "Sofia Reyes",
      role: "Head of Design, Coastline Properties",
    },
  },
  {
    slug: "summit-construction-field-ops",
    title: "Offline-First Field Operations App",
    client: "Summit Construction Co.",
    industry: "construction",
    services: ["mobile-app-development", "erp-development"],
    summary:
      "A field reporting and project management app built for job sites with unreliable connectivity, syncing seamlessly once back online.",
    challenge:
      "Site supervisors were tracking progress on paper and relaying updates to the office by phone, creating a 24-48 hour lag between what was happening on site and what leadership could see.",
    solution:
      "We built an offline-first mobile app for capturing progress photos, safety checklists, and change orders directly on site, syncing automatically once connectivity returns, feeding a real-time project dashboard for office staff.",
    outcomes: [
      { label: "Reporting delay reduction", value: "60%" },
      { label: "Projects tracked in real time", value: "100%" },
      { label: "Active field users", value: "180+" },
    ],
    technologies: ["React Native", "Laravel", "PostgreSQL", "AWS"],
    year: "2024",
    coverGradient: "from-yellow-400 via-amber-500 to-orange-600",
    testimonial: {
      quote:
        "They treat our product like it's their own. Exactly what you want from a long-term technology partner.",
      author: "James Okafor",
      role: "Director of Engineering, Summit Construction Co.",
    },
  },
];

export function getProjectBySlug(slug: string) {
  return portfolioProjects.find((p) => p.slug === slug);
}
