import type { StructureResolver } from "sanity/structure";
import { ContentCalendar } from "./views/ContentCalendar";
import { ReviewDashboard } from "./components/ReviewDashboard";

/**
 * Studio navigation. Singletons open straight into their one document rather than
 * a list you could accidentally add a second entry to.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Review Dashboard")
        .id("reviewDashboard")
        .child(S.component(ReviewDashboard).title("Review Dashboard")),

      S.listItem()
        .title("Inquiries")
        .id("inquiries")
        .child(
          S.list()
            .title("Inquiries")
            .items([
              S.listItem()
                .title("Open")
                .id("openLeads")
                .child(
                  S.documentList()
                    .title("Open inquiries")
                    .schemaType("lead")
                    .filter('_type == "lead" && !(status in ["won", "lost", "spam"])')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
                ),
              S.documentTypeListItem("lead").title("All inquiries"),
            ]),
        ),
      S.documentTypeListItem("order").title("Orders"),

      S.divider(),

      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site settings")),
      S.listItem()
        .title("About / Overview")
        .id("aboutContent")
        .child(S.document().schemaType("aboutContent").documentId("aboutContent").title("About / Overview")),
      S.listItem()
        .title("Promo page")
        .id("promoContent")
        .child(S.document().schemaType("promoContent").documentId("promoContent").title("Promo page")),

      S.divider(),

      S.listItem()
        .title("Content Calendar")
        .id("contentCalendar")
        .child(S.component(ContentCalendar).title("Content Calendar")),

      S.divider(),

      S.documentTypeListItem("blogPost").title("Blog posts"),
      S.documentTypeListItem("socialPost").title("Social posts"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("experience").title("Experience"),
      S.documentTypeListItem("techItem").title("Tech stack"),

      S.divider(),

      S.documentTypeListItem("servicePackage").title("Service packages"),
      S.documentTypeListItem("addonFeature").title("Add-on features"),
      S.documentTypeListItem("faq").title("FAQs"),

      S.divider(),

      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("reviewRequest").title("Review requests"),
      S.documentTypeListItem("sectionContent").title("Section headings"),
    ]);
