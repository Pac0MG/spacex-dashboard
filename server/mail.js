import nodemailer from "nodemailer";

// Set SMTP_HOST (plus SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM) to send real
// emails. Without it, messages are printed to the server console instead, which
// is enough for local development.
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

const transport = SMTP_HOST
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    })
  : null;

export async function sendPasswordResetEmail({ to, name, link }) {
  const text = [
    `Hi ${name},`,
    "",
    "We received a request to reset your SpaceX Dashboard password.",
    "Open this link to choose a new one (valid for 1 hour):",
    "",
    link,
    "",
    "If you didn't ask for this, you can ignore this email.",
  ].join("\n");

  if (!transport) {
    console.log(`\n[mail] Password reset for ${to}:\n${link}\n`);
    return;
  }

  await transport.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to,
    subject: "Reset your SpaceX Dashboard password",
    text,
  });
}
