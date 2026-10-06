# JLang Development

Source for [jlang.dev](https://jlang.dev), Jordan Lang's portfolio and services site: featured projects and case studies, a blog, service packages with an order flow, a digital products store, a private client portal, and a client review workflow, all managed from an embedded Sanity Studio.

[![CI](https://github.com/jordolang/Jlang-dev/actions/workflows/ci.yml/badge.svg)](https://github.com/jordolang/Jlang-dev/actions/workflows/ci.yml)

## Stack

- **Next.js 15** (App Router) with **React 18** and **TypeScript**
- **Tailwind CSS** and **Framer Motion**
- **Sanity** for content, with Studio mounted at `/studio`
- **Stripe** checkout, **Resend** email, **PostHog** analytics
- **Anthropic API** for Studio drafting and social copy
- **Vitest** unit and integration tests, **Playwright** end-to-end tests
- Deployed on **Vercel**

## Getting started

Requires Node.js 20 or later.

```bash
npm ci
cp env-example .env.local   # then fill in the values you need
npm run dev
```

The site runs at http://localhost:3000 and Studio at http://localhost:3000/studio. Pages that read from Sanity fall back gracefully when it is not configured, so you only need the variables for the features you are working on.

## Environment variables

Every variable the app reads is listed with a comment in [`env-example`](env-example). Set the same values in Vercel under Project Settings, Environment Variables. By feature:

| Feature | Variables |
| --- | --- |
| Content (all pages) | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_WRITE_TOKEN`, `NEXT_PUBLIC_SITE_URL` |
| Contact and order forms | `SANITY_API_WRITE_TOKEN` (saves inquiries), `RESEND_API_KEY`, optional `CONTACT_EMAIL`, `CONTACT_EMAIL_FROM`, `NEXT_PUBLIC_BOOKING_URL` |
| Spam protection (optional) | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| Blog newsletter | `RESEND_API_KEY`, optional `RESEND_NEWSLETTER_SEGMENT_ID` |
| Failure alerts | `RESEND_API_KEY`, optional `ALERT_EMAIL`, `ALERT_EMAIL_FROM` |
| Analytics | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` |
| Products store | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DOWNLOAD_TOKEN_SECRET`, `RESEND_API_KEY`, `PURCHASE_EMAIL_FROM` |
| Client portal | `PORTAL_SESSION_SECRET`, `RESEND_API_KEY`, `PORTAL_EMAIL_FROM` |
| Review workflow | `SANITY_WEBHOOK_SECRET`, `RESEND_API_KEY`, `REVIEW_EMAIL_FROM`, `REVIEW_NOTIFICATION_EMAIL`, `NEXT_PUBLIC_GOOGLE_REVIEW_URL` |
| Scheduled blog posts | `CRON_SECRET` |
| Studio AI tools | `ANTHROPIC_API_KEY` |
| Performance page | `GOOGLE_PAGESPEED_API_KEY` |

### Inquiries

Every contact, services and promo form submission is saved in Studio under **Inquiries** before any email is sent, so a lead survives an email outage. Each one starts as **New**; move it through Contacted, Qualified, Proposal sent, Won or Lost as the conversation goes. The sender gets an automatic confirmation that includes the **Booking link** from Site settings (or `NEXT_PUBLIC_BOOKING_URL`) when one is set.

Forms are protected by a hidden honeypot field, a minimum fill time and a limit of five inquiries per sender every ten minutes. Setting the two Turnstile keys adds Cloudflare's invisible bot check on top.

### Failure alerts

When a payment can't be fulfilled, an inquiry can't be saved or emailed, the newsletter fails, or any page or API route throws in production, an email goes to `ALERT_EMAIL` (or `CONTACT_EMAIL`). Each kind of alert is sent at most once every ten minutes.

### Products store

1. In Stripe, create a webhook endpoint for `https://jlang.dev/api/webhooks/stripe` with the `checkout.session.completed` event and save its signing secret as `STRIPE_WEBHOOK_SECRET`. Locally, use `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
2. Checkout charges each product's **Base price (number)** from Studio (0 means free), so no Stripe Price objects are needed.
3. Mark products **Published** in Studio for them to appear at `/products`.
4. Each paid purchase is saved in Studio under **Orders** (test-mode purchases are marked TEST). Download links expire after 24 hours; buyers can get fresh ones at `/products/downloads` by entering their checkout email.
5. Analytics records `checkout_started` in the browser and `purchase_completed` from the webhook with `revenue` and `is_test`, so test purchases can be filtered out of reports.

### Review workflow

See [docs/review-workflow.md](docs/review-workflow.md).

### Scheduled publishing

`vercel.json` runs `/api/cron/publish-scheduled` hourly. Vercel sends `CRON_SECRET` as a bearer token, so the variable must be set in the Vercel project for the cron to work.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Regenerates the icon bundle, then builds for production |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript, no emit |
| `npm test` | Vitest unit and integration tests |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run icons` | Regenerates `src/lib/generatedIcons.ts` |

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint, type check, tests and a production build on every push to `main` and every pull request. To stop failing changes from reaching `main`, make those checks required with a branch protection rule; see [docs/branch-protection.md](docs/branch-protection.md).

## Project layout

```
src/app/          Routes: home, blog, projects, services, products, portal, review, studio, api
src/components/   UI, grouped by feature (portfolio, services, projects, portal, ...)
src/lib/          Data access, auth, email, Stripe, SEO helpers
src/sanity/       Studio schema types and Sanity client
content/blog/     MDX blog posts
scripts/          Icon generation and Sanity seed scripts
tests/            unit, integration and e2e suites
```

## License

[MIT](LICENSE)
