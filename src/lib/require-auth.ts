import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Redirect guests to login; returns the authenticated session user. */
export async function requireAuth(callbackPath?: string) {
  let session = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }
  if (!session?.user?.id) {
    const callback = callbackPath
      ? `?callbackUrl=${encodeURIComponent(callbackPath)}`
      : "";
    redirect(`/login${callback}`);
  }
  return session.user;
}
