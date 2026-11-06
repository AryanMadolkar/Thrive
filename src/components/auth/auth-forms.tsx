"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  loginAction,
  registerAction,
  type ActionState,
} from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const initial: ActionState = {};

function PasswordField({
  id = "password",
  name = "password",
  autoComplete,
  minLength,
  value,
  onChange,
}: {
  id?: string;
  name?: string;
  autoComplete: string;
  minLength?: number;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        className="h-11 pr-11"
        placeholder="••••••••"
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-subtle hover:text-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeOff className="h-4 w-4" strokeWidth={1.75} />
        ) : (
          <Eye className="h-4 w-4" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}

function passwordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export function LoginForm({
  callbackUrl = "/discover",
}: {
  callbackUrl?: string;
}) {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em]">
        Welcome back.
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Your journeys are right where you left them.
      </p>

      <form action={action} className="mt-8 space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            autoComplete="email"
            className="h-11"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordField autoComplete="current-password" />
        </div>

        {state.error ? (
          <div className="rounded-xl border border-danger/20 bg-danger/5 px-3 py-2.5 text-sm text-danger">
            {state.error}
          </div>
        ) : null}

        <Button
          type="submit"
          className="h-11 w-full rounded-full text-sm font-semibold"
          disabled={pending}
        >
          {pending ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <GoogleAuthOptional />

      <p className="mt-8 text-center text-sm text-muted">
        New to THRIVE?{" "}
        <Link
          href={
            callbackUrl !== "/discover"
              ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : "/register"
          }
          className="font-semibold text-foreground underline-offset-2 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export function RegisterForm({
  callbackUrl = "/onboarding",
}: {
  callbackUrl?: string;
}) {
  const [state, action, pending] = useActionState(registerAction, initial);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const strength = useMemo(() => passwordStrength(password), [password]);
  const mismatch = confirm.length > 0 && confirm !== password;

  const labels = ["Too short", "Basic", "Good", "Strong", "Excellent"];

  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em]">
        Create your account
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Join THRIVE and start documenting your journey.
      </p>

      <form
        action={action}
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          if (mismatch || password.length < 8) e.preventDefault();
        }}
      >
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Your name"
            autoComplete="name"
            className="h-11"
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-subtle">
              @
            </span>
            <Input
              id="username"
              name="username"
              required
              placeholder="yourname"
              pattern="[a-z0-9_]+"
              autoComplete="username"
              className="h-11 pl-7"
            />
          </div>
          <p className="mt-1.5 text-xs text-subtle">
            Lowercase letters, numbers, and underscores only.
          </p>
        </div>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            autoComplete="email"
            className="h-11"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordField
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={setPassword}
          />
          <div className="mt-2 flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full bg-border",
                  strength > i && "bg-foreground"
                )}
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-subtle">
            {password ? labels[strength] : "At least 8 characters."}
          </p>
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            minLength={8}
            value={confirm}
            onChange={setConfirm}
          />
          {mismatch ? (
            <p className="mt-1.5 text-xs text-danger">Passwords don’t match.</p>
          ) : null}
        </div>

        {state.error ? (
          <div className="rounded-xl border border-danger/20 bg-danger/5 px-3 py-2.5 text-sm text-danger">
            {state.error}
          </div>
        ) : null}
        {state.success ? (
          <div className="rounded-xl border border-border bg-warm px-3 py-2.5 text-sm text-muted">
            {state.success}
          </div>
        ) : null}

        <p className="text-[12px] leading-relaxed text-subtle">
          By creating an account you agree to use THRIVE respectfully. Privacy
          and terms pages are coming soon.
        </p>

        <Button
          type="submit"
          className="h-11 w-full rounded-full text-sm font-semibold"
          disabled={pending || mismatch || password.length < 8}
        >
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <GoogleAuthOptional />

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={
            callbackUrl !== "/onboarding" && callbackUrl !== "/discover"
              ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : "/login"
          }
          className="font-semibold text-foreground underline-offset-2 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

function GoogleAuthOptional() {
  const enabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
  if (!enabled) return null;

  return (
    <>
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-subtle">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <form action="/api/auth/signin/google">
        <button
          type="submit"
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-border bg-white text-sm font-semibold transition hover:bg-hover"
        >
          Continue with Google
        </button>
      </form>
    </>
  );
}
