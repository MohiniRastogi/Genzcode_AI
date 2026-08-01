import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Rendered element tag semantics are preserved by the caller's wrapper. */
  as?: "div" | "section";
}

/**
 * Fast, non-distracting scroll reveal (fade + slight slide-up).
 * Respects reduced motion via framer-motion's global reducedMotion handling.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Comp = as === "section" ? motion.section : motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.22, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}
