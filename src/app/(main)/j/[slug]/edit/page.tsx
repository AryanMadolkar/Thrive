import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EditJourneyForm } from "@/components/journey/edit-journey-form";

export const metadata = { title: "Edit journey" };

export default async function EditJourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { slug } = await params;
  const journey = await db.journey.findUnique({ where: { slug } });
  if (!journey || journey.creatorId !== session.user.id) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit journey</h1>
        <p className="mt-1 text-sm text-muted">{journey.title}</p>
      </div>
      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 sm:p-6">
        <EditJourneyForm journey={journey} />
      </div>
    </div>
  );
}
