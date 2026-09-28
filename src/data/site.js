// DEMO DATA — company details, numbers and addresses are placeholders.

/**
 * The brand, in one place. Everything on the site — the logo lockup, page
 * titles, the footer and the legal copy — reads from here, so a rename is a
 * single edit rather than a hunt through the codebase.
 */
export const brand = {
  /** the acronym, used as the everyday name */
  short: "SBFT",
  /** the full form, spelled out in the footer and the legal copy */
  full: "Secure Business Finance & Trust",
  /** the short descriptor under the wordmark in the logo */
  strip: "Finance & Trust",
  tagline: "Aapke sapno ka saath, hamara vishwas",
};

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/apply", label: "Apply Now" },
  { href: "/loans", label: "Loan Products" },
  { href: "/partners", label: "Our Partners" },
  { href: "/testimonials", label: "Testimonials" },
];

export const contact = {
  phone: "1800 210 4455",
  phoneHref: "tel:18002104455",
  whatsapp: "+91 98110 44552",
  whatsappHref: "https://wa.me/919811044552",
  email: "hello@sbft.in",
  hours: "Mon–Sat, 9:30 am – 6:30 pm",
  grievance: { name: "Ritika Malhotra", email: "grievance@sbft.in" },
};

export const offices = [
  {
    city: "Gurugram",
    label: "Head office",
    address: "Level 6, Aurum Court, Golf Course Road, Sector 43, Gurugram, Haryana 122009",
  },
  {
    city: "Mumbai",
    label: "West region",
    address: "Unit 1104, Meridian House, Andheri–Kurla Road, Andheri East, Mumbai 400059",
  },
  {
    city: "Bengaluru",
    label: "South region",
    address: "3rd Floor, Lakeview Point, 100 Feet Road, Indiranagar, Bengaluru 560038",
  },
];

export const stats = [
  { label: "Loans facilitated", value: 1240, prefix: "₹", suffix: " Cr", note: "since 2017" },
  { label: "Customers funded", value: 18600, suffix: "+", note: "across 120+ cities" },
  { label: "Lending partners", value: 17, note: "banks, NBFCs & HFCs" },
  { label: "Median time to sanction", value: 72, suffix: " hrs", note: "salaried applicants" },
];

export const steps = [
  {
    title: "Tell us what you need",
    body: "A two-minute form: the loan type, the amount and a few details about your income.",
    meta: "2 minutes",
  },
  {
    title: "We match you with lenders",
    body: "An advisor compares offers across our partners and calls you with the two or three that actually fit.",
    meta: "Within 4 working hours",
  },
  {
    title: "Documents, collected",
    body: "Upload from your phone or book a doorstep pickup. We check everything before it reaches the lender.",
    meta: "1–2 days",
  },
  {
    title: "Sanction & disbursal",
    body: "The lender verifies and sanctions. We stay on your file until the money lands in your account.",
    meta: "2–10 days",
  },
];

export const faqs = [
  {
    q: "Does SBFT lend money directly?",
    a: "No. We're a loan facilitator empanelled with banks and NBFCs. The loan agreement, interest rate and disbursal always come from the lender, and your sanction letter is on their letterhead.",
  },
  {
    q: "Do I pay anything for your service?",
    a: "Our advice is free for applicants — the partner lender pays us once a loan is disbursed. You only pay the lender's own charges, such as processing fee and stamp duty, which we list before you sign anything.",
  },
  {
    q: "Will checking offers affect my credit score?",
    a: "Sharing your details with us doesn't. A lender only pulls your report after you choose an offer, and we submit to one or two lenders at most rather than spraying your file everywhere.",
  },
  {
    q: "How quickly will someone call me back?",
    a: "Within 4 working hours for applications sent Monday to Saturday between 9:30 am and 6:30 pm. Anything later is picked up first thing the next working morning.",
  },
  {
    q: "My CIBIL score is below 700. Can you still help?",
    a: "Often, yes. Some partners consider scores between 650 and 700 with a co-applicant, collateral or a strong income record. If waiting and rebuilding your score would get you a better deal, your advisor will say so.",
  },
  {
    q: "Is my information safe?",
    a: "Your details are encrypted in transit and shared only with the lender you pick. We don't sell data or use it for unrelated marketing.",
  },
];
