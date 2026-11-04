import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

async function main() {
  const pooled = process.env.DATABASE_URL;
  const direct = process.env.DATABASE_URL_UNPOOLED;

  if (!pooled || !direct) {
    throw new Error("Missing DATABASE_URL or DATABASE_URL_UNPOOLED");
  }
  if (!pooled.includes("-pooler")) {
    throw new Error("DATABASE_URL should be the pooled (-pooler) connection");
  }
  if (direct.includes("-pooler")) {
    throw new Error("DATABASE_URL_UNPOOLED should be the direct connection");
  }

  const adapter = new PrismaNeon({ connectionString: pooled });
  const db = new PrismaClient({ adapter });

  try {
    const [users, journeys, founding] = await Promise.all([
      db.user.count(),
      db.journey.count(),
      db.journey.findUnique({ where: { slug: "building-thrive" } }),
    ]);

    console.log(
      JSON.stringify(
        {
          ok: true,
          neonBranch: process.env.NEON_BRANCH ?? null,
          users,
          journeys,
          foundingJourney: founding?.title ?? null,
          pooledHost: new URL(pooled).hostname,
          directHost: new URL(direct).hostname,
        },
        null,
        2
      )
    );
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
