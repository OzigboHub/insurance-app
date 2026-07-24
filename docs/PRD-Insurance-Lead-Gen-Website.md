# Product Requirements Document (PRD)
## Insurance Lead Generation Website

**Version:** 1.0
**Date:** July 20, 2026
**Prepared for:** Insurance Client Project
**Stack:** Next.js (App Router) + TypeScript, no database

---

## 1. Overview

A professional, responsive marketing website for an insurance agent/broker, built to establish credibility and convert visitors into leads by routing every inquiry directly to **WhatsApp** or **email** — with no backend database or user accounts required.

The site acts as a digital storefront: static/server-rendered content, fast load times, and frictionless contact paths (chat, call, form, email).

## 2. Goals & Success Criteria

| Goal | Success Metric |
|---|---|
| Generate qualified leads | Contact form submissions + WhatsApp click-throughs tracked via analytics events |
| Fast, credible first impression | Lighthouse Performance & SEO scores ≥ 90 |
| Zero backend maintenance | No database, no user auth, no CMS admin panel required |
| Mobile-first conversion | >60% of traffic expected on mobile; all CTAs (WhatsApp/Call) must be one-tap |

## 3. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod validation (client-side) |
| Email delivery | Serverless API route using Resend (or Nodemailer + SMTP) — no DB, stateless send |
| WhatsApp | `wa.me` deep link (`https://wa.me/<number>?text=<prefilled message>`) |
| Spam protection | Honeypot field + Cloudflare Turnstile (or hCaptcha) |
| Hosting/Deploy | Vercel (recommended for Next.js) |
| Analytics | Google Analytics 4 / Plausible (event tracking on CTA clicks) |
| SEO | Next.js Metadata API, `sitemap.xml`, `robots.txt`, JSON-LD structured data |

**No database, no CMS, no login system.** Content is stored as static TypeScript/JSON data files or MDX, edited directly in code and redeployed — matching the "basic user guide" deliverable in the proposal (guide will cover editing these files, not a dashboard).

## 4. Site Structure / Pages

1. **Home** — hero with value proposition, primary CTAs (WhatsApp/Call/Email), services summary, trust signals (testimonials, certifications), lead capture strip.
2. **About** — agent/company background, credentials, mission.
3. **Insurance Services** — service/policy categories (e.g., Auto, Health, Life, Business), each with a short description and a "Get a Quote" CTA.
4. **Why Choose Us** — differentiators, stats, testimonials.
5. **FAQ** — accordion-style Q&A (static content).
6. **Contact Us** — contact form, click-to-call, WhatsApp button, email link, social links, embedded map (optional, static image or iframe — no API key dependency required).
7. **404 / Not Found** — custom branded page.

## 5. Core Features

### 5.1 WhatsApp Integration
- Floating WhatsApp chat button (persistent across all pages).
- Deep link format: `https://wa.me/<phone>?text=<url-encoded prefilled message>`.
- Prefilled message varies by context (e.g., "Home" vs a specific "Insurance Services" card) to give the agent lead context immediately.
- Opens in new tab; falls back gracefully on desktop (WhatsApp Web).

### 5.2 Click-to-Call
- `tel:` links on Contact page and header/footer.
- Visible primary button on mobile viewports.

### 5.3 Contact Form → Email
- Fields: Name, Phone, Email, Insurance Type (select), Message.
- Client-side validation (Zod schema).
- Submits to a Next.js Route Handler (`app/api/contact/route.ts`) which sends the message via a transactional email provider (Resend/SMTP) directly to the business inbox — **no data persisted**, purely pass-through.
- Success/error state shown inline; no page reload (progressive enhancement with `useFormStatus`/`useTransition`).
- Honeypot + Turnstile/hCaptcha to block bot spam before the email send is triggered.

### 5.4 Direct Email Link
- `mailto:` links with prefilled subject line as a fallback contact path (footer, Contact page).

### 5.5 Social Links
- Header/footer icons linking to the business's social profiles (configurable via a constants file).

## 6. SEO Requirements

- Unique `<title>` and meta description per page via Next.js Metadata API.
- Open Graph + Twitter card tags for link previews.
- `sitemap.xml` and `robots.txt` auto-generated (`app/sitemap.ts`, `app/robots.ts`).
- Semantic HTML, descriptive alt text on all images.
- JSON-LD structured data (`LocalBusiness` / `InsuranceAgency` schema) on Home/Contact.
- Core Web Vitals optimized: `next/image` for all imagery, font optimization via `next/font`.

## 7. Security & Performance

- HTTPS/SSL via hosting provider (auto with Vercel or configured on chosen host).
- Environment variables (email API keys) stored server-side only, never exposed to client.
- Rate limiting on the `/api/contact` route (e.g., simple IP-based throttling) to prevent abuse since there's no database to log/ban offenders.
- Image optimization, code-splitting, and static generation (SSG) wherever content doesn't change per request — most pages should be statically generated at build time.
- Target Lighthouse scores: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90, Best Practices ≥ 90.

## 8. Content Management Approach

Since there is no database or CMS:
- All copy (services, FAQ, testimonials) lives in typed data files (e.g., `content/services.ts`, `content/faq.ts`).
- Updating content = editing these files and redeploying (via Git push, auto-deployed on Vercel).
- Deliverable includes a short **non-technical guide** showing the client (or their developer) how to edit text, images, and contact numbers in these files.

## 9. Out of Scope

- User accounts / authentication
- Database-backed CMS or admin dashboard
- Online payment or policy purchase flow
- Multi-language support (unless requested later)
- Blog/CMS-driven content (can be added later as MDX if needed)

## 10. Deliverables (mapped from proposal)

- Fully responsive Next.js + TypeScript website (Home, About, Services, Why Choose Us, FAQ, Contact)
- WhatsApp, Click-to-Call, Contact Form (email), and social integrations
- Basic SEO setup (metadata, sitemap, robots, structured data)
- SSL, spam protection, performance optimization
- Domain + hosting deployment (Vercel or equivalent)
- Content-editing guide (for static data files, not a CMS)

## 11. Timeline

10–14 working days from approval and initial payment, per the proposal — aligned with the scope above (no backend/database work reduces build risk).

## 12. Assumptions

- Client will supply: logo/brand assets (or use complimentary design service), business WhatsApp number, business email, service descriptions, testimonials, and any certifications/images.
- Domain and hosting billed in USD as noted in the proposal; Vercel or similar host assumed for deployment.
- Three months of post-launch support covers minor content/config fixes within the scope defined above.
