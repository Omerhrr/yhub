import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Reuse the transporter across requests — avoids a new TCP connection per email
let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST  ?? "smtp.gmail.com",
      port:   Number(process.env.EMAIL_PORT ?? 587),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER ?? "",
        pass: process.env.EMAIL_PASS ?? "",
      },
      pool: true,         // keep-alive connection pool
      maxConnections: 5,
      maxMessages: 100,
    });
  }
  return _transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.EMAIL_USER) {
    console.log(`[email] Would send to ${to}: ${subject}`);
    return;
  }
  await getTransporter().sendMail({
    from:    process.env.EMAIL_FROM ?? `"Yahya Hub" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
