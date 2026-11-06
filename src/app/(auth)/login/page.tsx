import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/auth-forms";
import { safeCallbackUrl } from "@/lib/safe-callback";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);

  try {
    const session = await auth();
    if (session?.user) redirect(callbackUrl);
  } catch {
    // Misconfigured AUTH_SECRET should not blank the login page.
  }

  return <LoginForm callbackUrl={callbackUrl} />;
}
