import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/auth-forms";
import { safeCallbackUrl } from "@/lib/safe-callback";

export const metadata = { title: "Join THRIVE" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl, "/onboarding");

  try {
    const session = await auth();
    if (session?.user) redirect(callbackUrl);
  } catch {
    // Misconfigured AUTH_SECRET should not blank the register page.
  }

  return <RegisterForm callbackUrl={callbackUrl} />;
}
