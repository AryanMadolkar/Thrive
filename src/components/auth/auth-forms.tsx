"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  loginAction,
  registerAction,
  type ActionState,
} from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const initial: ActionState = {};

function PasswordField({
  id = "password",
  autoComplete,
  minLength,
}: {
  id?: string;
  autoComplete: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name="password"
        type={visible ? "text" : "password"}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        className="h-11 pr-11"
        placeholder="••••••••"
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

export function LoginForm({
  callbackUrl = "/discover",
}: {
  callbackUrl?: string;
}) {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-1.5 text-sm text-muted">
        Welcome back. Continue following the journeys you care about.
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
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="password" className="mb-0">
              Password
            </Label>
          </div>
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
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <AuthDivider />
      <GoogleAuthButton />

      <p className="mt-8 text-center text-sm text-muted">
        New to THRIVE?{" "}
        <Link
          href={
            callbackUrl && callbackUrl !== "/discover"
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
  callbackUrl = "/discover",
}: {
  callbackUrl?: string;
}) {
  const [state, action, pending] = useActionState(registerAction, initial);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
      <p className="mt-1.5 text-sm text-muted">
        Start documenting in under a minute. You can explore without posting.
      </p>

      <form action={action} className="mt-8 space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <Label htmlFor="name">Name</Label>
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
          <PasswordField autoComplete="new-password" minLength={8} />
          <p className="mt-1.5 text-xs text-subtle">At least 8 characters.</p>
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

        <Button
          type="submit"
          className="h-11 w-full rounded-full text-sm font-semibold"
          disabled={pending}
        >
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <AuthDivider />
      <GoogleAuthButton />

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={
            callbackUrl && callbackUrl !== "/discover"
              ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : "/login"
          }
          className="font-semibold text-foreground underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-subtle">or</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function GoogleAuthButton({ className }: { className?: string }) {
  const enabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

  if (!enabled) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-border bg-white text-sm font-medium text-muted opacity-70",
          className
        )}
        title="Google sign-in coming soon"
      >
        <GoogleIcon />
        Continue with Google
        <span className="text-[11px] text-subtle">(soon)</span>
      </button>
    );
  }

  return (
    <form action="/api/auth/signin/google">
      <button
        type="submit"
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-border bg-white text-sm font-semibold transition hover:bg-hover",
          className
        )}
      >
        <GoogleIcon />
        Continue with Google
      </button>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}
