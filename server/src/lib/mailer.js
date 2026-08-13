import nodemailer from "nodemailer";

// L'envoi d'e-mail est optionnel : si aucune config SMTP n'est fournie
// dans .env, on se contente d'enregistrer la demande en base (voir
// quotes.routes.js) sans faire échouer la requête.
const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    })
  : null;

export async function notifyNewQuote(quote) {
  if (!transporter) {
    console.log(`[mailer] SMTP non configuré — notification e-mail ignorée pour le devis ${quote.id}.`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL_TO || process.env.SMTP_USER,
    replyTo: quote.email,
    subject: `Nouvelle demande de devis — ${quote.name}`,
    text: [
      `Nom : ${quote.name}`,
      `Email : ${quote.email}`,
      `Téléphone : ${quote.phone}`,
      `Type de projet : ${quote.projectType}`,
      `Budget : ${quote.budget}`,
      "",
      quote.message,
    ].join("\n"),
  });
}
