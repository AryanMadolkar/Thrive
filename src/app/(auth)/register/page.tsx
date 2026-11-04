import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/auth-forms";

export const metadata = { title: "Join THRIVE" };

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/discover");

  return <RegisterForm />;
}
