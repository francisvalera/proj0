import * as React from "react";
import { sendWithSmtp } from "@/lib/email/providers/smtp";

export type EmailProps = Record<string, unknown>;

export interface SendEmailArgs<TProps extends EmailProps> {
  to: string;
  subject: string;
  component: React.ComponentType<TProps>;
  props: TProps;
  from?: string;
}

export async function sendEmail<TProps extends EmailProps>({ to, subject, component, props, from }: SendEmailArgs<TProps>) {
  const effectiveFrom = from ?? process.env.EMAIL_FROM ?? "Kuya Kards Motorcycle Trading <no-reply@example.com>";
  return sendWithSmtp({ from: effectiveFrom, to, subject, component, props });
}
