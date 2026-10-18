import type { Metadata } from "next";
import ResumeView from "@/components/resume/ResumeView";
import { JsonLd } from "@/components/JsonLd";
import { getResume } from "@/lib/resume";
import { SITE_URL } from "@/lib/schema";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Résumé | Jordan Lang",
  description: "Jordan Lang's résumé: founder and lead developer at JLang Development, recent projects, experience, skills and credentials.",
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Résumé | Jordan Lang",
    description: "Founder and lead developer at JLang Development. Recent projects, experience, skills and credentials.",
    type: "profile",
    url: `${SITE_URL}/resume`,
  },
};

export default async function ResumePage() {
  const resume = await getResume();

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: resume.name,
    jobTitle: resume.currentRole.role,
    worksFor: { "@type": "Organization", name: resume.currentRole.company, url: resume.currentRole.website },
    address: { "@type": "PostalAddress", addressLocality: resume.location },
    email: `mailto:${resume.email}`,
    url: `${SITE_URL}/resume`,
    ...(resume.photo ? { image: new URL(resume.photo, SITE_URL).toString() } : {}),
    sameAs: resume.links.map((link) => link.href),
    hasCredential: resume.credentials.map((item) => ({
      "@type": "EducationalOccupationalCredential",
      name: item.title,
      recognizedBy: { "@type": "Organization", name: item.issuer },
      ...(item.url ? { url: item.url } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={person} />
      <ResumeView resume={resume} />
    </>
  );
}
