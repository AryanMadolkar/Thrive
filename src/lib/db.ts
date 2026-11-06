import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Neon pooled URLs often include `channel_binding=require`, which breaks
 * some serverless/pgbouncer clients. Strip it and keep sslmode=require.
 */
function connectionUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Vercel → Project → Settings → Environment Variables."
    );
  }

  try {
    const url = new URL(raw);
    url.searchParams.delete("channel_binding");
    if (!url.searchParams.get("sslmode")) {
      url.searchParams.set("sslmode", "require");
    }
    // PgBouncer (Neon pooler) works more reliably with Prisma when this is set.
    if (
      url.hostname.includes("-pooler.") &&
      !url.searchParams.has("pgbouncer")
    ) {
      url.searchParams.set("pgbouncer", "true");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

function createPrismaClient() {
  // Standard Prisma engine on Vercel Node — more reliable than the Neon
  // WebSocket adapter for App Router server components / server actions.
  return new PrismaClient({
    datasources: {
      db: { url: connectionUrl() },
    },
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
// at collect-time. The client is created on first real DB access at runtime.
// Important: do not pass the Proxy as `receiver` to Reflect.get — Prisma model
// getters break when `this` is the empty proxy target.
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
