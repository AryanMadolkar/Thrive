import { Journey, JourneyVisibility, User } from "@prisma/client";
import { db } from "@/lib/db";

type JourneyAccess = Pick<Journey, "id" | "creatorId" | "visibility" | "status">;

export async function canViewJourney(
  journey: JourneyAccess,
  viewerId?: string | null
) {
  if (journey.status === "DRAFT") {
    return viewerId === journey.creatorId;
  }

  if (journey.visibility === "PUBLIC") {
    return true;
  }

  if (!viewerId) return false;
  if (viewerId === journey.creatorId) return true;

  const blocked = await isBlockedEitherWay(viewerId, journey.creatorId);
  if (blocked) return false;

  if (journey.visibility === "PRIVATE") {
    return false;
  }

  // FOLLOWERS-only: must follow the creator
  if (journey.visibility === "FOLLOWERS") {
    const follow = await db.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: viewerId,
          followingId: journey.creatorId,
        },
      },
    });
    return Boolean(follow);
  }

  return false;
}

export async function isBlockedEitherWay(a: string, b: string) {
  const block = await db.block.findFirst({
    where: {
      OR: [
        { blockerId: a, blockedId: b },
        { blockerId: b, blockedId: a },
      ],
    },
  });
  return Boolean(block);
}

export async function getBlockedIds(userId: string) {
  const blocks = await db.block.findMany({
    where: {
      OR: [{ blockerId: userId }, { blockedId: userId }],
    },
  });
  return blocks.map((b) =>
    b.blockerId === userId ? b.blockedId : b.blockerId
  );
}

export function publicUserSelect() {
  return {
    id: true,
    name: true,
    username: true,
    image: true,
    bio: true,
    isOfficial: true,
    createdAt: true,
  } as const;
}

export type PublicUser = Pick<
  User,
  "id" | "name" | "username" | "image" | "bio" | "isOfficial" | "createdAt"
>;
