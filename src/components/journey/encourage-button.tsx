"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn, formatCompactCount } from "@/lib/utils";
import { springSnappy } from "@/lib/motion";
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
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      disabled={pending}
      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
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
      aria-pressed={liked}
    >
      <motion.span
        animate={
          reduceMotion
            ? undefined
            : liked
              ? { scale: [1, 1.18, 1] }
              : { scale: 1 }
        }
        transition={springSnappy}
        className="inline-flex"
      >
        <Heart
          className="h-4 w-4"
          strokeWidth={1.75}
          fill={liked ? "currentColor" : "none"}
        />
      </motion.span>
      <span>
        {showLabel && count === 0
          ? "Encourage"
          : formatCompactCount(count)}
      </span>
    </motion.button>
  );
}
