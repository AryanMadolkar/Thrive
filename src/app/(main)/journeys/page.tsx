import Link from "next/link";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/require-auth";
import { CATEGORY_LABELS, formatDate } from "@/lib/utils";

export const metadata = { title: "My Journeys" };

export default async function MyJourneysPage() {
  const sessionUser = await requireAuth("/journeys");
  const session = { user: sessionUser };

  const journeys = await db.journey.findMany({
    where: { creatorId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { updates: true, followers: true } } },
  });

  const groups = {
    ACTIVE: journeys.filter((j) => j.status === "ACTIVE"),
    PAUSED: journeys.filter((j) => j.status === "PAUSED"),
    COMPLETED: journeys.filter((j) => j.status === "COMPLETED"),
    DRAFT: journeys.filter((j) => j.status === "DRAFT"),
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Journeys</h1>
          <p className="mt-1 text-sm text-muted">
            Everything you’re documenting.
          </p>
        </div>
        <Link href="/create">
          <Button size="sm">New journey</Button>
        </Link>
      </div>

      {journeys.length === 0 ? (
        <EmptyState
          title="No journeys yet"
          description="Create your first journey. It takes less than a minute — a title and a category is enough."
          actionLabel="Create a journey"
          actionHref="/create"
        />
      ) : (
        (["ACTIVE", "PAUSED", "DRAFT", "COMPLETED"] as const).map((status) => {
          const list = groups[status];
          if (!list.length) return null;
          return (
            <section key={status} className="space-y-3">
              <h2 className="text-xs font-medium uppercase tracking-wider text-subtle">
                {status === "ACTIVE"
                  ? "Active"
                  : status === "PAUSED"
                    ? "Paused"
                    : status === "DRAFT"
                      ? "Drafts"
                      : "Completed"}
              </h2>
              <div className="space-y-2">
                {list.map((j) => (
                  <Link
                    key={j.id}
                    href={`/j/${j.slug}`}
                    className="flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-border bg-surface px-4 py-3.5 transition hover:bg-hover"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{j.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {CATEGORY_LABELS[j.category]} · {j._count.updates}{" "}
                        updates · {j.visibility.toLowerCase()} · started{" "}
                        {formatDate(j.startDate)}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-subtle">
                      {j._count.followers} following
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
