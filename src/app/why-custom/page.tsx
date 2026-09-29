import type { Metadata } from "next";
import ComparisonView from "@/components/comparison/ComparisonView";
import { getComparisonPage } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Custom Website vs Squarespace, Webflow & WordPress | Jordan Lang",
  description: "Compare custom-built Next.js websites against Squarespace, Webflow, and WordPress. See real performance scores, pricing, SEO capabilities, and long-term costs. Make an informed decision for your business.",
  alternates: { canonical: "/why-custom" },
  openGraph: {
    title: "Custom Website vs Squarespace, Webflow & WordPress | Jordan Lang",
    description: "Compare custom-built Next.js websites against Squarespace, Webflow, and WordPress. See real performance scores, pricing, SEO capabilities, and long-term costs.",
    type: "website",
  },
};

export default async function WhyCustomPage() {
  const pageData = await getComparisonPage();

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Comparison page content not available</h1>
        <p className="mt-4 text-muted-foreground">Please check back later.</p>
      </div>
    );
  }

  return <ComparisonView data={pageData} />;
}
