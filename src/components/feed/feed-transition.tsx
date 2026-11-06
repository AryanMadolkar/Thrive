"use client";

import { motion, useReducedMotion } from "motion/react";
import { feedTransition } from "@/lib/motion";

export function FeedTransition({
  feedKey,
  children,
}: {
  feedKey: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={feedKey}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : feedTransition}
    >
      {children}
    </motion.div>
  );
}
