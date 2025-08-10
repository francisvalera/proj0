import nodemailer, { SendMailOptions } from "nodemailer";
import * as React from "react";
import { renderEmail } from "@/lib/email/render";

export type SmtpProps = Record<string, unknown>;

export interface SendWithSmtpArgs<TProps extends SmtpProps> {
  from: string;
  to: string;
  subject: string;
  component: React.ComponentType<TProps>;
  props: TProps;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendWithSmtp<TProps extends SmtpProps>({
  from,
  to,
  subject,
  component,
  props,
}: SendWithSmtpArgs<TProps>) {
  // Await the async renderer
  const { html, text } = await renderEmail(component, props);

  const mailOptions: SendMailOptions = {
    from,
    to,
    subject,
    html,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}
