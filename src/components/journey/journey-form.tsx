"use client";

import { useState, useTransition } from "react";
import { createJourneyAction, createUpdateAction } from "@/lib/actions/journeys";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { CATEGORY_LABELS } from "@/lib/utils";

export function CreatePanel({
  journeys,
}: {
  journeys: { id: string; title: string }[];
}) {
  const [mode, setMode] = useState<"journey" | "update">("journey");

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-[var(--radius-control)] border border-border p-1">
        <button
          type="button"
          onClick={() => setMode("journey")}
          className={`flex-1 rounded-[6px] py-2 text-sm ${
            mode === "journey" ? "bg-warm font-medium" : "text-muted"
          }`}
        >
          New journey
        </button>
        <button
          type="button"
          onClick={() => setMode("update")}
          className={`flex-1 rounded-[6px] py-2 text-sm ${
            mode === "update" ? "bg-warm font-medium" : "text-muted"
          }`}
        >
          New update
        </button>
      </div>
      {mode === "journey" ? (
        <CreateJourneyForm />
      ) : (
        <CreateUpdateForm journeys={journeys} />
      )}
    </div>
  );
}

function CreateJourneyForm() {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      action={(fd) => {
        setError(undefined);
        startTransition(async () => {
          const result = await createJourneyAction(fd);
          if (result?.error) setError(result.error);
        });
      }}
    >
      <div>
        <Label htmlFor="title">Journey title</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="e.g. Learning piano from scratch"
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          required
          className="flex h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm outline-none"
          defaultValue="PERSONAL_GROWTH"
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What is this journey about?"
        />
      </div>
      <div>
        <Label htmlFor="goal">Goal or intention (optional)</Label>
        <Input
          id="goal"
          name="goal"
          placeholder="Not every journey needs a deadline"
        />
      </div>
      <div>
        <Label htmlFor="coverImage">Cover image URL (optional)</Label>
        <Input id="coverImage" name="coverImage" type="url" placeholder="https://" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
          />
        </div>
        <div>
          <Label htmlFor="targetDate">Target date (optional)</Label>
          <Input id="targetDate" name="targetDate" type="date" />
        </div>
      </div>
      <div>
        <Label htmlFor="visibility">Visibility</Label>
        <select
          id="visibility"
          name="visibility"
          className="flex h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm outline-none"
          defaultValue="PUBLIC"
        >
          <option value="PUBLIC">Public</option>
          <option value="FOLLOWERS">Followers only</option>
          <option value="PRIVATE">Private</option>
        </select>
      </div>
      <div>
        <Label htmlFor="status">Save as</Label>
        <select
          id="status"
          name="status"
          className="flex h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm outline-none"
          defaultValue="ACTIVE"
        >
          <option value="ACTIVE">Active journey</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>
      <FieldError>{error}</FieldError>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating…" : "Create journey"}
      </Button>
    </form>
  );
}

function CreateUpdateForm({
  journeys,
}: {
  journeys: { id: string; title: string }[];
}) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  if (journeys.length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted">
        You don’t have any journeys yet. Create one first, then publish updates
        along the way.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      action={(fd) => {
        setError(undefined);
        startTransition(async () => {
          const result = await createUpdateAction(fd);
          if (result?.error) setError(result.error);
        });
      }}
    >
      <div>
        <Label htmlFor="journeyId">Journey</Label>
        <select
          id="journeyId"
          name="journeyId"
          required
          className="flex h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm outline-none"
          defaultValue={journeys[0]?.id}
        >
          {journeys.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="content">Update</Label>
        <Textarea
          id="content"
          name="content"
          required
          placeholder="What happened? What did you learn? How do you feel?"
          className="min-h-[160px]"
        />
      </div>
      <div>
        <Label htmlFor="imageUrl">Photo URL (optional)</Label>
        <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://" />
      </div>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" name="isMilestone" className="rounded border-border" />
        Mark as milestone
      </label>
      <FieldError>{error}</FieldError>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Publishing…" : "Publish update"}
      </Button>
    </form>
  );
}
