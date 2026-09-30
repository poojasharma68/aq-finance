import { z } from "zod";
import { contactSchema, contactTopics } from "@/lib/schemas";
import { saveSubmission } from "@/lib/submissions";
import { sendSubmissionEmail } from "@/lib/mailer";

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
  const receivedAt = new Date();

  await saveSubmission("messages", {
    receivedAt: receivedAt.toISOString(),
    ...message,
  });

  const topic = contactTopics.find((t) => t.value === message.topic)?.label ?? message.topic;

  try {
    await sendSubmissionEmail({
      subject: `New enquiry — ${message.name}, ${topic}`,
      heading: "New contact enquiry",
      replyTo: message.email,
      rows: [
        ["Received", receivedAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
        ["Name", message.name],
        ["Phone", message.phone],
        ["Email", message.email],
        ["Topic", topic],
        ["Message", message.message],
      ],
    });
  } catch (error) {
    console.error("[contact] email failed:", error);
    return Response.json(
      { ok: false, message: "We couldn't send your message right now. Please try again in a minute." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
