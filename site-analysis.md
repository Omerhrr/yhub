# Yahya Hub — Site Analysis & Clone Spec

**Target site:** `https://yahyahub-bookings-n-products--yahyahub-e7643.us-east4.hosted.app/`
**Analysis date:** June 2026 (server time)
**Tooling used:** `agent-browser` (Playwright-based), full DOM snapshots, CSS-variable extraction, network inspection, screenshots (saved in `/home/z/my-project/screenshots/`).

---

## 1. Site Overview

Yahya Hub is a **coworking-space / innovation-hub** marketing + booking platform. It lets visitors:

- Browse **workspaces** and book them by the hour or day (calendar-based, with Paystack payment).
- Browse **programs** (tech bootcamps for adults, kids, school-leavers) and enroll (Paystack payment).
- Browse **events** (conferences, webinars, game nights) and book a spot (free or paid).
- Read about past programs and past events (with detailed write-ups in modals).
- View the **YH Connect** product — a separate sub-platform connecting clients with verified built-environment professionals (architects, engineers, artisans), with its own client/talent authentication, project posting, and dashboards.
- Access a hidden **admin login** (linked from the footer as a dot ".") at `/admin/login`.

The site is in active use, contains real bookings data (Nigerian Naira prices, Africa/Lagos timezone), and includes a Paystack payment integration.

---

## 2. Tech Stack (confirmed from headers + network)

| Layer | Technology |
|---|---|
| Framework | **Next.js 14.0.21** (App Router, RSC streaming — `x-nextjs-cache: HIT`, `vary: rsc, next-router-state-tree`) |
| Styling | **Tailwind CSS** (utility classes everywhere) + **shadcn/ui** components (Radix UI primitives: Dialog, DropdownMenu, Tabs, Calendar, Popover, Select, Combobox, Toast/Sonner) |
| Font | **Inter** loaded from `https://fonts.googleapis.com/css2?family=Inter&display=swap` (single weight 400 + Tailwind weight utilities) |
| Icons | **lucide-react** (inline SVG icons throughout) |
| Auth | **Firebase Authentication** (email/password — confirmed by `Firebase: Error (auth/invalid-credential)` on bad login) |
| Database | **Cloud Firestore** (project `yahyahub-e7643`, real-time Listen channel observed) |
| Storage | **Firebase Storage** — two buckets: `yahyahub-e7643` (logos, hero video, paystack logo, some workspace images) and `yahya-hub-backed` (older workspace images like `executive-office.jpg`) |
| Payments | **Paystack** (logo shown on enrollment/booking checkout steps) |
| Hosting | Google Cloud Run (`us-east4`), fronted by Firebase App Hosting (`x-fah-adapter: nextjs-14.0.21`) |
| Notifications | **Sonner** toasts (region labelled "Notifications (F8)") |
| Title (default) | `Yahya Hub | Coworking Space, Programs & Events` (YH Connect page overrides to `YH Connect | Connect with Verified Professionals - Yahya Hub`) |

---

## 3. Routes / Pages (full sitemap)

### Public site (Yahya Hub main)
| Route | Type | Notes |
|---|---|---|
| `/` | Public | Home — hero, workspaces, programs, events |
| `/about` | Public | About page — mission/vision/offer/contact |
| `/programs` | Public | "Completed Programs" list |
| `/events` | Public | "Past Events" list with modals |
| `/blog` | Public | "Coming Soon" placeholder |
| `/privacy` | Public | Privacy Policy |
| `/terms` | Public | Terms of Service |
| `/products` | Public | Products index (lists YH Connect) |
| `/products/yh-connect` | Public | YH Connect landing page (has its own secondary nav) |
| `/#workspaces`, `/#programs`, `/#events` | Anchor | In-page navigation from header |
| `/admin/login` | Public (hidden) | Admin sign-in (linked from footer as ".") |
| `/client/login`, `/client/register` | Public | Client auth for YH Connect |
| `/talent/login`, `/talent/register` | Public | Talent auth for YH Connect (multi-step registration) |
| `/client/dashboard`, `/talent/dashboard`, `/admin/dashboard` | **Protected** | Redirect to respective `/login` when unauthenticated, with an "Access Denied" toast |
| `/client/signup` | 404 | (the sign-up *link* points to `/client/register`; `/client/signup` is a 404 page) |
| `/admin` | 404 | Not a route; only `/admin/login` + `/admin/dashboard` exist |
| Any unknown | 404 | Custom 404 page ("404 - Page Not Found") with the main header/footer |

### External links (open in new context)
- Facebook: `https://www.facebook.com/share/1913yPdrYe/`
- Twitter/X: `https://x.com/YahyaHub`
- LinkedIn: `https://www.linkedin.com/company/yahyahub/posts`
- Email: `yahyahub6@gmail.com` · Phone: `07043925169`

---

## 4. Visual Design

### Overall style
A clean, **minimalist / modern SaaS** look built on shadcn/ui + Tailwind. Lots of whitespace, soft borders, subtle shadows, rounded corners, and a confident navy primary color. Status cards on the hero use a translucent "glass" treatment (`bg-white backdrop-blur-sm`) over the background video.

### Color palette (from CSS variables, HSL → hex)

| Token | HSL | Hex | Usage |
|---|---|---|---|
| `--primary` | `206 98% 17%` | **`#013156`** | Navy — primary buttons, logo text, headings on hero, hover underline color `#013756` |
| `--secondary` | `196 83% 57%` | **`#36BCEC`** | Sky blue — icon accents (mail/phone icons in footer & about) |
| `--accent` | `46 100% 43%` | **`#DBA700`** | Amber/gold (used by shadcn defaults; not heavily used here) |
| `--background` | `0 0% 100%` | `#FFFFFF` | Page background |
| `--foreground` | `220 10% 15%` | `#22252A` | Body text |
| `--muted` | `220 15% 95%` | `#F0F2F4` | Workspaces section bg, footer contact box bg (`bg-muted/50`) |
| `--muted-foreground` | `220 10% 45%` | `#676F7E` | Secondary text, footer links |
| `--card` | `220 20% 100%` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `220 10% 15%` | `#22252A` | Card text |
| `--border` | `220 15% 90%` | `#E2E4E9` | All card/input borders |
| `--input` | `220 15% 90%` | `#E2E4E9` | Input borders |
| `--ring` | `206 98% 17%` | `#013156` | Focus ring |
| `--destructive` | `0 84.2% 60.2%` | `#EF4444` | Errors / heart icon on About page |
| `--radius` | `0.5rem` | `8px` | Base radius |
| `--primary-foreground` | `210 20% 98%` | `#F9FAFB` | Text on primary buttons |
| `--popover` | `220 20% 100%` | `#FFFFFF` | Popover bg |
| `--sidebar-*` | various | — | Defined but unused (no sidebar in app) |

**Status-badge colors (used directly as Tailwind classes, not tokens):**

| Color | Hex | Usage |
|---|---|---|
| Green-500/20 bg, Green-600 text, Green-500/30 border | `#22C55E` / `#16A34A` | "Operational", "Ongoing", "Online", "Physical" |
| Yellow-500/20 bg, Yellow-600 text, Yellow-500/30 border | `#EAB308` / `#CA8A04` | "Upcoming", "hours" |
| Amber-50 bg, Amber-200 border, Amber-800 text | `#FFFBEB` / `#FDE68A` / `#92400E` | Timezone-mismatch warning box |

**Chart palette** (defined, likely for admin dashboard charts): `--chart-1` `#F97316`, `--chart-2` `#29A38A`, `--chart-3` `#274658`, `--chart-4` `#E8B66B`, `--chart-5` `#F4A051`.

**Star rating color:** `text-yellow-500` (`#EAB308`) with `fill-current`.

### Typography

- **Font family:** `Inter, sans-serif` (only weight 400 is loaded from Google Fonts; Tailwind's `font-bold` (700), `font-semibold` (600), `font-medium` (500) are applied via CSS — the browser synthesizes bold from the single loaded weight, OR Inter is also bundled by Next.js font optimization. Safest: load Inter at weights 400/500/600/700.)
- **Heading sizes (desktop):**
  - H1 hero: `text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight` → 36/48/60px, weight 700, tight tracking
  - H1 inner pages (About, Privacy, Terms, Blog, Products, Programs, Events): `text-4xl font-bold` (40px) — About uses `text-primary`
  - H2 section headings: `text-xl md:text-3xl font-bold` (Workspaces section) — 20/30px; or `text-2xl font-semibold` (About sub-headings)
  - H3 cards: `text-lg font-semibold` (18px) or `text-xl font-semibold`
  - Card titles (workspace/program/event): `text-xl font-semibold` (20px), `tracking-tight`
- **Body sizes:**
  - Hero paragraph: `text-base sm:text-lg` (16/18px)
  - About intro: `text-lg` (18px)
  - Card descriptions: `text-sm` (14px)
  - Footer/legal: `text-sm` (14px)
  - Micro text: `text-xs` (12px) — status badges, muted captions
- **Button text:** `text-sm font-medium` (14px / 500)
- **Font weights in use:** 400 (body), 500 (buttons/links/medium), 600 (status badges), 700 (headings/bold)

### Spacing / Layout

- Container: `container mx-auto px-4` (Tailwind default container, ~1280px max with 16px gutters)
- Section padding: `py-16` (64px vertical) for major sections; `py-8` (32px) for footer
- Card padding: `p-6` (24px)
- Grid gaps: `gap-4` (16px) for status cards, `gap-8` (32px) for workspace/program/event grids
- Hero grid: `lg:grid-cols-2 gap-12 items-center`
- Workspaces/Programs/Events grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### Border radius

- Base `--radius`: `0.5rem` = **8px** (`rounded-lg` on cards)
- Buttons: `rounded-md` (6px)
- Badges/pills: `rounded-full` (9999px)
- Inputs: `rounded-md` (6px)

### Shadows

- Cards: `shadow-sm` (`0 1px 2px 0 rgba(0,0,0,0.05)`)
- Modals/dialogs: `shadow-lg` (`0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)`)
- Hero status cards: `shadow-sm` + `border-white/20` + `bg-white backdrop-blur-sm`

### Borders

- Default border color: `#E2E4E9` (`border`)
- Border width: `1px` on cards, inputs, dividers
- Divider inside cards: `h-[1px] w-full bg-border`

### Animations / transitions

- `transition-colors` on links/buttons
- Radix dialog animations: `fade-in-0`, `zoom-in-95`, `slide-in-from-*` (200ms duration)
- Chevron icon rotates 180° when dropdown opens: `group-data-[state=open]:rotate-180 transition-transform duration-200`

---

## 5. Global Layout & Reusable Components

### 5.1 Site Header (top nav) — `Header` component
- **Container:** sticky-ish top bar with `flex items-center justify-between` (logo left, nav right)
- **Logo:** 40×40 SVG (`logo.svg`) + wordmark "Yahya Hub" in `text-xl font-bold text-primary`
- **Desktop nav (`hidden md:flex`):** About Us · Workspaces · Programs · Events · **Products** (dropdown)
  - Link styling: `font-medium text-gray-700 hover:text-[#013756] hover:underline hover:underline-offset-4`
  - "Products" is a Radix DropdownMenu button with a chevron-down icon; menu item: "YH Connect" → `/products/yh-connect`
- **Mobile:** hamburger button (lucide `menu`/`x` icon) opens a Radix Sheet/drawer containing the same nav as a `<ul>` list

### 5.2 Site Footer — `Footer` component (present on all main pages)
Four-column grid (`md:grid-cols-4`), border-top, white bg:

1. **Contact** column
   - Heading "Contact" (`font-bold`)
   - Box: `rounded-lg border bg-muted/50 p-4` containing:
     - Mail icon (`text-secondary`) + `yahyahub6@gmail.com` (`mailto:`)
     - Phone icon (`text-secondary`) + `07043925169` (`tel:`)
2. **Community** column
   - Heading + `<ul>`: Programs (`/#programs`), Events (`/#events`), Blog (`/blog`)
3. **Social** column
   - Heading + `<ul>`: Facebook, Twitter, LinkedIn (external)
4. **Legal** column
   - Heading + `<ul>`: Privacy (`/privacy`), Terms (`/terms`), **"."** (`/admin/login` — hidden link)

Bottom bar: `mt-8 border-t pt-8 text-center text-muted-foreground` with `© 2026 Yahya Hub. All rights reserved.`

### 5.3 Reusable UI primitives (shadcn/ui)
Detected in use:
- `Button` (variants: default/primary, outline, ghost; sizes: default, sm, lg, icon)
- `Card` (`rounded-lg border bg-card shadow-sm` with `CardHeader`, `CardContent`, `CardFooter`)
- `Badge` (pill: `rounded-full border px-2.5 py-0.5 text-xs font-semibold`)
- `Input` (textbox, password with eye toggle button)
- `Label`
- `Select` / `Combobox` (Radix)
- `Dialog` (modal with overlay, centered, `max-w-lg`)
- `DropdownMenu` (Products, Login, Sign Up)
- `Tabs` (Daily / Hourly booking tabs)
- `Calendar` (date picker — Radix-style month grid)
- `Popover` (All Amenities, calendar trigger)
- `Checkbox` (terms agreement)
- `Progress` (talent registration stepper)
- `Toaster` / `toast()` (Sonner — bottom-right, dismissible, `role=status`)
- `Separator` (`h-[1px] w-full bg-border`)

### 5.4 Other shared components
- `WorkspaceCard`, `ProgramCard`, `EventCard` (all extend `Card`)
- `BookingModal` (multi-step: calendar → review → Paystack)
- `EnrollModal` (multi-step: contact info → details + Paystack)
- `EventDetailsModal` (single-step modal with full write-up)
- `AmenitiesModal` (lists all amenities with circle-check icons)
- `StatusBadge` (variants: operational/ongoing = green, upcoming = yellow)
- `StarRating` (5 lucide `Star` icons with `fill-current`, text-yellow-500)
- `PageHero` / `PageHeader` (Back link + H1 + subtitle — used on Programs/Events pages)
- `SecondaryNav` (YH Connect only — Home/Login/Sign Up)

---

## 6. Page-by-Page Documentation

### 6.1 Home page (`/`)

**Hero section** (full-bleed, has a background `<video>` with `firebasestorage.../hero/video/yahya_hub_commercial.mp4`):
- Dark navy overlay gradient over the video (`bg-primary/70`-style)
- 2-column grid on desktop (text left, status cards right); single column on mobile (status cards become a 4-button carousel)
- **Left column:**
  - H1: "Welcome to Yahya Hub"
  - Paragraph: "A vibrant space for ideas, creativity, and collaboration. We offer coworking spaces, run skill-building programs, and host events that inspire innovation across every field."
  - Two CTA buttons:
    - **"Explore Workspaces"** (primary navy, `h-11 px-8`, → `/#workspaces`)
    - **"Our Programs"** (outline, `border-white text-white hover:bg-white hover:text-black`, → `/#programs`)
- **Right column — 4 status cards** (`bg-white backdrop-blur-sm border-white/20`), each with:
  1. **Network Status** — lucide `signal` icon, green "Operational" badge, "99.0% uptime" (bold), "Starlink connection active"
  2. **Power Systems** — lucide `zap` icon, green "Operational" badge, "100% capacity", "Backup solar ready"
  3. **Climate Control** — lucide `thermometer` icon, green "Operational" badge, "26°C average", "Optimal temperature maintained"
  4. **Workspace** — lucide `briefcase-business` icon, **yellow "hours"** badge, "10 hours to close", "Open 9:00 AM - 8:00 PM"

**Workspaces section** (`#workspaces`, `bg-muted py-16`):
- H2 "Workspaces" (`mb-8 text-xl md:text-3xl font-bold`)
- Grid of **7 workspace cards** (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`). Each card:
  - **Header row:** title (`text-xl font-semibold`) on left + small "View Space" outline button (lucide `image` icon) on right
  - Description paragraph (`text-sm`)
  - **Rating row:** 5 yellow stars + numeric rating + "(N reviews)"
  - **Amenities row:** icons + labels (e.g., `armchair` icon + "50 Chair", `desk` icon + "6 Desk"). If >2 amenities, a "+N more" button (text-primary) opens an "All Amenities" modal listing every amenity with a `circle-check` icon.
  - **Pricing row:** "₦X,XXX /hour" and "₦X,XXX /day" (large bold numbers)
  - **CTA button:** "Check Availability" (primary, full-width-ish) — disabled when booking not allowed (e.g., Office of One is disabled)

  The 7 workspaces are:

  | # | Name | Description | Rating | Amenities | /hour | /day |
  |---|---|---|---|---|---|---|
  | 1 | Program/ Event space | A space of 50 chairs suitable for an event, webinar or workshop | 4.5 (10 reviews) | 50 Chair, 6 Desk, +2 more | ₦20,000 | ₦120,000 |
  | 2 | workspace | A dynamic, shared workspace designed for networking, collaboration, and spontaneous creativity. | 4.6 (150 reviews) | 20 Executive Desk | ₦333 | ₦3,000 |
  | 3 | Office of One | A compact, private office perfect for solo entrepreneurs and freelancers seeking focus and productivity. | 4.8 (75 reviews) | Executive Desk | ₦1,000 | ₦10,000 |
  | 4 | Office of Two | A private office designed for two, ideal for startups, small teams, or collaborative partners. | 4.9 (62 reviews) | 2 Executive Desk, Single Couches | ₦1,000 | ₦10,000 |
  | 5 | Office of Three | A collaborative workspace for a team of three, offering a blend of privacy and open communication. | 4.7 (45 reviews) | 3 Executive Desk, Double Couch | ₦1,000 | ₦10,000 |
  | 6 | Executive Office | A premium, spacious office for leaders, featuring top-tier amenities and a commanding view. | 4.5 (30 reviews) | Executive Desk, 2 Single Couches, +2 more | ₦1,000 | ₦10,000 |
  | 7 | Conference Room | A fully-equipped room for meetings, presentations, and workshops, designed for professional impact. | 4.9 (90 reviews) | 10 Executive Desk, Smart TV | ₦8,000 | ₦72,000 |

  *Note:* The booking calendar **requires the browser timezone to be Africa/Lagos**. Visitors in any other timezone see a "Timezone Mismatch" card instead of the booking UI. (I bypassed this with an init script overriding `Intl.DateTimeFormat` to capture the real card content — see screenshot `22-home-with-workspaces.png`.)

**Programs section** (`#programs`):
- H2 "Programs" + "Completed" link (`/programs`) with chevron-right icon
- 3 program cards (each with title + "Upcoming" yellow badge, description, two metadata rows with `users` icon + program-name + `clock` icon + duration, divider, price `text-xl font-bold` + "Enroll Now" primary button).

  | Name | Status | Description | Tag | Duration | Price |
  |---|---|---|---|---|---|
  | Adult Classes | Upcoming | Data Analysis/Data Science, UI/UX, Cybersecurity, AI Automation, Software Engineering. 2 months, 3 days a week | Adult Classes | 2 months | ₦100,000 |
  | Kids Program | Upcoming | Scratch & Blockly, Graphics Design, Web Development, 3D CAD, Robotics 5 weeks, Monday – Wednesday, 10am – 1pm | Kids Program | 1 month | ₦50,000 |
  | Highschool Leavers | Upcoming | Python Programming. 2 months, 3 days a week | Highschool Leavers | 2 months | ₦100,000 |

**Events section** (`#events`):
- H2 "Events" + "Past" link (`/events`) with chevron-right icon
- 2 event cards (title + status badge, description, 3 metadata rows: `calendar` icon + date, `clock` icon + time, `map-pin` icon + location, divider, price `text-lg font-bold` + button).

  | Title | Status | Description | Date | Time | Location | Price | Button |
  |---|---|---|---|---|---|---|---|
  | Annual Tech Conference | Ongoing (green) | Join us for our biggest event of the year, featuring talks from industry leaders, networking opportunities, and workshops. | Nov 21, 2026 | 10:00 AM - 01:00 PM | Yahya Hub | ₦1,200 | "Ongoing" (disabled) |
  | Annual Tech Conference | Upcoming (yellow) | (same description) | Oct 26, 2025 | 10:00 AM - 01:00 PM | Yahya Hub | Free | "Book a Spot" |

**Footer** (see §5.2).

### 6.2 About page (`/about`)
Single centered column, `max-w-4xl mx-auto space-y-8`:
- H1 "About Yahya Hub" (`text-4xl font-bold text-primary`)
- Subtitle: "Fostering Innovation, Collaboration, and Growth in the Heart of the Community." (`text-lg`)
- **"Our Mission"** — H2 with lucide `lightbulb` icon (`text-2xl font-semibold flex items-center gap-3`) + mission paragraph
- **"Our Vision"** — H2 with lucide `telescope` icon + vision paragraph
- **"What We Offer"** — H2 + bulleted list (`list-disc list-inside`), each item with a `<strong>` lead-in:
  - "**Flexible Workspaces:** Modern, fully-equipped coworking spaces designed to inspire productivity and collaboration, from single desks to private offices."
  - "**Expert-Led Programs:** Cutting-edge tech bootcamps and workshops led by industry experts to help you acquire in-demand skills and accelerate your career."
  - "**Inspiring Events:** A vibrant calendar of networking events, conferences, and meetups that connect you with leaders, investors, and peers."
- **"Get In Touch"** — H2 + flex row with mail icon + `yahyahub6@gmail.com` and phone icon + `07043925169`
- **"Join Our Community"** — centered, lucide `heart` icon (`text-destructive`, `h-10 w-10`) above H2 (`text-primary`) + paragraph: "Whether you're looking for a place to work, a skill to learn, or a network to grow with, you have a home at Yahya Hub. Become a part of our story today."

### 6.3 Programs page (`/programs`) — "Completed Programs"
- Back link (chevron-left + "Back") at top-left
- H1 "Completed Programs"
- Subtitle: "A look back at our previously offered programs and cohorts."
- 4 completed-program cards (same shape as home program cards but with "Completed" green badge and a cohort label + "0 seconds"/"7 days" duration):
  - Geographical Information System (GIS) — Cohort 3 — 0 seconds — ₦0
  - Geographical Information System (GIS) — Cohort 2 — 7 days — ₦0
  - Geographical Information System (GIS) — Cohort 1 — 7 days — ₦2,000
  - UX Workshop — Workshop — 0 seconds — ₦0
  - Description for GIS: "Gain practical skills in spatial data analysis, mapping, and geospatial technologies for real-world applications."
  - Description for UX Workshop: "Breaking into Ux Design in Nigeria Learn how to Start, Grow and Thrive"

### 6.4 Events page (`/events`) — "Past Events"
- Sub-header bar: "Back to Home" link (chevron-left) on left, H1 "Past Events" + subtitle "A look back at the gatherings, workshops, and conversations that have shaped Yahya Hub." on right
- 7 past event cards. Each card has: category badge (top-left, e.g., "Public Webinar", "Community Tournament", "Professional Conference", "Youth Training", "Entrepreneurial Mixer", "Community Event", "Webinar"), location-type badge (top-right, e.g., "Online" or "Physical"), optional "MOST RECENT" tag on the very first card, title (clickable, opens modal), description, audience (lucide `users` icon + text), date (lucide `calendar`), location (lucide `map-pin`), "Read More" / "Read Full Write-up" button, and an "Instagram Post"/"Instagram" link.
- The first card ("Building Green 101…") has a "Read Full Write-up" button (different from "Read More" on others) and an "Instagram Post" link.

  The 7 past events:

  | Title | Category | Mode | Date | Location | Audience |
  |---|---|---|---|---|---|
  | Building Green 101: Engineering, Architecture and Global Opportunities | Public Webinar | Online | May 23, 2026 | Google Meet | Civil Engineers, Architects, Urban Planners, Students, Built-Environment Professionals |
  | Games Night May Edition — Settle The Score | Community Tournament | Physical | May 22, 2026 | Yahya Hub | Gamers, Young Professionals, Students |
  | AI in Architecture — Yahya Hub x NIA | Professional Conference | Physical | May 21, 2026 | Yahya Hub | NIA Members, Architects, Built-Environment Professionals |
  | Kids Spring Break Tech Bootcamp | Youth Training | Physical | Apr 15, 2026 | Yahya Hub | Children and Young Learners |
  | From Ideas to Impact: Building Resilient Founders | Entrepreneurial Mixer | Physical | Apr 10, 2026 | Yahya Hub | Startup Founders, Entrepreneurs, Grant-Seekers |
  | Community Games Night | Community Event | Physical | Apr 5, 2026 | Yahya Hub | Gen Z, Young Professionals, Students |
  | Beyond the Hype: AI Security from the Ground Up | Webinar | Online | Apr 1, 2026 | Yahya Hub | Tech Professionals, Developers, Founders |

  Each "Read More" opens a modal with: category + mode badges, title, subtitle, audience row, **a long-form write-up paragraph** (the meaty recap text), date/time/location rows, **"FEE"** label + amount (₦0 for all), and a "View on Instagram" link.

  **Sample modal write-up (Games Night May Edition):**
  > "May's Games Night was a different beast entirely. Where April was a warm introduction, May delivered on the promise: a proper tournament. Two PS5 setups. Two separate brackets. FC26 on one screen, Mortal Kombat on the other. Sixteen tournament slots. Real prize money built from entry fees. Alongside the brackets, the room played Kahoot, with questions on Nigerian pop culture, football, and gaming, and Werewolf/Mafia for the non-tournament crowd. Two champions were crowned before the afternoon was done, and the room that came in competitive left feeling like a community. The tagline said it best: Two Arenas. Two Champions."

  **Sample modal write-up (Building Green 101 webinar):**
  > "Most built-environment professionals in Nigeria have heard the term 'green building.' Very few have had a clear, structured explanation of what it actually means and where they fit in it. Building Green 101 changed that. The webinar opened with a full anchor-led overview of the green building landscape. Its five key pillars, its areas of specialisation, and why the opportunity is significant for Nigerian professionals right now. Then the speaker took over. Adams Balade Abubakar, a COREN-certified civil engineer, Corporate Member of the Nigerian Society of Engineers, and PhD Candidate at the University of Ottawa, joined live to break down his field: sustainable structural materials, carbon reduction in construction, and his research into cement-free binders."

### 6.5 Blog page (`/blog`)
- Centered: a large icon (lucide — appears as `image`/`newspaper`), H1 "Coming Soon!", paragraph "Our team is working hard to bring you insightful articles and updates. Please check back later."

### 6.6 Privacy Policy (`/privacy`)
- H1 "Privacy Policy", "Last updated: June 16, 2026"
- 5 numbered H2 sections: 1. Introduction · 2. Information We Collect · 3. How We Use Your Information (with 5-bullet list) · 4. Disclosure of Your Information · 5. Contact Us
- Contact block with mail + phone icons/links.

### 6.7 Terms of Service (`/terms`)
- H1 "Terms of Service", "Last updated: June 16, 2026"
- 5 numbered H2 sections: 1. Acceptance of Terms · 2. Service Provision · 3. User Conduct · 4. Limitation of Liability · 5. Contact Us
- Same contact block.

### 6.8 Products index (`/products`)
- H1 "Products", subtitle "Discover the innovative products built at Yahya Hub."
- One product card: H2 "YH Connect", subtitle "A premier platform for connecting clients with verified professionals in the built environment.", "Learn More" link → `/products/yh-connect`.

### 6.9 YH Connect landing (`/products/yh-connect`)

**Secondary nav** (below the main header): a thin `border-b` bar, height 14, right-aligned, with three controls:
- **"Home"** button (wraps an `<a href="/products">`)
- **"Login"** dropdown (chevron-down) → menu items "As a Client" (`/client/login`) and "As a Talent" (`/talent/login`)
- **"Sign Up"** dropdown (chevron-down) → menu items "As a Client" (`/client/register`) and "As a Talent" (`/talent/register`)

**Hero:** H1 "Build with Confidence." + paragraph "YH Connect is the premier platform for connecting clients with verified professionals in the built environment. Find the right talent, manage your project, and achieve outstanding results, all in one place." + two CTA links: "Post a Project" (`/client/register`) and "Join as Talent" (`/talent/register`).

**"How It Works"** section: H2 + subtitle "A simple, transparent process for everyone." + 3-step row:
1. "1. Find or Post" — "Clients can post project details for bids or browse our directory of verified professionals. Talents can find opportunities that match their skills."
2. "2. Connect & Collaborate" — "Use our secure platform to communicate, agree on terms, and manage your project from kickoff to completion."
3. "3. Get It Done" — "Complete your project with confidence. Secure payments and a mutual rating system ensure accountability and quality."

**"Why Choose YH Connect?"** section: H2 + subtitle "Everything you need for a successful project." + 4 feature blocks:
- **Verified Professionals** — "Every talent on our platform is carefully vetted for skill, experience, and professionalism, giving you peace of mind."
- **Secure Payments** — "Our integrated payment system with escrow options ensures that funds are only released when milestones are met."
- **Flexible Project Management** — "Choose to manage your project directly or hand over the reins to our experienced in-house project managers."
- **Direct Communication** — "Use our built-in messaging to communicate seamlessly with your hired talent from start to finish."

**Two side-by-side panels:**
- **For Clients** — "Tired of unreliable contractors and project delays? Get access to a curated network of professionals. Post your project, receive competitive bids, and hire with confidence." + 3 bulleted features (each with check icon):
  - "Access to vetted architects, engineers, & artisans."
  - "Option for full project management by Yahya Hub."
  - "Transparent process with secure escrow payments."
  - CTA: "Get Started & Post Your Project"
- **For Talents** — "Stop searching for your next gig. Join a community where your skills are valued. Get verified, access exclusive projects, and build your professional reputation." + 3 bullets:
  - "Steady stream of project opportunities."
  - "Build your portfolio and professional brand."
  - "Fair compensation with secure and timely payments."
  - CTA: "Apply to Join Our Network"

**"Trusted by the Best"** section: H2 + subtitle "See what our users are saying about YH Connect." + 3 testimonial cards, each with 5 yellow stars + blockquote + avatar image + name + role:
1. ⭐⭐⭐⭐⭐ "Finding a reliable architect was a nightmare until I found YH Connect. The whole process was seamless and professional." — **Amina Jibril**, Homeowner & Client
2. ⭐⭐⭐⭐⭐ "As a freelance engineer, YH Connect has been a game-changer. I get consistent, high-quality projects without the hassle of marketing." — **David Okon**, Structural Engineer
3. ⭐⭐⭐⭐⭐ "The project management handover feature is brilliant. Yahya Hub managed our entire office renovation flawlessly." — **Fatima Bello**, Startup Founder

---

## 7. Authentication Flows

The site has **three distinct auth systems** (all Firebase email/password, all with the same visual language):

### 7.1 Admin login (`/admin/login`)
Standalone centered card (no main header/footer — just the logo at top):
- Logo image (clickable → home)
- Heading "Sign in to your account"
- Form: Email Address (textbox, required) · Password (textbox with eye-show/hide toggle button, required) · "Login" primary button
- "Back to Home" link (chevron-left)
- On failure: red Sonner toast "Login Failed" with message "Firebase: Error (auth/invalid-credential)."
- On success: redirects to `/admin/dashboard` (protected — I could not access content, but the route exists)

### 7.2 Client login (`/client/login`) & register (`/client/register`)
**Login** (`/client/login`) — same standalone-card layout:
- Heading "Client Login"
- Subtitle "Access your dashboard."
- Email + Password + "Login" + "Don't have an account? [Sign up]" (`/client/register`) + "Back to Home"

**Register** (`/client/register`) — standalone card:
- Heading "Create a Client Account"
- Subtitle "Join to find and manage top talent for your projects."
- Fields:
  - **Client Type** (Select dropdown): options `Individual` (default), `Company`, `Government Agency`
  - **Full Name** (placeholder "e.g., Bola John Bello")
  - **Email Address** (placeholder "Your email")
  - **Phone Number** (placeholder "e.g., 08012345678")
  - **Password** (placeholder "Your password", with eye toggle)
  - **Confirm Password** (placeholder "Your password again", with eye toggle)
  - **Address** (placeholder "Your address")
  - Checkbox "Agree to Terms and Conditions" + inline text "By checking this box, you agree to our [Terms of Service]."
  - "Create Account" primary button
- Footer: "Already have an account? [Log in]" + "Back to home"

### 7.3 Talent login (`/talent/login`) & register (`/talent/register`)
**Login** (`/talent/login`) — same standalone card:
- Heading "Talent Login"
- Subtitle "Access your talent dashboard."
- Email + Password + "Login" + "Don't have an account? [Sign up]" + "Back to home"

**Register** (`/talent/register`) — **multi-step** (Step 1 of N, with a Progress bar at top):
- Heading "Join Our Professional Network"
- Subtitle "Create your talent profile to get access to exclusive projects."
- `<Progress>` bar
- **Step 1: Account Information**
  - Full Name (placeholder "Your full name")
  - Phone Number (placeholder "Your phone number")
  - Email Address (placeholder "Your email address")
  - Password (placeholder "Choose password", eye toggle)
  - "Next" primary button
- Footer: "Already have an account? [Log in]" + "Back to home"
- (Subsequent steps were not reachable without submitting step 1, but presumably continue with professional info, portfolio, verification, etc.)

---

## 8. Interactive Flows (modals, bookings, payments)

### 8.1 Workspace booking — "Check Availability" button
Opens **"Schedule Your Visit"** dialog with:
- Title "Schedule Your Visit"
- Subtitle "Book {workspace_name}. Choose a daily or hourly rate."
- **Tabs:** `Daily` (default) | `Hourly`
- **Daily tab:** a month-calendar (Radix Calendar). Past dates and today-before are disabled. Past-month cell shows trailing days greyed. Navigation: "Go to previous month" (disabled if at current month) and "Go to next month" buttons. Below the calendar: selected price (e.g., "₦120,000"), duration ("1 day"), and a row of `[Clear]` `[Checkout]` buttons (both disabled until a date is selected).
- **Hourly tab:** three Select dropdowns (`Year`, `Month`, `Day`) followed by a vertical list of hour-slot buttons from `09:00` through `20:00` (each disabled if already booked). Same Clear/Checkout row.
- **Checkout button** → opens a second dialog "Review Your Booking":
  - Title "Review Your Booking"
  - Subtitle "Review your details for {workspace_name} before payment."
  - Summary: price, duration, selected date(s)
  - A remove/clear icon button
  - Form: Name · Phone · Email · **"Reason for booking"** select (options: `Private Meeting`, `Seminar`, `Workshop`, `Events`)
  - Paystack logo image (the actual payment brand mark)
  - `[Back]` `[Pay Now]` buttons

### 8.2 Workspace "View Space" button
Opens a simple image dialog with just: H2 = workspace name, the workspace photo, and a "Close" button. (No carousel/gallery UI was observed — single image per workspace.)

### 8.3 Workspace "+N more" amenities button
Opens **"All Amenities"** modal: grid of all amenities, each with a `circle-check` lucide icon + label (e.g., "50 Chair", "6 Desk", "Projector", "Whiteboard").

### 8.4 Program "Enroll Now" button
Opens **"Enroll in {Program Name}"** dialog. **Two-step flow:**

**Step 1** — "Let's get to know you! Enter your contact information":
- Program name + price + duration display
- Form fields: Full Name · Email · Phone Number
- "Next" primary button

**Step 2** — "Tell us more about yourself & complete your payment":
- Program name + price + duration display
- Form fields: **Gender** (Select dropdown: `Male` / `Female`) · **Educational Level** (free-text)
- Paystack logo image
- `[Back]` `[Pay Now]` buttons

### 8.5 Event "Book a Spot" button
Opens **"Book a Spot for {Event Name}"** dialog (single step for free events):
- Subtitle "Fill in your details to reserve your place at this event."
- Price display (e.g., "Free") + event category (e.g., "Conference")
- Form fields: Full Name · **Gender** (Select: Male/Female) · Email · Phone Number
- `[Cancel]` `[Register Free]` buttons (for free events)

### 8.6 Event card / "Read More" — past events
Clicking the event title or "Read More" button on a past-event card opens the **Event Details Modal** (see §6.4 for content shape).

### 8.7 Mobile menu
Hamburger button toggles a Radix Sheet (slides in from the side) containing the same nav as a `<ul>` with `<li>` items.

### 8.8 Notifications
Sonner toaster, bottom-right. Triggers observed:
- "Login Failed" — "Firebase: Error (auth/invalid-credential)." (red/error variant)
- "Access Denied" — "You do not have permission to access this page." (when hitting a protected route while logged out)
- (Likely also success toasts on booking/enrollment/payment — not triggered during exploration)

Pressing **F8** opens/focuses the notifications region (Sonner shortcut).

---

## 9. Data Structures (inferred)

### `Workspace`
```ts
{
  id: string
  name: string                    // "Program/ Event space", "workspace", "Office of One"...
  description: string
  type: string                    // "workspace" or "Program/ Event space"
  rating: number                  // 4.5, 4.6, 4.8...
  reviewCount: number             // 10, 150, 75...
  amenities: Array<{ icon: string, label: string }>   // e.g. [{icon:'armchair', label:'50 Chair'}, ...]
                                        // icons are lucide names: armchair, desk, armchair, sofa, tv...
  hourlyRate: number              // Naira
  dailyRate: number               // Naira
  imageUrl: string                // Firebase Storage URL
  bookingEnabled: boolean         // false → "Check Availability" disabled (Office of One)
}
```

### `Program`
```ts
{
  id: string
  name: string                    // "Adult Classes", "Kids Program", "Highschool Leavers"
  description: string
  category: string                // displayed as second metadata (== name here)
  duration: string                // "2 months", "1 month"
  price: number                   // Naira; 0 = Free
  status: 'upcoming' | 'completed'
  cohort?: string                 // "Cohort 1", "Cohort 2"... (for completed)
  type?: string                   // "Workshop"
  enrollable: boolean             // true on home (upcoming), false on /programs (completed)
}
```

### `Event`
```ts
{
  id: string
  title: string
  description: string
  longWriteUp?: string            // only on past events
  category: string                // "Public Webinar", "Community Tournament", "Professional Conference",
                                  // "Youth Training", "Entrepreneurial Mixer", "Community Event", "Webinar"
  mode: 'Online' | 'Physical'
  isMostRecent?: boolean
  status: 'ongoing' | 'upcoming' | 'past'
  date: string                    // ISO/date string formatted "Nov 21, 2026"
  time: string                    // "10:00 AM - 01:00 PM"
  location: string                // "Yahya Hub", "Google Meet"
  audience: string
  fee: number                     // Naira; 0 = Free
  instagramUrl: string
  bookable: boolean               // false for "ongoing"
}
```

### `Client` (YH Connect)
```ts
{
  uid: string
  clientType: 'Individual' | 'Company' | 'Government Agency'
  fullName: string
  email: string
  phone: string
  address: string
  // dashboard likely has: projects[], payments[], messages[]
}
```

### `Talent` (YH Connect) — multi-step registration implies a richer schema
```ts
{
  uid: string
  fullName: string
  phone: string
  email: string
  password: string                // (handled by Firebase Auth, not stored in Firestore)
  // Step 2+ (inferred): profession, skills, portfolio links, certifications,
  //                       verification documents, hourly rate, bio, profile photo...
}
```

### `Admin`
```ts
{ uid: string, email: string, role: 'admin' }
// /admin/dashboard likely manages: workspaces, programs, events, bookings, enrollments, users
```

### `Booking` (workspace)
```ts
{
  id: string
  workspaceId: string
  userId?: string                 // optional (guest bookings allowed)
  mode: 'daily' | 'hourly'
  dates: string[]                 // ISO dates
  hours?: string[]                // ['09:00','10:00',...]
  name: string
  phone: string
  email: string
  reason: 'Private Meeting' | 'Seminar' | 'Workshop' | 'Events'
  amount: number
  paymentStatus: 'pending' | 'paid'
  paystackRef?: string
}
```

### `Enrollment` (program)
```ts
{
  id: string, programId: string,
  fullName: string, email: string, phone: string,
  gender: 'Male' | 'Female',
  educationalLevel: string,
  amount: number, paymentStatus, paystackRef
}
```

---

## 10. Images & Media Assets

All served from Firebase Storage. Confirmed URLs:

| Asset | URL | Used on |
|---|---|---|
| **Logo** (SVG, 40×40) | `https://firebasestorage.googleapis.com/v0/b/yahyahub-e7643.firebasestorage.app/o/bookings-n-products%2Flogo%2Flogo.svg?alt=media&token=ab0d0a31-9584-43f1-bc95-2a8c66473a8c` | Header on every page, auth pages |
| **Hero background video** (MP4) | `https://firebasestorage.googleapis.com/v0/b/yahyahub-e7643.firebasestorage.app/o/bookings-n-products%2Fhero%2Fvideo%2Fyahya_hub_commercial.mp4?alt=media&token=24f59eeb-8203-4a75-8763-0c1d4454b9b7` | Home hero |
| **Paystack logo** (PNG) | `https://firebasestorage.googleapis.com/v0/b/yahyahub-e7643.firebasestorage.app/o/bookings-n-products%2Flogo%2Fpaystack-logo.png?alt=media&token=361ababc-d652-4a55-b56c-86b87f25f62a` | Booking/enroll checkout steps |
| **Co-working space image** (JPEG) | `https://firebasestorage.googleapis.com/v0/b/yahyahub-e7643.firebasestorage.app/o/bookings-n-products%2Fworkspaces%2Fco-working_space.jpeg?alt=media&token=6f46057d-8c94-48ad-a5fb-f1f320bedb6c` | "workspace" card View Space modal |
| **Executive Office image** (JPG) | `https://firebasestorage.googleapis.com/v0/b/yahya-hub-backed.firebasestorage.app/o/Yahya%20Hub%20Web%20App%2FStatic%20Assets%2Fworkspaces%2Fexecutive-office.jpg?alt=media&token=24266ec3-18df-459a-8057-041db5cbdb41` | Executive Office View Space modal |

**Two storage buckets are in use:**
1. `yahyahub-e7643` (primary, new app) — paths under `bookings-n-products/{logo,hero,workspaces,...}/`
2. `yahya-hub-backed` (legacy) — paths under `Yahya Hub Web App/Static Assets/workspaces/`

All other images observed in the UI are **inline Lucide SVG icons** (rendered as `<svg>` directly in the DOM, not `<img>`). Confirmed icons used: `mail`, `phone`, `signal`, `zap`, `thermometer`, `briefcase-business`, `image`, `star`, `armchair`, `desk`, `sofa`, `tv`, `users`, `clock`, `calendar`, `map-pin`, `menu`, `x`, `chevron-down`, `chevron-right`, `chevron-left`, `circle-check`, `lightbulb`, `telescope`, `heart`, `eye`, `eye-off`, `arrow-left`, `arrow-right`.

**Favicon:** `/favicon.ico` (Next.js default location).

---

## 11. Special Features / Notable Behaviors

1. **Timezone-gated booking UI.** The Workspaces section's "Check Availability" buttons only render real calendar UIs when `Intl.DateTimeFormat().resolvedOptions().timeZone === 'Africa/Lagos'`. Otherwise, every workspace card is replaced with a "Timezone Mismatch" warning card (amber-50 bg) instructing the user to set their system timezone to Central Africa Time. **Rebuild note:** if you want non-Nigeria visitors to see the calendar, you'll need to either (a) replicate this gating for parity, or (b) drop the gate entirely and accept the user's local timezone — but then daily/hourly slot availability would need timezone conversion logic server-side.

2. **Paystack payment integration.** The Paystack logo appears on the final checkout step of both workspace bookings and program enrollments. The "Pay Now" button presumably initializes a Paystack inline popup or redirect. (Not triggered during exploration to avoid real charges.)

3. **Firebase real-time listeners.** Firestore Listen channels are open on every page — the site subscribes to live updates for workspaces, programs, events (so admin changes reflect instantly).

4. **Hidden admin entry point.** The footer's Legal column has a third link whose visible text is just "." but whose `href` is `/admin/login`. Discreet admin access.

5. **Three role-based dashboards.** `/admin/dashboard`, `/client/dashboard`, `/talent/dashboard` all exist but are protected. Hitting them while logged out redirects to the role's login page AND fires an "Access Denied" Sonner toast.

6. **Distinct YH Connect sub-app.** The `/products/yh-connect` page and everything under `/client/*` and `/talent/*` form a semi-separate product with its own secondary navigation bar (Home/Login/Sign Up) rendered *below* the main Yahya Hub header. The visual language is the same (same colors, fonts, components).

7. **Multi-step talent registration** with a progress bar — at least 2 steps (Step 1: Account Information collected).

8. **Status badges with semantic colors:**
   - Green (`bg-green-500/20 text-green-600 border-green-500/30`): "Operational", "Ongoing", "Online", "Physical"
   - Yellow (`bg-yellow-500/20 text-yellow-600 border-yellow-500/30`): "Upcoming", "hours"
   - The "MOST RECENT" tag on the first past event is also a styled badge.

9. **Sonner toaster** with F8 shortcut to focus the notification region. Toasts have title + description + dismiss button.

10. **Responsive design:**
    - Header collapses to hamburger below `md` (768px)
    - Hero status cards become a 4-button carousel on mobile (vs 2×2 grid on desktop)
    - Workspace/Program/Event grids: 1 col mobile → 2 col tablet → 3 col desktop
    - Footer: 1 col mobile → 4 col desktop
    - YH Connect "For Clients"/"For Talents" panels stack on mobile

11. **Card hover states.** Titles of program/event cards have `hover:underline cursor-pointer` (clickable to open modals on past-events, less clearly so on home program cards).

12. **"Completed" / "Past" links** in the home page section headers are subtle text + chevron-right links to `/programs` and `/events` respectively — a consistent "see all" pattern.

---

## 12. Recommendations / Notes for Rebuilding in Next.js

- **Stack to use:** Next.js 14+ App Router, Tailwind CSS, shadcn/ui (Radix primitives), lucide-react, Sonner, Firebase Auth + Firestore + Storage, Paystack JS SDK.
- **Fonts:** Load Inter from `next/font/google` with weights 400, 500, 600, 700 and apply as the default sans-serif via Tailwind config (`fontFamily: { sans: ['var(--font-inter)', 'sans-serif'] }`).
- **Theme:** Reproduce the CSS variables exactly (see §4) — they map 1:1 to shadcn/ui's token system. The hover color `#013756` (slightly lighter than primary `#013156`) is hard-coded on nav links — replicate or replace with `text-primary`.
- **Components to build first:** `Header`, `Footer`, `WorkspaceCard`, `ProgramCard`, `EventCard`, `BookingModal` (with Daily/Hourly Tabs + Calendar), `EnrollModal`, `EventDetailsModal`, `AmenitiesModal`, `StatusBadge`, `StarRating`, `SecondaryNav` (for YH Connect).
- **Calendar component:** Use `react-day-picker` (what shadcn/ui's Calendar wraps). Replicate the daily (full month grid) and hourly (3 selects + slot button list) modes.
- **Auth:** Use Firebase JS SDK `signInWithEmailAndPassword` + `createUserWithEmailAndPassword`. For the talent multi-step form, use a client-side state machine + `react-hook-form` for validation.
- **Protected routes:** Server-side (middleware) or client-side redirect with `toast.error("Access Denied", { description: "You do not have permission to access this page." })`.
- **Timezone gate:** Decide whether to keep it (strict Nigeria-only) or drop it (international-friendly). If keeping, check `Intl.DateTimeFormat().resolvedOptions().timeZone` and conditionally render the mismatch card.
- **Currency formatting:** Prices are in Naira with the `₦` prefix and thousands separators — use `Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })` or hard-code `₦` + `toLocaleString()`.
- **Date formatting:** "Nov 21, 2026" style → `Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })`.
- **Firebase Storage:** Use the same bucket structure or consolidate into one. Image URLs include long tokens — for the clone, use Firebase Storage SDK to generate signed URLs or make buckets public.
- **Pages to stub first (MVP):** `/`, `/about`, `/products/yh-connect`, then booking/enroll/event-detail modals, then `/programs` & `/events` list pages, then auth pages, then dashboards last.

---

## 13. Screenshot Index

All saved in `/home/z/my-project/screenshots/`:

| File | Description |
|---|---|
| `00-products-dropdown.png` | Products dropdown open on home (showing "YH Connect") |
| `01-home-full.png` | Home page full (with timezone-mismatch cards) |
| `02-about-full.png` | About page full |
| `03-programs-full.png` | Programs (Completed) page full |
| `04-events-full.png` | Events (Past) page full |
| `05-event-modal.png` | Event details modal (Games Night May Edition) |
| `06-blog-full.png` | Blog "Coming Soon" page |
| `07-privacy-full.png` | Privacy Policy page |
| `08-terms-full.png` | Terms of Service page |
| `09-yh-connect-full.png` | YH Connect landing page full |
| `10-login-dropdown.png` | Login dropdown (As a Client / As a Talent) |
| `11-client-login.png` | Client login page |
| `12-client-signup.png` | 404 page (from `/client/signup`) |
| `13-client-register.png` | Client registration form |
| `14-signup-dropdown.png` | Sign Up dropdown |
| `15-talent-register.png` | Talent registration Step 1 |
| `16-talent-login.png` | Talent login page |
| `17-admin-login.png` | Admin login page |
| `18-enroll-program.png` | Home after clicking Enroll Now |
| `19-enroll-modal.png` | Enroll modal Step 1 (contact info) |
| `20-enroll-modal-step2.png` | Enroll modal Step 2 (gender, education, Paystack) |
| `21-book-spot.png` | Book a Spot modal for event |
| `22-home-with-workspaces.png` | Home page with timezone override applied (real workspace cards visible) |
| `23-check-availability.png` | Booking calendar modal (Daily tab, no date selected) |
| `24-calendar-selected.png` | Calendar with a date selected |
| `25-checkout.png` | Review Your Booking modal (form + Paystack) |
| `26-hourly-tab.png` | Booking modal Hourly tab (year/month/day selects + hour slots) |
| `27-view-space.png` | View Space image modal |
| `28-home-mobile.png` | Home page on mobile (375×812) |
| `29-mobile-menu.png` | Mobile hamburger menu open |
| `30-events-full-tz.png` | Events page (with tz set) |
| `31-webinar-writeup.png` | Webinar event details modal (long write-up) |
| `32-programs-full-tz.png` | Programs page (with tz set) |
| `33-admin-redirect.png` | 404 from `/admin` |
| `34-products.png` | Products index page |
| `35-executive-view-space.png` | Executive office card view |
| `36-home-final.png` | Final home page state |

---

## 14. Appendix — Sample HTML snippets (for pixel-faithful rebuild)

### Header logo + nav
```html
<a class="flex items-center gap-2" href="/">
  <img alt="Yahya Hub Logo" width="40" height="40"
       src=".../bookings-n-products/logo/logo.svg?alt=media&token=...">
  <span class="text-xl font-bold text-primary">Yahya Hub</span>
</a>
<nav class="hidden items-center space-x-6 md:flex">
  <a class="font-medium text-gray-700 transition-colors hover:text-[#013756] hover:underline hover:underline-offset-4" href="/about">About Us</a>
  <a class="font-medium text-gray-700 transition-colors hover:text-[#013756] hover:underline hover:underline-offset-4" href="/#workspaces">Workspaces</a>
  <a class="font-medium text-gray-700 transition-colors hover:text-[#013756] hover:underline hover:underline-offset-4" href="/#programs">Programs</a>
  <a class="font-medium text-gray-700 transition-colors hover:text-[#013756] hover:underline hover:underline-offset-4" href="/#events">Events</a>
  <button class="group flex items-center gap-1 font-medium text-gray-700 hover:text-[#013756]" aria-haspopup="menu">
    Products
    <svg class="lucide lucide-chevron-down h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180">...</svg>
  </button>
</nav>
```

### Hero CTAs
```html
<a class="bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8" href="/#workspaces">Explore Workspaces</a>
<a class="border h-11 rounded-md px-8 border-white text-white hover:bg-white hover:text-black" href="/#programs">Our Programs</a>
```

### Status badge (green variant)
```html
<div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
            bg-green-500/20 text-green-600 border-green-500/30 capitalize">Operational</div>
```

### Card (workspace / program / event)
```html
<div class="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col">
  <div class="flex flex-col p-6 space-y-3">
    <div class="flex justify-between items-start">
      <div class="tracking-tight text-xl font-semibold text-foreground">Office of Two</div>
      <button class="border h-9 rounded-md px-3 shrink-0 hover:bg-secondary">
        <svg class="lucide lucide-image mr-1 h-4 w-4"/>
        View Space
      </button>
    </div>
    <div class="line-clamp-2 text-sm text-foreground">A private office designed for two...</div>
  </div>
  <div class="p-6 pt-0 flex-grow"><!-- metadata row --></div>
  <div class="px-6 pb-4"><div class="shrink-0 bg-border h-[1px] w-full"></div></div>
  <div class="p-6 pt-0 flex justify-between items-center mt-auto">
    <p class="text-xl font-bold text-foreground">₦1,000 <span class="text-sm font-normal">/hour</span></p>
    <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Check Availability</button>
  </div>
</div>
```

### Footer
```html
<footer class="border-t bg-background">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
      <div>
        <h3 class="font-bold">Contact</h3>
        <div class="mt-4 space-y-3 rounded-lg border bg-muted/50 p-4 text-sm">
          <a href="mailto:yahyahub6@gmail.com" class="flex items-center gap-3 text-muted-foreground hover:text-foreground">
            <svg class="lucide lucide-mail h-4 w-4 shrink-0 text-secondary"/> yahyahub6@gmail.com
          </a>
          <a href="tel:07043925169" class="flex items-center gap-3 text-muted-foreground hover:text-foreground">
            <svg class="lucide lucide-phone h-4 w-4 shrink-0 text-secondary"/> 07043925169
          </a>
        </div>
      </div>
      <div><h3 class="font-bold">Community</h3>
        <ul class="mt-4 space-y-2">
          <li><a class="text-muted-foreground hover:text-foreground" href="/#programs">Programs</a></li>
          <li><a class="text-muted-foreground hover:text-foreground" href="/#events">Events</a></li>
          <li><a class="text-muted-foreground hover:text-foreground" href="/blog">Blog</a></li>
        </ul>
      </div>
      <div><h3 class="font-bold">Social</h3>
        <ul class="mt-4 space-y-2">
          <li><a class="text-muted-foreground hover:text-foreground" href="...facebook...">Facebook</a></li>
          <li><a class="text-muted-foreground hover:text-foreground" href="...x.com/YahyaHub...">Twitter</a></li>
          <li><a class="text-muted-foreground hover:text-foreground" href="...linkedin...">LinkedIn</a></li>
        </ul>
      </div>
      <div><h3 class="font-bold">Legal</h3>
        <ul class="mt-4 space-y-2">
          <li><a class="text-muted-foreground hover:text-foreground" href="/privacy">Privacy</a></li>
          <li><a class="text-muted-foreground hover:text-foreground" href="/terms">Terms</a></li>
          <li><a class="text-muted-foreground hover:text-foreground" href="/admin/login">.</a></li>
        </ul>
      </div>
    </div>
    <div class="mt-8 border-t pt-8 text-center text-muted-foreground">
      <p>© 2026 Yahya Hub. All rights reserved.</p>
    </div>
  </div>
</footer>
```

---

**End of analysis.** This document, combined with the 36 screenshots in `/home/z/my-project/screenshots/`, should serve as a complete spec for rebuilding the Yahya Hub site in Next.js.
