"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn, formatCompactCount } from "@/lib/utils";
import { toggleUpdateLike } from "@/lib/actions/social";

export function EncourageButton({
  updateId,
  initialLiked,
  initialCount,
  showLabel = false,
}: {
  updateId: string;
  initialLiked: boolean;
  initialCount: number;
  showLabel?: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          const result = await toggleUpdateLike(updateId);
          if (result?.ok) {
            setLiked(result.liked);
            setCount((c) => c + (result.liked ? 1 : -1));
          }
        });
      }}
      className={cn(
        "inline-flex items-center gap-1.5 text-[13px] transition-colors",
        liked ? "text-foreground" : "text-muted hover:text-foreground"
      )}
      aria-label="Like"
    >
      <Heart
        className="h-4 w-4"
        strokeWidth={1.75}
        fill={liked ? "currentColor" : "none"}
      />
      <span>
        {showLabel && count === 0
          ? "Encourage"
          : formatCompactCount(count)}
      </span>
    </button>
  );
}
