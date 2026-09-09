import { aboutContentType } from "./aboutContent";
import { addonFeatureType } from "./addonFeature";
import { blockContentType } from "./blockContent";
import { blogPostType } from "./blogPost";
import { certificationType } from "./certification";
import { experienceType } from "./experience";
import { faqType } from "./faq";
import { projectType } from "./project";
import { promoContentType } from "./promoContent";
import { reviewRequestType } from "./reviewRequest";
import { sectionContentType } from "./sectionContent";
import { servicePackageType } from "./servicePackage";
import { siteSettingsType } from "./siteSettings";
import { techItemType } from "./techItem";
import { testimonialType } from "./testimonial";

export const schemaTypes = [
  // Singletons
  siteSettingsType,
  aboutContentType,
  promoContentType,

  // Collections
  projectType,
  experienceType,
  techItemType,
  certificationType,
  servicePackageType,
  addonFeatureType,
  faqType,
  blogPostType,
  testimonialType,
  sectionContentType,
  reviewRequestType,

  // Object types
  blockContentType,
];

/** Document types that should only ever have one instance, stored under a fixed document id. */
export const SINGLETON_TYPES = ["siteSettings", "aboutContent", "promoContent"] as const;
