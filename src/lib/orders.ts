import "server-only";
import { generateDownloadToken } from "./download-tokens";
import { getResend } from "./resend";

export interface DownloadItem {
  productId: string;
  productName: string;
}

/** How long a buyer must wait before asking for fresh links again. */
export const RESEND_COOLDOWN_MS = 5 * 60 * 1000;

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev").replace(/\/$/, "");
}

/** Emails signed, expiring download links for each item. Throws if the email can't be sent. */
export async function sendDownloadEmail(email: string, items: DownloadItem[], options: { orderId?: string; resend?: boolean } = {}) {
  const links = items.map((item) => ({
    ...item,
    url: `${siteUrl()}/api/download/${encodeURIComponent(generateDownloadToken(item.productId, email))}`,
  }));
  const recoverUrl = `${siteUrl()}/products/downloads`;

  const { error } = await getResend().emails.send({
    from: process.env.PURCHASE_EMAIL_FROM || "JLang Development <orders@jlang.dev>",
    to: email,
    subject: options.resend ? "Your download links" : "Your purchase is ready - Download now",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.65">
        <h1 style="font-size:28px">${options.resend ? "Here are your downloads" : "Thank you for your purchase!"}</h1>
        <p>${links.length > 1 ? "Your digital products are" : "Your digital product is"} ready to download.</p>
        ${links
          .map(
            (link) => `
        <p style="margin:18px 0 6px;font-weight:700">${escapeHtml(link.productName)}</p>
        <p><a href="${link.url}" style="display:inline-block;background:#4f46e5;color:white;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700">Download</a></p>`,
          )
          .join("")}
        <p style="font-size:13px;color:#667085">These links are unique to you and expire after 24 hours. You can get fresh ones any time at <a href="${recoverUrl}">${recoverUrl.replace(/^https?:\/\//, "")}</a>.</p>
        ${options.orderId ? `<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"><p style="font-size:13px;color:#667085">Order ID: ${escapeHtml(options.orderId)}</p>` : ""}
      </div>`,
  });
  if (error) throw new Error(error.message);
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
