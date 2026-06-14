# Database Schema

Supabase project: `mebbczgctzrijtlwxilv`

Update this file whenever a migration is applied. TypeScript types live in `src/types/database.ts` and can be regenerated with:

```bash
npx supabase gen types typescript --project-id mebbczgctzrijtlwxilv > src/types/database.ts
```

---

## categories

| Column      | Type        | Notes               |
|-------------|-------------|---------------------|
| id          | uuid        | Primary key         |
| name        | text        | e.g. "Photography"  |
| slug        | text        | e.g. "photography"  |
| description | text        | nullable            |
| icon        | text        | nullable            |
| created_at  | timestamptz |                     |

## profiles

| Column     | Type        | Notes                                              |
|------------|-------------|----------------------------------------------------|
| id         | uuid        | Primary key (standalone — no `auth.users` FK yet)  |
| email      | text        |                                                    |
| full_name  | text        | nullable                                           |
| avatar_url | text        | nullable                                           |
| bio        | text        | nullable                                           |
| location   | text        | nullable                                           |
| is_pro     | boolean     | true = professional, false = client                |
| created_at | timestamptz |                                                    |
| updated_at | timestamptz |                                                    |

## services

| Column         | Type        | Notes                                         |
|----------------|-------------|-----------------------------------------------|
| id             | uuid        | Primary key                                   |
| title          | text        |                                               |
| description    | text        | nullable                                      |
| category_id    | uuid        | FK → categories                               |
| price_starting | numeric     | nullable                                      |
| price_type     | text        | `'starting_from'` or `'quote'` (CHECK constraint) |
| location       | text        |                                               |
| provider_id    | uuid        | FK → profiles                                 |
| image_url      | text        | nullable — primary image                      |
| images         | text[]      | nullable — gallery URLs                       |
| created_at     | timestamptz |                                               |
| updated_at     | timestamptz |                                               |

---

## RLS Policies

- All tables: **public SELECT** enabled
- INSERT / UPDATE / DELETE: locked down pending auth implementation

---

## Planned Additions (post-auth)

- `profiles.auth_user_id` — FK to `auth.users` + per-role RLS policies
- `profiles.stripe_account_id` — nullable, required for Stripe Connect
- `bookings` table — with `platform_fee` and `payout_amount` columns (designed for Stripe Connect from day one)
- `reviews` table
