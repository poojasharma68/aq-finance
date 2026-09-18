import { z } from "zod";
import { amountRanges, loans, salaryRanges, turnoverRanges } from "@/data/loans";

// Used by both the browser (react-hook-form) and the API routes, so the
// server never trusts what the client already validated.
//
// Select-style fields use refine() instead of z.enum(): an enum mismatch is an
// aborting issue in Zod 4, which would hide the cross-field checks below until
// every other field is fixed. Refinements let all errors surface in one pass.

const oneOf = (values, message) => z.string().refine((v) => values.includes(v), message);

const requiredText = (min, message) => z.string().trim().min(min, message);

const optionalEmail = z
  .string()
  .trim()
  .refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email address");

const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

function ageOn(dateString) {
  const dob = new Date(dateString);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export const employmentTypes = [
  { value: "salaried", label: "Salaried" },
  { value: "self-employed", label: "Self-employed" },
];

export const genders = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "undisclosed", label: "Prefer not to say" },
];

export const contactModes = [
  { value: "call", label: "Call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
];

export const applicationSchema = z
  .object({
    // personal
    fullName: requiredText(3, "Enter your full name as it appears on PAN")
      .max(80, "That name looks too long")
      .regex(/^[A-Za-z .'-]+$/, "Use letters, spaces and . ' - only"),
    mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    email: z.string().trim().pipe(z.email("Enter a valid email address")),
    dob: z
      .string()
      .min(1, "Select your date of birth")
      .refine((v) => {
        const age = ageOn(v);
        return age !== null && age >= 21 && age <= 65;
      }, "Applicants must be between 21 and 65 years old"),
    gender: oneOf(genders.map((g) => g.value), "Select an option"),
    pan: z
      .string()
      .trim()
      .transform((v) => v.toUpperCase())
      .refine((v) => v === "" || PAN.test(v), "PAN format is ABCDE1234F"),

    // employment
    employmentType: oneOf(employmentTypes.map((e) => e.value), "Choose your employment type"),
    companyName: z.string().trim(),
    workEmail: optionalEmail,
    monthlySalary: z.string(),
    businessName: z.string().trim(),
    annualTurnover: z.string(),

    // loan
    loanType: oneOf(loans.map((l) => l.slug), "Select a loan type"),
    amountRange: oneOf(amountRanges.map((a) => a.value), "Select the amount you need"),
    purpose: requiredText(1, "Select the purpose of the loan"),

    // additional
    city: requiredText(2, "Enter your city and state"),
    pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code"),
    contactMode: oneOf(contactModes.map((c) => c.value), "Choose how we should reach you"),
    consent: z.boolean().refine((v) => v === true, "Please accept the terms to continue"),

    // honeypot — real users never see or fill this
    website: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    const issue = (path, message) => ctx.addIssue({ code: "custom", path: [path], message });

    if (data.employmentType === "salaried") {
      if (data.companyName.length < 2) issue("companyName", "Enter your employer's name");
      if (!salaryRanges.some((s) => s.value === data.monthlySalary))
        issue("monthlySalary", "Select your monthly in-hand salary");
    }

    if (data.employmentType === "self-employed") {
      if (data.businessName.length < 2) issue("businessName", "Enter your business or practice name");
      if (!turnoverRanges.some((t) => t.value === data.annualTurnover))
        issue("annualTurnover", "Select your annual turnover");
    }

    const loan = loans.find((l) => l.slug === data.loanType);
    if (loan && data.purpose && !loan.purposes.includes(data.purpose)) {
      issue("purpose", "Pick a purpose that matches the loan type");
    }
  });

export const contactTopics = [
  { value: "new-loan", label: "I want to apply for a loan" },
  { value: "existing", label: "Update on an existing application" },
  { value: "partnership", label: "Lender / channel partnership" },
  { value: "grievance", label: "Complaint or grievance" },
  { value: "other", label: "Something else" },
];

export const contactSchema = z.object({
  name: requiredText(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().pipe(z.email("Enter a valid email address")),
  topic: oneOf(contactTopics.map((t) => t.value), "Choose a topic"),
  message: requiredText(10, "A line or two helps us route this correctly").max(1200, "Keep it under 1,200 characters"),
  website: z.string().max(0).optional(),
});

export const applicationDefaults = {
  fullName: "",
  mobile: "",
  email: "",
  dob: "",
  gender: "",
  pan: "",
  employmentType: "salaried",
  companyName: "",
  workEmail: "",
  monthlySalary: "",
  businessName: "",
  annualTurnover: "",
  loanType: "",
  amountRange: "",
  purpose: "",
  city: "",
  pincode: "",
  contactMode: "",
  consent: false,
  website: "",
};
