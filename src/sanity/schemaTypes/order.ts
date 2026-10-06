import { defineField, defineType } from "sanity";

/** A paid digital product purchase, written by the Stripe webhook. Lets buyers recover lost download links. */
export const orderType = defineType({
  name: "order",
  title: "Orders",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "email", title: "Customer email", type: "string" }),
    defineField({ name: "customerName", title: "Customer name", type: "string" }),
    defineField({ name: "product", title: "Product", type: "reference", to: [{ type: "digitalProduct" }], weak: true }),
    defineField({ name: "productName", title: "Product name", type: "string" }),
    defineField({ name: "amountTotal", title: "Amount paid (USD)", type: "number" }),
    defineField({ name: "currency", title: "Currency", type: "string" }),
    defineField({ name: "stripeSessionId", title: "Stripe checkout session", type: "string" }),
    defineField({ name: "livemode", title: "Live payment", type: "boolean", description: "False for Stripe test-mode purchases." }),
    defineField({ name: "purchasedAt", title: "Purchased", type: "datetime" }),
    defineField({ name: "lastLinkSentAt", title: "Last download link sent", type: "datetime" }),
    defineField({ name: "purchaseTracked", title: "Sent to analytics", type: "boolean", hidden: true }),
  ],
  orderings: [{ title: "Newest first", name: "purchasedAtDesc", by: [{ field: "purchasedAt", direction: "desc" }] }],
  preview: {
    select: { email: "email", productName: "productName", amount: "amountTotal", livemode: "livemode", purchasedAt: "purchasedAt" },
    prepare: ({ email, productName, amount, livemode, purchasedAt }) => ({
      title: `${productName ?? "Product"} · ${email ?? ""}`,
      subtitle: [
        typeof amount === "number" ? `$${amount.toFixed(2)}` : null,
        livemode === false ? "TEST" : null,
        purchasedAt ? new Date(purchasedAt).toLocaleDateString() : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
