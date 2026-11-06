import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  BottomNav,
  MobileHeader,
  Sidebar,
} from "@/components/layout/sidebar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  let unread = 0;
  if (session?.user?.id) {
    try {
      unread = await db.notification.count({
        where: { recipientId: session.user.id, read: false },
      });
    } catch {
      unread = 0;
    }
  }

  return (
    <div className="min-h-screen bg-white md:flex">
      <Sidebar unread={unread} />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileHeader unread={unread} />
        <main className="mx-auto w-full max-w-[430px] md:max-w-2xl flex-1 px-4 pb-24 md:px-6 md:pb-10 md:pt-6">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
