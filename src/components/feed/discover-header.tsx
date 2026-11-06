"use client";

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

export function DiscoverHeader({
  tab,
  category,
  search,
  focusSearch,
}: {
  tab: string;
  category?: string;
  search?: string;
  focusSearch?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusSearch) inputRef.current?.focus();
  }, [focusSearch]);

  return (
    <header className="space-y-4">
      <div>
        <h1 className="text-[26px] font-bold tracking-tight text-foreground md:text-[28px]">
          Discover
        </h1>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">
          Explore journeys, follow stories and find inspiration in other
          people’s progress.
        </p>
      </div>

      <form action="/discover" method="get" className="relative">
        {tab !== "for-you" ? (
          <input type="hidden" name="tab" value={tab} />
        ) : null}
        {category && category !== "ALL" ? (
          <input type="hidden" name="category" value={category} />
        ) : null}
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
          strokeWidth={1.75}
          aria-hidden
        />
        <input
          ref={inputRef}
          name="q"
          defaultValue={search}
          type="search"
          placeholder="Search journeys, creators, topics…"
          aria-label="Search journeys, creators, and topics"
          className="h-11 w-full rounded-full border border-border bg-warm pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-border-strong focus:bg-white"
        />
      </form>
    </header>
  );
}
