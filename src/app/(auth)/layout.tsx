import Image from "next/image";
import Link from "next/link";
import { ThriveLogo } from "@/components/brand/thrive-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white md:grid md:grid-cols-2">
      <aside className="relative hidden overflow-hidden md:block">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-between p-10 lg:p-14">
          <ThriveLogo href="/" tone="dark" priority className="!h-8 w-auto" />
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-semibold leading-tight tracking-[-0.035em] lg:text-5xl">
              Your next chapter starts here.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/80">
              Create a space for the things you’re working towards. Share your
              progress and find inspiration along the way.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 md:hidden">
          <ThriveLogo href="/" className="!h-7 w-auto" />
          <Link href="/" className="text-sm text-muted">
            Home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-10 md:px-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
