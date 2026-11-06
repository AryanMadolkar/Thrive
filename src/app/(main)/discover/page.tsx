import Link from "next/link";
import { JourneyCategory } from "@prisma/client";
import { auth } from "@/lib/auth";
import { getDiscoverFeed, type DiscoverTab } from "@/lib/feed";
import { JourneyCard } from "@/components/journey/journey-card";
import { DiscoverHeader } from "@/components/feed/discover-header";
import { DiscoverTabs } from "@/components/feed/discover-tabs";
import { CategoryFilters } from "@/components/feed/category-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { CATEGORIES } from "@/lib/utils";

export const metadata = { title: "Discover" };

function parseCategory(raw?: string): JourneyCategory | "ALL" {
  if (!raw || raw === "ALL") return "ALL";
  return (CATEGORIES as string[]).includes(raw)
    ? (raw as JourneyCategory)
    : "ALL";
}

function parseTab(raw?: string): DiscoverTab {
  if (raw === "following" || raw === "popular") return raw;
  return "for-you";
}

function emptyCopy({
  tab,
  search,
  category,
  signedIn,
}: {
  tab: DiscoverTab;
  search?: string;
  category: string;
  signedIn: boolean;
}) {
  if (search) {
    return {
      title: "No journeys found",
      description: "Try another keyword or category.",
      actionLabel: "Clear search",
      actionHref: category !== "ALL" ? `/discover?category=${category}` : "/discover",
    };
  }

  if (tab === "following") {
    if (!signedIn) {
      return {
        title: "Follow journeys you care about",
        description:
          "Sign in to save stories and see their latest progress here.",
        actionLabel: "Sign in",
        actionHref: "/login",
      };
    }
    return {
      title: "Your next favourite journey is out there",
      description: "Explore stories and follow the journeys that inspire you.",
      actionLabel: "Explore Discover",
      actionHref: "/discover",
    };
  }

  if (tab === "popular") {
    return {
      title: "No popular journeys yet",
      description: "Be part of the community as it grows.",
      actionLabel: "Create a journey",
      actionHref: "/create",
    };
  }

  if (category !== "ALL") {
    return {
      title: "Nothing in this category yet",
      description: "Try another filter, or start a journey of your own.",
      actionLabel: "Clear filter",
      actionHref: "/discover",
    };
  }

  return {
    title: "No journeys yet",
    description: "Create a journey or explore when others start sharing.",
    actionLabel: "Create a journey",
    actionHref: "/create",
  };
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    category?: string;
    q?: string;
    focus?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const session = await auth();
  const tab = parseTab(params.tab);
  const category = parseCategory(params.category);
  const search = params.q?.trim() || undefined;
  const page = Math.max(1, Number(params.page) || 1);

  let journeys: Awaited<ReturnType<typeof getDiscoverFeed>>["journeys"] = [];
  let hasMore = false;
  let feedError = false;

  try {
    const feed = await getDiscoverFeed({
      viewerId: session?.user?.id,
      tab,
      category,
      search,
      page,
    });
    journeys = feed.journeys;
    hasMore = feed.hasMore;
  } catch (error) {
    console.error("discover feed failed", error);
    feedError = true;
  }

  const empty = emptyCopy({
    tab,
    search,
    category,
    signedIn: Boolean(session?.user),
  });

  const loadMoreParams = new URLSearchParams();
  if (tab !== "for-you") loadMoreParams.set("tab", tab);
  if (category !== "ALL") loadMoreParams.set("category", category);
  if (search) loadMoreParams.set("q", search);
  loadMoreParams.set("page", String(page + 1));

  return (
    <div className="space-y-5 pt-1 md:pt-0">
      <DiscoverHeader
        tab={tab}
        category={category}
        search={search}
        focusSearch={params.focus === "search"}
      />

      <CategoryFilters
        active={category}
        tab={tab}
        search={search}
      />

      <DiscoverTabs tab={tab} category={category} search={search} />

      {feedError ? (
        <EmptyState
          title="Can’t reach the database"
          description="Something went wrong loading journeys. Please try again in a moment."
        />
      ) : journeys.length === 0 ? (
        <EmptyState
          title={empty.title}
          description={empty.description}
          actionLabel={empty.actionLabel}
          actionHref={empty.actionHref}
        />
      ) : (
        <div className="space-y-3.5">
          {journeys.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} />
          ))}

          {hasMore ? (
            <div className="pt-2 text-center">
              <Link
                href={`/discover?${loadMoreParams.toString()}`}
                className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-foreground transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              >
                Show more
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
