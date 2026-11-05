import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/auth-forms";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  try {
    const session = await auth();
    if (session?.user) redirect("/discover");
  } catch {
    // Misconfigured AUTH_SECRET should not blank the login page.
  }

  return <LoginForm />;
}
