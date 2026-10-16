import nodemailer from "nodemailer";
import { t } from "./messages.js";

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

// `locale` is the language of the request that asked for the reset.
export async function sendPasswordResetEmail({ to, name, link, locale }) {
  const text = [
    t(locale, "resetEmailGreeting", { name }),
    "",
    t(locale, "resetEmailIntro"),
    t(locale, "resetEmailAction"),
    "",
    link,
    "",
    t(locale, "resetEmailIgnore"),
  ].join("\n");

  if (!transport) {
    console.log(`\n[mail] Password reset for ${to}:\n${link}\n`);
    return;
  }

  await transport.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to,
    subject: t(locale, "resetEmailSubject"),
    text,
  });
}
