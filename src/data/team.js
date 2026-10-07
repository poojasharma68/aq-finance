// DEMO DATA — the founder's name, bio and dates are placeholders. Replace them
// before publishing.
//
// PHOTO. `photo` points at a file in public/team/ (a square crop, at least
// 600×600, works best). Without a photo the page shows initials instead.

export const founder = {
  name: "Akaash",
  role: "Founder & Managing Director",
  photo: "/team/founder.png",
  since: 2025,
  quote:
    "I started this firm after watching families get turned away by one bank and never hear about the ten others that would have said yes. Our job is to make sure that never happens to our customers.",
  bio: [
    "Before founding the company, Akaash spent over 12 years in retail lending with leading private banks — across credit, sales and branch operations.",
    "Today Akaash leads partnerships with our lenders and personally reviews every case that needs a second look.",
  ],
  highlights: [
    { value: 20, suffix: "+", label: "years in lending" },
    { value: 250, suffix: "+", label: "lender relationships" },
    { value: 1000, suffix: "+", label: "families funded" },
  ],
  links: { linkedin: "#" },
};

/** The commitments the founder makes to every customer, shown on the About page. */
export const promises = [
  {
    title: "Every lender, not just one",
    body: "Your profile is matched against our full panel of banks and NBFCs, so you see the offers that fit — not the one that pays us most.",
  },
  {
    title: "Advice from the bank's side of the table",
    body: "Years inside retail lending means we know how a credit desk reads your file, and we fix the gaps before they see it.",
  },
  {
    title: "One person, start to disbursal",
    body: "The advisor who takes your first call stays with your file until the money is in your account.",
  },
  {
    title: "No surprises in the fine print",
    body: "Rates, fees and charges are explained upfront, in plain words, before you sign anything.",
  },
];
