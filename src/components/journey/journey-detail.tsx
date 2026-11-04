"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { JourneyFollowButton } from "@/components/journey/follow-button";
import {
  createCommentAction,
  deleteCommentAction,
} from "@/lib/actions/comments";
import { toggleCommentLike, toggleUpdateLike } from "@/lib/actions/social";
import {
  firstLine,
  formatCompactCount,
  formatRelative,
  journeyDayNumber,
} from "@/lib/utils";

type CommentNode = {
  id: string;
  content: string;
  createdAt: Date | string;
  author: {
    id: string;
    name: string;
    username: string;
    image?: string | null;
  };
  likeCount: number;
  likedByMe: boolean;
};

type UpdateNode = {
  id: string;
  content: string;
  imageUrl?: string | null;
  isMilestone: boolean;
  createdAt: Date | string;
  likeCount: number;
  likedByMe: boolean;
  commentCount: number;
};

export function JourneyDetailView({
  journey,
  currentUserId,
  isOwner,
  isFollowing,
}: {
  journey: {
    id: string;
    slug: string;
    title: string;
    description?: string | null;
    coverImage?: string | null;
    startDate: Date | string;
    isOfficial: boolean;
    isFeatured: boolean;
    followerCount: number;
    likeCount: number;
    commentCount: number;
    creator: {
      id: string;
      name: string;
      username: string;
      image?: string | null;
      bio?: string | null;
      isOfficial: boolean;
    };
    updates: UpdateNode[];
    comments: CommentNode[];
    commentTargetUpdateId?: string;
  };
  currentUserId?: string;
  isOwner: boolean;
  isFollowing: boolean;
}) {
  const router = useRouter();
  const chronological = [...journey.updates].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="fade-in space-y-5 pt-1">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full p-1.5 -ml-1.5 hover:bg-hover"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        {isOwner ? (
          <Link
            href={`/j/${journey.slug}/edit`}
            className="rounded-full p-1.5 hover:bg-hover"
            aria-label="More"
          >
            <MoreHorizontal className="h-5 w-5" strokeWidth={1.75} />
          </Link>
        ) : (
          <span className="w-8" />
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/u/${journey.creator.username}`}
          className="flex min-w-0 items-center gap-3"
        >
          <Avatar
            src={journey.creator.image}
            name={journey.creator.name}
            size="md"
          />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold">{journey.creator.name}</p>
            <p className="truncate text-xs text-muted">
              {journey.creator.bio ||
                (journey.creator.isOfficial
                  ? "Building in public"
                  : `@${journey.creator.username}`)}
            </p>
          </div>
        </Link>
        {!isOwner ? (
          currentUserId ? (
            <JourneyFollowButton
              journeyId={journey.id}
              initialFollowing={isFollowing}
            />
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-foreground px-3.5 py-1.5 text-xs font-semibold"
            >
              Follow
            </Link>
          )
        ) : null}
      </div>

      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">
          {journey.title}
        </h1>
        {(journey.isOfficial || journey.isFeatured) && (
          <span className="mt-3 inline-flex rounded-full bg-warm px-3 py-1 text-xs font-medium text-muted">
            Founding Journey
          </span>
        )}
        {journey.description ? (
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            {journey.description}
          </p>
        ) : null}
      </div>

      {journey.coverImage ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-warm">
          <Image
            src={journey.coverImage}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 560px"
          />
        </div>
      ) : null}

      <div className="flex items-center justify-center gap-6 border-y border-border py-3 text-[13px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Heart className="h-4 w-4" strokeWidth={1.75} />
          {formatCompactCount(journey.likeCount)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
          {formatCompactCount(journey.commentCount)}
        </span>
        <span>{formatCompactCount(journey.followerCount)} following</span>
      </div>

      <section>
        <h2 className="text-[15px] font-bold">Updates</h2>
        {chronological.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No updates yet.</p>
        ) : (
          <ol className="relative mt-4 space-y-0">
            {chronological.map((update, index) => {
              const isLast = index === chronological.length - 1;
              const day = journeyDayNumber(
                journey.startDate,
                update.createdAt
              );
              return (
                <li key={update.id} className="relative flex gap-3 pb-5">
                  {!isLast ? (
                    <span
                      className="absolute left-[5px] top-3 bottom-0 w-px bg-border"
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={`relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 ${
                      update.isMilestone || !isLast
                        ? "border-foreground bg-foreground"
                        : "border-foreground bg-white"
                    }`}
                  />
                  <div className="min-w-0 flex-1 -mt-0.5">
                    <p className="text-[14px] leading-snug text-foreground">
                      <span className="font-semibold">Day {day}</span>
                      <span className="text-muted"> — </span>
                      <span>{firstLine(update.content, 64)}</span>
                    </p>
                    {update.imageUrl ? (
                      <div className="relative mt-2 aspect-[16/9] overflow-hidden rounded-[10px] bg-warm">
                        <Image
                          src={update.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="400px"
                        />
                      </div>
                    ) : null}
                    <UpdateActions
                      update={update}
                      canInteract={Boolean(currentUserId)}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section id="comments" className="space-y-4 border-t border-border pt-5">
        <h2 className="text-[15px] font-bold">Comments</h2>
        {journey.comments.length === 0 ? (
          <p className="text-sm text-muted">Be the first to leave a comment.</p>
        ) : (
          <ul className="space-y-4">
            {journey.comments.map((comment) => (
              <CommentRow
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
              />
            ))}
          </ul>
        )}
        {currentUserId && journey.commentTargetUpdateId ? (
          <CommentComposer updateId={journey.commentTargetUpdateId} />
        ) : !currentUserId ? (
          <p className="text-sm text-muted">
            <Link href="/login" className="underline underline-offset-2">
              Sign in
            </Link>{" "}
            to comment.
          </p>
        ) : null}
      </section>
    </div>
  );
}

function UpdateActions({
  update,
  canInteract,
}: {
  update: UpdateNode;
  canInteract: boolean;
}) {
  const [liked, setLiked] = useState(update.likedByMe);
  const [count, setCount] = useState(update.likeCount);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted">
      <button
        type="button"
        disabled={!canInteract || pending}
        className="inline-flex items-center gap-1 hover:text-foreground disabled:opacity-50"
        onClick={() => {
          startTransition(async () => {
            const result = await toggleUpdateLike(update.id);
            if (result?.ok) {
              setLiked(result.liked);
              setCount((c) => c + (result.liked ? 1 : -1));
            }
          });
        }}
      >
        <Heart
          className="h-3.5 w-3.5"
          strokeWidth={1.75}
          fill={liked ? "currentColor" : "none"}
        />
        {count > 0 ? count : null}
      </button>
      <span className="inline-flex items-center gap-1">
        <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
        {update.commentCount > 0 ? update.commentCount : null}
      </span>
    </div>
  );
}

function CommentRow({
  comment,
  currentUserId,
}: {
  comment: CommentNode;
  currentUserId?: string;
}) {
  const [liked, setLiked] = useState(comment.likedByMe);
  const [pending, startTransition] = useTransition();

  return (
    <li className="flex gap-3">
      <Avatar src={comment.author.image} name={comment.author.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <Link
            href={`/u/${comment.author.username}`}
            className="text-sm font-semibold"
          >
            {comment.author.name.split(" ")[0]}
          </Link>
          <span className="text-xs text-subtle">
            {formatRelative(comment.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-foreground">
          {comment.content}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <button
            type="button"
            disabled={!currentUserId || pending}
            className="text-muted hover:text-foreground disabled:opacity-40"
            onClick={() => {
              startTransition(async () => {
                const result = await toggleCommentLike(comment.id);
                if (result?.ok) setLiked(result.liked);
              });
            }}
          >
            <Heart
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
              fill={liked ? "currentColor" : "none"}
            />
          </button>
          {currentUserId === comment.author.id ? (
            <button
              type="button"
              className="text-xs text-muted hover:text-danger"
              onClick={() => {
                startTransition(async () => {
                  await deleteCommentAction(comment.id);
                });
              }}
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function CommentComposer({ updateId }: { updateId: string }) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState("");

  return (
    <form
      className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5"
      action={(fd) => {
        startTransition(async () => {
          await createCommentAction(fd);
          setValue("");
        });
      }}
    >
      <input type="hidden" name="updateId" value={updateId} />
      <input
        name="content"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        placeholder="Add a comment..."
        className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-subtle"
      />
      <button
        type="submit"
        disabled={pending || !value.trim()}
        className="rounded-full p-1.5 text-foreground disabled:opacity-40"
        aria-label="Send"
      >
        <Send className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </form>
  );
}
