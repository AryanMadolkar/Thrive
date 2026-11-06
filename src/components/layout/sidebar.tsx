"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
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
import { springSoft } from "@/lib/motion";
import { ThriveLogo } from "@/components/brand/thrive-logo";

const primaryNav = [
  { href: "/discover", label: "Discover", icon: Home },
  { href: "/following", label: "Following", icon: Users },
  { href: "/create", label: "Create", icon: PlusCircle },
  { href: "/journeys", label: "Journeys", icon: BookOpen },
];

const desktopExtra = [
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();
  const items = [...primaryNav, ...desktopExtra];

  return (
    <aside className="sticky top-0 z-20 hidden h-svh w-[180px] shrink-0 flex-col self-start border-r border-border/60 bg-[#f4f3f1] px-5 py-8 md:flex lg:w-[220px] lg:px-6">
      <div className="mb-12">
        <ThriveLogo href="/discover" priority className="!h-8 w-auto lg:!h-9" />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between py-2.5 text-[22px] leading-none tracking-[-0.03em] transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
                active
                  ? "font-semibold text-foreground"
                  : "font-medium text-foreground/35 hover:text-foreground/70"
              )}
            >
              <span>{item.label}</span>
              {item.href === "/notifications" && unread > 0 ? (
                <span className="rounded-full bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <form action="/discover" method="get" className="mt-auto border-t border-border/70 pt-5">
        <input type="hidden" name="focus" value="search" />
        <label className="flex items-center gap-2 text-[14px] text-subtle">
          <span className="flex-1">
            <input
              name="q"
              type="search"
              placeholder="Search"
              className="w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-subtle"
            />
          </span>
          <button
            type="submit"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-white"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </label>
      </form>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="mx-auto max-w-lg px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
        <div className="glass-strong relative flex items-stretch justify-between rounded-[22px] px-1.5 py-1.5">
          {primaryNav.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-[10px] font-medium",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
                  active ? "text-foreground" : "text-subtle"
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="glass-pill absolute inset-0.5 rounded-2xl"
                    transition={reduceMotion ? { duration: 0 } : springSoft}
                    aria-hidden
                  />
                ) : null}
                <Icon
                  className="relative z-10 h-5 w-5"
                  strokeWidth={active ? 2.2 : 1.75}
                />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function MobileHeader({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();
  if (pathname.startsWith("/j/")) return null;

  return (
    <header className="sticky top-0 z-30 md:hidden">
      <div className="mx-3 mt-3 flex items-center justify-between rounded-2xl border border-border/70 bg-[#f4f3f1]/95 px-3.5 py-2.5 backdrop-blur-md">
        <ThriveLogo href="/discover" className="!h-7 w-auto" />
        <div className="flex items-center gap-0.5">
          <Link
            href="/discover?focus=search"
            className="pressable rounded-full p-2 text-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          <Link
            href="/notifications"
            className="pressable relative rounded-full p-2 text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
            {unread > 0 ? (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-foreground" />
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
