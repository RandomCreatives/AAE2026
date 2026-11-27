# Addis Art Editions

An East African art-print publishing house. Artists keep the copyright and take a
published share of gross margin; the house captures, prints, mounts, frames, ships
and keeps the register.

Everything runs locally: images, fonts, pricing, database. No CDN, no analytics,
no third-party requests. The only network call is to your own PostgreSQL instance.

## Running it locally

```bash
# 1. Point .env at a PostgreSQL database you can reach
cp .env.example .env
#    DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db

# 2. Install dependencies from the lockfile
npm install

# 3. Develop
npm run dev            # http://localhost:3000

# 4. Production
npm run build && npm run start
```

The catalogue self-seeds on the first request. If the database is empty, the app
creates its tables and loads the Addis artists, editions and print options.

## Pages

| Path | Purpose |
| --- | --- |
| `/` | The house and a worked receipt |
| `/works`, `/works/[slug]` | Editions and the framing/pricing builder |
| `/artists`, `/artists/[slug]` | The roster |
| `/craft` | Papers, mounts, frames, size ladder |
| `/journal` | Essays from the press room |
| `/register` | Public provenance lookup by code |
| `/about` | The model, rules, risks, calculator |
| `/submit` | Artist submissions |
| `/status` | Check a submission by its `SUB-…` reference |
| `/verify/[serialNumber]` | Public certificate provenance (`AM-2026-XXXX`) |
| `/admin/ledger` | Order states, payout splits and certificate serials |

## Where things live

- `src/lib/pricing.ts` — the whole business in one function:
  `retail − production = margin`, `margin × artist % = artist royalty`,
  `margin − royalty = studio net`. Prices scale by print area relative to A2.
- `src/lib/config.ts` — studio overheads. Change one number and every page
  recalculates.
- `src/lib/brand.ts` — the house config: name, palette scope, currency and `scale`.
  Catalogue prices are authored in the operating currency; `scale` converts every
  line into USD.
- `src/app/globals.css` — every colour is a CSS custom property under `.brand-addis`.
- `src/lib/pricing.ts` also owns the order ledger: `retail − production − delivery −
  gateway fee = net profit`, split 60/40 on prints and 80/20 on originals.
- `src/db/schema.ts`, `src/db/seed.ts` — tables and the self-healing bootstrap.
  Works have an `itemMode` of `open`, `limited` or `original`; limited runs use a
  row-locked counter so a reservation cannot oversell the cap. Reservations carry
  an `AM-YYYY-NNNN` serial and move through Pending → In production → Delivered →
  Artist paid. Codes are prefixed `ADD-`.

## Replacing the placeholder art

Drop files into `public/art/` and update the `image` and `orientation` fields in
`src/db/seed.ts`. The framing preview in `src/components/price-builder.tsx` reads
`orientation` to pick the aspect ratio. For production, target 300dpi at A2
(4961 × 7016px), Adobe RGB or wider, layered TIF/PSD.

## Before this goes live

- **Payments** — reservations store intent and hold an edition number; no money moves.
- **Auth** — `/register` is an internal view with no login.
- **Fulfilment** — no courier, customs or inventory integration.
- **Images** — placeholder art, as above.
