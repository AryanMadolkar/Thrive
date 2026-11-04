import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreatePanel } from "@/components/journey/journey-form";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Create" };

export default async function CreatePage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <EmptyState
        title="Sign in to create"
        description="Create a journey in under a minute, or publish an update to one you already started."
        actionLabel="Sign in"
        actionHref="/login"
      />
    );
  }

  const journeys = await db.journey.findMany({
    where: {
      creatorId: session.user.id,
      status: { in: ["ACTIVE", "PAUSED", "DRAFT"] },
    },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create</h1>
        <p className="mt-1 text-sm text-muted">
          Start a journey or share what happened next.
        </p>
      </div>
      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 sm:p-6">
        <CreatePanel journeys={journeys} />
      </div>
    </div>
  );
}
