import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { logoutAction } from "@/lib/actions/auth";
import { requireAuth } from "@/lib/require-auth";
import { CATEGORY_LABELS } from "@/lib/utils";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const sessionUser = await requireAuth("/profile");
  const session = { user: sessionUser };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          journeys: true,
        },
      },
      journeys: {
        where: { status: { not: "DRAFT" }, visibility: { not: "PRIVATE" } },
        orderBy: { updatedAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar src={user.image} name={user.name} size="xl" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
            <p className="text-sm text-muted">@{user.username}</p>
            {user.bio ? (
              <p className="mt-3 max-w-md text-sm leading-relaxed">{user.bio}</p>
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
              <span>
                <strong className="text-foreground">{user._count.journeys}</strong>{" "}
                journeys
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/profile/settings">
          <Button variant="secondary" size="sm">
            Edit profile
          </Button>
        </Link>
        <Link href={`/u/${user.username}`}>
          <Button variant="ghost" size="sm">
            Public view
          </Button>
        </Link>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-subtle">
          Your public journeys
        </h2>
        {user.journeys.length === 0 ? (
          <EmptyState
            title="No public journeys yet"
            description="Create a journey and share your progress with the world."
            actionLabel="Create a journey"
            actionHref="/create"
          />
        ) : (
          <div className="space-y-2">
            {user.journeys.map((j) => (
              <Link
                key={j.id}
                href={`/j/${j.slug}`}
                className="block rounded-[var(--radius-card)] border border-border bg-surface px-4 py-3.5 hover:bg-hover"
              >
                <p className="font-medium">{j.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {CATEGORY_LABELS[j.category]} · {j.status.toLowerCase()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
