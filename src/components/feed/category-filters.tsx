"use client";

import Link from "next/link";
import { DISCOVER_CATEGORY_CHIPS, cn } from "@/lib/utils";

export function CategoryFilters({
  active,
  tab,
  search,
  orientation = "horizontal",
}: {
  active?: string;
  tab: string;
  search?: string;
  orientation?: "horizontal" | "vertical";
}) {
  const current = active || "ALL";

  const hrefFor = (value: string) => {
    const params = new URLSearchParams();
    if (tab !== "for-you") params.set("tab", tab);
    if (value !== "ALL") params.set("category", value);
    if (search) params.set("q", search);
    const s = params.toString();
    return s ? `/discover?${s}` : "/discover";
  };

  const vertical = orientation === "vertical";

  return (
    <div
      className={cn(
        vertical
          ? "flex flex-col gap-1"
          : "-mx-4 flex gap-1 overflow-x-auto px-4 pb-0.5 scrollbar-none md:mx-0 md:px-0"
      )}
      role="listbox"
      aria-label="Filter by category"
    >
      {DISCOVER_CATEGORY_CHIPS.map((chip) => {
        const selected = current === chip.value;
        const label =
          chip.value === "ALL"
            ? "#All"
            : `#${chip.label.replace(/\s+/g, "")}`;

        return (
          <Link
            key={chip.value}
            href={hrefFor(chip.value)}
            role="option"
            aria-selected={selected}
            className={cn(
              "shrink-0 rounded-md px-2 py-1.5 text-[15px] tracking-[-0.01em] transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
              vertical ? "w-full" : "",
              selected
                ? "font-semibold text-accent"
                : "font-medium text-muted hover:text-foreground"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
