import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { JourneyFollowButton } from "@/components/journey/follow-button";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  cn,
  formatCompactCount,
  formatJourneyDuration,
  formatRelative,
} from "@/lib/utils";

export type JourneyCardData = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  category: string;
  status: string;
  startDate: Date;
  isOfficial?: boolean;
  isFeatured?: boolean;
  coverImage?: string | null;
  followerCount: number;
  updateCount: number;
  isFollowing: boolean;
  creator: {
    name: string;
    username: string;
    image?: string | null;
    isOfficial?: boolean;
  };
  latestUpdate?: {
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: Date;
    likeCount: number;
    commentCount: number;
    likedByMe: boolean;
  } | null;
};

export function JourneyCard({ journey }: { journey: JourneyCardData }) {
  const categoryLabel =
    CATEGORY_LABELS[journey.category] ?? journey.category;
  const statusLabel = STATUS_LABELS[journey.status] ?? journey.status;
  const description = journey.description?.trim() || null;
  const latest = journey.latestUpdate;
  const timestamp = latest?.createdAt ?? journey.startDate;
  const reactionCount = latest?.likeCount ?? 0;
  const commentCount = latest?.commentCount ?? 0;

  return (
    <article
      className={cn(
        "fade-in group overflow-hidden rounded-[16px] border border-border bg-white transition-colors",
        "hover:border-border-strong"
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <Link
          href={`/u/${journey.creator.username}`}
          className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
        >
          <Avatar
            src={journey.creator.image}
            name={journey.creator.name}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {journey.creator.name}
            </p>
            <p className="truncate text-xs text-muted">
              @{journey.creator.username}
              <span className="text-subtle"> · </span>
              <time dateTime={new Date(timestamp).toISOString()}>
                {formatRelative(timestamp)}
              </time>
            </p>
          </div>
        </Link>

        <JourneyFollowButton
          journeyId={journey.id}
          initialFollowing={journey.isFollowing}
        />
      </div>

      <Link
        href={`/j/${journey.slug}`}
        className="mt-3 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/20"
      >
        {journey.coverImage ? (
          <div className="relative mx-4 aspect-[16/9] overflow-hidden rounded-[12px] bg-warm">
            <Image
              src={journey.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 560px"
            />
          </div>
        ) : null}

        <div className={cn("px-4", journey.coverImage ? "pt-3.5" : "pt-0")}>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.04em] text-muted">
            <span>{categoryLabel}</span>
            <span className="text-border-strong" aria-hidden>
              ·
            </span>
            <span>{statusLabel}</span>
            {journey.isOfficial ? (
              <>
                <span className="text-border-strong" aria-hidden>
                  ·
                </span>
                <span className="text-foreground">Official THRIVE Journey</span>
              </>
            ) : null}
          </div>

          <h2 className="mt-1.5 text-[17px] font-bold leading-snug tracking-tight text-foreground">
            {journey.title}
          </h2>

          {description ? (
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
              {description}
            </p>
          ) : null}

          <p className="mt-2 text-xs text-subtle">
            {formatJourneyDuration(journey.startDate)} in
          </p>
        </div>

        {latest ? (
          <div className="mx-4 mt-3 rounded-[12px] border border-border bg-warm/60 px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-subtle">
              Latest update
            </p>
            <div className="mt-1.5 flex gap-3">
              <p className="line-clamp-3 flex-1 text-[13px] leading-relaxed text-foreground">
                “{latest.content.trim()}”
              </p>
              {latest.imageUrl ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-warm">
                  <Image
                    src={latest.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </Link>

      <div className="mt-3 flex items-center gap-3 border-t border-border px-4 py-3 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          <span>
            {formatCompactCount(journey.followerCount)}{" "}
            {journey.followerCount === 1 ? "follower" : "followers"}
          </span>
        </span>
        <span className="text-border-strong" aria-hidden>
          ·
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Heart className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          <span>
            {formatCompactCount(reactionCount)}{" "}
            {reactionCount === 1 ? "reaction" : "reactions"}
          </span>
        </span>
        <span className="text-border-strong" aria-hidden>
          ·
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          <span>
            {formatCompactCount(commentCount)}{" "}
            {commentCount === 1 ? "comment" : "comments"}
          </span>
        </span>
      </div>
    </article>
  );
}
