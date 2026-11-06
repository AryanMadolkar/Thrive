import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Normalize Neon / Vercel DATABASE_URL for Prisma's query engine.
 * - Strip wrapping quotes (common paste mistake in dashboards)
 * - Drop channel_binding=require (breaks some pooler clients)
 * - Add pgbouncer=true for Neon -pooler hosts
 */
function normalizeDatabaseUrl(raw: string): string {
  let value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  if (
    !value.startsWith("postgresql://") &&
    !value.startsWith("postgres://")
  ) {
    throw new Error(
      `DATABASE_URL must start with postgresql:// or postgres:// (got “${value.slice(0, 24)}…” ). Re-set it in Vercel from your Neon pooled connection string, then redeploy.`
    );
  }

  try {
    const url = new URL(value);
    url.searchParams.delete("channel_binding");
    if (!url.searchParams.get("sslmode")) {
      url.searchParams.set("sslmode", "require");
    }
    if (
      url.hostname.includes("-pooler.") &&
      !url.searchParams.has("pgbouncer")
    ) {
      url.searchParams.set("pgbouncer", "true");
    }
    return url.toString();
  } catch {
    return value;
  }
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Vercel → Project → Settings → Environment Variables."
    );
  }

  // Mutate env before PrismaClient reads schema `env("DATABASE_URL")`.
  process.env.DATABASE_URL = normalizeDatabaseUrl(raw);

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Lazy proxy so `next build` can import modules without requiring DATABASE_URL
// at collect-time. Do not pass the Proxy as Reflect receiver — Prisma getters break.
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
