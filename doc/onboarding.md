# Onboarding & Dev Setup

## Prerequisites

- Node.js 18+
- Git
- Supabase project access — ask Jeongsoo for an invite

## Setup

1. Clone and install:

```bash
git clone <repo-url>
cd nearly
npm install
```

2. Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://mebbczgctzrijtlwxilv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ask Jeongsoo>
```

3. Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Key Conventions

**Database**
- Remote Supabase only. No local Docker DB.
- Ad-hoc queries: use the [Supabase Dashboard SQL Editor](https://supabase.com/dashboard/project/mebbczgctzrijtlwxilv).
- Schema migrations go in `supabase/migrations/`. Update `doc/schema.md` after applying.
- `supabase/seed.sql` is the source of truth for all seed data. Keep it in sync when changing the live DB.
- Supabase CLI v2.75.0 — note: `db execute` is not available, use SQL Editor instead.

**Components**
- Service-related components: `src/components/services/`
- Search components: `src/components/search/`
- Client components need `"use client"` at the top of the file.
- Server components (the default) fetch from Supabase directly — no intermediary API layer.

**Styling**
- Tailwind CSS v4 + shadcn/ui (Radix primitives)
- Primary color: warm amber (`--primary: #f4a261`)
- Icons: lucide-react only
- Font: Geist Sans (pre-configured)

## Folder Structure

```
src/
  app/              Next.js pages and API routes
  components/
    services/       ServiceCard, CategorySection, CategoryCarousel, etc.
    search/         HeroSearch, search bar components
    layout/         Header, Footer
    ui/             shadcn/ui primitives (Button, Input, etc.)
  lib/
    supabase/       server.ts (SSR client), client.ts (browser client)
  types/
    database.ts     Generated Supabase TypeScript types
supabase/
  migrations/       SQL schema migrations
  seed.sql          Seed data (source of truth)
doc/                Developer documentation (you are here)
```
