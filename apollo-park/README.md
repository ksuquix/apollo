# Apollo Adventure Park — Web App

Scaffold for the site described in `../Apollo Adventure Park.pdf` and detailed in
`../TECHNICAL_SPEC.md`. Next.js (App Router, TypeScript) + Prisma/PostgreSQL.

## Structure

```
src/app/            Route segments (pages + API routes)
  page.tsx           Welcome page                    (spec §5)
  tickets/            Ticket purchasing flow           (spec §2)
  poi/                Attractions/shops/restaurants    (spec §3)
  stay/               Tranquillity Inn                 (spec §5)
  map/                Park map                         (spec §5)
  contact/            Support contact                  (spec §5)
  api/                Route handlers backing the above
src/components/     Shared UI (theme, poi, ticketing)
src/lib/            Pricing engine, Prisma client
src/types/          Shared TS types
prisma/schema.prisma Data model (Patron, Ticket, PricingRule, POI, ParkEvent, ...)
```

## Media assets

The image/video/mesh assets shipped alongside the PDF (in the parent directory) map to
POI records and holographic UI per `TECHNICAL_SPEC.md` §3–5:

- `*.jpg` → per-POI images (`PointOfInterest.imageUrls`)
- `intro.mp4`, `moon-zoom.mp4`, `moon-approach.mov` → welcome/park-wide media
- `logo.jpg`, `logo-mesh.stl`, `lunar-mesh.stl` → branding + holographic map/UI assets

For local dev, copy or symlink needed files into `public/media/`; production serves them
from a CDN (see `next.config.ts` `images.remotePatterns`).

## Getting started

```bash
npm install
cp .env.example .env   # set DATABASE_URL
npx prisma migrate dev --name init
npm run dev
```

## Known gaps / open questions

See `TECHNICAL_SPEC.md` §6 — discount stacking rules, lunar holiday calendar source,
eMAC cybernetic-implant transfer protocol, and IWCAG target version are all unresolved
and stubbed with `TODO`s in the relevant files (`src/lib/pricing.ts`,
`src/app/api/tickets/route.ts`).
