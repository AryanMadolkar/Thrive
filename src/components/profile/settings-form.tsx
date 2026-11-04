"use client";

import { useState, useTransition } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";

export function ProfileSettingsForm({
  user,
}: {
  user: {
    name: string;
    username: string;
    email: string;
    bio?: string | null;
    image?: string | null;
  };
}) {
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
          const result = await updateProfileAction(fd);
          if (result?.error) setError(result.error);
          else setSuccess(true);
        });
      }}
    >
      <div>
        <Label>Username</Label>
        <Input value={user.username} disabled />
        <p className="mt-1 text-xs text-subtle">Usernames can’t be changed yet.</p>
      </div>
      <div>
        <Label>Email</Label>
        <Input value={user.email} disabled />
      </div>
      <div>
        <Label htmlFor="name">Display name</Label>
        <Input id="name" name="name" required defaultValue={user.name} />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={user.bio ?? ""}
          maxLength={280}
          placeholder="A short introduction"
        />
      </div>
      <div>
        <Label htmlFor="image">Profile photo URL</Label>
        <Input
          id="image"
          name="image"
          type="url"
          defaultValue={user.image ?? ""}
          placeholder="https://"
        />
      </div>
      <FieldError>{error}</FieldError>
      {success ? <p className="text-sm text-muted">Profile saved.</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
