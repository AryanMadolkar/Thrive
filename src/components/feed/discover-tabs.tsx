"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springSoft } from "@/lib/motion";

export function DiscoverTabs({
  tab,
  category,
  search,
}: {
  tab: string;
  category?: string;
  search?: string;
}) {
  const reduceMotion = useReducedMotion();
  const tabs = [
    { id: "for-you", label: "For you" },
    { id: "following", label: "Following" },
    { id: "popular", label: "Popular" },
  ];

  const hrefFor = (id: string) => {
    const params = new URLSearchParams();
    if (id !== "for-you") params.set("tab", id);
    if (category && category !== "ALL") params.set("category", category);
    if (search) params.set("q", search);
    const s = params.toString();
    return s ? `/discover?${s}` : "/discover";
  };

  return (
    <div
      className="relative max-w-md rounded-full border border-border/80 bg-white/55 p-1 backdrop-blur-md"
      role="tablist"
      aria-label="Discover feeds"
    >
      <div className="relative grid grid-cols-3 gap-0.5">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <Link
              key={t.id}
              href={hrefFor(t.id)}
              role="tab"
              aria-selected={active}
              className={cn(
                "relative z-10 flex h-9 items-center justify-center rounded-full text-[13px] transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
                active
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted hover:text-foreground"
              )}
            >
              {active ? (
                <motion.span
                  layoutId="discover-tab-pill"
                  className="glass-pill absolute inset-0 rounded-full"
                  transition={reduceMotion ? { duration: 0 } : springSoft}
                  aria-hidden
                />
              ) : null}
              <span className="relative z-10">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
