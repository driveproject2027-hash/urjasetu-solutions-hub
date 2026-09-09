import * as React from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import { TEMPLATES } from "./registry";

// Server-only: reads RESEND_API_KEY. Never import from client components.

// Configuration
const SITE_NAME = "LayaGreenEnergy";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@urjasetu.dev";

const resend = new Resend(process.env.RESEND_API_KEY);

export type SendTemplateEmailResult =
  { sent: true } | { sent: false; reason: "recipient_suppressed" | "failed" };

export interface SendTemplateEmailOptions {
  templateData?: Record<string, any>;
  /** Dedupes retries of the same logical send; defaults to a random UUID (no dedupe). */
  idempotencyKey?: string;
  replyTo?: string;
}

/**
 * Renders a registered template and sends it through Resend's email API.
 * Retries and rate limits are enforced by Resend server-side.
 */
export async function sendTemplateEmail(
  templateName: string,
  to: string,
  options: SendTemplateEmailOptions = {},
): Promise<SendTemplateEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(
      `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(", ")}`,
    );
  }

  // Template-level `to` takes precedence — notification templates always
  // send to their fixed address.
  const recipient = template.to || to;
  if (!recipient) {
    throw new Error("Recipient is required (the template defines no fixed recipient)");
  }

  const templateData = options.templateData ?? {};
  const element = React.createElement(template.component, templateData);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const subject =
    typeof template.subject === "function" ? template.subject(templateData) : template.subject;

  try {
    const result = await resend.emails.send({
      to: recipient,
      from: `${SITE_NAME} <${FROM_EMAIL}>`,
      subject,
      html,
      text,
      reply_to: options.replyTo,
    });

    if (result.error) {
      console.error(`Email send error for ${templateName}:`, result.error);
      return { sent: false, reason: "failed" };
    }

    return { sent: true };
  } catch (error) {
    console.error(`Email send error for ${templateName}:`, error);
    return { sent: false, reason: "failed" };
  }
}
