import Link from "next/link";
import { DISCOVER_CATEGORY_CHIPS, cn } from "@/lib/utils";

export function CategoryFilters({
  active,
  tab,
  search,
}: {
  active?: string;
  tab: string;
  search?: string;
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

  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 scrollbar-none md:mx-0 md:px-0"
      role="listbox"
      aria-label="Filter by category"
    >
      {DISCOVER_CATEGORY_CHIPS.map((chip) => {
        const selected = current === chip.value;
        return (
          <Link
            key={chip.value}
            href={hrefFor(chip.value)}
            role="option"
            aria-selected={selected}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
              selected
                ? "border-foreground bg-foreground text-white"
                : "border-border bg-white text-muted hover:border-border-strong hover:text-foreground"
            )}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
