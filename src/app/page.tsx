import Background from "@/components/portfolio/Background";
import HeroSection from "@/components/portfolio/HeroSection";
import Navigation from "@/components/portfolio/Navigation";
import OverviewSection from "@/components/portfolio/OverviewSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import Footer from "@/components/portfolio/Footer";
import {
  LazyBlogSection,
  LazyTechStackSection,
  LazyCertificationsSection,
  LazyProjectsSection,
  LazyServicesSection,
  LazyTestimonialsSection,
  LazyContactSection,
} from "@/components/portfolio/LazySections";
import {
  getAboutContent,
  getCertifications,
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
    certifications,
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
    getCertifications(),
    getServicePackages(),
    getFaqs(),
    getLatestBlogPosts(3),
    getApprovedTestimonials(),
  ]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white relative">
      {/* Background (static, server) */}
      <Background />

      {/* Navigation */}
      <Navigation items={settings?.navItems} />

      <div className="max-w-6xl mx-auto px-6 pt-24">
        {/* Above the fold */}
        <HeroSection content={settings ?? undefined} />
        <OverviewSection
          content={about ?? undefined}
          contact={settings ?? undefined}
          heading={headings?.overview}
        />

        {/* Below the fold — interactive sections lazy-mount on scroll;
            Experience + Footer are static server components rendered directly. */}
        <LazyBlogSection posts={posts} heading={headings?.blog} />
        <LazyTechStackSection stack={techStack ?? undefined} heading={headings?.stack} />
        <ExperienceSection
          items={experience ?? undefined}
          stats={about?.stats ?? undefined}
          heading={headings?.experience}
        />
        <LazyCertificationsSection
          items={certifications ?? undefined}
          heading={headings?.certifications}
        />
        <LazyProjectsSection projects={projects ?? undefined} heading={headings?.projects} />
        <LazyServicesSection
          packages={packages ?? undefined}
          faqs={faqs ?? undefined}
          heading={headings?.services}
        />
        <LazyTestimonialsSection testimonials={testimonials} heading={headings?.testimonials} />
        <LazyContactSection
          email={settings?.email}
          publicEmail={settings?.publicEmail}
          heading={headings?.contact}
        />
        <Footer text={settings?.footerText} />
      </div>
    </div>
  );
}
