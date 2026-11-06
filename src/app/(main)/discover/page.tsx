import { auth } from "@/lib/auth";
import { getDiscoverFeed } from "@/lib/feed";
import { JourneyCard } from "@/components/journey/journey-card";
import { DiscoverTabs } from "@/components/feed/discover-tabs";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Discover" };

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    category?: string;
    q?: string;
    focus?: string;
  }>;
}) {
  const params = await searchParams;
  const session = await auth();
  const tab = (params.tab as "for-you" | "following" | "popular") || "for-you";
  const search = params.q?.trim();

  let journeys: Awaited<ReturnType<typeof getDiscoverFeed>> = [];
  let feedError = false;
  try {
    journeys = await getDiscoverFeed({
      viewerId: session?.user?.id,
      tab,
      search,
    });
  } catch (error) {
    console.error("discover feed failed", error);
    feedError = true;
  }

  return (
    <div className="space-y-4 pt-1 md:pt-0">
      <DiscoverTabs
        tab={tab}
        search={search}
        focusSearch={params.focus === "search"}
      />

      {feedError ? (
        <EmptyState
          title="Can’t reach the database"
          description="Check that DATABASE_URL and AUTH_SECRET are set in Vercel environment variables, then redeploy."
        />
      ) : journeys.length === 0 ? (
        <EmptyState
          title={
            tab === "following"
              ? "No followed journeys yet"
              : search
                ? "No journeys found"
                : "No journeys yet"
          }
          description={
            tab === "following"
              ? "Follow a journey from Discover and updates will appear here."
              : "Create a journey or explore when others start sharing."
          }
          actionLabel={tab === "following" ? "Go to Discover" : "Create a journey"}
          actionHref={tab === "following" ? "/discover" : "/create"}
        />
      ) : (
        <div className="space-y-3.5">
          {journeys.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} />
          ))}
        </div>
      )}
    </div>
  );
}
