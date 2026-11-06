import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ThriveLogo } from "@/components/brand/thrive-logo";
import { MarketingNav } from "@/components/landing/marketing-nav";
import { HeroShowcase } from "@/components/landing/hero-showcase";
import { ProductPreview } from "@/components/landing/product-preview";
import { DiscoverGrid } from "@/components/landing/discover-grid";

export default async function LandingPage() {
  let session = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }
  if (session?.user) redirect("/discover");

  return (
    <div className="min-h-screen bg-white text-foreground">
      <MarketingNav />

      <main>
        {/* Hero */}
        <section className="border-b border-border bg-[#faf9f7]">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-muted">
                A social journal for progress
              </p>
              <h1 className="mt-5 max-w-xl text-[clamp(2.4rem,5.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
                Every journey deserves to be seen.
              </h1>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted md:text-[17px]">
                Big goals don’t happen overnight. THRIVE is a place to document
                the little steps, share your progress and discover the journeys
                that inspire you.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center rounded-full bg-foreground px-7 text-sm font-semibold text-white transition-colors hover:bg-foreground/90 active:scale-[0.98]"
                >
                  Start your journey
                </Link>
                <Link
                  href="/discover"
                  className="inline-flex h-12 items-center rounded-full border border-border bg-white px-7 text-sm font-semibold transition-colors hover:bg-hover active:scale-[0.98]"
                >
                  Explore journeys
                </Link>
              </div>
              <p className="mt-4 text-[13px] text-subtle">
                Create your journey. Share at your own pace.
              </p>
            </div>
            <HeroShowcase />
          </div>
        </section>

        {/* Product explanation */}
        <section id="how-it-works" className="scroll-mt-20 border-b border-border bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <div className="max-w-2xl">
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.035em]">
                Progress is a story, not a single moment.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">
                THRIVE gives your goals a place to grow. Every update becomes
                part of a bigger picture.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
              {[
                {
                  title: "Document your journey",
                  body: "Start with something you care about. Share updates, photos, reflections and milestones as you go.",
                },
                {
                  title: "Discover other journeys",
                  body: "Explore what other people are learning, building, creating and working towards.",
                },
                {
                  title: "Encourage one another",
                  body: "Follow journeys, celebrate progress and leave thoughtful encouragement along the way.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border-t border-border pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0 first:md:border-l-0 first:md:pl-0"
                >
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product preview */}
        <section className="border-b border-border bg-[#faf9f7]">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <div className="max-w-2xl">
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.035em]">
                See where a journey can take you.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">
                A calm timeline of updates, photos and encouragement — so
                progress stays readable over time.
              </p>
            </div>
            <div className="mt-10">
              <ProductPreview />
            </div>
          </div>
        </section>

        {/* Discover */}
        <section className="border-b border-border bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <div className="max-w-2xl">
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.035em]">
                Find journeys that move you.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">
                You can enjoy THRIVE even if you don’t want to post regularly —
                discovery is part of the experience.
              </p>
            </div>
            <div className="mt-10">
              <DiscoverGrid />
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section id="about" className="scroll-mt-20 border-b border-border bg-[#faf9f7]">
          <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8 md:py-24">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.035em]">
              No perfect streaks. No finish-line pressure. Just progress.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-muted">
              Some days bring big milestones. Others bring small steps, setbacks
              or lessons. Every part of the journey matters.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[13px] font-medium text-foreground">
              <span>Progress over perfection</span>
              <span className="text-border-strong">·</span>
              <span>Encouragement over competition</span>
              <span className="text-border-strong">·</span>
              <span>Journeys over isolated posts</span>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-b border-border bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8 md:py-24">
            <h2 className="text-[clamp(1.85rem,3.8vw,2.75rem)] font-semibold tracking-[-0.04em]">
              Your journey starts wherever you are.
            </h2>
            <p className="mt-4 text-[16px] text-muted">
              You don’t need to have it all figured out. Just start documenting.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-12 items-center rounded-full bg-foreground px-7 text-sm font-semibold text-white transition-colors hover:bg-foreground/90"
              >
                Start your journey
              </Link>
              <Link
                href="/discover"
                className="inline-flex h-12 items-center rounded-full border border-border px-7 text-sm font-semibold transition-colors hover:bg-hover"
              >
                Explore THRIVE
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#faf9f7]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_1fr] md:px-8 md:py-14">
          <div>
            <ThriveLogo href="/" className="!h-7 w-auto" />
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted">
              Document your journey. Share your progress. Inspire others.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-subtle">
                Product
              </p>
              <ul className="mt-3 space-y-2 text-[14px]">
                <li>
                  <Link href="/discover" className="text-muted hover:text-foreground">
                    Discover
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="text-muted hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-muted hover:text-foreground">
                    Get started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-subtle">
                Account
              </p>
              <ul className="mt-3 space-y-2 text-[14px]">
                <li>
                  <Link href="/login" className="text-muted hover:text-foreground">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-muted hover:text-foreground">
                    Create account
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-subtle">
                Contact
              </p>
              <ul className="mt-3 space-y-2 text-[14px]">
                <li>
                  <a
                    href="mailto:team@thrive.app"
                    className="text-muted hover:text-foreground"
                  >
                    team@thrive.app
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-border/80">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-[12px] text-subtle md:flex-row md:items-center md:justify-between md:px-8">
            <p>© {new Date().getFullYear()} THRIVE</p>
            <p>Privacy and terms pages coming soon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
