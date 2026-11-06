import Link from "next/link";
import { ThriveLogo } from "@/components/brand/thrive-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <ThriveLogo href="/" className="!h-7 w-auto" />
        <Link href="/" className="text-sm text-muted">
          Home
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-5 py-10 md:px-10">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
