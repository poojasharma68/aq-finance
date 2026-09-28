# SBFT — website

Marketing site and loan application flow for SBFT (Shree Balaji Fin Tech), built with Next.js 16 (App Router, JavaScript), Tailwind CSS 4 and Motion.

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
- **Partner logos** → a PNG or SVG in `public/brand/partners/` plus `logo: "/brand/partners/<slug>.png"` on that lender in `src/data/partners.js`. `PartnerLogo` in `src/components/ui.jsx` then renders it everywhere the lender appears — home marquee, partner directory, loan explorer — and falls back to the typographic monogram for anyone without one, so logos can be added one at a time. Any proportion works (the image is contained, never stretched) and it sits on a white chip in both themes. The nine banks are in place; the NBFCs and housing finance companies are still on monograms.

  Source files from the lender's own brand kit. Before committing one, check it has no stock-site watermark, no baked-in transparency checkerboard, and no border box — the supplied exports had all three, and they are invisible until the logo is on a white chip.
- **Testimonials** → `src/data/testimonials.js` (use real, consented reviews)
- **Logo** → `src/components/logo.jsx`. The emblem is the original artwork in `public/brand/` (`sbft-emblem.png` and its reversed variant); the SBFT wordmark beside it is typeset, and the name comes from `brand` in `src/data/site.js`. The browser tab icon is `src/app/icon.png`.
- **Brand colours** → CSS variables at the top of `src/app/globals.css` (light theme under `:root`, dark under `[data-theme="dark"]`).

## Forms

Both forms validate in the browser and again on the server using the same schemas (`src/lib/schemas.js`). Each includes a hidden honeypot field to catch basic spam bots.

Submissions are currently written to `.data/applications.json` and `.data/messages.json` (git-ignored) so you can see them locally. **Before deploying**, replace `saveSubmission` in `src/lib/submissions.js` with your CRM, database or email service — hosts like Vercel have a read-only filesystem, so the JSON files won't persist there.

## Theme

The site is **light by default** — the visitor's system setting is deliberately ignored. Dark is opt-in through the header toggle, and that choice is remembered in `localStorage` under `sbft-theme`. An inline script in `<head>` applies the theme before first paint, so there's no flash on load. The default lives in `src/components/theme-script.jsx`; to follow the OS again, restore the `matchMedia("(prefers-color-scheme: dark)")` branch there.

## Section rhythm

Every section on the home page is sized to fit inside a desktop viewport — each one is at most ~800px tall, so a 1440x800 window shows one section at a time with no section sprawling past the fold.

The vertical rhythm is a single utility, `section-y` in `src/app/globals.css` — change the padding there rather than per section. If you add a section, keep it under 800px at 1440 wide; `scratchpad/measure.mjs`-style measurement is just `[...document.querySelector("main").firstElementChild.children].map(el => el.getBoundingClientRect().height)` in the console.

Phones are a different matter: stacked layouts make the loan list, EMI calculator, process steps and testimonials taller than a phone screen. Fitting those would mean showing less per screen (a carousel, an accordion, or fewer items), which is a content decision rather than a spacing one.

## DSA loan-scanner hero

The home page hero tells the value proposition as an animation: **multiple lenders → smart comparison → best match → loan approved**. It is mounted in `src/app/page.jsx` as `<LoanScannerHero />`, and `/dsa-hero` renders the same component on its own for QA.

`ctaHref` sets where "Find My Best Loan" goes (default `/apply`); pass `onCtaClick` instead to open an eligibility flow in place. The previous hero is still in `src/components/home/hero.jsx` if you want to swap back.

### Files

```
src/components/loan-scanner/
  loan-scanner-hero.jsx     two-column hero; composition only
  bank-card.jsx             one floating lender card (+ pointer tilt)
  loan-scanner.jsx          the 3D magnifier: rim, glass, beam, particles
  approval-card.jsx         the BEST MATCH / LOAN APPROVED result
  scan-timeline.js          the whole sequence as one GSAP timeline (no React)
  use-scan-sequence.js      when the timeline runs (visibility, hover, resize)
  lenders.js                lenders, positions, figures, particle offsets
  loan-scanner.module.css   all styling, behind tokens on .hero
```

### How it fits together

The UI components render a resting state and publish `data-*` hooks; `scan-timeline.js` finds those hooks and animates them. Nothing about the choreography lives in the components, so:

- **Re-pace the story** — the `TIMING` object at the top of `scan-timeline.js`. One cycle is about 12s.
- **Move, add or remove a lender** — `lenders.js`. `pos`/`posSm` are percentages of the stage; `scan.order` decides which cards the magnifier visits and in what order. The scanner reads the cards' real positions out of the DOM, so nothing else needs editing.
- **Rebrand** — the custom properties on `.hero` in the stylesheet. Neutrals and the saffron accent are inherited from the site's theme tokens (`--ink`, `--saffron`, …) with literal fallbacks, so the hero follows light/dark with the rest of the site and still works if the component is dropped into a project without those tokens or without Tailwind.

`useScanSequence()` returns `controls` (`play`, `pause`, `restart`, `seek`, `timeline`). The timeline carries labels — `scan-0 … scan-n`, `match`, `reset` — so `controls.seek("match")` jumps straight to the result.

### Behaviour worth knowing

- **Accessibility** — the animation is decorative, so the stage is `aria-hidden` and a one-sentence screen-reader summary sits beside it. With `prefers-reduced-motion: reduce` no timeline is built at all: the approved state is rendered still.
- **Performance** — GSAP (~23 kB gzipped) is the only dependency; no WebGL, no video, no images. Only `transform` and `opacity` are animated. The loop is paused while the hero is off screen and while a card is hovered.
- **Responsive** — phones show 3 lenders instead of 6 (the extra cards are hidden in CSS, and the sequence shortens to the cards still on screen by itself).
- **One palette, two meanings.** Saffron is the brand accent — the scanner, the beams, the cards, the CTA. Green appears only on verdicts: the per-card tick, BEST MATCH, the checkmark and the LOAN APPROVED stamp. That keeps "approved" reading as approval rather than as branding.
- **Demo data.** Lender names and rates in `lenders.js` are placeholders, and the monograms are generic glyphs rather than bank logos. Publish a lender's name or logo only once empanelment and co-branding are approved, and source rates from the partner's current rate card. The result card's EMI is computed with the same `calculateEmi` used elsewhere in the app.
