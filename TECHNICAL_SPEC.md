# Apollo Adventure Park — Technical Specification

Derived from `Apollo Adventure Park.pdf` (Website Requirements and Specifications). This document translates the business/UX requirements into an implementable architecture.

## 1. System Overview

A responsive web application (with holographic-display and legacy-ocular-sensor rendering paths) composed of:

- **Ticketing service** — pricing engine, checkout, ticket issuance/delivery
- **POI content service** — attractions, shops, restaurants; dynamic status (wait times, closures, pricing)
- **Content/CMS layer** — welcome page events, holidays/lunar cycle calendar, contact routing
- **Media pipeline** — image/video/holographic asset delivery
- **Accessibility & rendering layer** — theming, vision-mode adaptation, input-method abstraction

```
┌─────────────┐   ┌──────────────┐   ┌───────────────┐
│  Client Apps │──▶│   API Gateway │──▶│  Core Services │
│ (web/holo/   │   │ (REST/GraphQL)│   │ - Ticketing    │
│  ocular/     │   └──────────────┘   │ - POI/Content  │
│  tactulus)   │                      │ - Pricing      │
└─────────────┘                      │ - Notifications │
                                       └───────┬────────┘
                                               ▼
                                       ┌───────────────┐
                                       │  Data Stores   │
                                       │ - Postgres     │
                                       │ - Media/CDN    │
                                       └───────────────┘
```

## 2. Ticket Purchasing System

### 2.1 Pricing Engine
Inputs: base rate, date/day-of-week, projected capacity (live occupancy forecast), lunar holiday calendar flag, patron age/species, group size.

```
final_price = base_price
            × day_of_week_multiplier
            × capacity_multiplier
            × (1 - eligible_discount_pct)   // discounts excluded on holiday flag
            + lunar_tax (5.000% of subtotal)
```

Discount rules (mutually exclusive, highest applicable wins unless business confirms stacking):
| Discount | Rate | Eligibility | Holiday exclusion |
|---|---|---|---|
| Child | 25% | Terran <12 or Centaurian <14 | Yes |
| Senior | 30% | Terran 65+ or Centaurian 70+ | Yes |
| Group | 15% | Party of 10+ ("cranial appendages or equivalents") | Not specified — confirm with stakeholder |

**Open question:** species field must be captured at checkout to apply correct age-bracket rules — needs a `species` enum (`terran`, `centaurian`, extensible) on the patron/ticket record.

### 2.2 Checkout & Tax Display
- Itemized real-time breakdown: base price → discounts → fees → Lunar Tax Authority (5.000%, stored as a configurable rate, not hardcoded, since tax authorities change rates)
- Currency/unit formatting must localize to the viewing device's unit system (see §5)

### 2.3 Ticket Issuance & Delivery
Delivery channels (multi-select at checkout):
1. Email (PDF/HTML ticket)
2. Device download (native file, QR-embedded)
3. Cybernetic implant transit via **eMAC code** (requires a secure short-lived transfer protocol — treat as a signed, single-use token pushed to the implant's receiver endpoint; do not conflate with QR/Holocube codes below)

Every ticket, regardless of channel, embeds:
- **QR code** (standard contactless scan)
- **Holocube Code** (volumetric code for holographic scanners)

Both codes should encode the same signed ticket-ID payload (JWT or equivalent) so either can independently validate at any gate reader.

## 3. Point-of-Interest (POI) Pages

Each POI (attraction, shop, restaurant) is a content entity:

```json
{
  "id": "uuid",
  "type": "attraction | shop | restaurant",
  "name": "string",
  "media": { "images": ["..."], "video": "...", "holo_upscale_asset": "optional 3D/volumetric asset" },
  "description": { "text": "string", "voiceover_audio": "url" },
  "wait_time_minutes": "number, converted to viewer's local time unit",
  "status": "open | closed | under_construction",
  "pricing": [{ "item": "string", "price": "decimal" }],
  "updated_at": "timestamp"
}
```

Source assets on hand map directly to POI entries, e.g.:
- `Rover Coaster.jpg`, `Bumper Saucers.jpg`, `Crater Cruiser.jpg`, `Starship Spinner.jpg`, `Buzz's Bounce House.jpg` → attractions
- `Moon Dust Emporium.jpg` → shop
- `Moonshots Tavern.jpg` → restaurant
- `Glorvok and the Snargulettes.jpg`, `Interstellar Dogs.jpg` → likely show/character or additional attraction entries (confirm categorization with stakeholder)
- `intro.mp4`, `moon-zoom.mp4`, `moon-approach.mov` → welcome/park-wide media, not per-POI
- `logo.jpg`, `logo-mesh.stl`, `lunar-mesh.stl` → branding and holographic/3D-print-grade meshes for holo-projection rendering

**Dynamic updates:** POI status, wait times, closures, and pricing need a write path for park operations staff (internal admin tool or CMS) with the storefront reading via cache-backed API (short TTL, e.g. 30–60s, given real-time wait-time requirement).

## 4. User Interface

### 4.1 Theming ("Regolithic")
```css
:root {
  --color-fg-primary: #E8E8E8;
  --color-fg-secondary: #787878;
  --color-accent: #0000D0;
  /* dark, space-themed backgrounds: nebula/interstellar imagery, not flat black */
}
```
Design tokens should be centralized (CSS custom properties or equivalent theme object) so the same palette drives web, holographic, and ocular-sensor renderers.

### 4.2 Responsive / Multi-Surface Rendering
Target surfaces: large screens, holographic smart watches, older-generation ocular sensors, touch screens, Tactulus (variable-depth) screens.

Recommend a rendering abstraction layer with per-surface adapters:
- **Standard web** — responsive HTML/CSS breakpoints
- **Holographic** — volumetric layout using the `.stl` mesh assets for 3D UI elements/logo
- **Legacy ocular sensors** — degrade gracefully to a low-bandwidth/low-fidelity text+image mode
- **Tactulus** — supports variable depth presentation; UI needs a z-depth layer model, not just x/y

### 4.3 Accessibility
- Color/vision: optimize for tetrachromatic vision, with a dichromatic-safe fallback palette (don't rely on hue alone for state — pair with icon/shape/pattern)
- Standards: compliant with newest IWCAG draft — treat as a living target; re-audit on each IWCAG draft revision
- Touch: hit-target sizing and gesture timing tolerant of varying finger sizes/motor control speeds (generous touch targets, adjustable/no strict timing windows)
- Tactulus: depth-aware focus/interaction model

## 5. User Experience

- **Welcome page**: current events feed, combining Earth holidays, otherworld holidays, and lunar cycle phase — needs a unified events/calendar service merging multiple calendar sources
- **Navigation**: tactile (standard touch/click) and mental (BCI/telepathic input) — UI navigation graph should be input-method agnostic (semantic focus/selection model, not mouse/touch-only)
- **Contact page**: routes to support via email, HoloPhone, and telepathic channel — needs a channel-routing abstraction so support staff triage from one queue regardless of inbound channel
- **Tranquillity Inn floor plans**: suite floor plans with a note that they exceed IRHA standards, plus IRHA badge displayed adjacent to the claim (compliance/legal copy — content-managed, not hardcoded)
- **Park map**: both flat image and holographic renderings — holographic map likely built from `lunar-mesh.stl`

## 6. Open Questions for Stakeholders

1. Does the 15% group discount get excluded on holidays like child/senior discounts, or does it stack?
2. Discount stacking rules in general (e.g., senior + group)?
3. What counts as a "lunar holiday" — is there an authoritative calendar/API source?
4. eMAC cybernetic-implant transit — is there an existing protocol/SDK to integrate against, or does this need to be built?
5. Categorization confirmation for `Glorvok and the Snargulettes.jpg` and `Interstellar Dogs.jpg` (attraction vs. show vs. dining).
6. Source/version of "newest IWCAG draft standards" to target for accessibility compliance.

## 7. Suggested Stack (pending team conventions)

- Frontend: component-based SPA/SSR framework with theme-token support and a pluggable renderer per surface (web/holo/ocular/Tactulus)
- Backend: REST or GraphQL API gateway over discrete services (Ticketing, POI/Content, Pricing, Notifications)
- Data: Postgres for transactional data (tickets, pricing rules, POI records); CDN/object storage for media and `.stl` mesh assets
- Real-time: pub/sub or short-TTL cache for wait-time/closure updates
