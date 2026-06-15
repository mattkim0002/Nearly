# Nearly

## Mission Statement
Nearly’s mission is to connect Pros all over to clients all over the globe. Nearly connects trusted professionals with clients through simple, local-first experiences -- making it easy to discover, book, and collaborate with skilled creators anywhere in the world.

## Target Customers
1. Professionals such as Woodworkers, ceramicists, photographers, etc. These professions are able to contribute to customer's project or products. These professions do not sell "experiences" necessarily, but rather they sell their products, such as cermics, chairs, paintings, or even music beats. We connect customers who want to get their project done with artists, hand-workers, or musicians.
2. Customers who need local Pros for specific product or job that can contribute to their project of interest. These customers are not expert at any of the profession such as woodworking, illustration, or ceramics, for example. But they have a need of those expertise in order to achieve their goals such as improving interior design of a cafe, building custom ceramic plates, or creating an illustration for their album. These customers could use Nearly to look for Pros that carry the target expertise and also locally reachable.


## Core Features
<!-- What are the main features of the application? -->
- Service marketplace connecting clients with creative professionals
- Categories: Photography, Woodworking, Ceramics, Illustration, Interior Design
- Search by location, date, and service type
- User authentication (OAuth via Supabase)


## Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Database/Auth**: Supabase
- **Styling**: Tailwind CSS + shadcn/ui
- **Hosting**: Vercel (planned)
- **Monitoring**: Sentry (planned)


## Documentation

Project documentation lives in `/doc` in this repo. Keep it up to date as the project evolves.

**Structure:**
- `doc/product.md` — What Nearly is, who it's for, what's in/out of MLP scope
- `doc/architecture.md` — App structure, routes, components, key technical decisions
- `doc/schema.md` — Database schema reference (source of truth)
- `doc/onboarding.md` — How to run the project locally
- `doc/roadmap.md` — Current sprint, upcoming work, backlog

**Update triggers — do these automatically after each relevant task:**
- **Feature completed** → Update `doc/architecture.md` if the structure changed; update `doc/roadmap.md` to check off completed items.
- **Architectural decision made** → Add a section to `doc/architecture.md` under "Key Technical Decisions".
- **DB schema changed** → Update `doc/schema.md` to reflect the new state.
- **Roadmap item completed** → Check it off in `doc/roadmap.md`.


## Project Conventions
- **Database**: Remote Supabase only (no local Docker/DB). Seed changes are applied via the Supabase Dashboard SQL Editor.
- **Supabase CLI**: Installed (`v2.75.0`) and authenticated. Project is linked (ref: `mebbczgctzrijtlwxilv`). `db execute` is not available in this version — use SQL Editor for ad-hoc queries.
- **Seed data**: `supabase/seed.sql` is the single source of truth for all seed data (profiles, services, categories). Keep it updated when changing live DB.
- **Components**: Service-related components live in `src/components/services/`. Client components use `"use client"` directive.

