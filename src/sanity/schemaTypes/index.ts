import { aboutContentType } from "./aboutContent";
import { addonFeatureType } from "./addonFeature";
import { blockContentType } from "./blockContent";
import { blogPostType } from "./blogPost";
import { categoryType } from "./category";
import { clientProjectType } from "./clientProject";
import { clientType } from "./client";
import { comparisonPageType } from "./comparisonPage";
import { digitalProductType } from "./digitalProduct";
import { experienceType } from "./experience";
import { faqType } from "./faq";
import { leadType } from "./lead";
import { magicLinkTokenType } from "./magicLinkToken";
import { orderType } from "./order";
import { portalDeliverableType } from "./portalDeliverable";
import { portalMessageType } from "./portalMessage";
import { projectType } from "./project";
import { promoContentType } from "./promoContent";
import { reviewRequestType } from "./reviewRequest";
import { sectionContentType } from "./sectionContent";
import { servicePackageType } from "./servicePackage";
import { siteSettingsType } from "./siteSettings";
import { socialPostType } from "./socialPost";
import { tagType } from "./tag";
import { techItemType } from "./techItem";
import { testimonialType } from "./testimonial";

export const schemaTypes = [
  // Singletons
  siteSettingsType,
  aboutContentType,
  promoContentType,
  comparisonPageType,

  // Collections
  projectType,
  experienceType,
  techItemType,
  servicePackageType,
  addonFeatureType,
  faqType,
  blogPostType,
  categoryType,
  tagType,
  testimonialType,
  sectionContentType,
  reviewRequestType,
  clientType,
  clientProjectType,
  magicLinkTokenType,
  portalMessageType,
  portalDeliverableType,
  digitalProductType,
  socialPostType,
  leadType,
  orderType,

  // Object types
  blockContentType,
];

/** Document types that should only ever have one instance, stored under a fixed document id. */
export const SINGLETON_TYPES = ["siteSettings", "aboutContent", "promoContent", "comparisonPage"] as const;
