import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="fade-in flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border/90 bg-white/70 px-6 py-16 text-center shadow-[var(--glass-shadow-soft)] backdrop-blur-sm">
      <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="mt-6">
          <Button variant="secondary">{actionLabel}</Button>
        </Link>
      ) : null}
    </div>
  );
}
