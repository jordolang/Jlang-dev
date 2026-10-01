/**
 * Email template functions for client review workflow
 * Extracted from webhook route for reusability across the application
 */

/**
 * Escapes HTML special characters to prevent XSS
 */
export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ||
      character
  );
}

/**
 * Base email wrapper with consistent styling
 */
function emailWrapper(content: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.65">
      ${content}
    </div>`;
}

/**
 * Styled button for emails
 */
function emailButton(href: string, text: string): string {
  return `<a href="${href}" style="display:inline-block;background:#4f46e5;color:white;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700">${escapeHtml(
    text
  )}</a>`;
}

/**
 * Small disclaimer text
 */
function emailDisclaimer(text: string): string {
  return `<p style="font-size:13px;color:#667085">${escapeHtml(text)}</p>`;
}

/**
 * Email template for initial review request sent to client
 */
export interface ReviewRequestEmailData {
  clientName: string;
  company: string;
  reviewUrl: string;
}

export function reviewRequestEmail(data: ReviewRequestEmailData): string {
  return emailWrapper(`
    <h1 style="font-size:28px">A quick review would mean a lot</h1>
    <p>Hi ${escapeHtml(data.clientName)},</p>
    <p>Thank you for trusting JLang Development with ${escapeHtml(
      data.company
    )}. Would you take a moment to share your experience?</p>
    <p>${emailButton(data.reviewUrl, "Write your review")}</p>
    ${emailDisclaimer("This private link is intended for you and can be used once.")}
  `);
}

/**
 * Email template for notifying Jordan when a client submits a review
 */
export interface ReviewReceivedEmailData {
  clientName: string;
  company: string;
  role: string;
  rating: number;
  testimonial: string;
  dashboardUrl: string;
}

export function reviewReceivedEmail(data: ReviewReceivedEmailData): string {
  const stars = "⭐".repeat(data.rating);
  return emailWrapper(`
    <h1 style="font-size:28px">New Review Received</h1>
    <p><strong>${escapeHtml(data.clientName)}</strong> from ${escapeHtml(
    data.company
  )} has submitted a review:</p>
    <div style="background:#f9fafb;border-left:4px solid #4f46e5;padding:16px;margin:20px 0">
      <p style="margin:0 0 8px;font-weight:700">${stars} ${data.rating}/5</p>
      <p style="margin:0;font-style:italic">"${escapeHtml(data.testimonial)}"</p>
      <p style="margin:12px 0 0;font-size:14px;color:#667085">— ${escapeHtml(
        data.clientName
      )}, ${escapeHtml(data.role)}</p>
    </div>
    <p>${emailButton(data.dashboardUrl, "View in Dashboard")}</p>
    ${emailDisclaimer("You can respond with a thank-you message or request revisions before publishing.")}
  `);
}

/**
 * Email template for notifying client when Jordan responds to their review
 */
export interface JordanResponseEmailData {
  clientName: string;
  message: string;
  action: "publish" | "request_revision";
  reviewUrl: string;
}

export function jordanResponseEmail(data: JordanResponseEmailData): string {
  const isPublished = data.action === "publish";
  const title = isPublished
    ? "Your review has been published!"
    : "Jordan has responded to your review";

  return emailWrapper(`
    <h1 style="font-size:28px">${title}</h1>
    <p>Hi ${escapeHtml(data.clientName)},</p>
    <p>Jordan from JLang Development has responded to your review:</p>
    <div style="background:#f9fafb;border-left:4px solid #4f46e5;padding:16px;margin:20px 0">
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(data.message)}</p>
    </div>
    ${
      isPublished
        ? `<p>Your review is now live on the JLang Development website. Thank you for taking the time to share your experience!</p>`
        : `<p>${emailButton(data.reviewUrl, "View Your Review")}</p>
    ${emailDisclaimer("You can view the full conversation and make any requested changes.")}`
    }
  `);
}

/**
 * Email template for notifying client when their review is published (alternative to jordanResponseEmail)
 */
export interface ReviewPublishedEmailData {
  clientName: string;
  company: string;
  websiteUrl: string;
}

export function reviewPublishedEmail(data: ReviewPublishedEmailData): string {
  return emailWrapper(`
    <h1 style="font-size:28px">Your review is live!</h1>
    <p>Hi ${escapeHtml(data.clientName)},</p>
    <p>Thank you for sharing your experience working with JLang Development on ${escapeHtml(
      data.company
    )}.</p>
    <p>Your review is now published and helping others learn about our work.</p>
    <p>${emailButton(data.websiteUrl, "See your review")}</p>
    ${emailDisclaimer("Thank you for your trust and partnership!")}
  `);
}
