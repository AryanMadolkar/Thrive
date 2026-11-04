"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  PlusCircle,
  BookOpen,
  Bell,
  Search,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/discover", label: "Discover", icon: Home },
  { href: "/following", label: "Following", icon: Users },
  { href: "/create", label: "Create", icon: PlusCircle },
  { href: "/journeys", label: "My Journeys", icon: BookOpen },
];

const desktopExtra = [
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();
  const items = [...primaryNav, ...desktopExtra];

  return (
    <aside className="hidden md:flex md:w-56 lg:w-60 shrink-0 flex-col border-r border-border bg-surface px-3 py-6 sticky top-0 h-screen">
      <Link href="/discover" className="px-3 mb-8">
        <span className="text-[22px] font-bold tracking-tight">THRIVE</span>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-warm text-foreground font-semibold"
                  : "text-muted hover:bg-hover hover:text-foreground"
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              <span className="flex-1">{item.label}</span>
              {item.href === "/notifications" && unread > 0 ? (
                <span className="rounded-full bg-foreground px-1.5 py-0.5 text-[10px] text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-white">
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-1 pb-[env(safe-area-inset-bottom)]">
        {primaryNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                active ? "text-foreground" : "text-subtle"
              )}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={active ? 2.25 : 1.75}
                fill={active && item.href === "/discover" ? "currentColor" : "none"}
              />
              <span>{item.label === "My Journeys" ? "My Journeys" : item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileHeader({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();
  if (pathname.startsWith("/j/")) return null;

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-white px-4 pt-3 pb-1">
      <Link href="/discover" className="text-[22px] font-bold tracking-tight">
        THRIVE
      </Link>
      <div className="flex items-center gap-1">
        <Link
          href="/discover?focus=search"
          className="rounded-full p-2 text-foreground"
          aria-label="Search"
        >
          <Search className="h-5 w-5" strokeWidth={1.75} />
        </Link>
        <Link
          href="/notifications"
          className="relative rounded-full p-2 text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
          {unread > 0 ? (
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-foreground" />
          ) : null}
        </Link>
      </div>
    </header>
  );
}
