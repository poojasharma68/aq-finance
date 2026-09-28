// DEMO DATA — fictional customers written for the prototype.
// Replace with real, consented reviews before going live.

import { brand } from "@/data/site";

export const testimonials = [
  {
    name: "Rohit Sharma",
    role: "Software engineer",
    city: "Pune",
    loan: "personal",
    amount: 6_00_000,
    days: 4,
    rating: 5,
    month: "Aug 2026",
    quote:
      `I had applied directly with two banks and heard nothing for a week. The ${brand.short} advisor called within the hour, pointed out my salary-account bank would price me better, and the money was in on day four.`,
  },
  {
    name: "Neha Verma",
    role: "School teacher",
    city: "Jaipur",
    loan: "home",
    amount: 32_00_000,
    days: 11,
    rating: 5,
    month: "Jul 2026",
    quote:
      "The builder's documents were a mess and I was dreading it. Their team sat with the builder's office and got the approved plan copy sorted. I only signed where I was told to.",
  },
  {
    name: "Amit Singh",
    role: "Runs a printing unit",
    city: "Ludhiana",
    loan: "business",
    amount: 18_00_000,
    days: 6,
    rating: 5,
    month: "Aug 2026",
    quote:
      "They put three offers side by side with the processing fee and foreclosure terms, not just the rate. I took one that was 0.3% higher but had no foreclosure charge. Good advice.",
  },
  {
    name: "Pooja Mehta",
    role: "Marketing executive",
    city: "Mumbai",
    loan: "education",
    amount: 22_00_000,
    days: 9,
    rating: 5,
    month: "Jun 2026",
    quote:
      "My sister's MS admission came through late in June. The sanction letter arrived before her visa appointment, which is honestly all that mattered to us.",
  },
  {
    name: "Sandeep Yadav",
    role: "Sales manager",
    city: "Lucknow",
    loan: "consolidation",
    amount: 7_50_000,
    days: 5,
    rating: 4,
    month: "May 2026",
    quote:
      "I was paying four EMIs and two card bills. Now it's one EMI and about ₹9,000 less every month. There was one extra round of documents, hence four stars.",
  },
  {
    name: "Kavita Joshi",
    role: "Freelance designer",
    city: "Bengaluru",
    loan: "property",
    amount: 45_00_000,
    days: 12,
    rating: 5,
    month: "Jul 2026",
    quote:
      "Being self-employed, most lenders wanted three years of ITR. They found one that accepted two years plus GST returns, and were upfront about the timeline from the first call.",
  },
  {
    name: "Farhan Qureshi",
    role: "Pharmacy owner",
    city: "Hyderabad",
    loan: "business",
    amount: 9_00_000,
    days: 5,
    rating: 5,
    month: "Jun 2026",
    quote:
      "Needed to stock up before the monsoon rush. The GST-based assessment meant I wasn't chasing my CA for certificates for two weeks.",
  },
  {
    name: "Ananya Iyer",
    role: "Product analyst",
    city: "Chennai",
    loan: "home",
    amount: 68_00_000,
    days: 14,
    rating: 5,
    month: "Apr 2026",
    quote:
      "Moved my home loan from 9.4% to 8.55%. They followed up on the foreclosure letter themselves, which is the part that usually drags. Saving roughly ₹4,800 a month.",
  },
  {
    name: "Gurpreet Kaur",
    role: "Staff nurse",
    city: "Chandigarh",
    loan: "personal",
    amount: 3_00_000,
    days: 3,
    rating: 5,
    month: "Aug 2026",
    quote:
      "It was a medical emergency in the family. I explained everything on WhatsApp at 10 pm and had a callback at 9:30 the next morning.",
  },
  {
    name: "Vikram Rao",
    role: "Civil contractor",
    city: "Nagpur",
    loan: "property",
    amount: 1_20_00_000,
    days: 16,
    rating: 4,
    month: "Mar 2026",
    quote:
      "The valuation came in lower than expected and they pushed the lender for a second visit. It took longer, but the final sanction was ₹15 lakh higher.",
  },
  {
    name: "Meera Pillai",
    role: "HR lead",
    city: "Kochi",
    loan: "consolidation",
    amount: 12_00_000,
    days: 6,
    rating: 5,
    month: "Jul 2026",
    quote:
      "What I appreciated most: nobody tried to bundle insurance I hadn't asked for. Clear numbers, one EMI, done.",
  },
  {
    name: "Arjun Desai",
    role: "CA finalist",
    city: "Ahmedabad",
    loan: "education",
    amount: 6_50_000,
    days: 7,
    rating: 5,
    month: "May 2026",
    quote:
      "First loan in my own name, with my father as co-applicant. They walked us through how interest builds up during the moratorium, so there were no surprises later.",
  },
];

export const ratingSummary = {
  average: 4.8,
  total: 2_314,
  distribution: [
    { stars: 5, share: 0.84 },
    { stars: 4, share: 0.12 },
    { stars: 3, share: 0.03 },
    { stars: 2, share: 0.01 },
    { stars: 1, share: 0 },
  ],
};
