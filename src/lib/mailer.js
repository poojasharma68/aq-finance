import nodemailer from "nodemailer";

// Sends form submissions to the team inbox over SMTP. Configure in .env.local:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and optionally MAIL_TO / MAIL_FROM.

const DEFAULT_TO = "docs@shreebalajifintech.com";

let transporter;

export function mailerConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/**
 * rows: array of [label, value] pairs; empty values are skipped.
 * Returns true when sent, false when SMTP is not configured. Throws on send failure.
 */
export async function sendSubmissionEmail({ subject, heading, rows, replyTo }) {
  if (!mailerConfigured()) {
    console.warn("[mailer] SMTP is not configured — skipping email for:", subject);
    return false;
  }

  const filled = rows.filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "");

  const text = [heading, "", ...filled.map(([label, value]) => `${label}: ${value}`)].join("\n");
  const html = `
    <h2 style="font-family:Arial,sans-serif;margin:0 0 12px">${escapeHtml(heading)}</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${filled
        .map(
          ([label, value]) => `<tr>
            <td style="border:1px solid #ddd;background:#f6f6f6;font-weight:bold;white-space:nowrap">${escapeHtml(label)}</td>
            <td style="border:1px solid #ddd">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
          </tr>`,
        )
        .join("")}
    </table>`;

  await getTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: process.env.MAIL_TO || DEFAULT_TO,
    replyTo,
    subject,
    text,
    html,
  });
  return true;
}
