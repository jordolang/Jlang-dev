import { defineLocations, type DocumentLocationResolvers } from "sanity/presentation";

/** Most content types render into a section of the home page rather than a page of their own. */
function homePage(title: string) {
  return defineLocations({
    message: `${title} appear on the home page.`,
    locations: [{ title: "Home", href: "/" }],
  });
}

function servicesPage(title: string) {
  return defineLocations({
    message: `${title} appear on the services page.`,
    locations: [
      { title: "Services", href: "/services" },
      { title: "Home", href: "/" },
    ],
  });
}

/**
 * Tells Presentation which URL to open for the document being edited, so the preview pane follows
 * the editor instead of sitting on whatever page it happened to load first.
 */
export const locations: DocumentLocationResolvers = {
  blogPost: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        { title: doc?.title || "Untitled post", href: `/blog/${doc?.slug}` },
        { title: "All posts", href: "/blog" },
      ],
    }),
  }),

  siteSettings: defineLocations({
    message: "Site settings affect every page.",
    locations: [
      { title: "Home", href: "/" },
      { title: "Services", href: "/services" },
      { title: "Blog", href: "/blog" },
    ],
  }),

  promoContent: defineLocations({
    message: "The promo page.",
    locations: [{ title: "Promo", href: "/promo" }],
  }),

  aboutContent: homePage("About / overview"),
  project: homePage("Projects"),
  experience: homePage("Experience"),
  techItem: homePage("Tech stack"),
  certification: homePage("Certifications"),
  testimonial: homePage("Testimonials"),
  sectionContent: homePage("Section headings"),

  servicePackage: servicesPage("Service packages"),
  addonFeature: servicesPage("Add-on features"),
  faq: servicesPage("FAQs"),
};
