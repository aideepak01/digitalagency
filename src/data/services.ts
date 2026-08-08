import {
  Bot,
  MessageSquare,
  Workflow,
  Globe,
  AppWindow,
  Smartphone,
  Layers,
  Triangle,
  Atom,
  Palette,
  Webhook,
  Users,
  Building2,
  Cloud,
  GitBranch,
  LifeBuoy,
} from "lucide-react";
import type { Service } from "@/types";

const standardProcess = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We start with structured discovery workshops to understand your business goals, users, constraints, and success metrics before writing a single line of code.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Our designers translate requirements into wireframes, interactive prototypes, and a polished design system tailored to your brand.",
  },
  {
    step: "03",
    title: "Development",
    description:
      "Engineers build in focused sprints with continuous demos, automated testing, and transparent progress tracking so you always know where things stand.",
  },
  {
    step: "04",
    title: "Deployment",
    description:
      "We handle CI/CD, infrastructure provisioning, and a staged rollout so launch day is uneventful in the best possible way.",
  },
  {
    step: "05",
    title: "Support",
    description:
      "Post-launch, our team monitors performance, ships iterations, and provides SLA-backed support so your product keeps improving.",
  },
];

export const services: Service[] = [
  {
    slug: "ai-agent-development",
    category: "AI",
    name: "AI Agent Development",
    shortName: "AI Agents",
    icon: Bot,
    tagline: "Autonomous agents that plan, decide, and act on your behalf.",
    overview:
      "We design and build production-grade AI agents that go beyond simple prompt-response loops — systems capable of reasoning, tool use, memory, and multi-step task execution. Whether you need an internal ops agent, a customer-facing assistant, or a fleet of specialized agents coordinating on complex workflows, we architect agents that are reliable, observable, and safe to run in production.",
    benefits: [
      { title: "Reduce operational overhead", description: "Automate multi-step processes that previously required manual coordination across tools and teams." },
      { title: "Faster decision-making", description: "Agents retrieve, reason over, and act on live data in seconds instead of hours." },
      { title: "Built to scale", description: "Agent architectures are designed for concurrency, observability, and graceful failure handling from day one." },
    ],
    features: [
      { title: "Tool-using agents", description: "Agents that call internal APIs, databases, and third-party services autonomously." },
      { title: "Memory & context management", description: "Short and long-term memory strategies so agents stay coherent across sessions." },
      { title: "Multi-agent orchestration", description: "Coordinated agent teams that divide, delegate, and verify each other's work." },
      { title: "Human-in-the-loop controls", description: "Approval gates and guardrails for high-stakes or irreversible actions." },
    ],
    techStack: ["Python", "TypeScript", "LangGraph", "OpenAI", "Anthropic Claude", "Pinecone", "PostgreSQL", "Redis"],
    process: standardProcess,
    faqs: [
      { question: "What can an AI agent actually do for my business?", answer: "Agents can handle research, data entry, customer triage, report generation, internal tooling, and multi-step operational workflows — anything that follows a repeatable process but currently needs a human to coordinate." },
      { question: "How do you keep agents from making costly mistakes?", answer: "We implement scoped permissions, human approval checkpoints for high-risk actions, structured evaluation suites, and detailed logging so every agent decision is traceable and reversible where needed." },
      { question: "Can agents integrate with our existing systems?", answer: "Yes. We build custom tool integrations against your CRM, ERP, internal APIs, and databases so agents operate on your real data, not a sandbox." },
      { question: "How long does an AI agent build typically take?", answer: "A focused single-purpose agent can launch in 4-6 weeks. Multi-agent systems with complex tool integrations typically take 8-14 weeks." },
    ],
    relatedIndustries: ["finance", "healthcare", "retail"],
  },
  {
    slug: "ai-chatbots",
    category: "AI",
    name: "AI Chatbots",
    shortName: "AI Chatbots",
    icon: MessageSquare,
    tagline: "Conversational AI that resolves, not just responds.",
    overview:
      "We build intelligent chatbots that understand context, retrieve accurate information from your knowledge base, and resolve customer and internal queries without human hand-off — while knowing exactly when to escalate. From support deflection to sales qualification, our chatbots are trained on your data and tuned for your brand voice.",
    benefits: [
      { title: "24/7 instant response", description: "Never lose a lead or frustrate a customer waiting on business hours." },
      { title: "Lower support costs", description: "Deflect repetitive tickets so your team focuses on complex, high-value conversations." },
      { title: "Consistent brand voice", description: "Every conversation reflects your tone, policies, and product knowledge accurately." },
    ],
    features: [
      { title: "Retrieval-augmented answers", description: "Responses grounded in your docs, FAQs, and product data — not hallucinated." },
      { title: "Omnichannel deployment", description: "Website, WhatsApp, Slack, Messenger, and in-app widgets from one backend." },
      { title: "Seamless human handoff", description: "Smart escalation to live agents with full conversation context preserved." },
      { title: "Analytics dashboard", description: "Track resolution rate, deflection, sentiment, and conversation trends." },
    ],
    techStack: ["Next.js", "OpenAI", "Anthropic Claude", "LangChain", "Vector DB", "Node.js", "WebSockets"],
    process: standardProcess,
    faqs: [
      { question: "Will the chatbot give inaccurate answers?", answer: "We use retrieval-augmented generation grounded in your verified content, plus confidence thresholds that trigger human escalation instead of guessing." },
      { question: "Can it speak multiple languages?", answer: "Yes, our chatbots support multilingual conversations and can auto-detect the customer's language." },
      { question: "Does it integrate with our support platform?", answer: "We integrate with Zendesk, Intercom, HubSpot, Freshdesk, and custom helpdesk systems via API." },
    ],
    relatedIndustries: ["retail", "travel", "hospitality"],
  },
  {
    slug: "ai-automation",
    category: "AI",
    name: "AI Automation",
    shortName: "AI Automation",
    icon: Workflow,
    tagline: "Intelligent workflows that eliminate manual busywork.",
    overview:
      "We combine AI models with robust workflow engines to automate document processing, data extraction, reporting, and cross-system operations that used to require manual effort. Unlike rigid rule-based automation, our AI-driven workflows adapt to variation in inputs while remaining auditable and predictable.",
    benefits: [
      { title: "Eliminate repetitive tasks", description: "Free your team from data entry, document review, and manual reconciliation." },
      { title: "Fewer errors", description: "Consistent, auditable processing reduces the human error rate in high-volume tasks." },
      { title: "Faster turnaround", description: "Processes that took days complete in minutes." },
    ],
    features: [
      { title: "Document intelligence", description: "Extract structured data from invoices, contracts, and forms automatically." },
      { title: "Workflow orchestration", description: "Multi-step automations across your existing SaaS tools and internal systems." },
      { title: "Exception handling", description: "Automated flagging and routing of edge cases for human review." },
      { title: "Audit trails", description: "Every automated action is logged for compliance and debugging." },
    ],
    techStack: ["Python", "n8n", "Node.js", "OpenAI", "AWS Textract", "PostgreSQL", "Docker"],
    process: standardProcess,
    faqs: [
      { question: "What processes are good candidates for automation?", answer: "High-volume, repetitive, rules-based work with occasional variation — invoice processing, lead qualification, report generation, and data reconciliation are common starting points." },
      { question: "How do you handle exceptions the AI can't confidently process?", answer: "Low-confidence cases are automatically routed to a human review queue with the AI's reasoning attached, so reviewers work faster without losing oversight." },
    ],
    relatedIndustries: ["finance", "construction", "healthcare"],
  },
  {
    slug: "website-development",
    category: "Development",
    name: "Website Development",
    shortName: "Web Development",
    icon: Globe,
    tagline: "Fast, beautiful websites built to convert.",
    overview:
      "We design and build marketing websites, corporate sites, and landing pages engineered for speed, SEO, and conversion. Every site ships with clean semantic markup, optimized Core Web Vitals, and a CMS your team can actually use.",
    benefits: [
      { title: "Higher conversion rates", description: "Conversion-focused UX and copy structure that turns visitors into leads." },
      { title: "Top search rankings", description: "Technical SEO built in from the first commit, not bolted on after launch." },
      { title: "Effortless content updates", description: "A headless or built-in CMS your marketing team can manage without a developer." },
    ],
    features: [
      { title: "Pixel-perfect responsive design", description: "Flawless across mobile, tablet, and desktop breakpoints." },
      { title: "Blazing performance", description: "Sub-second load times with optimized assets and edge delivery." },
      { title: "CMS integration", description: "Sanity, Contentful, or a custom admin panel — your choice." },
      { title: "Built-in analytics & SEO tooling", description: "Structured data, sitemaps, and tracking wired up from day one." },
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity", "Vercel", "Framer Motion"],
    process: standardProcess,
    faqs: [
      { question: "How long does a marketing website take?", answer: "A polished 5-10 page marketing website typically takes 3-5 weeks from kickoff to launch." },
      { question: "Will I be able to update content myself?", answer: "Yes — every site we ship includes a CMS so your team can update copy, images, and blog posts without touching code." },
    ],
  },
  {
    slug: "web-application-development",
    category: "Development",
    name: "Web Application Development",
    shortName: "Web Apps",
    icon: AppWindow,
    tagline: "Complex products, built on solid architecture.",
    overview:
      "From SaaS platforms to internal operations dashboards, we build web applications that handle real complexity — authentication, permissions, billing, real-time data, and integrations — without sacrificing speed or maintainability.",
    benefits: [
      { title: "Architecture that scales", description: "Systems designed to handle growth in users, data, and feature complexity." },
      { title: "Faster iteration", description: "Modular codebases mean new features ship without breaking existing ones." },
      { title: "Lower long-term cost", description: "Clean code and test coverage reduce the cost of every future change." },
    ],
    features: [
      { title: "Role-based access control", description: "Granular permissions for multi-tenant and enterprise use cases." },
      { title: "Real-time features", description: "Live updates, notifications, and collaborative editing via WebSockets." },
      { title: "Billing & subscriptions", description: "Stripe-powered metering, invoicing, and plan management." },
      { title: "Robust testing", description: "Unit, integration, and end-to-end test coverage on critical flows." },
    ],
    techStack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "Redis"],
    process: standardProcess,
    faqs: [
      { question: "Can you take over an existing codebase?", answer: "Yes, we regularly audit and take ownership of existing web applications, including legacy systems that need modernization." },
      { question: "Do you build multi-tenant SaaS platforms?", answer: "Multi-tenancy, organization/workspace models, and role-based permissions are core to most of the applications we build." },
    ],
  },
  {
    slug: "mobile-app-development",
    category: "Development",
    name: "Mobile App Development",
    shortName: "Mobile Apps",
    icon: Smartphone,
    tagline: "Native-quality apps for iOS and Android, one codebase.",
    overview:
      "We build cross-platform mobile applications with React Native and native modules where performance demands it, delivering a truly native feel without the cost of maintaining two separate codebases.",
    benefits: [
      { title: "One codebase, two platforms", description: "Ship to iOS and Android simultaneously without duplicating engineering effort." },
      { title: "Native performance", description: "Smooth animations and native modules where they matter most." },
      { title: "App store ready", description: "We handle submission, compliance, and release management end-to-end." },
    ],
    features: [
      { title: "Offline-first architecture", description: "Apps that work reliably even with unstable connectivity." },
      { title: "Push notifications", description: "Segmented, targeted notifications with delivery tracking." },
      { title: "Biometric authentication", description: "Face ID, Touch ID, and secure device-level auth." },
      { title: "In-app purchases", description: "Subscription and one-time purchase flows via App Store and Play Store." },
    ],
    techStack: ["React Native", "Expo", "TypeScript", "Swift", "Kotlin", "Firebase"],
    process: standardProcess,
    faqs: [
      { question: "React Native vs fully native — which is right for us?", answer: "React Native covers the vast majority of app requirements at a fraction of the cost and time. We recommend fully native development only for apps with heavy graphics, AR, or hardware-intensive needs." },
      { question: "Do you handle App Store and Play Store submission?", answer: "Yes, we manage the entire submission process including compliance review, assets, and release rollout." },
    ],
  },
  {
    slug: "laravel-development",
    category: "Development",
    name: "Laravel Development",
    shortName: "Laravel",
    icon: Layers,
    tagline: "Robust PHP backends for demanding business logic.",
    overview:
      "Our Laravel engineers build secure, well-tested backend systems for applications with complex business logic — from multi-vendor marketplaces to enterprise internal tools — leveraging Laravel's mature ecosystem for queues, auth, and background processing.",
    benefits: [
      { title: "Battle-tested framework", description: "Laravel's maturity means fewer surprises and a large ecosystem of vetted packages." },
      { title: "Rapid development", description: "Convention-driven architecture accelerates delivery without sacrificing quality." },
      { title: "Strong security defaults", description: "Built-in protection against common vulnerabilities, hardened further by our team." },
    ],
    features: [
      { title: "RESTful & GraphQL APIs", description: "Clean, versioned APIs built for consumption by web and mobile clients." },
      { title: "Queue-based processing", description: "Reliable background jobs for emails, imports, and heavy computation." },
      { title: "Multi-tenancy", description: "Isolated tenant data and configuration for B2B SaaS products." },
      { title: "Comprehensive testing", description: "PHPUnit and Pest test suites covering critical business logic." },
    ],
    techStack: ["Laravel 12", "PHP 8.3", "MySQL", "PostgreSQL", "Redis", "Livewire", "Docker"],
    process: standardProcess,
    faqs: [
      { question: "Is Laravel a good fit for enterprise applications?", answer: "Yes — Laravel's ecosystem (queues, events, policies, testing tools) is well suited to complex, long-lived enterprise systems." },
      { question: "Can Laravel power both our API and admin dashboard?", answer: "Absolutely. We commonly pair a Laravel API with a React or Next.js frontend, or use Laravel with Livewire for a fully server-rendered admin experience." },
    ],
  },
  {
    slug: "nextjs-development",
    category: "Development",
    name: "Next.js Development",
    shortName: "Next.js",
    icon: Triangle,
    tagline: "The React framework for production, done right.",
    overview:
      "We're deep specialists in Next.js — App Router, server components, streaming, and edge rendering — building applications that are fast by default and optimized for both users and search engines.",
    benefits: [
      { title: "Best-in-class performance", description: "Server components and edge rendering minimize client-side JavaScript." },
      { title: "SEO-first architecture", description: "Server-rendered pages with full metadata control out of the box." },
      { title: "Unified full-stack codebase", description: "API routes and server actions eliminate the need for a separate backend in many cases." },
    ],
    features: [
      { title: "App Router architecture", description: "Modern routing with layouts, streaming, and parallel data fetching." },
      { title: "Server actions", description: "Type-safe mutations without hand-rolled API endpoints." },
      { title: "ISR & edge caching", description: "The right rendering strategy for every page — static, dynamic, or streamed." },
      { title: "Image & font optimization", description: "Automatic optimization for the best Core Web Vitals scores." },
    ],
    techStack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Vercel", "Prisma"],
    process: standardProcess,
    faqs: [
      { question: "Why choose Next.js over a plain React SPA?", answer: "Next.js gives you server rendering, routing, and performance optimization out of the box — critical for SEO and Core Web Vitals, which a client-only SPA struggles with." },
      { question: "Can you migrate our existing React app to Next.js?", answer: "Yes, we regularly migrate CRA and Vite SPAs to Next.js incrementally, minimizing downtime and regression risk." },
    ],
  },
  {
    slug: "react-development",
    category: "Development",
    name: "React Development",
    shortName: "React",
    icon: Atom,
    tagline: "Interactive interfaces engineered for performance.",
    overview:
      "We build complex, stateful frontend applications with React — dashboards, editors, and real-time interfaces — with a strong focus on component architecture, performance, and accessibility.",
    benefits: [
      { title: "Maintainable component architecture", description: "Reusable, well-typed components that scale with your product." },
      { title: "Smooth, responsive UI", description: "Optimized rendering for even the most data-dense interfaces." },
      { title: "Accessible by default", description: "WCAG-compliant components tested with real assistive technology." },
    ],
    features: [
      { title: "State management", description: "Zustand, Redux Toolkit, or React Query — matched to your app's needs." },
      { title: "Design system integration", description: "Component libraries built on ShadCN, Radix, or your existing design tokens." },
      { title: "Performance profiling", description: "Render optimization for complex, data-heavy interfaces." },
      { title: "Testing coverage", description: "React Testing Library and Playwright coverage for critical UI flows." },
    ],
    techStack: ["React 19", "TypeScript", "Zustand", "React Query", "Vite", "Playwright"],
    process: standardProcess,
    faqs: [
      { question: "Do you build standalone React apps outside of Next.js?", answer: "Yes — for internal tools, embedded widgets, or apps that don't need SSR, we build fast Vite-powered React SPAs." },
      { question: "How do you handle complex state management?", answer: "We choose the lightest tool that solves the problem — often React Query for server state and Zustand for client state — rather than defaulting to heavyweight solutions." },
    ],
  },
  {
    slug: "ui-ux-design",
    category: "Design",
    name: "UI/UX Design",
    shortName: "UI/UX Design",
    icon: Palette,
    tagline: "Design that looks premium and performs even better.",
    overview:
      "Our design team crafts interfaces that balance aesthetics with usability — research-driven UX, cohesive design systems, and pixel-perfect UI that holds up against the best product companies in the world.",
    benefits: [
      { title: "Higher user satisfaction", description: "Intuitive flows reduce friction and support tickets." },
      { title: "Consistent brand experience", description: "A design system ensures every screen feels like part of the same product." },
      { title: "Faster development", description: "Well-documented design systems speed up engineering handoff." },
    ],
    features: [
      { title: "User research & testing", description: "Interviews, usability testing, and data-informed design decisions." },
      { title: "Design systems", description: "Reusable component libraries in Figma, mirrored in code." },
      { title: "Interactive prototyping", description: "Clickable prototypes to validate flows before development starts." },
      { title: "Accessibility audits", description: "WCAG 2.2 AA compliance built into every design decision." },
    ],
    techStack: ["Figma", "Framer", "Adobe Creative Suite", "Maze", "ShadCN UI"],
    process: standardProcess,
    faqs: [
      { question: "Do you design and develop, or just design?", answer: "Both — our designers and engineers work from the same design system, ensuring nothing is lost in handoff. We also take on design-only engagements." },
      { question: "Can you redesign our existing product?", answer: "Yes, redesigns are a significant part of our work — we audit the current experience, identify friction points, and rebuild with a clear before/after impact." },
    ],
  },
  {
    slug: "api-development",
    category: "Development",
    name: "API Development",
    shortName: "API Development",
    icon: Webhook,
    tagline: "Clean, documented APIs that other systems love to consume.",
    overview:
      "We design and build REST and GraphQL APIs that are secure, versioned, well-documented, and built to support both your current integrations and whatever you build next.",
    benefits: [
      { title: "Reliable integrations", description: "Well-defined contracts reduce integration bugs for every consumer." },
      { title: "Future-proof architecture", description: "Versioning strategy that lets you evolve without breaking clients." },
      { title: "Faster partner onboarding", description: "Clear documentation means third parties integrate without hand-holding." },
    ],
    features: [
      { title: "REST & GraphQL", description: "The right API paradigm for your data shape and client needs." },
      { title: "Authentication & rate limiting", description: "OAuth2, API keys, and throttling to keep your API secure and stable." },
      { title: "Auto-generated documentation", description: "OpenAPI/Swagger docs that stay in sync with your code." },
      { title: "Webhook infrastructure", description: "Reliable event delivery with retries and signature verification." },
    ],
    techStack: ["Node.js", "Laravel", "GraphQL", "PostgreSQL", "Redis", "OpenAPI"],
    process: standardProcess,
    faqs: [
      { question: "REST or GraphQL — which do we need?", answer: "REST suits simple, resource-based APIs with broad compatibility. GraphQL shines when clients need flexible queries over complex, nested data. We'll recommend based on your actual use case." },
      { question: "Can you build APIs on top of our legacy database?", answer: "Yes, we frequently build clean API layers on top of legacy or third-party databases without requiring a full data migration." },
    ],
  },
  {
    slug: "crm-development",
    category: "Development",
    name: "CRM Development",
    shortName: "CRM Development",
    icon: Users,
    tagline: "Custom CRM systems built around how your team actually sells.",
    overview:
      "Off-the-shelf CRMs force your process to fit their workflow. We build custom CRM systems modeled on your actual sales, support, or account management process — with the automations and reporting you need, and none of the bloat you don't.",
    benefits: [
      { title: "Fits your exact workflow", description: "No more forcing your process into a generic tool's rigid structure." },
      { title: "Lower per-seat cost", description: "Own your system outright instead of paying growing per-user licensing fees." },
      { title: "Deep integrations", description: "Connect natively with your existing stack instead of relying on fragile third-party connectors." },
    ],
    features: [
      { title: "Pipeline & deal tracking", description: "Custom stages, automation triggers, and forecasting built around your sales motion." },
      { title: "Contact & account management", description: "Unified customer records pulled from every touchpoint." },
      { title: "Automated workflows", description: "Task creation, follow-up reminders, and lead routing without manual work." },
      { title: "Custom reporting", description: "Dashboards built around the metrics that matter to your business." },
    ],
    techStack: ["Laravel", "Next.js", "PostgreSQL", "Twilio", "SendGrid"],
    process: standardProcess,
    faqs: [
      { question: "Why build custom instead of using Salesforce or HubSpot?", answer: "When your process is standard, off-the-shelf tools are fine. When your sales motion, compliance needs, or integration requirements are non-standard, a custom CRM removes constant workaround friction and per-seat cost growth." },
      { question: "Can you migrate our data from our current CRM?", answer: "Yes, we handle full data migration including historical records, custom fields, and attachments." },
    ],
  },
  {
    slug: "erp-development",
    category: "Development",
    name: "ERP Development",
    shortName: "ERP Development",
    icon: Building2,
    tagline: "Unify operations, inventory, and finance in one system.",
    overview:
      "We build custom ERP systems that bring together procurement, inventory, finance, and operations into a single source of truth — tailored to how your organization actually runs, not a generic template.",
    benefits: [
      { title: "Single source of truth", description: "Eliminate data silos and reconciliation errors across departments." },
      { title: "Operational visibility", description: "Real-time reporting across finance, inventory, and operations." },
      { title: "Scales with complexity", description: "Built to handle multi-location, multi-currency, and multi-entity operations." },
    ],
    features: [
      { title: "Inventory & procurement", description: "Real-time stock tracking, purchase orders, and supplier management." },
      { title: "Financial modules", description: "Invoicing, accounts payable/receivable, and financial reporting." },
      { title: "Role-based workflows", description: "Approval chains and permissions matched to your organizational structure." },
      { title: "Custom reporting engine", description: "Operational dashboards built for executives and department leads alike." },
    ],
    techStack: ["Laravel", "PostgreSQL", "Next.js", "Redis", "Docker"],
    process: standardProcess,
    faqs: [
      { question: "How long does a custom ERP take to build?", answer: "A focused ERP covering 2-3 core modules typically takes 4-6 months. Full enterprise-wide systems can take longer depending on integration complexity." },
      { question: "Can it integrate with our existing accounting software?", answer: "Yes, we build integrations with QuickBooks, Xero, and other accounting platforms as part of the ERP build." },
    ],
  },
  {
    slug: "cloud-solutions",
    category: "Infrastructure",
    name: "Cloud Solutions",
    shortName: "Cloud Solutions",
    icon: Cloud,
    tagline: "Infrastructure that scales without the surprises.",
    overview:
      "We design and manage cloud infrastructure on AWS, GCP, and Azure — architected for reliability, cost efficiency, and the ability to scale from your first users to your millionth without a rebuild.",
    benefits: [
      { title: "Predictable costs", description: "Right-sized infrastructure with cost monitoring to avoid runaway bills." },
      { title: "High availability", description: "Multi-zone architectures designed to survive infrastructure failures." },
      { title: "Elastic scale", description: "Auto-scaling infrastructure that handles traffic spikes gracefully." },
    ],
    features: [
      { title: "Infrastructure as code", description: "Terraform-managed infrastructure for repeatable, auditable deployments." },
      { title: "Multi-cloud & hybrid setups", description: "Architecture matched to your compliance and vendor requirements." },
      { title: "Cost optimization", description: "Right-sizing and reserved capacity planning to reduce cloud spend." },
      { title: "Disaster recovery", description: "Backup and failover strategies with defined RTO/RPO targets." },
    ],
    techStack: ["AWS", "Google Cloud", "Azure", "Terraform", "Kubernetes", "Docker"],
    process: standardProcess,
    faqs: [
      { question: "Which cloud provider should we use?", answer: "It depends on your existing tooling, compliance requirements, and team expertise. We're provider-agnostic and will recommend based on your specific constraints." },
      { question: "Can you migrate us from on-premise to the cloud?", answer: "Yes, we plan and execute on-premise to cloud migrations with minimal downtime, including data migration and cutover strategy." },
    ],
  },
  {
    slug: "devops",
    category: "Infrastructure",
    name: "DevOps",
    shortName: "DevOps",
    icon: GitBranch,
    tagline: "Ship faster, break less, sleep better.",
    overview:
      "We implement CI/CD pipelines, observability, and infrastructure automation that let your team deploy confidently, multiple times a day, with fast rollback and clear visibility when something goes wrong.",
    benefits: [
      { title: "Faster release cycles", description: "Automated pipelines turn multi-day releases into minutes." },
      { title: "Fewer production incidents", description: "Automated testing gates and staged rollouts catch issues before users do." },
      { title: "Full observability", description: "Logs, metrics, and traces unified so incidents are diagnosed in minutes, not hours." },
    ],
    features: [
      { title: "CI/CD pipelines", description: "Automated build, test, and deploy pipelines tailored to your stack." },
      { title: "Monitoring & alerting", description: "Real-time dashboards and on-call alerting for critical systems." },
      { title: "Containerization", description: "Docker and Kubernetes setups for consistent environments everywhere." },
      { title: "Security hardening", description: "Automated dependency scanning and secrets management." },
    ],
    techStack: ["GitHub Actions", "Docker", "Kubernetes", "Terraform", "Datadog", "Grafana"],
    process: standardProcess,
    faqs: [
      { question: "We already deploy manually — is DevOps worth it at our size?", answer: "If deployments are risky, slow, or require a specific person to execute, you're paying an ongoing tax in speed and reliability. Even a lightweight CI/CD setup pays for itself quickly." },
      { question: "Do you provide ongoing DevOps support or just initial setup?", answer: "Both — we offer setup engagements and ongoing managed DevOps retainers depending on your team's needs." },
    ],
  },
  {
    slug: "maintenance-support",
    category: "Infrastructure",
    name: "Maintenance & Support",
    shortName: "Maintenance & Support",
    icon: LifeBuoy,
    tagline: "Your product, kept fast, secure, and up to date.",
    overview:
      "We provide ongoing maintenance, monitoring, and support for web and mobile applications — whether we built them or not — covering security patches, dependency upgrades, bug fixes, and performance tuning under a clear SLA.",
    benefits: [
      { title: "Peace of mind", description: "Proactive monitoring catches issues before your users notice them." },
      { title: "Always up to date", description: "Regular dependency and security patching reduces vulnerability exposure." },
      { title: "Predictable costs", description: "Fixed monthly retainers instead of unpredictable emergency fire drills." },
    ],
    features: [
      { title: "24/7 uptime monitoring", description: "Automated alerts the moment something goes wrong." },
      { title: "Security patching", description: "Regular dependency updates and vulnerability remediation." },
      { title: "Performance tuning", description: "Ongoing optimization as your traffic and data grow." },
      { title: "SLA-backed response times", description: "Guaranteed response and resolution windows based on severity." },
    ],
    techStack: ["New Relic", "Sentry", "Datadog", "GitHub Actions", "Docker"],
    process: standardProcess,
    faqs: [
      { question: "Do you support applications you didn't originally build?", answer: "Yes — we start with a codebase audit to understand the system, then bring it under our monitoring and support umbrella." },
      { question: "What's included in a support retainer?", answer: "Typically: uptime monitoring, security patching, bug fixes, minor feature requests, and a defined monthly hour allowance, all governed by an SLA matched to your plan." },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
