// DEMO DATA — partner names and rates are placeholders for the prototype.
// Only publish a lender's name/logo once the empanelment and co-branding
// approvals are in place, and source rates from the partner's current rate card.
//
// LOGOS. Each partner may carry an optional `logo` pointing at a file in
// public/brand/partners/, and PartnerMark renders it instead of the
// typographic monogram:
//
//   { slug: "sbi", name: "State Bank of India", mark: "SBI",
//     logo: "/brand/partners/sbi.svg", ... }
//
// Any proportion works — the image is contained in a fixed box. PNG (use a
// 2x export, transparent background) and SVG both work. Take the file from
// the lender's own brand kit: a logo pulled off the web is both the wrong
// asset and someone else's trademark, and most DSA agreements make marketing
// use conditional on written co-branding approval.

export const partnerTypes = {
  bank: "Bank",
  nbfc: "NBFC",
  hfc: "Housing Finance",
};

export const partners = [
  {
    slug: "sbi",
    name: "State Bank of India",
    mark: "SBI",
    type: "bank",
    since: 2018,
    products: ["home", "personal", "education", "property"],
    rates: { home: 8.4, personal: 11.15, education: 9.65, property: 9.4 },
    maxLoan: "₹10 Cr",
    sanctionDays: 7,
    bigTicket: -0.2,
    longTenure: 0.1,
  },
  {
    slug: "hdfc",
    name: "HDFC Bank",
    mark: "HDFC",
    type: "bank",
    since: 2017,
    products: ["personal", "home", "business", "property", "consolidation"],
    rates: { personal: 10.75, home: 8.5, business: 15.5, property: 9.5, consolidation: 11.5 },
    maxLoan: "₹10 Cr",
    sanctionDays: 3,
    bigTicket: -0.3,
    longTenure: 0.2,
  },
  {
    slug: "icici",
    name: "ICICI Bank",
    mark: "ICICI",
    type: "bank",
    since: 2018,
    products: ["personal", "home", "business", "education"],
    rates: { personal: 10.8, home: 8.55, business: 15.25, education: 9.95 },
    maxLoan: "₹8 Cr",
    sanctionDays: 2,
    bigTicket: 0.1,
    longTenure: -0.1,
  },
  {
    slug: "axis",
    name: "Axis Bank",
    mark: "AXIS",
    type: "bank",
    since: 2019,
    products: ["personal", "home", "property", "consolidation"],
    rates: { personal: 10.99, home: 8.6, property: 9.6, consolidation: 11.25 },
    maxLoan: "₹7.5 Cr",
    sanctionDays: 3,
    bigTicket: -0.35,
    longTenure: 0.15,
  },
  {
    slug: "kotak",
    name: "Kotak Mahindra Bank",
    mark: "KMB",
    type: "bank",
    since: 2019,
    products: ["personal", "home", "business"],
    rates: { personal: 10.99, home: 8.65, business: 16 },
    maxLoan: "₹5 Cr",
    sanctionDays: 2,
    bigTicket: 0.2,
    longTenure: -0.2,
  },
  {
    slug: "indusind",
    name: "IndusInd Bank",
    mark: "IIB",
    type: "bank",
    since: 2020,
    products: ["personal", "business", "consolidation"],
    rates: { personal: 10.49, business: 15, consolidation: 11.75 },
    maxLoan: "₹50 L",
    sanctionDays: 2,
    bigTicket: 0.45,
    longTenure: 0.25,
  },
  {
    slug: "bob",
    name: "Bank of Baroda",
    mark: "BOB",
    type: "bank",
    since: 2020,
    products: ["home", "education", "property"],
    rates: { home: 8.35, education: 9.5, property: 9.25 },
    maxLoan: "₹10 Cr",
    sanctionDays: 8,
    bigTicket: 0,
    longTenure: 0.1,
  },
  {
    slug: "yes",
    name: "Yes Bank",
    mark: "YES",
    type: "bank",
    since: 2021,
    products: ["personal", "business", "property"],
    rates: { personal: 11.25, business: 14.5, property: 9.8 },
    maxLoan: "₹5 Cr",
    sanctionDays: 3,
    bigTicket: -0.25,
    longTenure: 0,
  },
  {
    slug: "idfc",
    name: "IDFC FIRST Bank",
    mark: "IDFC",
    type: "bank",
    since: 2021,
    products: ["personal", "consolidation", "property"],
    rates: { personal: 10.99, consolidation: 11.5, property: 9.75 },
    maxLoan: "₹5 Cr",
    sanctionDays: 2,
    bigTicket: -0.15,
    longTenure: -0.1,
  },
  {
    slug: "bajaj",
    name: "Bajaj Finserv",
    mark: "BFL",
    type: "nbfc",
    since: 2017,
    products: ["personal", "business", "property"],
    rates: { personal: 11, business: 14.75, property: 9.75 },
    maxLoan: "₹5 Cr",
    sanctionDays: 1,
    bigTicket: 0.3,
    longTenure: 0.2,
  },
  {
    slug: "tata",
    name: "Tata Capital",
    mark: "TCL",
    type: "nbfc",
    since: 2018,
    products: ["personal", "business", "education", "consolidation"],
    rates: { personal: 10.99, business: 15.5, education: 10.5, consolidation: 11.99 },
    maxLoan: "₹3 Cr",
    sanctionDays: 2,
    bigTicket: 0.05,
    longTenure: -0.15,
  },
  {
    slug: "hdb",
    name: "HDB Financial Services",
    mark: "HDB",
    type: "nbfc",
    since: 2019,
    products: ["personal", "business", "property"],
    rates: { personal: 12.5, business: 16.5, property: 10.25 },
    maxLoan: "₹2 Cr",
    sanctionDays: 2,
    bigTicket: -0.2,
    longTenure: 0,
  },
  {
    slug: "lnt",
    name: "L&T Finance",
    mark: "L&T",
    type: "nbfc",
    since: 2020,
    products: ["personal", "business", "home"],
    rates: { personal: 11.5, business: 15.75, home: 8.75 },
    maxLoan: "₹5 Cr",
    sanctionDays: 3,
    bigTicket: -0.4,
    longTenure: 0.1,
  },
  {
    slug: "abc",
    name: "Aditya Birla Capital",
    mark: "ABC",
    type: "nbfc",
    since: 2021,
    products: ["personal", "business", "property"],
    rates: { personal: 11.99, business: 15.25, property: 10.1 },
    maxLoan: "₹3 Cr",
    sanctionDays: 3,
    bigTicket: -0.3,
    longTenure: -0.2,
  },
  {
    slug: "muthoot",
    name: "Muthoot Finance",
    mark: "MF",
    type: "nbfc",
    since: 2022,
    products: ["business", "personal"],
    rates: { business: 17, personal: 13.5 },
    maxLoan: "₹50 L",
    sanctionDays: 1,
    bigTicket: 0,
    longTenure: 0,
  },
  {
    slug: "pnbhfl",
    name: "PNB Housing Finance",
    mark: "PNB",
    type: "hfc",
    since: 2019,
    products: ["home", "property"],
    rates: { home: 8.5, property: 9.6 },
    maxLoan: "₹10 Cr",
    sanctionDays: 6,
    bigTicket: -0.1,
    longTenure: 0.05,
  },
  {
    slug: "lichfl",
    name: "LIC Housing Finance",
    mark: "LIC",
    type: "hfc",
    since: 2020,
    products: ["home", "property"],
    rates: { home: 8.45, property: 9.9 },
    maxLoan: "₹15 Cr",
    sanctionDays: 8,
    bigTicket: 0.05,
    longTenure: -0.05,
  },
];

const bigTicketThreshold = {
  personal: 15_00_000,
  home: 75_00_000,
  business: 30_00_000,
  property: 1_00_00_000,
  education: 40_00_000,
  consolidation: 20_00_000,
};

const longTenureThreshold = {
  personal: 48,
  home: 240,
  business: 48,
  property: 120,
  education: 120,
  consolidation: 60,
};

/** Demo pricing model: base rate nudged by ticket size and tenure. */
export function indicativeRate(partner, product, amount, months) {
  const base = partner.rates[product];
  if (base == null) return null;
  let rate = base;
  if (amount >= bigTicketThreshold[product]) rate += partner.bigTicket;
  if (months >= longTenureThreshold[product]) rate += partner.longTenure;
  return Math.round(rate * 100) / 100;
}

export function partnersFor(product) {
  return partners.filter((partner) => partner.products.includes(product));
}
