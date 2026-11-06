import { auth } from "@/lib/auth";
import { getFollowingFeed } from "@/lib/feed";
import { JourneyCard } from "@/components/journey/journey-card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Following" };

export default async function FollowingPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="space-y-4 pt-2">
        <h1 className="text-xl font-bold tracking-tight">Following</h1>
        <EmptyState
          title="Sign in to see your feed"
          description="Follow journeys you care about, then come back here."
          actionLabel="Sign in"
          actionHref="/login"
        />
      </div>
    );
  }

  const journeys = await getFollowingFeed(session.user.id);

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
