"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareButton({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="secondary"
      size="sm"
      type="button"
      onClick={async () => {
        const url = `${window.location.origin}/j/${slug}`;
        try {
          if (navigator.share) {
            await navigator.share({ title, url });
          } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        } catch {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }}
    >
      {copied ? "Link copied" : "Share"}
    </Button>
  );
}
