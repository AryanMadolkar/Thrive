import Link from "next/link";
import { cn } from "@/lib/utils";

export function DiscoverTabs({
  tab,
  category,
  search,
}: {
  tab: string;
  category?: string;
  search?: string;
}) {
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
      className="flex items-end border-b border-border"
      role="tablist"
      aria-label="Discover feeds"
    >
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <Link
            key={t.id}
            href={hrefFor(t.id)}
            role="tab"
            aria-selected={active}
            className={cn(
              "flex-1 border-b-2 pb-2.5 text-center text-[14px] transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
              active
                ? "border-foreground font-semibold text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
