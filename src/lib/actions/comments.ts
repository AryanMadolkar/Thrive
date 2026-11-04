"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { commentSchema, reportSchema } from "@/lib/validations";
import { createNotification } from "@/lib/notifications";

export async function createCommentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sign in to leave encouragement" };

  const parsed = commentSchema.safeParse({
    content: formData.get("content"),
    updateId: formData.get("updateId"),
    parentId: formData.get("parentId") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid comment" };
  }

  const update = await db.journeyUpdate.findUnique({
    where: { id: parsed.data.updateId },
    include: { journey: true },
  });
  if (!update) return { error: "Update not found" };

  let parentAuthorId: string | undefined;
  if (parsed.data.parentId) {
    const parent = await db.comment.findUnique({
      where: { id: parsed.data.parentId },
    });
    if (!parent || parent.updateId !== update.id) {
      return { error: "Reply target not found" };
    }
    parentAuthorId = parent.authorId;
  }

  const comment = await db.comment.create({
    data: {
      content: parsed.data.content,
      updateId: update.id,
      authorId: session.user.id,
      parentId: parsed.data.parentId,
    },
  });

  if (parsed.data.parentId && parentAuthorId) {
    await createNotification({
      recipientId: parentAuthorId,
      actorId: session.user.id,
      type: "COMMENT_REPLY",
      message: `${session.user.name ?? "Someone"} replied to your comment`,
      link: `/j/${update.journey.slug}#comment-${comment.id}`,
    });
  } else {
    await createNotification({
      recipientId: update.authorId,
      actorId: session.user.id,
      type: "COMMENT",
      message: `${session.user.name ?? "Someone"} left encouragement on your update`,
      link: `/j/${update.journey.slug}#update-${update.id}`,
    });
  }

  revalidatePath(`/j/${update.journey.slug}`);
  return { success: true };
}

export async function deleteCommentAction(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: { update: { include: { journey: true } } },
  });
  if (!comment || comment.authorId !== session.user.id) {
    return { error: "Not found" };
  }

  await db.comment.delete({ where: { id: commentId } });
  revalidatePath(`/j/${comment.update.journey.slug}`);
  return { success: true };
}

export async function reportContentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sign in to report" };

  const parsed = reportSchema.safeParse({
    reason: formData.get("reason"),
    details: formData.get("details") || undefined,
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
  });
  if (!parsed.success) return { error: "Invalid report" };

  await db.report.create({
    data: {
      ...parsed.data,
      reporterId: session.user.id,
    },
  });

  return { success: true };
}

export async function blockUserAction(userId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  if (session.user.id === userId) return { error: "Cannot block yourself" };

  await db.block.upsert({
    where: {
      blockerId_blockedId: {
        blockerId: session.user.id,
        blockedId: userId,
      },
    },
    create: { blockerId: session.user.id, blockedId: userId },
    update: {},
  });

  return { success: true };
}

export async function markNotificationsReadAction() {
  const session = await auth();
  if (!session?.user?.id) return;
  await db.notification.updateMany({
    where: { recipientId: session.user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/notifications");
}
