import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileSettingsForm } from "@/components/profile/settings-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account settings</h1>
        <p className="mt-1 text-sm text-muted">
          Update how you appear across THRIVE.
        </p>
      </div>
      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 sm:p-6">
        <ProfileSettingsForm
          user={{
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            image: user.image,
          }}
        />
      </div>
    </div>
  );
}
