import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  if (!session?.user) {
    redirect("/login?callbackUrl=/discover");
  }

  return <AppShell>{children}</AppShell>;
}
