"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { safeCallbackUrl } from "@/lib/safe-callback";
import { registerSchema } from "@/lib/validations";

export type ActionState = {
  error?: string;
  success?: string;
};

export async function registerAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const email = parsed.data.email.toLowerCase();
  const username = parsed.data.username.toLowerCase();

  let existing;
  try {
    existing = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
  } catch (error) {
    console.error("register lookup failed", error);
    return {
      error:
        "Could not reach the database. Please try again in a moment.",
    };
  }

  if (existing) {
    return {
      error:
        existing.email === email
          ? "An account with this email already exists"
          : "Username is taken",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    await db.user.create({
      data: {
        name: parsed.data.name,
        email,
        username,
        passwordHash,
      },
    });
  } catch (error) {
    console.error("register create user failed", error);
    return {
      error:
        "Could not create your account. Please try again in a moment.",
    };
  }

  const redirectTo = safeCallbackUrl(
    formData.get("callbackUrl"),
    "/onboarding"
  );

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Account exists; auto sign-in failed (e.g. AUTH_SECRET / AUTH_URL).
      console.error("register signIn failed", error);
      return { success: "Account created. Please sign in." };
    }
    // Next.js redirect() throws; rethrow so navigation works.
    throw error;
  }

  return {};
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeCallbackUrl(formData.get("callbackUrl"));

  if (!email || !password) {
    return { error: "Enter your email and password" };
  }

  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    // Unexpected failures (redirect is a throw we must re-raise).
    throw error;
  }

  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
