# AQ Finance — website

Marketing site and loan application flow for AQ Finance, built with Next.js 16 (App Router, JavaScript), Tailwind CSS 4 and Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

## Pages

| Route           | What's there                                                                 |
| --------------- | ---------------------------------------------------------------------------- |
| `/`             | Hero with live offer preview, stats, partner marquee, loan list, EMI calculator, process, stories, FAQ |
| `/apply`        | Full application form with validation, progress tracker and success screen. Accepts `?type=home&amount=5000000` to prefill |
| `/loans`        | Tabbed product explorer (`?type=personal` deep-links to a tab)               |
| `/partners`     | Filterable directory of banks, NBFCs and housing finance companies           |
| `/testimonials` | Rating summary and filterable customer stories                               |
| `/contact`      | Contact form, channels, offices, grievance officer                            |

## Where things live

```
src/
  app/                 routes, API handlers (api/applications, api/contact)
  components/          shared UI (header, footer, logo, theme, motion helpers, form parts)
  components/home/     home page sections
  data/                ALL demo content — loans, partners, testimonials, company details
  lib/                 EMI maths, formatting, zod schemas, submission storage
```

## Replacing the demo content

- **Company details, stats, FAQs, offices** → `src/data/site.js`
- **Loan products, rates, documents** → `src/data/loans.js`
- **Partner lenders** → `src/data/partners.js`. Only publish a lender's name or logo once empanelment and co-branding are approved.
- **Testimonials** → `src/data/testimonials.js` (use real, consented reviews)
- **Logo** → `src/components/logo.jsx` draws the AQ mark as SVG. To use your original file, put it in `public/brand/` and follow the comment at the top of that file. The browser tab icon is `src/app/icon.svg`.
- **Brand colours** → CSS variables at the top of `src/app/globals.css` (light theme under `:root`, dark under `[data-theme="dark"]`).

## Forms

Both forms validate in the browser and again on the server using the same schemas (`src/lib/schemas.js`). Each includes a hidden honeypot field to catch basic spam bots.

Submissions are currently written to `.data/applications.json` and `.data/messages.json` (git-ignored) so you can see them locally. **Before deploying**, replace `saveSubmission` in `src/lib/submissions.js` with your CRM, database or email service — hosts like Vercel have a read-only filesystem, so the JSON files won't persist there.

## Theme

Light and dark themes follow the visitor's system setting by default; the toggle in the header overrides it and remembers the choice. An inline script in `<head>` applies the theme before first paint, so there's no flash on load.
