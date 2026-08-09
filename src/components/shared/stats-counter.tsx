"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

function Counter({ value, suffix }: { value: string; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();

  const target = Number(value);
  const isNumeric = value.trim() !== "" && Number.isFinite(target);
  const decimals = value.includes(".") ? value.split(".")[1].length : 0;

  // Start at the final value so the server-rendered HTML — and anything that
  // reads it before the count-up runs (crawlers, audits, JS-disabled, reduced
  // motion) — shows the real number instead of 0.
  const [display, setDisplay] = React.useState(isNumeric ? target : 0);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1.4, bounce: 0 });

  React.useEffect(
    () => springValue.on("change", (latest) => setDisplay(latest)),
    [springValue]
  );

  React.useEffect(() => {
    if (!isInView || !isNumeric || prefersReducedMotion) return;
    setDisplay(0);
    motionValue.set(target);
  }, [isInView, isNumeric, motionValue, prefersReducedMotion, target]);

  return (
    <span ref={ref}>
      {isNumeric ? display.toFixed(decimals) : value}
      {suffix}
    </span>
  );
}

export function StatsCounter({ stats }: { stats: readonly Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          className="flex flex-col items-center gap-1 text-center"
        >
          <span className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            <Counter value={stat.value} suffix={stat.suffix} />
          </span>
          <span className="text-sm text-muted-foreground">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
