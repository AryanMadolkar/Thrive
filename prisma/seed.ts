import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  await db.commentLike.deleteMany();
  await db.comment.deleteMany();
  await db.reaction.deleteMany();
  await db.notification.deleteMany();
  await db.journeyFollow.deleteMany();
  await db.userFollow.deleteMany();
  await db.journeyUpdate.deleteMany();
  await db.journey.deleteMany();
  await db.report.deleteMany();
  await db.block.deleteMany();
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const thrive = await db.user.create({
    data: {
      email: "team@thrive.app",
      username: "thrive",
      name: "The THRIVE Team",
      bio: "Building in public",
      passwordHash,
      isOfficial: true,
    },
  });

  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };

  const founding = await db.journey.create({
    data: {
      slug: "building-thrive",
      title: "Building THRIVE 🚀",
      description:
        "We're building a social platform where people can document their journeys, share their progress and motivate each other along the way.\n\nWe're starting with an idea. We'll share the entire journey here — the decisions, experiments, challenges, failures and milestones.",
      goal: "Ship a calm, human place for people to document what they're becoming.",
      category: "BUILDING",
      visibility: "PUBLIC",
      status: "ACTIVE",
      startDate: daysAgo(20),
      isFeatured: true,
      isOfficial: true,
      creatorId: thrive.id,
    },
  });

  const updates = [
    {
      content: "The idea — a calm place to document personal progress.",
      days: 19,
      milestone: true,
    },
    {
      content: "Designing the feed. Monochrome interface. Colour from photos.",
      days: 15,
      milestone: true,
    },
    {
      content: "Building the MVP — journeys, updates, encouragement.",
      days: 8,
      milestone: true,
    },
    {
      content: "Launching soon. Following along means a lot.",
      days: 0,
      milestone: false,
    },
  ];

  for (const u of updates) {
    await db.journeyUpdate.create({
      data: {
        content: u.content,
        isMilestone: u.milestone,
        createdAt: daysAgo(u.days),
        journeyId: founding.id,
        authorId: thrive.id,
      },
    });
  }

  console.log("Seeded official THRIVE founding journey (no placeholder images).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
