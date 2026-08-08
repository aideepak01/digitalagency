import type { PricingPlan } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    name: "Startup",
    price: "$4,900",
    period: "/month",
    description: "For early-stage teams that need senior engineering and design without hiring a full in-house team.",
    features: [
      "1 dedicated product pod (PM + design + engineering)",
      "Up to 2 active projects",
      "Weekly sprint demos",
      "Core web or mobile application build",
      "Basic SEO & performance setup",
      "Slack-based communication",
      "Monthly reporting",
    ],
    cta: "Start with Startup",
  },
  {
    name: "Business",
    price: "$12,500",
    period: "/month",
    description: "For growing companies scaling a product with AI, integrations, and a dedicated senior team.",
    features: [
      "Dedicated cross-functional team",
      "Up to 5 active projects",
      "AI agent / automation development",
      "Advanced integrations & API development",
      "Dedicated DevOps & infrastructure support",
      "Priority Slack & video support",
      "Bi-weekly strategy reviews",
      "SLA-backed response times",
    ],
    cta: "Choose Business",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations that need dedicated capacity, compliance rigor, and long-term technology partnership.",
    features: [
      "Dedicated multi-team engagement",
      "Unlimited active projects",
      "Custom AI, ERP, and CRM systems",
      "Enterprise security & compliance review",
      "Dedicated account & delivery lead",
      "24/7 priority support with custom SLA",
      "Quarterly business reviews",
      "On-site workshops available",
    ],
    cta: "Talk to Sales",
  },
];

export const pricingFaqs = [
  {
    question: "What's included in the monthly retainer?",
    answer:
      "Every plan includes a dedicated team, active project delivery, sprint-based progress tracking, and ongoing communication. Higher tiers add specialized capabilities like AI development, DevOps, and compliance support.",
  },
  {
    question: "Can we switch plans as our needs change?",
    answer:
      "Yes, plans can be adjusted at the start of any billing cycle as your team size and project scope evolve.",
  },
  {
    question: "Do you offer fixed-price projects instead of retainers?",
    answer:
      "For well-defined, scoped projects we offer fixed-price engagements. Retainers are recommended for ongoing product development where scope evolves over time.",
  },
  {
    question: "Is there a minimum commitment?",
    answer:
      "Startup and Business plans have a 3-month minimum engagement to allow the team to ramp up properly and deliver meaningful results. Enterprise terms are custom.",
  },
];
