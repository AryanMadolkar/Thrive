"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { toMonochromeUrl } from "@/lib/mono-image";
import { profileSchema } from "@/lib/validations";

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio") || "",
    image: formData.get("image") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await db.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      image: toMonochromeUrl(parsed.data.image),
    },
  });

  revalidatePath("/profile");
  revalidatePath(`/u/${user.username}`);
  return { success: true };
}
