// DEMO DATA — names, roles, bios and dates are placeholders. Replace them with
// the real team before publishing, and only use a person's photo with their
// permission.
//
// PHOTOS. Each person may carry an optional `photo` pointing at a file in
// public/team/ (a square crop, at least 600×600, works best):
//
//   { name: "…", role: "…", photo: "/team/priya.jpg", ... }
//
// Without a photo the page shows their initials instead. The photos in
// public/team/ right now are stock placeholders (pravatar.cc) — swap them for
// the real people.

export const founder = {
  name: "Founder Name",
  role: "Founder & Managing Director",
  photo: "/team/founder.jpg",
  since: 2025,
  quote:
    "I started this firm after watching families get turned away by one bank and never hear about the ten others that would have said yes. Our job is to make sure that never happens to our customers.",
  bio: [
    "Before founding the company, spent over 12 years in retail lending with leading private banks — across credit, sales and branch operations.",
    "Today leads partnerships with our lenders and personally reviews every case that needs a second look.",
  ],
  highlights: [
    { value: 20, suffix: "+", label: "years in lending" },
    { value: 250, suffix: "+", label: "lender relationships" },
    { value: 1000, suffix: "+", label: "families funded" },
  ],
  links: { linkedin: "#" },
};

export const team = [
  {
    name: "Team Member One",
    role: "Head of Operations",
    photo: "/team/member-1.jpg",
    experience: "10 yrs",
    focus: "Keeps every file moving from login to disbursal.",
    languages: ["Hindi", "English"],
  },
  {
    name: "Team Member Two",
    role: "Senior Loan Advisor",
    photo: "/team/member-2.jpg",
    experience: "8 yrs",
    focus: "Home loans and balance transfers for salaried buyers.",
    languages: ["Hindi", "English", "Punjabi"],
  },
  {
    name: "Team Member Three",
    role: "Business Loan Specialist",
    photo: "/team/member-3.jpg",
    experience: "7 yrs",
    focus: "Working capital and OD limits for traders and MSMEs.",
    languages: ["Hindi", "English", "Gujarati"],
  },
  {
    name: "Team Member Four",
    role: "Credit Analyst",
    photo: "/team/member-4.jpg",
    experience: "6 yrs",
    focus: "Reads your profile the way a lender will — before they do.",
    languages: ["Hindi", "English"],
  },
  {
    name: "Team Member Five",
    role: "Relationship Manager",
    photo: "/team/member-5.jpg",
    experience: "5 yrs",
    focus: "Your single point of contact until the money is in.",
    languages: ["Hindi", "English", "Marathi"],
  },
  {
    name: "Team Member Six",
    role: "Documentation Lead",
    photo: "/team/member-6.jpg",
    experience: "5 yrs",
    focus: "Doorstep pickup and paperwork, done right the first time.",
    languages: ["Hindi", "English"],
  },
];
