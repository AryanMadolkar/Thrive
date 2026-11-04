import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getJourneyBySlug } from "@/lib/feed";
import { JourneyDetailView } from "@/components/journey/journey-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const journey = await getJourneyBySlug(slug);
  if (!journey) return { title: "Journey" };
  return {
    title: journey.title,
    description: journey.description?.slice(0, 160),
  };
}

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const journey = await getJourneyBySlug(slug, session?.user?.id);
  if (!journey) notFound();

  const isOwner = session?.user?.id === journey.creatorId;
  const isFollowing = Array.isArray(journey.followers)
    ? journey.followers.length > 0
    : false;

  const likeCount = journey.updates.reduce(
    (sum, u) => sum + u._count.reactions,
    0
  );
  const commentCount = journey.updates.reduce(
    (sum, u) => sum + u._count.comments,
    0
  );

  const flatComments = journey.updates
    .flatMap((u) =>
      u.comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        author: c.author,
        likeCount: c._count.likes,
        likedByMe: Array.isArray(c.likes) ? c.likes.length > 0 : false,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 20);

  const latestUpdate = [...journey.updates].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  return (
    <JourneyDetailView
      isOwner={isOwner}
      isFollowing={isFollowing}
      currentUserId={session?.user?.id}
      journey={{
        id: journey.id,
        slug: journey.slug,
        title: journey.title,
        description: journey.description,
        coverImage: journey.coverImage,
        startDate: journey.startDate,
        isOfficial: journey.isOfficial,
        isFeatured: journey.isFeatured,
        followerCount: journey._count.followers,
        likeCount,
        commentCount,
        creator: journey.creator,
        commentTargetUpdateId: latestUpdate?.id,
        comments: flatComments,
        updates: journey.updates.map((u) => ({
          id: u.id,
          content: u.content,
          imageUrl: u.imageUrl,
          isMilestone: u.isMilestone,
          createdAt: u.createdAt,
          likeCount: u._count.reactions,
          likedByMe: Array.isArray(u.reactions) ? u.reactions.length > 0 : false,
          commentCount: u._count.comments,
        })),
      }}
    />
  );
}
