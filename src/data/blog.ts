import type { BlogPost } from "@/types";

export const blogCategories = [
  "AI & Automation",
  "Web Development",
  "Product Design",
  "Engineering",
  "Business Strategy",
] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-agents-vs-chatbots-whats-the-real-difference",
    title: "AI Agents vs. Chatbots: What's the Real Difference?",
    excerpt:
      "The terms get used interchangeably, but agents and chatbots solve fundamentally different problems. Here's how to know which one your business actually needs.",
    category: "AI & Automation",
    author: { name: "Amara Chen", role: "Head of AI Engineering" },
    date: "2026-07-14",
    readTime: "6 min read",
    coverGradient: "from-violet-500 via-fuchsia-500 to-cyan-400",
    content: [
      "Every vendor conversation about AI right now uses 'agent' and 'chatbot' as if they're the same thing. They're not, and the distinction matters a lot when you're deciding what to build.",
      "A chatbot, at its core, is a conversational interface. It receives a message, retrieves relevant context, and generates a response. Even a very good chatbot — one grounded in your documentation with retrieval-augmented generation — is fundamentally reactive. It answers what it's asked.",
      "An AI agent is built to act, not just respond. It can break a goal into steps, call tools and APIs, evaluate the results, and decide what to do next — often without a human prompting each step. Where a chatbot might tell a customer how to update their shipping address, an agent could actually go update it, verify the change, and send a confirmation, all from a single instruction.",
      "The practical question isn't which is 'better' — it's which matches your use case. If you need to answer questions accurately and consistently, a well-grounded chatbot is often the right call: simpler to build, easier to evaluate, and lower risk. If you need to automate a multi-step process that currently requires a human to coordinate across systems, you're looking at agent territory.",
      "The riskiest projects we see are the ones that reach for agent architecture when a chatbot would have solved the problem, or vice versa — a rigid rule-based bot forced to handle open-ended requests. Start with the actual workflow, not the buzzword, and the right architecture usually becomes obvious.",
    ],
  },
  {
    slug: "why-your-mvp-should-skip-microservices",
    title: "Why Your MVP Should Skip Microservices",
    excerpt:
      "Microservices are the right architecture for scale — and the wrong one for validation. Here's how to think about the tradeoff honestly.",
    category: "Engineering",
    author: { name: "Diego Fuentes", role: "Principal Engineer" },
    date: "2026-06-22",
    readTime: "5 min read",
    coverGradient: "from-cyan-400 via-sky-500 to-indigo-600",
    content: [
      "We get asked to architect microservices for products that don't have their first paying customer yet more often than you'd think. The instinct makes sense — you've read the engineering blogs from companies operating at massive scale, and their architecture looks impressive. But copying their infrastructure before you have their problems is a costly mistake.",
      "Microservices solve organizational and scaling problems: independent deployability across large teams, isolated failure domains, and the ability to scale specific components independently. Those are real benefits — once you have the team size and traffic patterns that create those problems in the first place.",
      "Before that point, a well-structured modular monolith gives you nearly all the maintainability benefits with a fraction of the operational overhead. No distributed tracing to debug a single user flow across six services. No network latency between components that used to be a function call. No duplicated infrastructure to provision and monitor for every service.",
      "The key is building the monolith with clear module boundaries from day one — enforced through code structure, not just convention — so that if and when you do need to split services out, the seams are already there. We've done this split successfully for clients well after product-market fit, and it's a far easier migration than untangling a premature microservices mess would have been.",
    ],
  },
  {
    slug: "the-real-cost-of-technical-debt-in-a-growing-saas",
    title: "The Real Cost of Technical Debt in a Growing SaaS",
    excerpt:
      "Technical debt doesn't show up on a balance sheet, but it shows up everywhere else — in velocity, in hiring, and eventually in churn.",
    category: "Business Strategy",
    author: { name: "Rachel Kim", role: "VP of Engineering Delivery" },
    date: "2026-05-30",
    readTime: "7 min read",
    coverGradient: "from-emerald-400 via-teal-500 to-indigo-600",
    content: [
      "Technical debt is easy to defer because, unlike financial debt, there's no monthly statement reminding you it exists. It accrues quietly in code that's hard to change, tests that don't exist, and architecture decisions made under a deadline that never got revisited.",
      "The first symptom is usually velocity. Features that should take a week start taking a month, not because the team got worse, but because every change now requires working around fragile code paths and untested assumptions. Leadership sees slower delivery and often responds by adding more engineers — which, on a tangled codebase, frequently makes things worse before it makes them better.",
      "The second symptom is hiring and retention. Good engineers can tell within their first few weeks whether they're working in a codebase that respects their time. Persistent technical debt is one of the more reliable predictors of engineering team turnover we've seen across client engagements.",
      "The fix isn't a rewrite — rewrites carry enormous risk and rarely deliver the clean slate people imagine. It's disciplined, incremental improvement: strangling problematic modules, adding test coverage before touching risky code, and treating architecture reviews as a regular practice rather than a crisis response. Budget for it continuously, and it never becomes a crisis.",
    ],
  },
  {
    slug: "designing-ai-interfaces-people-actually-trust",
    title: "Designing AI Interfaces People Actually Trust",
    excerpt:
      "Great AI products fail on trust before they fail on capability. Here's what separates AI interfaces users rely on from ones they abandon.",
    category: "Product Design",
    author: { name: "Naomi Patel", role: "Design Director" },
    date: "2026-05-09",
    readTime: "6 min read",
    coverGradient: "from-rose-400 via-pink-500 to-violet-600",
    content: [
      "Most discussions about AI products focus entirely on model quality. But we've watched technically excellent AI features get abandoned by users because the interface never earned their trust — and mediocre models succeed because the surrounding product design made their limitations legible and safe.",
      "The first principle is showing your work. When an AI system makes a recommendation or takes an action, users trust it more when they can see why — cited sources, a visible reasoning summary, or a clear indication of confidence. Black-box answers, even correct ones, train users to be suspicious.",
      "The second is making reversibility obvious. Users will let an AI take much bolder actions if they know they can easily undo them. Interfaces that clearly communicate 'this is a suggestion, you approve it' versus 'this already happened, here's how to reverse it' dramatically change how comfortable people are handing off control.",
      "The third is graceful failure. Every AI system is wrong sometimes. The products that keep users' trust are the ones that fail visibly and gracefully — flagging low confidence, asking clarifying questions, or explicitly saying 'I'm not sure' — rather than confidently producing a wrong answer that looks identical to a right one.",
      "Design for AI products isn't just about the happy path anymore. It's about designing the full spectrum of confidence, from certain to uncertain to wrong, and making every point on that spectrum legible to the person relying on it.",
    ],
  },
  {
    slug: "next-js-15-app-router-lessons-from-production",
    title: "Next.js 15 App Router: Lessons From Production",
    excerpt:
      "After shipping dozens of App Router projects, here's what we wish we'd known earlier about server components, caching, and data fetching.",
    category: "Web Development",
    author: { name: "Tomás Alvarez", role: "Lead Frontend Engineer" },
    date: "2026-04-18",
    readTime: "8 min read",
    coverGradient: "from-indigo-500 via-violet-500 to-purple-600",
    content: [
      "The App Router's mental model — server components by default, client components as an opt-in island — is a genuine improvement over the pages router, but it takes a few production projects to develop good instincts for it.",
      "The biggest early mistake teams make is over-using 'use client'. It's tempting to slap it on a component the moment you need any interactivity, but that pulls the entire subtree into client-side JavaScript. The better pattern is pushing client boundaries as far down the tree as possible — a server component page that renders a small, focused client component for the interactive bit, not the other way around.",
      "Caching is the second area that trips teams up, mostly because the defaults changed meaningfully between versions and a lot of tutorial content online is now outdated. Understanding the difference between the request memoization, the data cache, the full route cache, and the router cache — and being explicit about revalidation strategy per route — saves a lot of confusing 'why is this stale' debugging later.",
      "Server actions are the feature we've gotten the most mileage out of. For internal tools and admin panels especially, being able to write a mutation as a function colocated with the component that calls it, with full type safety end to end, eliminates an entire category of API boilerplate we used to write by hand.",
      "Our overall take after two years building on the App Router in production: it's a legitimate step forward for performance and developer experience, but it rewards teams who take the time to understand the rendering and caching model rather than treating it as 'React with extra folders.'",
    ],
  },
  {
    slug: "how-to-brief-an-agency-so-you-get-what-you-actually-need",
    title: "How to Brief an Agency So You Get What You Actually Need",
    excerpt:
      "The quality of what an agency delivers is often set before a single line of code is written — in how the project gets briefed.",
    category: "Business Strategy",
    author: { name: "Sarah Whitfield", role: "Head of Client Partnerships" },
    date: "2026-03-27",
    readTime: "5 min read",
    coverGradient: "from-amber-400 via-orange-500 to-rose-500",
    content: [
      "After running discovery on hundreds of projects, we've noticed the strongest predictor of a successful engagement isn't budget or timeline — it's the clarity of the initial brief, and specifically, whether it describes the problem or jumps straight to a prescribed solution.",
      "Briefs that say 'build us a mobile app with these six screens' skip the part where an experienced team can add the most value: understanding why those six screens, what problem they solve, and whether a mobile app is even the right medium. We'll often ask 'what happens today, without this?' before we ask anything about features.",
      "The most useful briefs include: the specific business outcome you're trying to move, who the software is for and what they currently do instead, any hard constraints (compliance, existing systems, timeline), and what success looks like in measurable terms three months after launch.",
      "It's fine — expected, even — not to have all of this figured out before the first conversation. A good discovery process should surface it. But coming in with a rough sense of the underlying problem, rather than a fully-formed feature list, consistently produces better outcomes than a hyper-detailed spec written without the context an experienced technical partner can bring.",
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
