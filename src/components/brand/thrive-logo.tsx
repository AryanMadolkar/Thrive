import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ThriveLogoProps = {
  href?: string | null;
  /** full wordmark or icon mark only */
  variant?: "full" | "mark";
  /** light = black logo for light UI; dark = white logo for dark UI */
  tone?: "light" | "dark";
  className?: string;
  priority?: boolean;
};

const assets = {
  full: {
    light: "/brand/thrive-logo.png",
    dark: "/brand/thrive-logo-on-dark.png",
  },
  mark: {
    light: "/brand/thrive-mark.png",
    dark: "/brand/thrive-mark-on-dark.png",
  },
} as const;

const sizes = {
  full: { width: 657, height: 161 },
  mark: { width: 206, height: 153 },
} as const;

export function ThriveLogo({
  href = "/discover",
  variant = "full",
  tone = "light",
  className,
  priority = false,
}: ThriveLogoProps) {
  const src = assets[variant][tone];
  const { width, height } = sizes[variant];

  const image = (
    <Image
      src={src}
      alt="THRIVE"
      width={width}
      height={height}
      priority={priority}
      className={cn(
        "h-auto w-auto select-none",
        variant === "full" ? "h-7 md:h-8" : "h-8 w-auto",
        className
      )}
    />
  );

  if (href === null) return image;

  return (
    <Link
      href={href}
      className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
      aria-label="THRIVE home"
    >
      {image}
    </Link>
  );
}
