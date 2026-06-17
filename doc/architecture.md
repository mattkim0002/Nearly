# Architecture

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript 5 |
| Database / Auth | Supabase (remote only) |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Icons | lucide-react |
| Date picker | react-day-picker v9 |
| Hosting | Vercel (planned) |
| Monitoring | Sentry (planned) |

## Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server component | Home — hero search + category carousel |
| `/search` | Server component | Full-text search results with filters and pagination |
| `/categories/[slug]` | Server component | Browse all services in a category |
| `/services/[id]` | Server component | Service detail — gallery, pro bio, booking widget, inquiry form |
| `/pro/[id]` | Server component | Public Pro profile — bio, craft badges, services grid, inquiry widget |
| `/pro/onboarding` | Client component | 4-step Pro onboarding wizard (craft → profile → photo → done) |
| `/how-it-works` | Server component | Static explainer page for clients and Pros |
| `/become-a-pro` | Server component | Static pitch + waitlist CTA for prospective Pros |
| `/login` | Client component | Sign-in page — magic link form + Google OAuth stub |
| `/signup` | Client component | Registration — role toggle (Client / Pro), redirects to onboarding for Pros |
| `/dashboard` | Client layout + Server page | Pro dashboard overview — services and inquiries empty states |
| `/dashboard/services/new` | Server component + Client form | Post a service — title, category, description, pricing, location |
| `/api/locations` | API route | `GET ?q=` — location autocomplete from DB |

All pages are server components by default. Client components (`"use client"`) are used only where interactivity is required.

## Key Components

### Layout
- `src/components/layout/header.tsx` — site header; `useAuthMock` hook reads `localStorage.makevoMockAuth` to toggle between logged-out (Log in / Sign up) and logged-in (avatar pill + dropdown with Dashboard, My profile, Sign out) states; Sprint 2 will swap the hook for a real Supabase session
- `src/components/layout/footer.tsx` — site footer

### Search
- `src/components/search/hero-section.tsx` — home page hero; animated "kinetic" headline with profession words cycling via opacity fade every 2.8 s; category shortcut chips link to `/search?category=slug`
- `src/components/search/hero-search.tsx` — the Airbnb-style search bar on the home page; manages field state and navigates to `/search`
- `src/components/search/search-bar-desktop.tsx` / `search-bar-mobile.tsx` — layout variants for the hero search
- `src/components/search/location-dropdown.tsx` — location field with geolocation (Nearby) + popular cities + DB autocomplete
- `src/components/search/date-picker-dropdown.tsx` — two-month calendar using react-day-picker v9 headless (all styles via `classNames` prop)
- `src/components/search/service-suggestions.tsx` — category chip suggestions in the search bar; `onSelect(label, slug)` sets both the display label and the category slug on `SearchValues`, which `HeroSearch` maps to `?category=slug` instead of `?q=`

### Pro
- `src/components/pro/inquiry-widget.tsx` — sticky sidebar (desktop) + bottom bar (mobile) on `/pro/[id]`; stub form fields (name, email, message); submit shows toast confirmation
- `src/components/pro/inquiry-form.tsx` — inline inquiry form on `/services/[id]`; real `<input>` / `<textarea>` fields with focus rings; submit shows toast

### Dashboard
- `src/app/dashboard/layout.tsx` — dashboard shell; sticky sidebar with nav links on desktop, bottom tab nav on mobile; demo mode banner; wraps all `/dashboard/*` routes
- `src/components/dashboard/new-service-form.tsx` — post a service form; pricing toggle (starting from / quote); category `<select>` populated from DB; image upload stub

### Services
- `src/components/services/service-card.tsx` — card shown in grids and carousels; links to `/services/[id]`; accepts optional `className` to override the default `w-72 flex-none` for grid layouts
- `src/components/services/category-carousel.tsx` — tabbed client component; `useState` for active tab + CSS `translateX` for sliding panel transitions
- `src/components/services/category-section.tsx` — single category panel: renders two `ServiceRow` components; each row has left/right arrow buttons on either end and manages its own scroll state independently
- `src/components/services/category-filter-bar.tsx` — Category / Sort / Price / Location dropdowns; calls `router.push()` on selection to update URL params; accepts optional `basePath` for reuse across category browse and search pages; Category dropdown is sourced from DB and only rendered when `categories` prop is provided
- `src/components/services/category-pagination.tsx` — prev/next + numbered pages (max 5 with ellipsis); server-renderable
- `src/components/services/service-gallery.tsx` — adaptive photo grid: 1 image → full-width hero; 2–3 → hero + stacked right; 4–5 → full 5-slot grid
- `src/components/services/booking-widget.tsx` — sticky sidebar on desktop, bottom bar on mobile; CTA is a stub (toast) until auth ships
- `src/components/services/bio-section.tsx` — pro bio with show more/less toggle

## Data Flow

Pages are async server components that fetch from Supabase directly (no API layer for page data). Filters and pagination live in URL search params — no client state needed for data, enabling SSR and shareable URLs.

```
URL params → server component → Supabase query → rendered HTML
```

The only client-side data fetching is location autocomplete via `GET /api/locations?q=`.

## Supabase Clients

- `src/lib/supabase/server.ts` — SSR client (uses cookies for session); used in server components and API routes
- `src/lib/supabase/client.ts` — browser client; used in client components

## Key Technical Decisions

### URL-driven filter state
All filter/sort/page state lives in URL search params. No client-side state for data. This enables server rendering, shareable URLs, and browser back/forward navigation without extra work.

### Category carousel over anchor tabs
Replaced anchor-link category tabs with `CategoryCarousel` — a client component using `useState` + CSS `translateX`. Avoids scroll-jump issues that anchor links cause with a fixed header.

### Two-row card layout
Each category on the home page displays up to 16 services in two rows of 8 (`slice(0, 8)` and `slice(8, 16)` in `CategorySection`). Each row is wrapped in a `ServiceRow` client component with left/right `ChevronLeft`/`ChevronRight` arrow buttons. Arrows disable and grey out when the row cannot scroll further in that direction. Each row tracks its own scroll state independently.

### react-day-picker v9 headless
All date picker styles applied via the `classNames` prop. No external CSS import. Keeps the bundle clean and makes theming straightforward.

### Nominatim for reverse geocoding
Used to resolve the user's current location label from coordinates. Free, no API key required.

### Services use UUID routing
`/services/[id]` uses raw UUID. Slug-based URLs are a non-breaking addition when needed — no schema change required.

### Kinetic hero instead of background image
The home page hero uses no background image. A client component cycles through profession labels (`Woodworker`, `Ceramicist`, etc.) with a CSS opacity fade every 2.8 s — conveying the breadth of the marketplace without a photo. This keeps the hero lightweight (no large image fetch) and avoids the generic stock-photo look. The warm off-white background (`#faf8f5`) maintains visual warmth without needing imagery.

### localStorage mock auth flag for Sprint 1
The header and auth pages use `localStorage.makevoMockAuth = "true"` as a stand-in for a real session during Sprint 1. Setting the flag (via `/login`, `/signup`, or the dashboard demo shortcut) switches the header to its logged-in state. Clearing it (Sign out) reverts it. In Sprint 2, `useAuthMock` in `header.tsx` is replaced with a `useSession` hook from Supabase — no other component changes required.

### Schema designed for Stripe Connect from day one
`profiles` will include `stripe_account_id` (nullable) and `bookings` will include `platform_fee` + `payout_amount` even before payments ship. Retrofitting Stripe Connect onto an unprepared schema is significant tech debt.
