import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm text-muted">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        This page doesn’t exist
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The journey may be private, removed, or the link is incorrect.
      </p>
      <Link href="/discover" className="mt-6">
        <Button>Back to Discover</Button>
      </Link>
    </div>
  );
}
