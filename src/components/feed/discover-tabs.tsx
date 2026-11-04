"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function DiscoverTabs({
  tab,
  search,
  focusSearch,
}: {
  tab: string;
  category?: string;
  search?: string;
  focusSearch?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const tabs = [
    { id: "for-you", label: "For you" },
    { id: "following", label: "Following" },
    { id: "popular", label: "Popular" },
  ];

  useEffect(() => {
    if (focusSearch) inputRef.current?.focus();
  }, [focusSearch]);

  const hrefFor = (id: string) => {
    const params = new URLSearchParams();
    if (id !== "for-you") params.set("tab", id);
    if (search) params.set("q", search);
    const s = params.toString();
    return s ? `/discover?${s}` : "/discover";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-around border-b border-border">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={hrefFor(t.id)}
            className={cn(
              "flex-1 border-b-2 pb-2.5 text-center text-[14px] transition-colors",
              tab === t.id
                ? "border-foreground font-semibold text-foreground"
                : "border-transparent text-muted"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {(focusSearch || search) && (
        <form action="/discover" method="get">
          {tab !== "for-you" ? (
            <input type="hidden" name="tab" value={tab} />
          ) : null}
          <input
            ref={inputRef}
            name="q"
            defaultValue={search}
            placeholder="Search journeys"
            className="h-10 w-full rounded-full border border-border bg-warm px-4 text-sm outline-none focus:border-border-strong"
          />
        </form>
      )}
    </div>
  );
}
