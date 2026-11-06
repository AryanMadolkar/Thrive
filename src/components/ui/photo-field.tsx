"use client";

import { useId, useState, useTransition } from "react";
import { FieldError, Input, Label } from "@/components/ui/input";
import { fileToGrayscaleDataUrl } from "@/lib/mono-image";

export function PhotoField({
  name,
  label,
  defaultValue = "",
  hint = "Upload a photo or paste a URL. Photos are saved in black and white.",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
}) {
  const id = useId();
  const fileId = `${id}-file`;
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <input type="hidden" name={name} value={value} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor={fileId}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center border border-border bg-surface px-3 text-sm font-medium transition-colors hover:bg-surface-muted"
        >
          {pending ? "Processing…" : "Upload photo"}
        </label>
        <input
          id={fileId}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={pending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setError(undefined);
            startTransition(async () => {
              try {
                const dataUrl = await fileToGrayscaleDataUrl(file);
                setValue(dataUrl);
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Could not process photo"
                );
              }
            });
          }}
        />
        <Input
          id={id}
          type="url"
          placeholder="https://"
          value={value.startsWith("data:") ? "" : value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(undefined);
          }}
          className="min-w-0 flex-1"
        />
      </div>

      {hint ? <p className="text-xs text-subtle">{hint}</p> : null}
      <FieldError>{error}</FieldError>

      {value ? (
        <div className="relative mt-1 aspect-[16/10] max-w-xs overflow-hidden border border-border bg-warm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            className="absolute right-2 top-2 border border-border bg-white/90 px-2 py-1 text-xs font-medium"
            onClick={() => setValue("")}
          >
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}
