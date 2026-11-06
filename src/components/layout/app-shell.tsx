import {
  BottomNav,
  MobileHeader,
  Sidebar,
} from "@/components/layout/sidebar";
import { MotionProvider } from "@/components/providers/motion-provider";

export async function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <div className="min-h-svh bg-[#f4f3f1] md:flex md:items-start">
        <Sidebar />
        <div className="flex min-h-svh min-w-0 flex-1 flex-col">
          <MobileHeader />
          <main className="mx-auto w-full max-w-[430px] flex-1 px-4 pb-28 pt-4 sm:max-w-none sm:px-6 md:px-8 md:pb-12 md:pt-8 lg:max-w-6xl xl:px-10">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
    </MotionProvider>
  );
}
