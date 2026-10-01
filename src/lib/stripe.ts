import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) throw new Error("STRIPE_SECRET_KEY is not configured");
  stripe ||= new Stripe(apiKey);
  return stripe;
}
