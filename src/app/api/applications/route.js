import { z } from "zod";
import { applicationSchema, contactModes, employmentTypes, genders } from "@/lib/schemas";
import { saveSubmission } from "@/lib/submissions";
import { sendSubmissionEmail } from "@/lib/mailer";
import { amountRanges, loans, salaryRanges, turnoverRanges } from "@/data/loans";

const labelOf = (list, value) => list.find((item) => item.value === value)?.label ?? value;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Request body must be JSON." }, { status: 400 });
  }

  const result = applicationSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      {
        ok: false,
        message: "Some details need another look.",
        fieldErrors: z.flattenError(result.error).fieldErrors,
      },
      { status: 422 },
    );
  }

  const { website, consent, ...application } = result.data;
  const receivedAt = new Date();

  await saveSubmission("applications", {
    receivedAt: receivedAt.toISOString(),
    consentGiven: consent,
    ...application,
  });

  const a = application;
  const loanName = loans.find((l) => l.slug === a.loanType)?.name ?? a.loanType;
  const salaried = a.employmentType === "salaried";

  try {
    await sendSubmissionEmail({
      subject: `New loan application — ${a.fullName}, ${loanName}`,
      heading: "New loan application",
      replyTo: a.email,
      rows: [
        ["Received", receivedAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
        ["Full name", a.fullName],
        ["Mobile", a.mobile],
        ["Email", a.email],
        ["Date of birth", a.dob],
        ["Gender", labelOf(genders, a.gender)],
        ["PAN", a.pan],
        ["Employment", labelOf(employmentTypes, a.employmentType)],
        ...(salaried
          ? [
              ["Company", a.companyName],
              ["Work email", a.workEmail],
              ["Monthly salary", labelOf(salaryRanges, a.monthlySalary)],
            ]
          : [
              ["Business name", a.businessName],
              ["Annual turnover", labelOf(turnoverRanges, a.annualTurnover)],
            ]),
        ["Loan type", loanName],
        ["Amount", labelOf(amountRanges, a.amountRange)],
        ["Purpose", a.purpose],
        ["City / state", a.city],
        ["PIN code", a.pincode],
        ["Preferred contact", labelOf(contactModes, a.contactMode)],
        ["Consent given", consent ? "Yes" : "No"],
      ],
    });
  } catch (error) {
    console.error("[applications] email failed:", error);
    return Response.json(
      { ok: false, message: "We couldn't send your application right now. Please try again in a minute." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
