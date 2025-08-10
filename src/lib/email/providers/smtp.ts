import nodemailer from "nodemailer";
import { renderEmail } from "@/lib/email/render";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendWithSmtp({ from, to, subject, component, props }: any) {
  const { html, text } = await renderEmail(component, props);
  const mailOptions = {
    from,
    to,
    subject,
    html, // string now, not Promise<string>
    text, // string now, not Promise<string>
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}