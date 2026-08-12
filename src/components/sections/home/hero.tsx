"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Bot, Code2, Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
// Client component: site settings arrive as a prop from the server page rather
// than being read from the database here.

const floatingCards = [
  { icon: Bot, label: "AI Agents", className: "left-[4%] top-[18%]", delay: 0 },
  { icon: Code2, label: "Next.js 16", className: "right-[2%] top-[8%]", delay: 0.15 },
  { icon: Cpu, label: "Automation", className: "left-[8%] bottom-[12%]", delay: 0.3 },
  { icon: Zap, label: "99.9% Uptime", className: "right-[6%] bottom-[20%]", delay: 0.45 },
];

export function Hero({ siteName }: { siteName: string }) {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-brand-radial opacity-[0.15] dark:opacity-30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-brand opacity-[0.08] blur-[120px] dark:opacity-[0.18]"
        aria-hidden="true"
      />

      <div className="container-brand relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground"
          >
            <Sparkles className="size-3.5 text-primary" />
            Enterprise AI Agents &amp; Product Engineering
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            We Architect, Build &amp; Scale
            <br />
            <span className="text-gradient-brand">Production-Grade AI Agents</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Replace manual workflows with enterprise AI agents and high-performance
            full-stack platforms. {siteName} takes you from prototype to production
            scale in weeks — built and run by senior engineers only.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-gradient-brand px-7 text-base text-white hover:opacity-90"
              >
                <Link href="/contact#consultation">
                  Book 30-Min AI Strategy Call
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-primary/40 px-7 text-base text-foreground hover:border-primary hover:bg-primary/5"
              >
                <Link href="/portfolio">See Client Results</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Straight to a senior AI engineer · Free architecture review · No sales pitch
            </p>
          </motion.div>
        </div>

        <div className="relative mx-auto mt-16 hidden max-w-5xl sm:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="glass relative mx-auto flex h-72 max-w-3xl items-center justify-center overflow-hidden rounded-3xl"
          >
            <div className="grid grid-cols-3 gap-6 px-8 opacity-80">
              {["Discovery", "Design", "Development", "Deployment", "AI Agents", "Support"].map(
                (label) => (
                  <div
                    key={label}
                    className="flex h-16 items-center justify-center rounded-xl border border-border/60 bg-background/40 text-xs font-medium text-muted-foreground"
                  >
                    {label}
                  </div>
                )
              )}
            </div>
          </motion.div>

          {floatingCards.map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + card.delay }}
              className={`glass absolute flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-foreground shadow-lg ${card.className}`}
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-brand text-white">
                <card.icon className="size-3.5" />
              </span>
              {card.label}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
