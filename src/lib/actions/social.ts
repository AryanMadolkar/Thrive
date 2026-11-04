"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export async function toggleJourneyFollow(journeyId: string) {
  const user = await requireUser();
  if (!user) return { ok: false as const, error: "auth" };

  const journey = await db.journey.findUnique({ where: { id: journeyId } });
  if (!journey || journey.visibility === "PRIVATE") {
    return { ok: false as const, error: "not_found" };
  }

  const existing = await db.journeyFollow.findUnique({
    where: { userId_journeyId: { userId: user.id, journeyId } },
  });

  if (existing) {
    await db.journeyFollow.delete({ where: { id: existing.id } });
    revalidatePath("/discover");
    revalidatePath("/following");
    revalidatePath(`/j/${journey.slug}`);
    return { ok: true as const, following: false };
  }

  await db.journeyFollow.create({
    data: { userId: user.id, journeyId },
  });

  await createNotification({
    recipientId: journey.creatorId,
    actorId: user.id,
    type: "JOURNEY_FOLLOW",
    message: `${user.name ?? "Someone"} started following your journey “${journey.title}”`,
    link: `/j/${journey.slug}`,
  });

  revalidatePath("/discover");
  revalidatePath("/following");
  revalidatePath(`/j/${journey.slug}`);
  return { ok: true as const, following: true };
}

export async function toggleUserFollow(userId: string) {
  const user = await requireUser();
  if (!user) return { ok: false as const, error: "auth" };
  if (user.id === userId) return { ok: false as const, error: "self" };

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return { ok: false as const, error: "not_found" };

  const existing = await db.userFollow.findUnique({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId: userId,
      },
    },
  });

  if (existing) {
    await db.userFollow.delete({ where: { id: existing.id } });
    revalidatePath(`/u/${target.username}`);
    return { ok: true as const, following: false };
  }

  await db.userFollow.create({
    data: { followerId: user.id, followingId: userId },
  });

  await createNotification({
    recipientId: userId,
    actorId: user.id,
    type: "PROFILE_FOLLOW",
    message: `${user.name ?? "Someone"} started following you`,
    link: `/u/${user.username}`,
  });

  revalidatePath(`/u/${target.username}`);
  return { ok: true as const, following: true };
}

export async function toggleUpdateLike(updateId: string) {
  const user = await requireUser();
  if (!user) return { ok: false as const, error: "auth" };

  const update = await db.journeyUpdate.findUnique({
    where: { id: updateId },
    include: { journey: true },
  });
  if (!update) return { ok: false as const, error: "not_found" };

  const existing = await db.reaction.findUnique({
    where: {
      userId_updateId_type: {
        userId: user.id,
        updateId,
        type: "like",
      },
    },
  });

  if (existing) {
    await db.reaction.delete({ where: { id: existing.id } });
    revalidatePath(`/j/${update.journey.slug}`);
    return { ok: true as const, liked: false };
  }

  await db.reaction.create({
    data: { userId: user.id, updateId, type: "like" },
  });

  await createNotification({
    recipientId: update.authorId,
    actorId: user.id,
    type: "UPDATE_LIKE",
    message: `${user.name ?? "Someone"} encouraged your update`,
    link: `/j/${update.journey.slug}#update-${update.id}`,
  });

  revalidatePath(`/j/${update.journey.slug}`);
  return { ok: true as const, liked: true };
}

export async function toggleCommentLike(commentId: string) {
  const user = await requireUser();
  if (!user) return { ok: false as const, error: "auth" };

  const existing = await db.commentLike.findUnique({
    where: { userId_commentId: { userId: user.id, commentId } },
  });

  if (existing) {
    await db.commentLike.delete({ where: { id: existing.id } });
    return { ok: true as const, liked: false };
  }

  await db.commentLike.create({
    data: { userId: user.id, commentId },
  });
  return { ok: true as const, liked: true };
}
