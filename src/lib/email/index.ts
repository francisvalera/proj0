import { getEffectiveSettings } from "@/lib/config/settings";
import { sendWithSmtp } from "./providers/smtp";

export type SendEmailArgs = {
  to: string;
  subject: string;
  component: any; // React.FC
  props: any;
};

export async function sendEmail(args: SendEmailArgs) {
  const settings = await getEffectiveSettings();
  const from = settings.fromEmail;
  return sendWithSmtp({ from, ...args });
}