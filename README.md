# ManzilIQ — Admin Prototype

A representation-only prototype of the ManzilIQ admin dashboard, using the
same UI as the live ManzilIQ app.

## What it is

- **Real authentication** — email + password sign-in / sign-up through
  Supabase Auth, against the live ManzilQ Supabase project. Sessions persist
  and survive reloads. Sign out works.
- **Admin dashboard shell** — sidebar navigation (Overview, Analytics, Users,
  Verification Queue, Content Moderation, Disputes, Audit Logs) with the same
  ManzilIQ look: Outfit headings, slate/amber/indigo palette, rounded cards.
- **No functionality** — every button, approve/reject action and form inside
  the dashboard is a visual placeholder. Clicking one shows a
  "Prototype — demo action, nothing was saved" note. All numbers, users,
  listings and logs shown are **sample data**, clearly labelled as such.

## Setup

```bash
cp .env.example .env   # then fill in VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
bun install            # or: npm install
bun run dev            # or: npm run dev
```

Deploying (Vercel): create a project from this repo and set the same two
environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) for
Production and Preview. No other secrets are needed.

## What it is NOT

- Not connected to the live ManzilIQ app or its database tables — it only
  talks to Supabase Auth.
- No real user management, listing approval, payment or moderation happens
  here, even though the screens look like they do.
