import nodemailer from "nodemailer";

interface IEmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: IEmailParams): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "no-reply@reckronsp.com";
  const port = parseInt(process.env.SMTP_PORT || "587");

  // If SMTP configuration is incomplete, fallback to console logger
  if (!host || !user || !pass) {
    console.log("=== NODEMAILER DEVELOPMENT FALLBACK ===");
    console.log(`To: ${to}`);
    console.log(`From: ${from}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (text): ${text}`);
    console.log("======================================");
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // True for 465, false for 587
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log(`Nodemailer email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Nodemailer transmission error:", error);
    return false;
  }
}
