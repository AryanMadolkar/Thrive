import { JourneyCategory, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { canViewJourney, getBlockedIds } from "@/lib/privacy";
import type { JourneyCardData } from "@/components/journey/journey-card";
import { CATEGORY_LABELS } from "@/lib/utils";

export const DISCOVER_PAGE_SIZE = 12;

export type DiscoverTab = "for-you" | "following" | "popular";

type FeedOptions = {
  viewerId?: string | null;
  tab?: DiscoverTab;
  category?: JourneyCategory | "ALL";
  search?: string;
  page?: number;
};

export type DiscoverFeedResult = {
  journeys: JourneyCardData[];
  page: number;
  hasMore: boolean;
};

const CATEGORY_VALUES = Object.keys(CATEGORY_LABELS) as JourneyCategory[];

function resolveCategoryFilter(
  category: JourneyCategory | "ALL" | undefined,
  search?: string
): JourneyCategory | "ALL" {
  if (category && category !== "ALL") return category;
  if (!search) return "ALL";

  const q = search.toLowerCase().trim();
  const match = CATEGORY_VALUES.find((key) => {
    const label = CATEGORY_LABELS[key].toLowerCase();
    return (
      key.toLowerCase().replace(/_/g, " ") === q ||
      label === q ||
      label.includes(q) ||
      q.includes(label)
    );
  });
  return match ?? "ALL";
}

function mapJourney(
  j: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    category: JourneyCategory;
    status: string;
    startDate: Date;
    isOfficial: boolean;
    isFeatured: boolean;
    coverImage: string | null;
    creator: JourneyCardData["creator"];
    _count: { followers: number; updates: number };
    followers: { id: string }[] | false;
    updates: Array<{
      id: string;
      content: string;
      imageUrl: string | null;
      createdAt: Date;
      _count: { reactions: number; comments: number };
      reactions: { id: string }[] | false;
    }>;
  }
): JourneyCardData {
  const latest = j.updates[0];
  return {
    id: j.id,
    slug: j.slug,
    title: j.title,
    description: j.description,
    category: j.category,
    status: j.status,
    startDate: j.startDate,
    isOfficial: j.isOfficial,
    isFeatured: j.isFeatured,
    coverImage: j.coverImage,
    followerCount: j._count.followers,
    updateCount: j._count.updates,
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
}

function engagementScore(j: JourneyCardData) {
  const likes = j.latestUpdate?.likeCount ?? 0;
  const comments = j.latestUpdate?.commentCount ?? 0;
  return j.followerCount * 3 + likes + comments * 2 + j.updateCount;
}

export async function getDiscoverFeed(
  options: FeedOptions = {}
): Promise<DiscoverFeedResult> {
  const {
    viewerId,
    tab = "for-you",
    category: categoryParam = "ALL",
    search,
    page = 1,
  } = options;

  const safePage = Math.max(1, page);
  const take = safePage * DISCOVER_PAGE_SIZE;
  const blocked = viewerId ? await getBlockedIds(viewerId) : [];
  const category = resolveCategoryFilter(categoryParam, search);

  // When search matched a category label exactly, still keep text search unless
  // the query is only the category name.
  const searchIsCategoryOnly =
    !!search &&
    category !== "ALL" &&
    (CATEGORY_LABELS[category].toLowerCase() === search.toLowerCase().trim() ||
      category.toLowerCase().replace(/_/g, " ") ===
        search.toLowerCase().trim());

  const where: Prisma.JourneyWhereInput = {
    status: { in: ["ACTIVE", "COMPLETED", "PAUSED"] },
    visibility: "PUBLIC",
    ...(blocked.length ? { creatorId: { notIn: blocked } } : {}),
    ...(category !== "ALL" ? { category } : {}),
    ...(search && !searchIsCategoryOnly
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { goal: { contains: search, mode: "insensitive" } },
            { creator: { name: { contains: search, mode: "insensitive" } } },
            {
              creator: {
                username: { contains: search, mode: "insensitive" },
              },
            },
            {
              updates: {
                some: {
                  content: { contains: search, mode: "insensitive" },
                },
              },
            },
          ],
        }
      : {}),
  };

  if (tab === "following") {
    if (!viewerId) {
      return { journeys: [], page: safePage, hasMore: false };
    }
    where.followers = { some: { userId: viewerId } };
  }

  const orderBy: Prisma.JourneyOrderByWithRelationInput[] =
    tab === "popular"
      ? [{ followers: { _count: "desc" } }, { updatedAt: "desc" }]
      : tab === "following"
        ? [{ updatedAt: "desc" }]
        : [
            { isFeatured: "desc" },
            { isOfficial: "desc" },
            { updatedAt: "desc" },
          ];

  // Fetch a little extra for popular re-ranking / hasMore detection.
  const fetchTake =
    tab === "popular" ? Math.max(take + 8, DISCOVER_PAGE_SIZE * 2) : take + 1;

  const rows = await db.journey.findMany({
    where,
    orderBy,
    take: fetchTake,
    include: {
      creator: {
        select: {
          name: true,
          username: true,
          image: true,
          isOfficial: true,
        },
      },
      _count: { select: { followers: true, updates: true } },
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

  let mapped = rows.map(mapJourney);

  if (tab === "popular") {
    mapped = [...mapped].sort(
      (a, b) => engagementScore(b) - engagementScore(a)
    );
  }

  const pageSlice = mapped.slice(0, take);
  const hasMore = mapped.length > take;

  return {
    journeys: pageSlice,
    page: safePage,
    hasMore,
  };
}

export async function getFollowingFeed(viewerId: string) {
  const result = await getDiscoverFeed({ viewerId, tab: "following" });
  return result.journeys;
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
