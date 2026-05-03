// packages/emails/src/send.ts

import { randomUUID } from "node:crypto";
import type { ReactElement } from "react";

type SendInput = {
  to: string | string[];
  subject: string;
  react?: ReactElement;
  text?: string;
  html?: string;
};

export async function sendEmail(input: SendInput): Promise<{ id: string }> {
  const id = `console-noop-${randomUUID()}`;
  console.info(
    "[email:stub]",
    JSON.stringify(
      {
        id,
        to: input.to,
        subject: input.subject,
        hasReact: !!input.react,
        text: input.text,
        html: input.html,
      },
      null,
      2,
    ),
  );
  return { id };
}
