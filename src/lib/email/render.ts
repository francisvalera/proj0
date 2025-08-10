import { render } from "@react-email/render";
import * as React from "react";

export type EmailRenderProps = Record<string, unknown>;

export async function renderEmail<TProps extends EmailRenderProps>(
  Comp: React.ComponentType<TProps>,
  props: TProps
): Promise<{ html: string; text: string }> {
  const element = React.createElement(Comp, props);

  // Newer versions of @react-email/render return a Promise<string>
  const html: string = await render(element);

  const text: string = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return { html, text };
}