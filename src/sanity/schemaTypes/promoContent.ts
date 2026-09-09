import { defineField, defineType } from "sanity";

export const promoContentType = defineType({
  name: "promoContent",
  title: "Promo page",
  type: "document",
  description: "The limited-time offer copy on /promo. There is only one of these.",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", description: 'e.g. "EXCLUSIVE EMAIL OFFER".' }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "subhead", title: "Subheadline", type: "text", rows: 2 }),
    defineField({ name: "attributionOffer", title: "Attribution offer", type: "string", description: "The extra discount for letting you showcase the work." }),
    defineField({ name: "attributionCheckboxLabel", title: "Attribution checkbox label", type: "string" }),
    defineField({ name: "active", title: "Promo active", type: "boolean", initialValue: true, description: "Turn off to hide the promo pricing." }),
  ],
  preview: { select: { title: "headline" }, prepare: ({ title }) => ({ title: title || "Promo page" }) },
});
