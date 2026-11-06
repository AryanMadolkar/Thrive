"use client";

import { useEffect, useRef } from "react";

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
    <header className="space-y-5">
      <div>
        <h1 className="text-[34px] font-semibold tracking-[-0.045em] text-foreground md:text-[40px]">
          Discover
        </h1>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted">
          Explore journeys, follow stories and find inspiration in other
          people’s progress.
        </p>
      </div>

      {/* Mobile / compact search — desktop also has sidebar search */}
      <form action="/discover" method="get" className="relative md:hidden">
        {tab !== "for-you" ? (
          <input type="hidden" name="tab" value={tab} />
        ) : null}
        {category && category !== "ALL" ? (
          <input type="hidden" name="category" value={category} />
        ) : null}
        <input
          ref={inputRef}
          name="q"
          defaultValue={search}
          type="search"
          placeholder="Search journeys, creators, topics…"
          aria-label="Search journeys, creators, and topics"
          className="h-11 w-full rounded-none border-0 border-b border-border bg-transparent px-0 text-sm text-foreground outline-none placeholder:text-subtle focus:border-foreground"
        />
      </form>
    </header>
  );
}
