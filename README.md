# Yahya Hub — Clone

A Next.js 16 clone of the Yahya Hub coworking-space / innovation-hub platform, rebuilt from the ground up with TypeScript, Tailwind CSS 4, shadcn/ui, and Zustand.

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui (New York style)
- **Icons:** lucide-react
- **State:** Zustand (client-side view routing + modal state)
- **Toasts:** sonner
- **Forms:** react-hook-form (available, but most forms use plain controlled inputs for simplicity)
- **Database:** Prisma (SQLite) — scaffolded but unused by the clone (all data is in-memory)
- **Fonts:** Inter (400/500/600/700) via `next/font/google`

## What's Implemented

### Pages (all client-side routed via Zustand store)
- **Home** — hero with background video + 4 status cards, workspaces grid, programs grid, events grid
- **About** — mission, vision, what we offer, contact, join community
- **Programs** — completed programs list (4 cohorts)
- **Events** — past events list (7 events) with details modals & long-form write-ups
- **Blog** — coming soon placeholder
- **Privacy** & **Terms** — legal pages with 5 sections each
- **Products** index + **YH Connect** landing page (with secondary nav)
- **Admin / Client / Talent login** pages
- **Client register** (single form) & **Talent register** (2-step with progress bar)
- **Mock dashboards** for all 3 roles (protected — redirect to login when unauthenticated, with "Access Denied" toast)
- **404** page

### Modals
- **BookingModal** — Daily calendar tab + Hourly slots tab + Review form + Paystack logo mock
- **EnrollModal** — 2-step (contact info → gender/education + Paystack)
- **EventBookModal** — single-step free registration
- **EventDetailsModal** — long-form write-up + metadata
- **AmenitiesModal** — grid of all amenities with circle-check icons
- **ViewSpaceModal** — workspace image preview

### Components
- `Header` — sticky nav with logo, desktop nav, Products dropdown, mobile hamburger Sheet
- `Footer` — 4-column grid (Contact / Community / Social / Legal with hidden "." admin link)
- `WorkspaceCard`, `ProgramCard`, `EventCard`, `HomeEventCard`
- `StatusCard` & `StatusBadge` — green/yellow variants for Operational/Upcoming/etc.
- `StarRating` — 5 yellow stars + rating + review count

### Theme
- Navy primary `#013156` (HSL `206 98% 17%`)
- Sky-blue secondary `#36BCEC`
- Amber accent `#DBA700`
- Inter font (weights 400/500/600/700)
- 8px border radius (`--radius: 0.5rem`)
- shadcn/ui color tokens mapped to Yahya Hub palette

## File Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind 4 + Yahya Hub theme tokens
│   ├── layout.tsx           # Inter font + metadata + Sonner Toaster
│   ├── page.tsx             # Root component, view switcher, auth guards
│   └── api/route.ts         # Default API route (unchanged)
├── components/
│   ├── site/
│   │   ├── Header.tsx       # Top nav with mobile menu
│   │   ├── Footer.tsx       # 4-column footer
│   │   ├── StatusCard.tsx   # StatusCard + StatusBadge (exported)
│   │   ├── StarRating.tsx
│   │   ├── WorkspaceCard.tsx
│   │   ├── ProgramCard.tsx
│   │   ├── EventCard.tsx
│   │   ├── modals/
│   │   │   └── Modals.tsx   # All 6 modals + ModalsHost
│   │   └── pages/
│   │       ├── HomePage.tsx
│   │       ├── StaticPages.tsx   # About, Programs, Events, Blog, Privacy, Terms, Products, YH Connect
│   │       └── AuthPages.tsx     # Login/register/dashboard for 3 roles
│   └── ui/                  # shadcn/ui primitives (button, card, dialog, etc.)
├── data/
│   └── content.ts           # All catalog data + image URLs + formatNaira helper
├── store/
│   └── nav.ts               # Zustand store: view + modal + auth state
└── lib/
    ├── utils.ts             # cn() helper
    └── db.ts                # Prisma client (unused by clone)
```

## Data Sources

- All workspace/program/event content is hardcoded in `src/data/content.ts` based on the original site
- Images & video are loaded directly from the original Firebase Storage URLs (no proxying)
- Logo: `firebasestorage.googleapis.com/.../bookings-n-products/logo/logo.svg`
- Hero video: `firebasestorage.googleapis.com/.../bookings-n-products/hero/video/yahya_hub_commercial.mp4`
- Paystack logo: `firebasestorage.googleapis.com/.../bookings-n-products/logo/paystack-logo.png`

## Authentication

The clone uses **mock auth** (no Firebase integration). Any non-empty email + password will log you in. Auth state is held in the Zustand store and resets on page refresh. Protected routes (`/admin/dashboard`, `/client/dashboard`, `/talent/dashboard`) redirect to the role's login page with an "Access Denied" Sonner toast when accessed without auth.

## Routing

The clone uses a single Next.js route (`/`) with client-side view switching via Zustand. This matches the original site's SPA-like behavior and keeps the clone simple. To convert to real Next.js routing, move each view in `src/components/site/pages/` to its own `app/<route>/page.tsx` and replace `useNav().navigate()` calls with `next/link` or `useRouter().push()`.

## Payment

The Paystack logo is shown on the booking/enrollment checkout steps, but no real payment is initiated. The "Pay Now" button shows a success toast and closes the modal. To integrate real Paystack, add the Paystack inline JS SDK and call `PaystackPop.setup()` in the `pay()` handlers in `Modals.tsx`.

## Timezone Gate

The original site gates the Workspaces section behind an `Africa/Lagos` timezone check. This clone **does not** implement that gate — all visitors see the booking UI regardless of timezone. If you want to restore it, check `Intl.DateTimeFormat().resolvedOptions().timeZone === 'Africa/Lagos'` in `HomePage.tsx` and conditionally render a "Timezone Mismatch" card instead of the workspaces grid.

## Getting Started

```bash
# Install dependencies
bun install

# Run the dev server
bun run dev

# Open http://localhost:3000
```

## Notes for Further Development

- The original site uses Firebase Auth + Firestore + Storage. This clone is fully self-contained with mock data.
- The `prisma/schema.prisma` file still has the default `User`/`Post` models — replace with your real schema if you wire up a database.
- The `examples/` folder contains a WebSocket demo that's not used by the clone.
- The `mini-services/` folder is empty (just a `.gitkeep`) — add real microservices there if needed.
