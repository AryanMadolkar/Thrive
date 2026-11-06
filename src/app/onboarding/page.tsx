import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ThriveLogo } from "@/components/brand/thrive-logo";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata = { title: "Welcome" };

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/onboarding");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, onboardingComplete: true },
  });

  if (!user) redirect("/login");
  if (user.onboardingComplete) redirect("/discover");

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-border/80 bg-white px-5 py-4">
        <ThriveLogo href="/discover" className="!h-7 w-auto" />
      </header>
      <OnboardingFlow name={user.name} />
    </div>
  );
}
