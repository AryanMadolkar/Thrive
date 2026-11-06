"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { onboardingSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function saveOnboardingAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const intents = formData.getAll("intents").map(String);
  const interests = formData.getAll("interests").map(String);
  const skip = formData.get("skip") === "1";

  const parsed = onboardingSchema.safeParse({
    intents: skip ? [] : intents,
    interests: skip ? [] : interests,
  });

  if (!parsed.success) {
    redirect("/onboarding");
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      onboardingComplete: true,
      intents: parsed.data.intents,
      interests: parsed.data.interests,
    },
  });

  revalidatePath("/discover");
  const next = String(formData.get("next") || "/discover");
  if (next === "/create") redirect("/create");
  redirect("/discover");
}
