export const siteConfig = {
  name: "Sbabu AI",
  legalName: "Sbabu AI Technologies",
  tagline: "Building Intelligent Businesses Through AI & Software",
  description:
    "Sbabu AI is a global AI & software development agency helping ambitious companies design, build, and scale intelligent products — from AI agents and automation to full-stack web and mobile platforms.",
  url: "https://sbabu.ai",
  ogImage: "/og-image.png",
  email: "hello@sbabu.ai",
  salesEmail: "sales@sbabu.ai",
  phone: "+91 93102 49299",
  whatsapp: "919310249299",
  address: {
    street: "548 Market Street, Suite 62000",
    city: "San Francisco",
    state: "CA",
    zip: "94104",
    country: "United States",
  },
  social: {
    twitter: "https://twitter.com/sbabuai",
    linkedin: "https://linkedin.com/company/sbabuai",
    github: "https://github.com/sbabuai",
    instagram: "https://instagram.com/sbabuai",
    dribbble: "https://dribbble.com/sbabuai",
  },
  founded: "2019",
  stats: [
    { label: "Projects Delivered", value: "240", suffix: "+" },
    { label: "Global Clients", value: "85", suffix: "+" },
    { label: "Team Experts", value: "60", suffix: "+" },
    { label: "Client Retention", value: "96", suffix: "%" },
  ],
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    megaMenu: true,
  },
  {
    label: "Industries",
    href: "/industries",
    megaMenu: true,
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const footerLinks = {
  services: [
    { label: "AI Agent Development", href: "/services/ai-agent-development" },
    { label: "AI Chatbots", href: "/services/ai-chatbots" },
    { label: "AI Automation", href: "/services/ai-automation" },
    { label: "Web Application Development", href: "/services/web-application-development" },
    { label: "Mobile App Development", href: "/services/mobile-app-development" },
    { label: "UI/UX Design", href: "/services/ui-ux-design" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
  ],
};
