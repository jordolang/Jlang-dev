export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/** Sends a form submission to /api/contact, which emails it to the site owner. Throws on failure. */
export async function sendContactMessage(payload: ContactMessage): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || `Contact request failed (${response.status})`);
  }
}
