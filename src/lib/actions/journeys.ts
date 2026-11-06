"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { journeySchema, updateSchema } from "@/lib/validations";
import { toMonochromeUrl } from "@/lib/mono-image";
import { slugify } from "@/lib/utils";
import { nanoid } from "nanoid";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
}

export async function createJourneyAction(formData: FormData) {
  const user = await requireUserId();
  const parsed = journeySchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description") || "",
    goal: formData.get("goal") || "",
    coverImage: formData.get("coverImage") || "",
    startDate: formData.get("startDate") || undefined,
    targetDate: formData.get("targetDate") || "",
    visibility: formData.get("visibility") || "PUBLIC",
    status: formData.get("status") || "ACTIVE",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const base = slugify(parsed.data.title) || "journey";
  let slug = base;
  let attempt = 0;
  while (await db.journey.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${base}-${nanoid(4)}`;
    if (attempt > 5) break;
  }

  const journey = await db.journey.create({
    data: {
      title: parsed.data.title,
      slug,
      category: parsed.data.category,
      description: parsed.data.description || null,
      goal: parsed.data.goal || null,
      coverImage: toMonochromeUrl(parsed.data.coverImage),
      visibility: parsed.data.visibility,
      status: parsed.data.status ?? "ACTIVE",
      startDate: parsed.data.startDate
        ? new Date(parsed.data.startDate)
        : new Date(),
      targetDate: parsed.data.targetDate
        ? new Date(parsed.data.targetDate)
        : null,
      creatorId: user.id,
    },
  });

  revalidatePath("/journeys");
  revalidatePath("/discover");
  redirect(`/j/${journey.slug}`);
}

export async function updateJourneyAction(journeyId: string, formData: FormData) {
  const user = await requireUserId();
  const journey = await db.journey.findUnique({ where: { id: journeyId } });
  if (!journey || journey.creatorId !== user.id) {
    return { error: "Not found" };
  }

  const parsed = journeySchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description") || "",
    goal: formData.get("goal") || "",
    coverImage: formData.get("coverImage") || "",
    startDate: formData.get("startDate") || undefined,
    targetDate: formData.get("targetDate") || "",
    visibility: formData.get("visibility") || journey.visibility,
    status: formData.get("status") || journey.status,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.journey.update({
    where: { id: journeyId },
    data: {
      title: parsed.data.title,
      category: parsed.data.category,
      description: parsed.data.description || null,
      goal: parsed.data.goal || null,
      coverImage: toMonochromeUrl(parsed.data.coverImage),
      visibility: parsed.data.visibility,
      status: parsed.data.status ?? journey.status,
      startDate: parsed.data.startDate
        ? new Date(parsed.data.startDate)
        : journey.startDate,
      targetDate: parsed.data.targetDate
        ? new Date(parsed.data.targetDate)
        : null,
    },
  });

  revalidatePath(`/j/${journey.slug}`);
  revalidatePath("/journeys");
  return { success: true };
}

export async function createUpdateAction(formData: FormData) {
  const user = await requireUserId();
  const parsed = updateSchema.safeParse({
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl") || "",
    isMilestone: formData.get("isMilestone") === "on",
    journeyId: formData.get("journeyId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const journey = await db.journey.findUnique({
    where: { id: parsed.data.journeyId },
  });
  if (!journey || journey.creatorId !== user.id) {
    return { error: "You can only post to your own journeys" };
  }

  const update = await db.journeyUpdate.create({
    data: {
      content: parsed.data.content,
      imageUrl: toMonochromeUrl(parsed.data.imageUrl),
      isMilestone: parsed.data.isMilestone ?? false,
      journeyId: journey.id,
      authorId: user.id,
    },
  });

  // Keep Discover “For you” ordering honest — bump journey activity time.
  await db.journey.update({
    where: { id: journey.id },
    data: {
      updatedAt: new Date(),
      ...(journey.status === "DRAFT" ? { status: "ACTIVE" as const } : {}),
    },
  });

  revalidatePath(`/j/${journey.slug}`);
  revalidatePath("/discover");
  revalidatePath("/following");
  redirect(`/j/${journey.slug}#update-${update.id}`);
}

export async function deleteUpdateAction(updateId: string) {
  const user = await requireUserId();
  const update = await db.journeyUpdate.findUnique({
    where: { id: updateId },
    include: { journey: true },
  });
  if (!update || update.authorId !== user.id) {
    return { error: "Not found" };
  }

  await db.journeyUpdate.delete({ where: { id: updateId } });
  revalidatePath(`/j/${update.journey.slug}`);
  return { success: true };
}

export async function deleteJourneyAction(journeyId: string) {
  const user = await requireUserId();
  const journey = await db.journey.findUnique({ where: { id: journeyId } });
  if (!journey || journey.creatorId !== user.id) {
    return { error: "Not found" };
  }
  await db.journey.delete({ where: { id: journeyId } });
  revalidatePath("/journeys");
  redirect("/journeys");
}
