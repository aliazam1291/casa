# Wolf Casa — Build Plan for Claude Code
### Handoff package: brand → IA → design system → prototype → production build

## What's in this handoff
1. `Wolf_Casa_Website_IA.md` — full information architecture, nav, page templates, phased rollout (from the brand deck analysis)
2. `Wolf_Casa_Design_System.md` — color/type/spacing/component tokens
3. `Wolf_Casa_3D_Concept.md` — the home hero's 3D concept and production upgrade path
4. `wolf-casa-homepage.html` — a working, self-contained prototype of the homepage (vanilla HTML/CSS/Three.js) demonstrating the design language and the 3D hero interaction. **This is a design reference, not the production codebase** — Claude Code should rebuild it properly in the stack below, not just deploy this file.

Read all four before writing any code. The design tokens and the 3D mood-mechanic in particular are meant to be carried over exactly, not reinterpreted.

---

## Recommended stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR/SSG for SEO — the brand deck's own playbook leans hard on SEO/AEO/GEO discoverability; a client-only SPA works against that goal |
| 3D | React Three Fiber + drei | Declarative, integrates with React state (the World mood-switch is just state), large ecosystem for the Phase 2/3 upgrades in the 3D concept doc |
| Styling | CSS Modules or vanilla-extract with the token file as the single source of truth | Avoid a generic Tailwind utility soup — this is a bespoke editorial brand; hand-authored CSS matching the token doc keeps the "quiet luxury" restraint intact |
| Animation | Framer Motion (page/section reveals) + native R3F for the 3D layer | |
| CMS | Headless (Sanity or Contentful) for The Journal, Signature Reveal gallery, and the Named Object catalogue | Non-technical team needs to publish editorial content and new objects/compositions without a deploy |
| Forms/lead capture | Room Audit, Consultation booking, Furniture Tourism application, Trade request — all need a backend target (CRM or simple serverless function + email/WhatsApp webhook) | This is the actual revenue path per the 90-day plan; don't leave these as static mailto forms |
| Hosting | Vercel (pairs natively with Next.js) | |

---

## Folder structure (App Router)

```
/app
  /(marketing)
    page.tsx                    → Home
    /way-of-light-form/page.tsx
    /the-wolf-way
      page.tsx                  → Worlds landing
      /[world]/page.tsx         → World page (5 worlds)
      /[world]/[composition]/page.tsx   → Composition/room page
      /object/[slug]/page.tsx   → Named Object PDP
    /experiences
      page.tsx
      /consultation/page.tsx
      /materials-library/page.tsx
      /furniture-tourism/page.tsx     → Casa Sojourn application flow
      /signature-reveal/page.tsx
      /signature-evenings/page.tsx
    /journal
      page.tsx
      /[slug]/page.tsx
    /the-house/page.tsx
    /trade/page.tsx              → Specifier Desk request-access
    /visit/page.tsx
  /api
    /lead-capture/route.ts       → Room Audit / consultation / trade forms
/components
  /three
    ComposedRoomHero.tsx         → port of wolf-casa-homepage.html's scene
    WorldMoodProvider.tsx        → shared mood-state context (color targets, active world)
  /nav, /footer, /world-card, /journal-card, /world-pill, /button ...
/lib
  /tokens.ts                     → design tokens as typed constants, mirrors Wolf_Casa_Design_System.md
  /cms.ts                        → CMS client
/content (if using a git-based CMS instead of hosted)
```

---

## Build phases (mirrors the IA doc's 30/90/180/365 roadmap — do not reorder)

### Phase 1 — Foundation
- Design tokens implemented as the single CSS/theme source
- Home, Way of Light & Form, The Wolf Way skeleton (5 World pages + 12 Named Object pages, using placeholder photography if real shoots aren't ready)
- 3D hero ported to R3F per `Wolf_Casa_3D_Concept.md` Phase 1
- Visit page, basic Trade request form
- Analytics + SEO metadata scaffolding (this matters — the brand's own plan is search/AEO/GEO-driven)

### Phase 2 — Conversion
- Signature Consultation booking flow (real calendar/lead backend, not a static form)
- Room Audit / Composition Finder quiz, wired to lead capture
- Furniture Tourism / Casa Sojourn application page live, with the day-by-day itinerary and 11-step sourcing pipeline from the IA doc

### Phase 3 — Authority
- The Journal fully populated via CMS, organized by the 9 content pillars
- Knowledge Unplugged series
- First Signature Reveal gallery entries (video-forward)

### Phase 4 — Leadership
- Signature Evenings + Signature Circle
- Full Specifier/Builder web app (login, catalogues, samples, quotation requests, project basket — currently just a request-access form in Phase 1)
- Podcast archive with embeds

---

## Non-negotiables to carry through every phase
- **Compositions, not SKUs** — no page in `/the-wolf-way` should ever present a bare product grid without its World/Composition framing above it.
- **One accent color globally** (brass) — World mood colors are scoped only to their own World/Composition pages and the homepage hero, never bleeding into global nav/buttons.
- **Every interactive component ships all states** (default/hover/focus-visible/disabled/error/loading) per `Wolf_Casa_Design_System.md` §5 — this is a review gate, not a nice-to-have.
- **Accessibility & performance for the 3D layer** are explicit requirements in `Wolf_Casa_3D_Concept.md`, not follow-up work — reduced-motion handling, WebGL fallback, and disposal on unmount ship with Phase 1, not retrofitted later.
- **Confirm the World/Composition naming resolution** (flagged in the IA doc) with the brand team before Phase 1 content entry — it determines the URL structure (`/the-wolf-way/[world]/[composition]`) and can't be cheaply restructured once content and links exist.

---

## Assets still needed from the brand side before Phase 2
- Logo/wordmark (noted as pending)
- Real photography or glTF models for the 12 Named Objects and 5 Worlds (the 3D hero and PDPs currently use placeholder geometry/gradients)
- Signature Reveal video content
- Director portraits and bios for The House
- Podcast recordings, once that program starts producing episodes
