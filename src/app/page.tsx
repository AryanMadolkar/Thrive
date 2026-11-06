import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ThriveLogo } from "@/components/brand/thrive-logo";

export default async function LandingPage() {
  let session = null;
  try {
    session = await auth();
  } catch {
    // Missing AUTH_SECRET during misconfigured deploys should not hard-crash the landing.
  }
  if (session?.user) redirect("/discover");

  let founding: {
    slug: string;
    title: string;
    description: string | null;
  } | null = null;

  try {
    founding = await db.journey.findFirst({
      where: { isOfficial: true, slug: "building-thrive" },
      select: { slug: true, title: true, description: true },
    });
  } catch {
    founding = null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa] text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, #ebebeb 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, #f0f0f0 0%, transparent 45%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <ThriveLogo href="/" priority className="h-7 w-auto sm:h-8" />
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-muted transition hover:text-foreground sm:inline"
          >
            Explore
          </Link>
          <Link
            href="/login"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground transition hover:bg-black/[0.04]"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white transition hover:bg-foreground/90"
          >
            Join
          </Link>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center px-6 pb-20 pt-10 md:pt-6">
          <p className="landing-fade text-[13px] font-medium tracking-[0.18em] text-muted uppercase">
            A social journal for progress
          </p>
          <h1 className="landing-fade landing-fade-delay-1 mt-6 max-w-3xl">
            <span className="sr-only">THRIVE</span>
            <ThriveLogo
              href={null}
              priority
              className="h-14 w-auto sm:h-20 md:h-24"
            />
          </h1>
          <p className="landing-fade landing-fade-delay-2 mt-6 max-w-lg text-lg leading-relaxed text-muted md:text-xl">
            Document your journey. Share your progress. Inspire others.
          </p>
          <div className="landing-fade landing-fade-delay-3 mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-flex h-12 items-center rounded-full bg-foreground px-7 text-sm font-semibold text-white transition hover:bg-foreground/90"
            >
              Start your journey
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-full border border-border bg-white px-7 text-sm font-semibold transition hover:bg-hover"
            >
              Sign in to explore
            </Link>
          </div>
        </section>

        <section className="border-t border-border bg-white">
          <div className="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:grid-cols-3 md:gap-10">
            {[
              {
                title: "Journeys, not posts",
                body: "Every update belongs to a longer story — so progress is readable over time.",
              },
              {
                title: "Follow what moves you",
                body: "Follow a journey without following the person. Stay close to the stories that matter.",
              },
              {
                title: "Encourage, don’t compete",
                body: "Comments and encouragement are built for support — not streaks or scoreboards.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h2 className="text-base font-bold tracking-tight">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {founding ? (
          <section className="border-t border-border bg-[#fafafa]">
            <div className="mx-auto max-w-5xl px-6 py-20">
              <p className="text-[12px] font-medium tracking-[0.16em] text-muted uppercase">
                Founding journey
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                {founding.title}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted line-clamp-3">
                {founding.description}
              </p>
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(`/j/${founding.slug}`)}`}
                className="mt-8 inline-flex text-sm font-semibold underline-offset-4 hover:underline"
              >
                Sign in to follow along →
              </Link>
            </div>
          </section>
        ) : null}

        <footer className="border-t border-border bg-white">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
            <ThriveLogo href="/" className="h-6 w-auto" />
            <p className="text-xs text-subtle">
              Document your journey. Share your progress. Inspire others.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
