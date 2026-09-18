import { z } from "zod";
import { contactSchema } from "@/lib/schemas";
import { createReference, saveSubmission } from "@/lib/submissions";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Request body must be JSON." }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
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

  const { website, ...message } = result.data;
  const reference = createReference("MSG");

  await saveSubmission("messages", {
    reference,
    receivedAt: new Date().toISOString(),
    ...message,
  });

  return Response.json({ ok: true, reference }, { status: 201 });
}
