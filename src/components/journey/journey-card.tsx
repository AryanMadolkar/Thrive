import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JourneyFollowButton } from "@/components/journey/follow-button";
import { SafeImage } from "@/components/ui/safe-image";
import {
  categoryHashtag,
  cn,
  formatCompactCount,
  formatShortDate,
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

export function JourneyCard({
  journey,
  tone = "white",
}: {
  journey: JourneyCardData;
  tone?: "white" | "muted";
}) {
  const hashtag = categoryHashtag(journey.category);
  const latest = journey.latestUpdate;
  const timestamp = latest?.createdAt ?? journey.startDate;
  const media = journey.coverImage || latest?.imageUrl || null;

  return (
    <article
      className={cn(
        "fade-in group relative flex h-full flex-col overflow-hidden border border-border/90 bg-white",
        "transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-spring)]",
        "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--card-shadow-hover)]"
      )}
    >
      <div className="relative">
        <Link
          href={`/j/${journey.slug}`}
          className="card-media relative block aspect-square overflow-hidden bg-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/20"
        >
          {media ? (
            <SafeImage
              src={media}
              alt=""
              fill
              className="object-cover transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between bg-[linear-gradient(160deg,#111_0%,#2c2c2c_55%,#141414_100%)] p-5 text-white">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                {journey.creator.name}
              </p>
              <p className="max-w-[13ch] text-[22px] font-semibold leading-tight tracking-[-0.03em]">
                {journey.title}
              </p>
            </div>
          )}
        </Link>

        <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
          <JourneyFollowButton
            journeyId={journey.id}
            initialFollowing={journey.isFollowing}
            compact
            className="border-white/35 bg-black/40 text-white backdrop-blur-md hover:bg-black/55"
          />
        </div>
      </div>

      <Link
        href={`/j/${journey.slug}`}
        className={cn(
          "relative flex flex-1 flex-col px-4 pb-4 pt-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/20",
          tone === "muted" ? "bg-surface-muted" : "bg-white"
        )}
      >
        <time
          className="text-[12px] tabular-nums text-subtle"
          dateTime={new Date(timestamp).toISOString()}
          suppressHydrationWarning
        >
          {formatShortDate(timestamp)}
        </time>

        <h2 className="mt-2.5 text-[17px] font-medium leading-[1.35] tracking-[-0.02em] text-foreground">
          {journey.title}
        </h2>

        {latest?.content ? (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {latest.content.trim()}
          </p>
        ) : journey.description ? (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {journey.description.trim()}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="min-w-0">
            <p className="truncate text-[12px] text-subtle">{hashtag}</p>
            {journey.isOfficial ? (
              <p className="mt-0.5 text-[11px] text-muted">Official</p>
            ) : (
              <p className="mt-0.5 text-[11px] text-subtle">
                {formatCompactCount(journey.followerCount)} following
              </p>
            )}
          </div>

          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-white transition-transform duration-300 group-hover:scale-105"
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </span>
        </div>
      </Link>
    </article>
  );
}
