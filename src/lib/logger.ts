/**
 * Lightweight logger that stays silent in production.
 *
 * Keeps the browser console clean for visitors and avoids leaking diagnostic
 * detail (config, request payloads) in production builds. Genuine submission
 * failures are still captured in PostHog via `trackEvent(..., status: 'error')`,
 * so production observability is unaffected.
 */
const isDev = process.env.NODE_ENV !== "production";

export const logger = {
  error: (message: string, ...context: unknown[]): void => {
    if (isDev) console.error(message, ...context);
  },
  warn: (message: string, ...context: unknown[]): void => {
    if (isDev) console.warn(message, ...context);
  },
};
