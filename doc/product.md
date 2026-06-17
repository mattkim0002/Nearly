# Product

## What is Makevo?

Makevo is a marketplace that connects clients with skilled creative professionals — woodworkers, ceramicists, photographers, illustrators, interior designers, and more. The focus is on local-first discovery: clients find Pros who can contribute to their specific project, not just browse generic services.

Pros on Makevo sell their work and expertise (a custom chair, a ceramic set, a photo shoot, an illustration) rather than generic "experiences." Clients come with a project goal in mind and need someone with the right craft to help them achieve it.

## Target Users

**Professionals (Pros)**
- Woodworkers, ceramicists, photographers, illustrators, interior designers, musicians, and others
- Sell products and services: custom furniture, ceramic plates, album illustrations, interior styling
- Need a way to reach clients who are actively looking for their specific craft

**Clients**
- People with a project goal who lack the expertise to execute it themselves
- Examples: a cafe owner wanting custom ceramic plates, someone building a home interior, a musician needing album art
- Need to find a trusted, locally-reachable Pro with the right skills

## Core Value Loop

> A client finds a real Pro → reaches out → the Pro receives it and responds → work happens.

That loop is the product. Everything else is acquisition (before) or retention/monetization (after).

## What's in Scope (MLP)

- Auth — client and pro accounts via Supabase OAuth
- Pro self-serve onboarding — claim profile, list services
- Public pro profile page (`/pro/[id]`)
- Inquiry / contact form (client → pro)
- Email notification to pro on new inquiry
- Basic client account (inquiry history)
- Vercel deployment

## What's Out of Scope (deferred post-MLP)

- Payment / Stripe — add after proving the connection has value
- In-app messaging thread — email handles v1
- Reviews & ratings — need real users and completed work first
- Admin dashboard — founders manage early
- Calendar / availability
- Mobile app

## Categories

Initial list: Photography, Woodworking, Ceramics, Illustration, Interior Design.
Makevo is not limited to the above 5 cateogires. Makevo should be built in a way adding a new category to the platform is simple and straightforward.
