"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleJourneyFollow } from "@/lib/actions/social";
import { Button } from "@/components/ui/button";

export function JourneyFollowButton({
  journeyId,
  initialFollowing,
  compact = false,
  className,
}: {
  journeyId: string;
  initialFollowing: boolean;
  followerCount?: number;
  compact?: boolean;
  className?: string;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await toggleJourneyFollow(journeyId);
          if (result?.ok) setFollowing(result.following);
        });
      }}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
        following
          ? "border-border bg-warm text-muted"
          : "border-foreground bg-white text-foreground hover:bg-hover",
        className
      )}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}

export function UserFollowButton({
  userId,
  initialFollowing,
}: {
  userId: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant={following ? "secondary" : "primary"}
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const { toggleUserFollow } = await import("@/lib/actions/social");
          const result = await toggleUserFollow(userId);
          if (result?.ok) setFollowing(result.following);
        });
      }}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
