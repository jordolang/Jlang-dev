import Background from "@/components/portfolio/Background";
import HeroSection from "@/components/portfolio/HeroSection";
import Navigation from "@/components/portfolio/Navigation";
import OverviewSection from "@/components/portfolio/OverviewSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import Footer from "@/components/portfolio/Footer";
import ScrollStory from "@/components/portfolio/ScrollStory";
import CapabilitiesSection from "@/components/portfolio/CapabilitiesSection";
import CtaBand from "@/components/portfolio/CtaBand";
import {
  LazyBlogSection,
  LazyTechStackSection,
  LazyProjectsSection,
  LazyServicesSection,
  LazyTestimonialsSection,
  LazyContactSection,
} from "@/components/portfolio/LazySections";
import {
  getAboutContent,
  getExperience,
  getFaqs,
  getProjects,
  getSectionHeadings,
  getServicePackages,
  getSiteSettings,
  getTechStack,
} from "@/lib/cms";
import { getLatestBlogPosts } from "@/lib/blog";
import { getApprovedTestimonials } from "@/lib/reviews";
import { JsonLd } from "@/components/JsonLd";
import { generatePersonSchema, generateFAQPageSchema, SITE_URL } from "@/lib/schema";

export default async function Portfolio() {
  // One server-side pass for the whole page. Anything the CMS doesn't have comes back
  // null/empty and each section falls back to the content bundled in the component.
  const [
    settings,
    about,
    headings,
    projects,
    experience,
    techStack,
    packages,
    faqs,
    posts,
    testimonials,
  ] = await Promise.all([
    getSiteSettings(),
    getAboutContent(),
    getSectionHeadings(),
    getProjects(),
    getExperience(),
    getTechStack(),
    getServicePackages(),
    getFaqs(),
    getLatestBlogPosts(15),
    getApprovedTestimonials(),
  ]);

  // Generate structured data for SEO
  const personSchema = generatePersonSchema({
    name: settings?.name || "Jordan Lang",
    jobTitle: "Web Developer & IT Specialist",
    url: SITE_URL,
    email: settings?.publicEmail,
    image: settings?.ogImage || `${SITE_URL}/og-jlang.jpg`,
    sameAs: settings?.socials?.map((social) => social.href).filter(Boolean),
  });

  const faqSchema = faqs?.length
    ? generateFAQPageSchema({ questions: faqs })
    : null;

  return (
    <div className="min-h-screen text-gray-900 dark:text-white relative">
      {/* Structured data for SEO */}
      <JsonLd data={personSchema} id="person-schema" />
      {faqSchema && <JsonLd data={faqSchema} id="faq-schema" />}

      {/* Background (static, server) */}
      <Background />

      {/* Navigation landmark */}
      <Navigation items={settings?.navItems} />

      {/* Main content landmark */}
      <main id="main-content">
        {/* Full-bleed cinematic opening: video hero, then the pinned scroll story */}
        <HeroSection content={settings ?? undefined} />
        <ScrollStory />

        <div className="max-w-6xl mx-auto px-6">
          <CapabilitiesSection />
          <OverviewSection
            content={about ?? undefined}
            contact={settings ?? undefined}
            heading={headings?.overview}
          />

          {/* Below the fold — interactive sections lazy-mount on scroll;
              Experience + Footer are static server components rendered directly. */}
          <LazyBlogSection
            posts={posts.map(post => ({
              ...post,
              tags: post.tags.map(t => t.name)
            }))}
            heading={headings?.blog}
          />
          <LazyTechStackSection stack={techStack ?? undefined} heading={headings?.stack} />
          <ExperienceSection
            items={experience ?? undefined}
            stats={about?.stats ?? undefined}
            heading={headings?.experience}
          />
          <LazyProjectsSection projects={projects ?? undefined} heading={headings?.projects} />
          <LazyServicesSection
            packages={packages ?? undefined}
            faqs={faqs ?? undefined}
            heading={headings?.services}
          />
          <LazyTestimonialsSection testimonials={testimonials} heading={headings?.testimonials} />
        </div>

        <CtaBand />

        <div className="max-w-6xl mx-auto px-6 pt-20">
          <LazyContactSection
            email={settings?.email}
            publicEmail={settings?.publicEmail}
            heading={headings?.contact}
          />
        </div>
      </main>

      {/* Footer contentinfo landmark */}
      <div className="max-w-6xl mx-auto px-6">
        <Footer text={settings?.footerText} />
      </div>
    </div>
  );
}
