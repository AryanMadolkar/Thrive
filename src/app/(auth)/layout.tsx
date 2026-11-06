import Link from "next/link";
import { ThriveLogo } from "@/components/brand/thrive-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white md:grid md:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-border bg-[#fafafa] md:flex md:flex-col md:justify-between md:px-12 md:py-12 lg:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, #e8e8e8 0%, transparent 55%)",
          }}
        />
        <div className="relative z-10">
          <ThriveLogo href="/" priority className="h-8 w-auto" />
        </div>
        <div className="relative z-10 max-w-sm">
          <p className="text-[13px] font-medium tracking-[0.16em] text-muted uppercase">
            Welcome
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Your journey
            <br />
            starts here.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            Create an account to document progress, follow journeys that inspire
            you, and leave encouragement along the way.
          </p>
        </div>
        <p className="relative z-10 text-xs text-subtle">
          Document. Share. Inspire.
        </p>
      </aside>

      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between px-5 py-5 md:hidden">
          <ThriveLogo href="/" className="h-7 w-auto" />
          <Link href="/" className="text-sm text-muted">
            Home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-10 md:px-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
