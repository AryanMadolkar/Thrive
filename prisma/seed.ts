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
      title: "Building THRIVE",
      description:
        "We're building a calm social platform where people document their journeys, share progress, and encourage one another — starting with the idea and sharing every decision along the way.",
      goal: "Ship a human place for people to document what they're becoming.",
      category: "BUILDING",
      visibility: "PUBLIC",
      status: "ACTIVE",
      startDate: daysAgo(28),
      isFeatured: true,
      isOfficial: true,
      creatorId: thrive.id,
      updatedAt: daysAgo(0),
    },
  });

  const updates = [
    {
      content:
        "Why we started: most social feeds reward performance. We wanted a quieter place for progress — where documenting a journey matters more than looking finished.",
      days: 27,
      milestone: true,
    },
    {
      content:
        "The original idea: journeys first, not isolated posts. Follow someone's marathon training, learning streak, or product build as a continuous story.",
      days: 24,
      milestone: true,
    },
    {
      content:
        "Early design decision: keep the interface monochrome. People's photos and stories bring the colour. Less chrome, more substance.",
      days: 20,
      milestone: true,
    },
    {
      content:
        "Building the first version: journeys, progress updates, follow, and encouragement. Starting simple so the core loop feels right.",
      days: 14,
      milestone: true,
    },
    {
      content:
        "Challenge: discovery without competition. No leaderboards. Just ways to find journeys worth following and people worth encouraging.",
      days: 9,
      milestone: false,
    },
    {
      content:
        "What we're shipping next: a clearer Discover experience, better journey previews, and smoother ways to find stories by topic.",
      days: 4,
      milestone: false,
    },
    {
      content:
        "Launching the foundation. If you're here early — thank you. Follow along as we keep building in public.",
      days: 0,
      milestone: true,
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

  console.log("Seeded official THRIVE founding journey with genuine updates.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
