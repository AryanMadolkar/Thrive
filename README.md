# THRIVE

A social platform for personal journeys.

**Document your journey. Share your progress. Inspire others.**

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + Neon Postgres (`@prisma/adapter-neon`)
- Auth.js (email/password; extensible for Google)
- Zod + React Hook Form patterns via server actions

## Getting started

```bash
npm install
neon login
neon deploy          # pulls DATABASE_URL + DATABASE_URL_UNPOOLED into .env
npm run db:push
npm run db:seed
npm run db:verify
npm run dev
```

`DATABASE_URL` is the pooled connection (app traffic).  
`DATABASE_URL_UNPOOLED` is the direct connection (Prisma migrations / `db push`).

Open [http://localhost:3000](http://localhost:3000).

Seed data includes only the official founding journey **Building THRIVE 🚀**.

Team account (after seed): `team@thrive.app` / `password123`

## Product surface

- **Discover** — For You, Following, Popular, categories, search
- **Following** — chronological feed of followed journeys
- **Create** — new journey or update (under a minute)
- **My Journeys** — active, paused, draft, completed
- **Profile** — bio, followers, public journeys, settings
- **Journey pages** — timeline, encouragement, comments, share URLs
- **Notifications** — follows, likes, comments, replies

Public journeys are viewable without signing in. Following and interacting require an account.

Privacy (public / followers-only / private), blocking, and reporting are enforced in server logic.
