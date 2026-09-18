import { z } from "zod";
import { applicationSchema } from "@/lib/schemas";
import { createReference, saveSubmission } from "@/lib/submissions";

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
  const reference = createReference("BJF");

  await saveSubmission("applications", {
    reference,
    receivedAt: new Date().toISOString(),
    consentGiven: consent,
    ...application,
  });

  return Response.json({ ok: true, reference }, { status: 201 });
}
