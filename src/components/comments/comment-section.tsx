"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import {
  createCommentAction,
  deleteCommentAction,
  reportContentAction,
} from "@/lib/actions/comments";
import { toggleCommentLike } from "@/lib/actions/social";
import { formatRelative } from "@/lib/utils";
import { Heart } from "lucide-react";

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

export function CommentSection({
  updateId,
  comments,
  currentUserId,
  canComment,
}: {
  updateId: string;
  comments: CommentNode[];
  currentUserId?: string;
  canComment: boolean;
}) {
  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      <h4 className="text-sm font-medium">Encouragement</h4>
      {comments.length === 0 ? (
        <p className="text-sm text-muted">
          No comments yet. Leave a word of encouragement.
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              updateId={updateId}
              currentUserId={currentUserId}
              canComment={canComment}
            />
          ))}
        </div>
      )}
      {canComment ? (
        <CommentForm updateId={updateId} />
      ) : (
        <p className="text-sm text-muted">
          <Link href="/login" className="underline underline-offset-2">
            Sign in
          </Link>{" "}
          to leave encouragement.
        </p>
      )}
    </div>
  );
}

function CommentForm({
  updateId,
  parentId,
  onDone,
  placeholder = "Share encouragement…",
}: {
  updateId: string;
  parentId?: string;
  onDone?: () => void;
  placeholder?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  return (
    <form
      className="space-y-2"
      action={(fd) => {
        setError(undefined);
        startTransition(async () => {
          const result = await createCommentAction(fd);
          if (result?.error) setError(result.error);
          else {
            onDone?.();
            (document.getElementById(`comment-${updateId}-${parentId ?? "root"}`) as HTMLFormElement | null)?.reset();
          }
        });
      }}
      id={`comment-${updateId}-${parentId ?? "root"}`}
    >
      <input type="hidden" name="updateId" value={updateId} />
      {parentId ? <input type="hidden" name="parentId" value={parentId} /> : null}
      <Textarea
        name="content"
        required
        rows={2}
        placeholder={placeholder}
        className="min-h-[72px]"
      />
      {error ? <p className="text-xs text-danger">{error}</p> : null}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Sending…" : parentId ? "Reply" : "Encourage"}
      </Button>
    </form>
  );
}

function CommentItem({
  comment,
  updateId,
  currentUserId,
  canComment,
}: {
  comment: CommentNode;
  updateId: string;
  currentUserId?: string;
  canComment: boolean;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [liked, setLiked] = useState(comment.likedByMe);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [pending, startTransition] = useTransition();

  return (
    <div id={`comment-${comment.id}`} className="space-y-2">
      <div className="flex gap-3">
        <Avatar src={comment.author.image} name={comment.author.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <Link
              href={`/u/${comment.author.username}`}
              className="text-sm font-medium hover:underline"
            >
              {comment.author.name}
            </Link>
            <span className="text-xs text-subtle">
              {formatRelative(comment.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed prose-update">
            {comment.content}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
            <button
              type="button"
              disabled={pending || !currentUserId}
              className="inline-flex items-center gap-1 hover:text-foreground"
              onClick={() => {
                startTransition(async () => {
                  const result = await toggleCommentLike(comment.id);
                  if (result?.ok) {
                    setLiked(result.liked);
                    setLikeCount((c) => c + (result.liked ? 1 : -1));
                  }
                });
              }}
            >
              <Heart
                className="h-3 w-3"
                fill={liked ? "currentColor" : "none"}
                strokeWidth={1.75}
              />
              {likeCount > 0 ? likeCount : "Like"}
            </button>
            {canComment ? (
              <button
                type="button"
                className="hover:text-foreground"
                onClick={() => setReplyOpen((v) => !v)}
              >
                Reply
              </button>
            ) : null}
            {currentUserId === comment.author.id ? (
              <button
                type="button"
                className="hover:text-danger"
                onClick={() => {
                  startTransition(async () => {
                    await deleteCommentAction(comment.id);
                  });
                }}
              >
                Delete
              </button>
            ) : currentUserId ? (
              <button
                type="button"
                className="hover:text-foreground"
                onClick={() => {
                  startTransition(async () => {
                    const fd = new FormData();
                    fd.set("reason", "OTHER");
                    fd.set("targetType", "comment");
                    fd.set("targetId", comment.id);
                    await reportContentAction(fd);
                    alert("Report submitted. Thank you.");
                  });
                }}
              >
                Report
              </button>
            ) : null}
          </div>
          {replyOpen ? (
            <div className="mt-3">
              <CommentForm
                updateId={updateId}
                parentId={comment.id}
                onDone={() => setReplyOpen(false)}
                placeholder={`Reply to ${comment.author.name}…`}
              />
            </div>
          ) : null}
          {comment.replies && comment.replies.length > 0 ? (
            <div className="mt-3 space-y-3 border-l border-border pl-4">
              {comment.replies.map((r) => (
                <CommentItem
                  key={r.id}
                  comment={r}
                  updateId={updateId}
                  currentUserId={currentUserId}
                  canComment={canComment}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
