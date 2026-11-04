import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Avatar } from "@/components/ui/avatar";
import { UserFollowButton } from "@/components/journey/follow-button";
import { EmptyState } from "@/components/ui/empty-state";
import { canViewJourney } from "@/lib/privacy";
import { CATEGORY_LABELS } from "@/lib/utils";
import { blockUserAction } from "@/lib/actions/comments";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await db.user.findUnique({ where: { username } });
  return { title: user ? user.name : "Profile" };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();
  const user = await db.user.findUnique({
    where: { username },
    include: {
      _count: { select: { followers: true, following: true } },
      journeys: {
        where: { status: { not: "DRAFT" } },
        orderBy: { updatedAt: "desc" },
      },
      followers: session?.user?.id
        ? {
            where: { followerId: session.user.id },
            select: { id: true },
          }
        : false,
    },
  });

  if (!user) notFound();

  const visibleJourneys = [];
  for (const j of user.journeys) {
    if (await canViewJourney(j, session?.user?.id)) {
      visibleJourneys.push(j);
    }
  }

  const isSelf = session?.user?.id === user.id;
  const isFollowing = Array.isArray(user.followers)
    ? user.followers.length > 0
    : false;

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <Avatar src={user.image} name={user.name} size="xl" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {user.name}
            {user.isOfficial ? (
              <span className="ml-2 text-xs font-normal text-muted">
                Official
              </span>
            ) : null}
          </h1>
          <p className="text-sm text-muted">@{user.username}</p>
          {user.bio ? (
            <p className="mt-3 text-sm leading-relaxed">{user.bio}</p>
          ) : null}
          <div className="mt-4 flex gap-4 text-sm text-muted">
            <span>
              <strong className="text-foreground">{user._count.followers}</strong>{" "}
              followers
            </span>
            <span>
              <strong className="text-foreground">{user._count.following}</strong>{" "}
              following
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {!isSelf && session?.user ? (
              <>
                <UserFollowButton
                  userId={user.id}
                  initialFollowing={isFollowing}
                />
                <form
                  action={async () => {
                    "use server";
                    await blockUserAction(user.id);
                  }}
                >
                  <button
                    type="submit"
                    className="h-8 rounded-[var(--radius-control)] px-3 text-xs text-muted hover:text-foreground"
                  >
                    Block
                  </button>
                </form>
              </>
            ) : null}
            {isSelf ? (
              <Link
                href="/profile/settings"
                className="inline-flex h-8 items-center rounded-[var(--radius-control)] border border-border px-3 text-xs hover:bg-hover"
              >
                Edit profile
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-subtle">
          Journeys
        </h2>
        {visibleJourneys.length === 0 ? (
          <EmptyState
            title="No public journeys"
            description="This person hasn’t shared any journeys you can view yet."
          />
        ) : (
          <div className="space-y-2">
            {visibleJourneys.map((j) => (
              <Link
                key={j.id}
                href={`/j/${j.slug}`}
                className="block rounded-[var(--radius-card)] border border-border bg-surface px-4 py-3.5 hover:bg-hover"
              >
                <p className="font-medium">{j.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {CATEGORY_LABELS[j.category]} · {j.status.toLowerCase()}
                  {j.isOfficial ? " · Official" : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
