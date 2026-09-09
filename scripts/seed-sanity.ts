/**
 * One-shot migration: pushes the content currently hardcoded in the site into Sanity,
 * uploading every referenced image into the asset library along the way.
 *
 *   npx tsx scripts/seed-sanity.ts          # create missing documents only
 *   npx tsx scripts/seed-sanity.ts --force  # overwrite documents that already exist
 *
 * Safe to re-run: documents use deterministic ids, and without --force existing ones are
 * left alone, so it never clobbers edits made in the Studio.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import matter from "gray-matter";

import { projects } from "../src/components/portfolio/ProjectsSection";
import { experience } from "../src/components/portfolio/ExperienceSection";
import { techStackData } from "../src/components/portfolio/TechStackSection";
import { certifications } from "../src/components/portfolio/CertificationsSection";
import { pricingPackages, faqs } from "../src/components/portfolio/ServicesSection";
import { defaultTestimonials } from "../src/components/portfolio/TestimonialsSection";
import { ADDON_FEATURES } from "../src/lib/content/addons";
import { markdownToPortableText } from "./lib/markdown-to-portable-text";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN (check .env.local).");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-01-01", useCdn: false });
const FORCE = process.argv.includes("--force");

/** Stable, readable document ids so re-runs update rather than duplicate. */
const id = (prefix: string, key: string) =>
  `${prefix}.${key.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const assetCache = new Map<string, string>();

/** Upload a file from /public into Sanity's asset library, once per path. */
async function uploadImage(publicPath: string): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } } | undefined> {
  if (!publicPath || publicPath.startsWith("http")) return undefined;

  const clean = publicPath.trim();
  if (assetCache.has(clean)) {
    return { _type: "image", asset: { _type: "reference", _ref: assetCache.get(clean)! } };
  }

  const filePath = path.join(process.cwd(), "public", clean.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) {
    console.warn(`  ! image not found, skipping: ${clean}`);
    return undefined;
  }

  const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  });
  assetCache.set(clean, asset._id);
  console.log(`  ↑ uploaded ${clean}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

/** Create the document, or replace it when --force. */
async function upsert(doc: Record<string, unknown> & { _id: string; _type: string }) {
  if (FORCE) {
    await client.createOrReplace(doc as never);
    return "replaced";
  }
  try {
    await client.create(doc as never);
    return "created";
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 409) return "exists";
    throw error;
  }
}

async function seedGroup(label: string, docs: (Record<string, unknown> & { _id: string; _type: string })[]) {
  const counts: Record<string, number> = {};
  for (const doc of docs) {
    const result = await upsert(doc);
    counts[result] = (counts[result] ?? 0) + 1;
  }
  const summary = Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(", ");
  console.log(`${label}: ${summary}`);
}

/**
 * The UI's feature list uses a positional convention: an emoji-led line is a category
 * header, "" is a spacer. Rebuild that into the structured groups the schema stores.
 */
function toFeatureGroups(features: string[]) {
  const isHeader = (line: string) => /^\p{Extended_Pictographic}/u.test(line);
  const groups: { _key: string; _type: "featureGroup"; category: string; items: string[] }[] = [];

  for (const line of features) {
    if (!line) continue;
    if (isHeader(line)) {
      groups.push({ _key: slugify(line).slice(0, 40) || `g${groups.length}`, _type: "featureGroup", category: line, items: [] });
    } else if (groups.length) {
      groups[groups.length - 1].items.push(line);
    } else {
      groups.push({ _key: `g${groups.length}`, _type: "featureGroup", category: "", items: [line] });
    }
  }
  return groups;
}

async function main() {
  console.log(`Seeding Sanity project ${projectId}/${dataset}${FORCE ? " (force)" : ""}\n`);

  // --- Add-on features first: service packages reference them. ---
  await seedGroup(
    "Add-on features",
    ADDON_FEATURES.map((feature, index) => ({
      _id: id("addon", feature.name),
      _type: "addonFeature",
      name: feature.name,
      desc: feature.desc,
      price: feature.price,
      icon: feature.icon,
      order: index,
    })),
  );

  // --- Service packages (promo prices come from the /promo page's variants). ---
  const promoPricing: Record<string, { promoPrice: string; promoBasePrice: number | null }> = {
    Launchpad: { promoPrice: "$400", promoBasePrice: 400 },
    Professional: { promoPrice: "Starting at $1,400+", promoBasePrice: 1400 },
    Enterprise: { promoPrice: "Custom Pricing (Contact Sales)", promoBasePrice: null },
  };
  const basePrices: Record<string, number | null> = { Launchpad: 499, Professional: 1499, Enterprise: null };

  await seedGroup(
    "Service packages",
    pricingPackages.map((pkg, index) => ({
      _id: id("package", pkg.name),
      _type: "servicePackage",
      name: pkg.name,
      slug: { _type: "slug", current: slugify(pkg.name) },
      description: pkg.description,
      price: pkg.price,
      basePrice: basePrices[pkg.name] ?? null,
      promoPrice: promoPricing[pkg.name]?.promoPrice ?? null,
      promoBasePrice: promoPricing[pkg.name]?.promoBasePrice ?? null,
      gradient: pkg.gradient,
      highlights: pkg.highlights,
      featureGroups: toFeatureGroups(pkg.features),
      addons: (pkg.addons ?? []).map((addon, addonIndex) => ({
        _key: `addon-${addonIndex}`,
        _type: "addon",
        label: addon.label,
        price: addon.price,
        ...(addon.feature
          ? { feature: { _type: "reference", _ref: id("addon", addon.feature) } }
          : {}),
      })),
      addonsNote: pkg.addonsNote,
      popular: pkg.popular,
      order: index,
    })),
  );

  await seedGroup(
    "FAQs",
    faqs.map((faq, index) => ({
      _id: id("faq", faq.question.slice(0, 50)),
      _type: "faq",
      question: faq.question,
      answer: faq.answer,
      order: index,
    })),
  );

  // --- Projects (images uploaded to the asset library). ---
  const projectDocs = [];
  for (const [index, project] of projects.entries()) {
    const image = await uploadImage(project.image);
    projectDocs.push({
      _id: id("project", `${project.title}-${project.group ?? "desktop"}`),
      _type: "project",
      title: project.title,
      slug: { _type: "slug", current: slugify(`${project.title}-${project.group ?? "desktop"}`) },
      subtitle: project.subtitle,
      description: project.description,
      ...(image ? { image } : {}),
      features: project.features,
      deliverables: project.deliverables,
      tech: project.tech,
      github: project.github || undefined,
      live: project.live || undefined,
      gradient: project.gradient,
      status: project.status,
      category: project.category,
      highlight: project.highlight,
      timeline: project.timeline,
      clientType: project.clientType,
      group: project.group ?? "desktop",
      fullPagePreview: project.fullPagePreview ?? false,
      featured: index === 0,
      order: index,
    });
  }
  await seedGroup("Projects", projectDocs);

  await seedGroup(
    "Experience",
    experience.map((role, index) => ({
      _id: id("experience", `${role.company}-${role.role}`),
      _type: "experience",
      role: role.role,
      company: role.company,
      period: role.period,
      type: role.type,
      companyColor: role.companyColor,
      companyIcon: role.companyIcon,
      description: role.description,
      achievements: role.achievements,
      technologies: role.technologies,
      order: index,
    })),
  );

  const techDocs = Object.entries(techStackData).flatMap(([category, items]) =>
    items.map((item, index) => ({
      _id: id("tech", `${category}-${item.name}`),
      _type: "techItem",
      name: item.name,
      icon: item.icon,
      category,
      level: item.level,
      description: item.description,
      yearsUsed: item.yearsUsed,
      order: index,
    })),
  );
  await seedGroup("Tech stack", techDocs);

  const certDocs = [];
  for (const [index, cert] of certifications.entries()) {
    const preview = await uploadImage(cert.certificatePreview);
    certDocs.push({
      _id: id("cert", cert.credentialId || cert.title),
      _type: "certification",
      title: cert.title,
      provider: cert.provider,
      platform: cert.platform,
      issued: cert.issued,
      credentialId: cert.credentialId,
      skills: cert.skills,
      providerIcon: cert.providerIcon,
      platformIcon: cert.platformIcon,
      providerIconSize: cert.providerIconSize,
      platformIconSize: cert.platformIconSize,
      color: cert.color,
      ...(preview ? { certificatePreview: preview } : {}),
      order: index,
    });
  }
  await seedGroup("Certifications", certDocs);

  // --- Testimonials: the six bundled quotes become editable documents. ---
  await seedGroup(
    "Testimonials",
    defaultTestimonials.map((testimonial) => ({
      _id: id("testimonial", `${testimonial.author}-${testimonial.company}`),
      _type: "testimonial",
      content: testimonial.content,
      author: testimonial.author,
      role: testimonial.role,
      company: testimonial.company,
      rating: testimonial.rating,
      approved: true,
      featured: testimonial.featured ?? false,
      submittedAt: new Date("2025-01-01").toISOString(),
    })),
  );

  // --- Blog posts: MDX on disk -> Portable Text documents. ---
  const blogDir = path.join(process.cwd(), "content/blog");
  const postDocs = [];
  if (fs.existsSync(blogDir)) {
    for (const file of fs.readdirSync(blogDir).filter((f) => /\.mdx?$/.test(f))) {
      const slug = file.replace(/\.mdx?$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(blogDir, file), "utf8"));
      const cover = await uploadImage(data.image ?? "");

      postDocs.push({
        _id: id("post", slug),
        _type: "blogPost",
        title: data.title,
        slug: { _type: "slug", current: slug },
        date: data.date,
        excerpt: data.excerpt,
        ...(cover ? { image: cover } : {}),
        tags: data.tags ?? [],
        author: data.author ?? "Jordan Lang",
        readTime: data.readTime ?? "",
        body: markdownToPortableText(content),
        published: true,
      });
    }
  }
  await seedGroup("Blog posts", postDocs);

  // --- Singletons ---
  const logoLight = await uploadImage("/JLang-Development.png");
  const logoDark = await uploadImage("/JLang-Development-Black.png");
  const ogImage = await uploadImage("/jlangdev.png");

  await seedGroup("Site settings", [
    {
      _id: "siteSettings",
      _type: "siteSettings",
      name: "Jordan Lang",
      ...(logoLight ? { logoLight } : {}),
      ...(logoDark ? { logoDark } : {}),
      tagline: "Creating beautiful, accessible websites that engage users and drive results",
      typewriterRoles: ["Web Designer", "UI/UX Designer", "WordPress Developer", "Digital Creative"],
      availabilityBanner: "Available for contract web design & App Development & Various IT projects",
      skillsPreview: [
        { _key: "html", label: "HTML/CSS", icon: "skill-icons:html" },
        { _key: "wp", label: "WordPress", icon: "skill-icons:wordpress" },
        { _key: "uiux", label: "UI/UX Design", icon: "vscode-icons:file-type-figma" },
        { _key: "responsive", label: "Responsive Design", icon: "material-symbols:responsive-layout" },
        { _key: "a11y", label: "Web Accessibility", icon: "mdi:web-check" },
      ],
      resumeCommand: "curl jlang.dev/resume | bash",
      resumeCopyCommand: "curl https://jlang.dev/api/resume/launch.sh | bash",
      email: "jordan@jlang.dev",
      publicEmail: "jordolang@gmail.com",
      location: "Zanesville, OH",
      website: "jlang.dev",
      socials: [
        { _key: "fb", label: "Facebook", href: "https://facebook.com/jordolang", icon: "simple-icons:facebook", color: "hover:text-blue-600" },
        { _key: "x", label: "X (Twitter)", href: "https://x.com/jordolang", icon: "simple-icons:x", color: "hover:text-gray-900 dark:hover:text-white" },
        { _key: "li", label: "LinkedIn", href: "https://linkedin.com/in/jordolang", icon: "simple-icons:linkedin", color: "hover:text-blue-700" },
        { _key: "gh", label: "GitHub", href: "https://github.com/jordolang", icon: "simple-icons:github", color: "hover:text-gray-900 dark:hover:text-white" },
        { _key: "em", label: "Email", href: "mailto:jordan@jlang.dev", icon: "material-icon-theme:email", color: "hover:text-green-600" },
      ],
      navItems: [
        { _key: "overview", label: "Overview", href: "/#overview" },
        { _key: "blog", label: "Blog", href: "/#blog" },
        { _key: "stack", label: "Stack", href: "/#stack" },
        { _key: "experience", label: "Experience", href: "/#experience" },
        { _key: "certifications", label: "Certifications", href: "/#certifications" },
        { _key: "projects", label: "Projects", href: "/#projects" },
        { _key: "services", label: "Services", href: "/services" },
        { _key: "testimonials", label: "Testimonials", href: "/#testimonials" },
        { _key: "contact", label: "Contact", href: "/#contact" },
      ],
      footerText: "© 2025 Jordan Lang. Built with Next.js, Tailwind CSS, and Framer Motion",
      seoTitle: "Jordan Lang | Web Developer & IT Specialist Portfolio",
      seoDescription:
        "Portfolio of Jordan Lang, a passionate web developer and IT specialist focused on contract web design and IT projects, creating modern digital solutions.",
      seoKeywords: ["Jordan Lang", "Web Developer", "IT Specialist", "Contract Web Design", "Portfolio", "Frontend Development"],
      ogTitle: "Jordan Lang - Web Developer & IT Specialist",
      ogDescription: "Portfolio of Jordan Lang, specializing in contract web design and IT projects with modern technologies.",
      ...(ogImage ? { ogImage } : {}),
    },
  ]);

  await seedGroup("About / Overview", [
    {
      _id: "aboutContent",
      _type: "aboutContent",
      greeting: "Hello, I'm Jordan Lang",
      role: "Web Designer",
      age: "38 years old",
      yearsExperience: "12+ years",
      bio: [
        "I specialize in creating visually stunning and user-friendly websites using modern design tools and techniques. I focus on responsive design, user experience optimization, and brand identity development that helps businesses stand out in the digital landscape.",
        "Beyond design, I love collaborating with clients to bring their vision to life, staying updated with the latest design trends, and creating digital experiences that not only look great but also drive results and user engagement.",
      ],
      coreCompetenciesLabel: "Core Competencies (10+ Years Experience)",
      coreCompetencies: [
        "Adobe Creative Suite", "HTML/CSS", "Javascript", "Full Stack Development", "Brand Identity",
        "Small-Business Marketing", "Digital Media (TV/Radio/Print)", "Responsive Design", "User Experience", "WordPress",
      ],
      emergingSectorsLabel: "Emerging Sectors of Focus (Less than 5 Years Experience or Education)",
      emergingSectors: [
        "AI/Machine Learning", "Cloud Computing", "DevOps", "Mobile Development", "Progressive Web Apps",
        "Open-Source Projects", "Self-Hosted Solutions", "Small-Business Technology Independence", "FREE FOREVER TECHNOLOGY",
      ],
      achievements: [
        { _key: "a1", text: "Head Robotics Build (2000s)", icon: "solar:star-bold", color: "text-yellow-600" },
        { _key: "a2", text: "98% Client Satisfaction Rate", icon: "solar:palette-bold", color: "text-blue-600" },
        { _key: "a3", text: "10+ Websites Deployed", icon: "solar:code-square-bold", color: "text-green-600" },
      ],
      availability: ["Open to New Opportunities", "On-site Service in Zanesville, OH", "Remote Service Nationwide"],
      currentRole: {
        title: "Freelance Web Designer",
        subtitle: "Independent Consultant",
        period: "2015 — Present",
        description:
          "Building custom websites and digital solutions for small to medium businesses, helping them establish a strong online presence and grow their digital footprint. Offering expertise in domain and local server configurations, providing on-site support as a specialist, implementing budget-minded fixes, and combining these with strategic marketing and advertising consulting.",
        badge: "50+ Satisfied Tech Clients",
      },
      stats: { yearsExperience: "4+", websitesCreated: "25+", clientSatisfaction: "100%" },
    },
  ]);

  await seedGroup("Promo page", [
    {
      _id: "promoContent",
      _type: "promoContent",
      eyebrow: "EXCLUSIVE EMAIL OFFER",
      headline: "Limited Time: $99 OFF Launchpad Package!",
      subhead: "Plus, get an additional $50 OFF by allowing us to showcase our work on your site",
      attributionOffer: "Get an Additional $50 OFF!",
      attributionCheckboxLabel: "Allow JLang Development to showcase this project on our site",
      active: true,
    },
  ]);

  const sections = [
    { sectionId: "overview", tagText: "Get To Know Me", tagIcon: "solar:user-heart-bold", heading: "About Me", description: "Crafting digital experiences with passion, precision, and purpose" },
    { sectionId: "blog", tagText: "Latest Insights", tagIcon: "solar:document-text-bold", heading: "Blog Posts", description: "Thoughts on web development, self-hosting, mobile apps, and technology trends" },
    { sectionId: "stack", tagText: "Tech Arsenal", tagIcon: "solar:settings-bold", heading: "Technology Stack", description: "Technologies I use to bring ideas to life" },
    { sectionId: "experience", tagText: "Professional Journey", tagIcon: "solar:case-bold", heading: "Experience", description: "My professional journey and the impact I've made across different domains" },
    { sectionId: "certifications", tagText: "Professional Credentials", tagIcon: "solar:verified-check-bold", heading: "Certifications", description: "Credentials backing the stack and the experience above. Select one to view the certificate." },
    { sectionId: "projects", tagText: "Portfolio Showcase", tagIcon: "solar:code-square-bold", heading: "Featured Projects", description: "Explore my web design portfolio featuring modern, responsive websites and digital solutions for diverse industries", ctaText: "Interested in working together? Let's create something amazing!" },
    { sectionId: "services", tagText: "Services", tagIcon: "solar:code-square-bold", heading: "Web Design & Development Services", description: "Custom web solutions tailored to your business — pick a package and order in minutes." },
    { sectionId: "testimonials", tagText: "Client Stories", tagIcon: "solar:users-group-rounded-outline", heading: "Testimonials Wall", description: "Real feedback from real clients who trusted me with their projects" },
    { sectionId: "contact", tagText: "Contact", tagIcon: "solar:chat-line-bold", heading: "Let's Work Together", description: "Ready to bring your ideas to life? I'm always excited to work on interesting projects and collaborate with amazing people. Let's create something extraordinary together." },
  ];
  await seedGroup(
    "Section headings",
    sections.map((section) => ({ _id: id("section", section.sectionId), _type: "sectionContent", ...section })),
  );

  console.log("\nDone. Open /studio to edit.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
