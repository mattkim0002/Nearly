# Roadmap

**Target launch:** April 30, 2026

For the full product strategy behind these priorities, see [product.md](product.md).

---

## Strategy: Frontend-First

Build all pages and user flows as navigable, demo-able UI before wiring up auth or backend logic. This lets us validate the full user experience on both sides of the marketplace — client and Pro — before committing to session and security implementation.

**Design rule while building frontend stubs:** every page that will eventually be auth-gated should include a visible logged-in mock state (e.g. avatar in header, dashboard link). This makes auth integration in Sprint 2 a wiring job, not a rebuild.

---

## ✅ Sprint 1 — Frontend & Demo (complete)

Goal: every meaningful page exists and is clickable end-to-end with real seeded data. No auth required to browse.

**Client side**
- [x] Wire `/search` results page to DB (filters, pagination)
- [x] Public Pro profile page (`/pro/[id]`) — bio, listed services, inquiry CTA stub
- [x] Inquiry / contact form on service detail page (stub — UI only, no email yet)

**Pro side**
- [x] Pro registration / onboarding flow UI (`/pro/onboarding`) — claim profile, add bio (stub)
- [x] Post a service UI (`/dashboard/services/new`) — title, description, category, price (stub)
- [x] Pro dashboard shell (`/dashboard`) — overview of listed services and inquiries (stub)

**Shared**
- [x] Sign in / Sign up pages (`/login`, `/signup`) — UI only, no auth wiring
- [x] Header logged-in mock state — avatar, dashboard link (conditional on mock session flag)

---

## Sprint 2 — Auth & Security

Goal: real users can exist on both sides. All stub pages become functional.

- [ ] Client sign-up / sign-in (OAuth: Google + email magic link via Supabase)
- [ ] Auth middleware + session handling (redirect unauthenticated users from gated pages)
- [ ] Link `profiles` to Supabase `auth.users`
- [ ] Row Level Security — profiles and services tables
- [ ] Wire Pro onboarding and service posting stubs to DB
- [ ] Wire header auth state to real session

---

## Sprint 3 — Connection Loop

Goal: the core marketplace loop works end-to-end.

- [ ] Wire inquiry form to email notification (Resend)
- [ ] `bookings` table (schema designed for Stripe Connect from day one)
- [ ] Client inquiry history page (`/account/inquiries`)
- [ ] Pro inquiry management (simple list view in dashboard)

---

## Sprint 4 — Launch Readiness

Goal: deploy to production with confidence.

- [ ] Vercel deployment + environment variables
- [ ] Sentry error monitoring
- [ ] Security headers (CSP, HSTS) via Next.js middleware
- [ ] API rate limiting on `/api/*` routes
- [ ] `npm audit` + dependency hardening
- [ ] Seed 10 real Pro profiles (invite-only beta)
- [ ] Basic SEO — meta tags, OG images, sitemap

---

## Security Checklist

### When auth ships (Sprint 2)
- Auth rate limiting (Supabase built-in + app-level middleware)
- CSRF protection on state-changing requests
- Row Level Security on all tables

### When user input ships (Sprint 3)
- API rate limiting middleware on `/api/*`
- Server-side input validation and sanitization (XSS/injection prevention)
- File upload restrictions — type, size limits, and malware scanning

### Pre-launch (Sprint 4)
- Audit exposed env vars (service role key must never be client-side)
- Security headers via Next.js middleware (CSP, X-Frame-Options, HSTS)
- `npm audit` and dependency hardening

---

## Backlog (post-launch)

- Reviews and ratings
- In-app messaging (Supabase Realtime)
- Stripe Connect + platform fee
- Pro dashboard (analytics, booking management)
- Image uploads (Supabase Storage)
- Admin moderation tools
- Calendar / availability

---

## Open Questions

Before Sprint 2 is locked:

1. **Pro onboarding model** — self-sign-up open to anyone, or invite-only v1?
2. **Inquiry ownership** — does the client↔pro thread live in Makevo, or hand off to email after first message?
3. **Monetization model** — platform fee, pro subscription, or freemium?
4. **Who are the first 10 Pros?** — people we know personally or cold outreach?
