# Implementation Plan
## Insurance Lead Generation Website (Next.js + TypeScript)

**Companion to:** PRD-Insurance-Lead-Gen-Website.md
**Target timeline:** 10–14 working days

---

## 1. Project Setup (Day 1)

- [ ] Init repo: `npx create-next-app@latest --typescript --tailwind --app --eslint`
- [ ] Set up folder structure (below)
- [ ] Configure ESLint + Prettier
- [ ] Install core deps:
  ```
  npm i react-hook-form zod @hookform/resolvers resend
  npm i -D @types/node
  ```
- [ ] Set up Git repo, connect to Vercel project (preview deployments from day 1)
- [ ] Create `.env.local` with placeholders: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `WHATSAPP_NUMBER`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

### Folder Structure
```
app/
  layout.tsx
  page.tsx                  # Home
  about/page.tsx
  services/page.tsx
  why-choose-us/page.tsx
  faq/page.tsx
  contact/page.tsx
  api/
    contact/route.ts        # email send handler
  sitemap.ts
  robots.ts
  not-found.tsx
components/
  layout/  (Header, Footer, WhatsAppButton)
  ui/      (Button, Input, Textarea, Select, Accordion, Card)
  sections/ (Hero, ServicesGrid, Testimonials, FAQAccordion, ContactForm)
content/
  services.ts
  faq.ts
  testimonials.ts
  site-config.ts            # phone, email, whatsapp number, social links
lib/
  validations.ts            # zod schemas
  email.ts                  # resend/nodemailer wrapper
  whatsapp.ts               # link-builder helper
public/
  images/, favicon, og-image
```

## 2. Content Data Layer (Day 1–2)

- [ ] `content/site-config.ts` — business name, phone, WhatsApp number, email, address, social links (single source of truth used across components + metadata)
- [ ] `content/services.ts` — typed array of insurance categories (title, description, icon, slug)
- [ ] `content/faq.ts` — typed Q&A array
- [ ] `content/testimonials.ts` — name, quote, rating
- [ ] Define shared TypeScript types (`types/content.ts`)

## 3. Core UI Components (Day 2–3)

- [ ] `Header` — logo, nav, mobile menu, click-to-call button
- [ ] `Footer` — nav links, social icons, contact info, copyright
- [ ] `WhatsAppButton` — floating action button, uses `lib/whatsapp.ts` helper for prefilled message, present in root `layout.tsx`
- [ ] Base `ui/` primitives (Button, Card, Input, Textarea, Select, Accordion) — Tailwind-styled, accessible (keyboard nav, ARIA)
- [ ] `lib/whatsapp.ts`:
  ```ts
  export function buildWhatsAppLink(message: string) {
    const base = `https://wa.me/${siteConfig.whatsappNumber}`;
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  ```

## 4. Page Build-Out (Day 3–6)

- [ ] **Home** — Hero (headline + primary WhatsApp/Call CTA), services summary grid, "Why Choose Us" teaser, testimonials carousel/grid, closing CTA strip
- [ ] **About** — bio/company story, credentials, photo
- [ ] **Insurance Services** — full grid/list from `content/services.ts`, each card with a context-specific "Get a Quote on WhatsApp" link
- [ ] **Why Choose Us** — differentiators, stats section
- [ ] **FAQ** — accordion component rendering `content/faq.ts`
- [ ] **Contact** — form + click-to-call + WhatsApp + mailto + optional map embed
- [ ] **404** — branded not-found page

## 5. Contact Form & Email Pipeline (Day 6–8)

- [ ] `lib/validations.ts` — Zod schema (name, phone, email, insuranceType, message, honeypot field)
- [ ] Build `ContactForm` client component with React Hook Form + Zod resolver
- [ ] Add hidden honeypot input (bots fill it, humans don't → reject silently)
- [ ] Integrate Cloudflare Turnstile widget on the form
- [ ] `app/api/contact/route.ts`:
  - Verify Turnstile token server-side
  - Validate payload with same Zod schema
  - Check honeypot field is empty
  - Send email via Resend (or Nodemailer/SMTP) to business inbox
  - Return JSON success/error — **no data written anywhere**
- [ ] Basic in-memory or edge-based rate limiting on the route (e.g., simple sliding window by IP) to blunt spam bursts
- [ ] Inline success/error UI state (no page reload), loading state on submit

## 6. SEO Implementation (Day 8–9)

- [ ] `app/layout.tsx` — default metadata (title template, description, OG defaults)
- [ ] Per-page `metadata` exports (title, description, OG image)
- [ ] `app/sitemap.ts` and `app/robots.ts`
- [ ] JSON-LD `LocalBusiness`/`InsuranceAgency` schema component on Home + Contact
- [ ] `next/image` for every image asset; `next/font` for typography
- [ ] Alt text audit across all images

## 7. Performance & Security Pass (Day 9–10)

- [ ] Run Lighthouse (mobile + desktop) — target ≥90 across all categories
- [ ] Convert eligible pages to static generation (default in App Router unless dynamic)
- [ ] Verify env vars are server-only (not `NEXT_PUBLIC_`) where sensitive
- [ ] Confirm HTTPS/SSL on deployed domain
- [ ] Security headers via `next.config.ts` (CSP, X-Frame-Options, Referrer-Policy)
- [ ] Cross-browser + cross-device manual QA (iOS Safari, Android Chrome, desktop)

## 8. Deployment & Domain (Day 10–11)

- [ ] Connect custom domain to Vercel project
- [ ] Configure DNS records
- [ ] Verify SSL auto-provisioned
- [ ] Set production environment variables in Vercel dashboard
- [ ] Smoke test contact form + WhatsApp links on production URL

## 9. QA & Handover (Day 11–13)

- [ ] Full functional pass: every CTA (WhatsApp, call, email, form) on every page/breakpoint
- [ ] Spam protection test (submit via honeypot/bot simulation)
- [ ] Analytics events firing correctly (WhatsApp click, call click, form submit)
- [ ] Write the **content-editing guide**: how to update `content/*.ts` files, swap images, change phone/WhatsApp numbers, and redeploy via Git push
- [ ] Client walkthrough/handover call

## 10. Buffer & Launch (Day 13–14)

- [ ] Final client review + fixes
- [ ] Go-live
- [ ] Begin 3-month support window

---

## Risk Notes

| Risk | Mitigation |
|---|---|
| Email deliverability (spam folder) | Use a reputable transactional provider (Resend/SendGrid), verify sending domain (SPF/DKIM) |
| Form spam without a database to track offenders | Honeypot + Turnstile + rate limiting at the API route level |
| Client wants content changes post-launch without touching code | Documented in guide as a known limitation of the no-CMS approach; can be revisited if recurring edits become frequent |
