"use client";

import { SafeImage } from "@/components/ui/safe-image";
import { useTransition } from "react";
import { EncourageButton } from "@/components/journey/encourage-button";
import { CommentSection } from "@/components/comments/comment-section";
import { deleteUpdateAction } from "@/lib/actions/journeys";
import { formatRelative } from "@/lib/utils";
import { Flag } from "lucide-react";

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
  replies?: CommentNode[];
};

export function UpdateCard({
  update,
  currentUserId,
  isOwner,
}: {
  update: {
    id: string;
    content: string;
    imageUrl?: string | null;
    isMilestone: boolean;
    createdAt: Date | string;
    likeCount: number;
    likedByMe: boolean;
    comments: CommentNode[];
  };
  currentUserId?: string;
  isOwner: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <article
      id={`update-${update.id}`}
      className="rounded-[var(--radius-card)] border border-border bg-surface p-4 sm:p-5 fade-in"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted">
          <time>{formatRelative(update.createdAt)}</time>
          {update.isMilestone ? (
            <>
              <span aria-hidden>·</span>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-foreground">
                Milestone
              </span>
            </>
          ) : null}
        </div>
        {isOwner ? (
          <button
            type="button"
            disabled={pending}
            className="text-xs text-muted hover:text-danger"
            onClick={() => {
              if (!confirm("Delete this update?")) return;
              startTransition(async () => {
                await deleteUpdateAction(update.id);
              });
            }}
          >
            Delete
          </button>
        ) : null}
      </div>

      <p className="prose-update mt-3 text-sm sm:text-[15px] text-foreground">
        {update.content}
      </p>

      {update.imageUrl ? (
        <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-[var(--radius-sm)] border border-border bg-warm">
          <SafeImage
            src={update.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-2">
        <EncourageButton
          updateId={update.id}
          initialLiked={update.likedByMe}
          initialCount={update.likeCount}
        />
        {!isOwner && currentUserId ? (
          <span className="inline-flex items-center gap-1 text-xs text-subtle">
            <Flag className="h-3 w-3" strokeWidth={1.75} />
            Report via comments menu
          </span>
        ) : null}
      </div>

      <CommentSection
        updateId={update.id}
        comments={update.comments}
        currentUserId={currentUserId}
        canComment={Boolean(currentUserId)}
      />
    </article>
  );
}
