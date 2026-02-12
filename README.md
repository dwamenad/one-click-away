# One Click Away (MVP)

One Click Away turns social place inspiration into a practical trip plan with maps, budget filters, share links, and group voting.

## Architecture Plan (Brief)

1. Next.js App Router app with API routes for Places, trips, and voting.
2. Google Places provider abstraction with DB-backed TTL caching.
3. Place Hub pages with map/list tabs for Eat/Stay/Do and budget/radius filters.
4. Deterministic itinerary generator persisted in Postgres via Prisma.
5. Public trip links and invite-token voting links.
6. Nearby Now mode for no-login mobile usage.

## Stack

- Next.js 14+ (App Router) + TypeScript
- Tailwind CSS + shadcn-style UI components
- Postgres + Prisma
- Google Maps Platform (Maps JS + Places APIs)

## Required Google APIs

Enable these in Google Cloud Console:
- Maps JavaScript API
- Places API (New)
- Place Photos (served by Places API media endpoint)

## API Key Setup and Restrictions

Create two keys:

1. `GOOGLE_MAPS_API_KEY_PUBLIC`
- Use for browser map rendering only.
- Restrict by HTTP referrer (your domains).
- Restrict API usage to Maps JavaScript API.

2. `GOOGLE_MAPS_API_KEY_SERVER`
- Use for server-side Places calls.
- Restrict by server IP (or secure runtime environment controls).
- Restrict API usage to Places API.

## Environment Variables

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

`.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/one_click_away?schema=public"
GOOGLE_MAPS_API_KEY_PUBLIC="your_referrer_restricted_maps_js_key"
GOOGLE_MAPS_API_KEY_SERVER="your_server_restricted_places_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RATE_LIMIT_WINDOW_MS="60000"
RATE_LIMIT_MAX_REQUESTS="60"
```

## Install and Run

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm prisma db seed
pnpm dev
```

## Prisma Scripts

This project uses Prisma with `prisma/schema.prisma` and `prisma/seed.ts`.

## Seed Data

The seed script creates `accra-weekend-sample` so you can visit:
- `/trip/accra-weekend-sample`

## Tests

```bash
pnpm test
```

Included tests:
- Itinerary scoring determinism and ranking
- Provider interface mock contract

## MVP Routes

- `/` Landing + place search + social text parsing
- `/place/[placeId]` Place Hub with map, tabs, budget/radius, and trip creation
- `/trip/[slug]` Itinerary builder, share links, optional group voting via token
- `/nearby` Nearby Now mode

## Notes

- No social scraping is implemented.
- Places calls run server-side through API routes/provider layer.
- Place details cache TTL: 24h (`PlaceCache`).
- Nearby search cache TTL: 6h (`NearbyCache`).
- Basic in-memory rate limiting is applied to public API endpoints.
