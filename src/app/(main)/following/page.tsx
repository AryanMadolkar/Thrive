import { getFollowingFeed } from "@/lib/feed";
import { JourneyCard } from "@/components/journey/journey-card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAuth } from "@/lib/require-auth";

export const metadata = { title: "Following" };

export default async function FollowingPage() {
  const sessionUser = await requireAuth("/following");
  const journeys = await getFollowingFeed(sessionUser.id);

  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-xl font-bold tracking-tight">Following</h1>
      {journeys.length === 0 ? (
        <EmptyState
          title="Your next favourite journey is out there"
          description="Explore stories and follow the journeys that inspire you."
          actionLabel="Explore Discover"
          actionHref="/discover"
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
