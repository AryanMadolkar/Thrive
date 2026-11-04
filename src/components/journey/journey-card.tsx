import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { JourneyFollowButton } from "@/components/journey/follow-button";
import { EncourageButton } from "@/components/journey/encourage-button";
import {
  displayName,
  formatCompactCount,
  formatJourneyDay,
} from "@/lib/utils";

export type JourneyCardData = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  category: string;
  startDate: Date;
  isOfficial?: boolean;
  isFeatured?: boolean;
  coverImage?: string | null;
  followerCount: number;
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
  const snippet =
    journey.latestUpdate?.content ||
    journey.description ||
    "";
  const image =
    journey.latestUpdate?.imageUrl || journey.coverImage || null;

  return (
    <article className="fade-in overflow-hidden rounded-[16px] border border-border bg-white">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/u/${journey.creator.username}`}
            className="flex min-w-0 items-center gap-2.5"
          >
            <Avatar
              src={journey.creator.image}
              name={journey.creator.name}
              size="sm"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {displayName(journey.creator.name)}
              </p>
              <p className="text-xs text-muted">
                {formatJourneyDay(journey.startDate)}
              </p>
            </div>
          </Link>
          <JourneyFollowButton
            journeyId={journey.id}
            initialFollowing={journey.isFollowing}
          />
        </div>

        <Link href={`/j/${journey.slug}`} className="mt-3.5 block">
          <h2 className="text-[17px] font-bold leading-snug tracking-tight text-foreground">
            {journey.title}
          </h2>
          {snippet ? (
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
              {snippet}
            </p>
          ) : null}
          {image ? (
            <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-[12px] bg-warm">
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 430px"
              />
            </div>
          ) : null}
        </Link>

        <div className="mt-3 flex items-center gap-3 text-[13px] text-muted">
          {journey.latestUpdate ? (
            <>
              <EncourageButton
                updateId={journey.latestUpdate.id}
                initialLiked={journey.latestUpdate.likedByMe}
                initialCount={journey.latestUpdate.likeCount}
              />
              <Link
                href={`/j/${journey.slug}#comments`}
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                {formatCompactCount(journey.latestUpdate.commentCount)}
              </Link>
              <span className="mx-0.5 h-3 w-px bg-border" aria-hidden />
            </>
          ) : null}
          <span className="text-[12px]">
            {formatCompactCount(journey.followerCount)} following this journey
          </span>
        </div>
      </div>
    </article>
  );
}
