import { JourneyCategory, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { canViewJourney, getBlockedIds } from "@/lib/privacy";
import { JourneyCardData } from "@/components/journey/journey-card";

type FeedOptions = {
  viewerId?: string | null;
  tab?: "for-you" | "following" | "popular";
  category?: JourneyCategory | "ALL";
  search?: string;
};

export async function getDiscoverFeed(
  options: FeedOptions = {}
): Promise<JourneyCardData[]> {
  const { viewerId, tab = "for-you", category = "ALL", search } = options;
  const blocked = viewerId ? await getBlockedIds(viewerId) : [];

  const where: Prisma.JourneyWhereInput = {
    status: { in: ["ACTIVE", "COMPLETED", "PAUSED"] },
    visibility: "PUBLIC",
    ...(blocked.length
      ? { creatorId: { notIn: blocked } }
      : {}),
    ...(category !== "ALL" ? { category } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { creator: { name: { contains: search } } },
            { creator: { username: { contains: search } } },
          ],
        }
      : {}),
  };

  if (tab === "following" && viewerId) {
    where.followers = { some: { userId: viewerId } };
  }

  const orderBy: Prisma.JourneyOrderByWithRelationInput[] =
    tab === "popular"
      ? [{ followers: { _count: "desc" } }, { updatedAt: "desc" }]
      : [{ isFeatured: "desc" }, { updatedAt: "desc" }];

  const journeys = await db.journey.findMany({
    where,
    orderBy,
    take: 40,
    include: {
      creator: {
        select: {
          name: true,
          username: true,
          image: true,
          isOfficial: true,
        },
      },
      _count: { select: { followers: true } },
      followers: viewerId
        ? { where: { userId: viewerId }, select: { id: true } }
        : false,
      updates: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          _count: { select: { reactions: true, comments: true } },
          reactions: viewerId
            ? {
                where: { userId: viewerId, type: "like" },
                select: { id: true },
              }
            : false,
        },
      },
    },
  });

  return journeys.map((j) => {
    const latest = j.updates[0];
    return {
      id: j.id,
      slug: j.slug,
      title: j.title,
      description: j.description,
      category: j.category,
      startDate: j.startDate,
      isOfficial: j.isOfficial,
      isFeatured: j.isFeatured,
      coverImage: j.coverImage,
      followerCount: j._count.followers,
      isFollowing: Array.isArray(j.followers) ? j.followers.length > 0 : false,
      creator: j.creator,
      latestUpdate: latest
        ? {
            id: latest.id,
            content: latest.content,
            imageUrl: latest.imageUrl,
            createdAt: latest.createdAt,
            likeCount: latest._count.reactions,
            commentCount: latest._count.comments,
            likedByMe: Array.isArray(latest.reactions)
              ? latest.reactions.length > 0
              : false,
          }
        : null,
    };
  });
}

export async function getFollowingFeed(viewerId: string) {
  return getDiscoverFeed({ viewerId, tab: "following" });
}

export async function getJourneyBySlug(slug: string, viewerId?: string | null) {
  const journey = await db.journey.findUnique({
    where: { slug },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
          isOfficial: true,
        },
      },
      _count: { select: { followers: true } },
      followers: viewerId
        ? { where: { userId: viewerId }, select: { id: true } }
        : false,
      updates: {
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { name: true, username: true, image: true },
          },
          _count: { select: { reactions: true, comments: true } },
          reactions: viewerId
            ? {
                where: { userId: viewerId, type: "like" },
                select: { id: true },
              }
            : false,
          comments: {
            where: { parentId: null },
            orderBy: { createdAt: "asc" },
            include: {
              author: {
                select: { id: true, name: true, username: true, image: true },
              },
              _count: { select: { likes: true } },
              likes: viewerId
                ? { where: { userId: viewerId }, select: { id: true } }
                : false,
              replies: {
                orderBy: { createdAt: "asc" },
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      username: true,
                      image: true,
                    },
                  },
                  _count: { select: { likes: true } },
                  likes: viewerId
                    ? { where: { userId: viewerId }, select: { id: true } }
                    : false,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!journey) return null;
  const allowed = await canViewJourney(journey, viewerId);
  if (!allowed) return null;
  return journey;
}
