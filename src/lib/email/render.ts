import { render } from "@react-email/components";
import * as React from "react";

export async function renderEmail(Comp: React.FC<any>, props: any) {
  const element = React.createElement(Comp, props);
  const html = await render(element, { pretty: true }); // Await because render returns Promise<string>
  const text = await render(element, { plainText: true }); // Await because render returns Promise<string>
  return { html, text };
}