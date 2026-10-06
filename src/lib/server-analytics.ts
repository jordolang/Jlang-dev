import "server-only";
import { PostHog } from "posthog-node";

/**
 * Captures an event from the server, for things the browser never sees (a payment clearing in a
 * Stripe webhook). Never throws: analytics must not break fulfilment.
 */
export async function captureServerEvent(distinctId: string, event: string, properties: Record<string, unknown> = {}) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  const client = new PostHog(key, {
    host: [process.env.POSTHOG_HOST, process.env.NEXT_PUBLIC_POSTHOG_HOST].find((h) => h?.startsWith("http")) || "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
  try {
    client.capture({ distinctId, event, properties });
    await client.shutdown();
  } catch (error) {
    console.error(`Failed to capture ${event}:`, error);
  }
}
