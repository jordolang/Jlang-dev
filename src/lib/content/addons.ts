/**
 * Optional extras offered on the /services and /promo order forms.
 *
 * Both pages previously carried identical copies of this list; they now share this one.
 * It also seeds the `addonFeature` documents in Sanity, and doubles as the fallback if the
 * CMS has none.
 */
export interface AddonFeature {
  icon: string;
  name: string;
  desc: string;
  price: number;
}

export const ADDON_FEATURES: AddonFeature[] = [
  { icon: "solar:shop-bold", name: "E-commerce Integration", desc: "Shopping cart & payment processing", price: 299 },
  { icon: "solar:document-text-bold", name: "Blog/CMS System", desc: "Manage your own content easily", price: 99 },
  { icon: "solar:chat-round-bold", name: "Live Chat Widget", desc: "Real-time customer support", price: 99 },
  { icon: "solar:calendar-bold", name: "Booking System", desc: "Appointment scheduling functionality", price: 199 },
  { icon: "solar:letter-bold", name: "Email Marketing Integration", desc: "Newsletter and email campaigns", price: 49 },
  { icon: "solar:users-group-rounded-bold", name: "User Authentication", desc: "Login and member areas", price: 99 },
  { icon: "solar:translation-bold", name: "Multi-language Support", desc: "Reach international audiences", price: 199 },
  { icon: "solar:database-bold", name: "Custom Database Integration", desc: "Connect to external data sources", price: 199 },
  { icon: "solar:gallery-bold", name: "Advanced Photo Gallery", desc: "Professional image showcase", price: 39 },
  { icon: "solar:video-frame-bold", name: "Video Background/Hero", desc: "Dynamic video presentation", price: 49 },
  { icon: "solar:graph-new-bold", name: "Analytics Dashboard", desc: "Custom reporting & insights", price: 99 },
  { icon: "solar:map-point-bold", name: "Interactive Maps", desc: "Location features & directions", price: 49 },
  { icon: "solar:review-bold", name: "Review System", desc: "Customer reviews & ratings", price: 99 },
  { icon: "solar:bell-bold", name: "Push Notifications", desc: "Real-time user notifications", price: 199 },
  { icon: "solar:document-add-bold", name: "Advanced Forms", desc: "Custom forms & lead capture", price: 99 },
  { icon: "solar:chart-bold", name: "Data Visualization", desc: "Charts, graphs & metrics", price: 99 },
  { icon: "solar:share-bold", name: "Social Media Feed", desc: "Display your social content", price: 99 },
  { icon: "solar:shield-check-bold", name: "Advanced Security", desc: "2FA, encryption & monitoring", price: 99 },
  { icon: "solar:document-bold", name: "PDF Generation", desc: "Dynamic document creation", price: 99 },
  { icon: "solar:box-bold", name: "Inventory Management", desc: "Track products & stock", price: 199 },
  { icon: "solar:hashtag-bold", name: "Forum/Community", desc: "User discussion platform", price: 49 },
  { icon: "solar:ticket-bold", name: "Event Ticketing", desc: "Sell & manage event tickets", price: 199 },
];
