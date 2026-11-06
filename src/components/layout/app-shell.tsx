import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  BottomNav,
  MobileHeader,
  Sidebar,
} from "@/components/layout/sidebar";
import { MotionProvider } from "@/components/providers/motion-provider";

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
    <MotionProvider>
      <div className="min-h-screen bg-[#f4f3f1] md:flex">
        <Sidebar unread={unread} />
        <div className="flex min-h-screen flex-1 flex-col">
          <MobileHeader unread={unread} />
          <main className="mx-auto w-full max-w-[430px] flex-1 px-4 pb-28 pt-4 sm:max-w-none sm:px-6 md:px-8 md:pb-12 md:pt-8 lg:max-w-6xl xl:px-10">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
    </MotionProvider>
  );
}
