import type { FAQ, TeamMember, JobOpening } from "@/types";

export const homeFaqs: FAQ[] = [
  {
    question: "What kind of companies do you work with?",
    answer:
      "We work with venture-backed startups, mid-market companies, and enterprise teams across AI, SaaS, healthcare, finance, retail, and more — typically organizations that need senior product engineering without building an in-house team from scratch.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "It depends on scope. A focused MVP or AI chatbot can launch in 4-8 weeks. Full platform builds typically run 3-6 months. We'll give you a realistic timeline after discovery, not before.",
  },
  {
    question: "Do you work with our existing team, or only end-to-end?",
    answer:
      "Both. We regularly embed with in-house teams to extend capacity on a specific initiative, and we also run full end-to-end engagements from discovery through long-term support.",
  },
  {
    question: "What does the engagement process look like?",
    answer:
      "Every engagement starts with a discovery workshop to align on goals and constraints, followed by design, development in focused sprints with regular demos, a staged deployment, and ongoing support after launch.",
  },
  {
    question: "Do you sign NDAs and handle data securely?",
    answer:
      "Yes, we sign NDAs as standard practice and follow strict data handling protocols, including encryption, access controls, and compliance alignment for regulated industries like healthcare and finance.",
  },
  {
    question: "How do you price projects?",
    answer:
      "We offer monthly retainer plans for ongoing product development and fixed-price quotes for well-scoped projects. See our Pricing page for plan details, or request a custom estimate.",
  },
];

export const team: TeamMember[] = [
  {
    name: "Victor Odom",
    role: "Founder & CEO",
    bio: "Founded Sbabu AI in 2019 after a decade building engineering teams at high-growth startups. Focused on the intersection of AI strategy and product execution.",
    initials: "VO",
  },
  {
    name: "Amara Chen",
    role: "Head of AI Engineering",
    bio: "Leads the AI practice, from agent architecture to production LLM systems. Previously built ML infrastructure at scale for enterprise fintech.",
    initials: "AC",
  },
  {
    name: "Rachel Kim",
    role: "VP of Engineering Delivery",
    bio: "Oversees delivery quality across every engagement. Obsessive about clean architecture, test coverage, and shipping things that don't break.",
    initials: "RK",
  },
  {
    name: "Naomi Patel",
    role: "Design Director",
    bio: "Leads product design and design systems work, with a background in enterprise UX and a strong point of view on interfaces people can trust.",
    initials: "NP",
  },
  {
    name: "Diego Fuentes",
    role: "Principal Engineer",
    bio: "Architects the hardest technical problems across client projects, from distributed systems to performance-critical frontend work.",
    initials: "DF",
  },
  {
    name: "Sarah Whitfield",
    role: "Head of Client Partnerships",
    bio: "Ensures every engagement stays aligned to business outcomes, not just delivered features. The first and last voice clients hear from.",
    initials: "SW",
  },
];

export const coreValues = [
  {
    title: "Outcomes over output",
    description: "We measure success by the business results our work creates, not the number of features shipped.",
  },
  {
    title: "Radical transparency",
    description: "Clear timelines, honest tradeoffs, and no surprises — you always know exactly where a project stands.",
  },
  {
    title: "Engineering discipline",
    description: "Clean architecture, real test coverage, and code we'd be proud to hand off — because eventually, we do.",
  },
  {
    title: "Design as strategy",
    description: "We treat design as a business function, not decoration — every interface decision ties back to a goal.",
  },
];

export const jobOpenings: JobOpening[] = [
  {
    slug: "senior-ai-engineer",
    title: "Senior AI Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    description:
      "Design and build production AI agent systems for clients across industries, from architecture through deployment and evaluation.",
    requirements: [
      "4+ years of software engineering experience, 1+ years working with LLM-based systems in production",
      "Strong Python or TypeScript fundamentals",
      "Experience with agent frameworks, RAG pipelines, and vector databases",
      "Comfortable working directly with clients on technical requirements",
    ],
  },
  {
    slug: "senior-fullstack-engineer-nextjs",
    title: "Senior Full-Stack Engineer (Next.js)",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    description:
      "Build production web applications for clients across industries using Next.js, TypeScript, and modern backend systems.",
    requirements: [
      "5+ years of professional web development experience",
      "Deep expertise in React, Next.js, and TypeScript",
      "Experience designing and building REST or GraphQL APIs",
      "Track record of shipping and maintaining production applications",
    ],
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    department: "Design",
    location: "Remote (Global)",
    type: "Full-time",
    description:
      "Lead UX research, design systems, and interface design across client engagements spanning web, mobile, and AI products.",
    requirements: [
      "4+ years of product design experience",
      "Strong portfolio demonstrating end-to-end design process",
      "Experience building and maintaining design systems",
      "Comfortable presenting design decisions directly to clients",
    ],
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote (Global)",
    type: "Full-time",
    description:
      "Design and manage cloud infrastructure and CI/CD pipelines for client projects across AWS, GCP, and Azure.",
    requirements: [
      "3+ years of DevOps or infrastructure engineering experience",
      "Strong experience with Terraform, Docker, and Kubernetes",
      "Familiarity with observability tooling and incident response",
      "Experience working across multiple cloud providers",
    ],
  },
  {
    slug: "technical-project-manager",
    title: "Technical Project Manager",
    department: "Delivery",
    location: "Remote (Global)",
    type: "Full-time",
    description:
      "Own delivery for a portfolio of client engagements, coordinating design, engineering, and client communication end to end.",
    requirements: [
      "3+ years managing software delivery projects",
      "Technical fluency to engage credibly with engineering teams",
      "Excellent written and verbal client communication skills",
      "Experience with agile delivery methodologies",
    ],
  },
];

export const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Laravel",
  "Node.js",
  "Python",
  "Tailwind CSS",
  "PostgreSQL",
  "OpenAI",
  "Anthropic Claude",
  "AWS",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "React Native",
  "Terraform",
];

export const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description: "We align on business goals, users, and constraints before any design or code work begins.",
  },
  {
    step: "02",
    title: "Design",
    description: "Wireframes, prototypes, and a design system tailored to your brand and users.",
  },
  {
    step: "03",
    title: "Development",
    description: "Focused sprints with continuous demos, automated testing, and full transparency.",
  },
  {
    step: "04",
    title: "Deployment",
    description: "CI/CD, infrastructure provisioning, and a staged rollout for a smooth launch.",
  },
  {
    step: "05",
    title: "Support",
    description: "Ongoing monitoring, iteration, and SLA-backed support after launch.",
  },
];

export const whyChooseUs = [
  {
    title: "Senior talent only",
    description: "Every engagement is staffed with senior engineers and designers — no junior learning curve on your dime.",
  },
  {
    title: "AI-native, not AI-bolted-on",
    description: "We've been building production AI systems since before it was trendy — it's core to how we architect software.",
  },
  {
    title: "Transparent delivery",
    description: "Weekly demos, clear timelines, and dashboards you can check anytime — never a black box.",
  },
  {
    title: "Built to last",
    description: "Clean architecture and real test coverage mean your product stays maintainable long after we hand it off.",
  },
];
