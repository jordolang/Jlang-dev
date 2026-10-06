export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
  /** Which form sent it, so inquiries can be told apart in Studio. */
  source?: "contact" | "services" | "promo";
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  /** Spam checks: the hidden honeypot, when the form was rendered, and the Turnstile token if enabled. */
  website?: string;
  startedAt?: number;
  turnstileToken?: string;
}

/** Choices offered by the homepage contact form, kept here so the API can accept exactly these. */
export const PROJECT_TYPES = ["New website", "Web app or portal", "Mobile app", "Redesign or upgrade", "IT or automation help", "Something else"];
export const BUDGET_RANGES = ["Under $1,000", "$1,000 – $5,000", "$5,000 – $15,000", "$15,000+", "Not sure yet"];
export const TIMELINES = ["As soon as possible", "Within 1–3 months", "3+ months out", "Flexible"];

/** Sends a form submission to /api/contact, which saves it and emails it to the site owner. Throws on failure. */
export async function sendContactMessage(payload: ContactMessage): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, pagePath: typeof window !== "undefined" ? window.location.pathname : undefined }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || `Contact request failed (${response.status})`);
  }
}
