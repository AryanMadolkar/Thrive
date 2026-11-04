import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelative } from "@/lib/utils";
import { markNotificationsReadAction } from "@/lib/actions/comments";
import { Avatar } from "@/components/ui/avatar";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <EmptyState
        title="Sign in for notifications"
        description="We’ll let you know when someone follows your journey or leaves encouragement."
        actionLabel="Sign in"
        actionHref="/login"
      />
    );
  }

  const notifications = await db.notification.findMany({
    where: { recipientId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      actor: {
        select: { name: true, username: true, image: true },
      },
    },
  });

  await markNotificationsReadAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="mt-1 text-sm text-muted">
          Follows, encouragement, and replies.
        </p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="You’re all caught up"
          description="When someone engages with your journeys, it will show up here."
          actionLabel="Explore Discover"
          actionHref="/discover"
        />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
          {notifications.map((n) => (
            <li key={n.id}>
              <Link
                href={n.link || "/discover"}
                className={`flex gap-3 px-4 py-3.5 transition hover:bg-hover ${
                  n.read ? "" : "bg-warm/60"
                }`}
              >
                {n.actor ? (
                  <Avatar
                    src={n.actor.image}
                    name={n.actor.name}
                    size="sm"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-warm" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed">{n.message}</p>
                  <p className="mt-1 text-xs text-subtle">
                    {formatRelative(n.createdAt)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
