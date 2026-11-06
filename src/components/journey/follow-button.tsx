"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion";
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
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      disabled={pending}
      aria-pressed={following}
      aria-busy={pending}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          const result = await toggleJourneyFollow(journeyId);
          if (result?.ok) setFollowing(result.following);
        });
      }}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full border px-3.5 py-1.5 text-xs font-semibold",
        "min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
        "disabled:cursor-wait disabled:opacity-70",
        following
          ? "border-border/80 bg-surface-muted text-muted"
          : "border-foreground/90 bg-white text-foreground shadow-[var(--glass-shadow-soft)]",
        compact && "px-3 py-1",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={pending ? "pending" : following ? "following" : "follow"}
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          transition={reduceMotion ? { duration: 0 } : springSnappy}
          className="inline-block"
        >
          {pending ? "…" : following ? "Following" : "Follow"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
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
