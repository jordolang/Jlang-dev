import { NextResponse } from "next/server";
import { alertOwner } from "@/lib/alerts";
import { RESEND_COOLDOWN_MS, sendDownloadEmail } from "@/lib/orders";
import { checkSpam, clientIp } from "@/lib/spam";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

interface OrderRow {
  _id: string;
  productId: string;
  productName: string;
  lastLinkSentAt?: string;
}

/**
 * Emails fresh download links for every past purchase made with this address. The response is the
 * same whether or not orders exist, so the form can't be used to learn who bought what.
 */
export async function POST(request: Request) {
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Download recovery isn't available right now." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase().slice(0, 320);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const verdict = await checkSpam(body ?? {}, clientIp(request));
  if (!verdict.ok) {
    if (verdict.silent) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Please complete the verification and try again." }, { status: 400 });
  }

  const orders = await sanityClient.fetch<OrderRow[]>(
    `*[_type == "order" && lower(email) == $email && defined(product._ref)] | order(purchasedAt desc) {
      _id, "productId": product._ref, productName, lastLinkSentAt
    }`,
    { email },
  );

  // One email per address per cooldown, however often the form is submitted.
  const cutoff = Date.now() - RESEND_COOLDOWN_MS;
  const recentlySent = orders.some((order) => order.lastLinkSentAt && Date.parse(order.lastLinkSentAt) > cutoff);
  if (orders.length && !recentlySent) {
    const items = [...new Map(orders.map((order) => [order.productId, order])).values()];
    try {
      await sendDownloadEmail(email, items, { resend: true });
      const now = new Date().toISOString();
      const transaction = sanityClient.transaction();
      for (const order of orders) transaction.patch(order._id, (patch) => patch.set({ lastLinkSentAt: now }));
      await transaction.commit();
    } catch (error) {
      await alertOwner("Could not resend download links", { error, email });
      return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
