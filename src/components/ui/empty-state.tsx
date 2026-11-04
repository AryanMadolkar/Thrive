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
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border bg-surface px-6 py-16 text-center">
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted leading-relaxed">
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
