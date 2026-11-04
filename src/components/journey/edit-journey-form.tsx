"use client";

import { useState, useTransition } from "react";
import { Journey } from "@prisma/client";
import {
  deleteJourneyAction,
  updateJourneyAction,
} from "@/lib/actions/journeys";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { CATEGORY_LABELS } from "@/lib/utils";

export function EditJourneyForm({ journey }: { journey: Journey }) {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      action={(fd) => {
        setError(undefined);
        setSuccess(false);
        startTransition(async () => {
          const result = await updateJourneyAction(journey.id, fd);
          if (result?.error) setError(result.error);
          else setSuccess(true);
        });
      }}
    >
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={journey.title} />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          className="flex h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm outline-none"
          defaultValue={journey.category}
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={journey.description ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="goal">Goal or intention</Label>
        <Input id="goal" name="goal" defaultValue={journey.goal ?? ""} />
      </div>
      <div>
        <Label htmlFor="coverImage">Cover image URL</Label>
        <Input
          id="coverImage"
          name="coverImage"
          type="url"
          defaultValue={journey.coverImage ?? ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={journey.startDate.toISOString().slice(0, 10)}
          />
        </div>
        <div>
          <Label htmlFor="targetDate">Target date</Label>
          <Input
            id="targetDate"
            name="targetDate"
            type="date"
            defaultValue={
              journey.targetDate
                ? journey.targetDate.toISOString().slice(0, 10)
                : ""
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="visibility">Visibility</Label>
          <select
            id="visibility"
            name="visibility"
            className="flex h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm outline-none"
            defaultValue={journey.visibility}
          >
            <option value="PUBLIC">Public</option>
            <option value="FOLLOWERS">Followers only</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            className="flex h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm outline-none"
            defaultValue={journey.status}
          >
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>
      <FieldError>{error}</FieldError>
      {success ? (
        <p className="text-sm text-muted">Journey updated.</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="danger"
          disabled={pending}
          onClick={() => {
            if (!confirm("Delete this journey and all updates?")) return;
            startTransition(async () => {
              await deleteJourneyAction(journey.id);
            });
          }}
        >
          Delete journey
        </Button>
      </div>
    </form>
  );
}
