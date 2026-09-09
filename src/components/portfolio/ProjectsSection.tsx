"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import SectionHeader from "./SectionHeader";

interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  deliverables: string[];
  tech: string[];
  github: string;
  live: string;
  gradient: string;
  status: "Live" | "In Development";
  category: string;
  highlight: string;
  timeline: string;
  clientType: string;
  group?: "desktop" | "mobile";
  fullPagePreview?: boolean;
  /** Intrinsic size of `image`. Required for full-page captures so the scroll container renders them at true aspect ratio. */
  imageWidth?: number;
  imageHeight?: number;
}

export const projects: Project[] = [
  {
    title: "Stuck On You",
    subtitle: "Permanent Jewelry Bloomington, IN",
    description:
      "A bespoke new home on the web for Stuck On You — elegant design, effortless content editing, and lightning-fast pages. Designed & built by JLang Development.",
    image: "/images/projects/stuck-on-you.jpg",
    imageWidth: 1440,
    imageHeight: 7237,
    fullPagePreview: true,
    features: [
      "Elegant, brand-led website design",
      "Effortless content editing",
      "Lightning-fast page performance",
      "Responsive experience for every screen",
    ],
    deliverables: [
      "Website design and development",
      "Responsive interface implementation",
      "Content editing experience",
      "Production deployment",
    ],
    tech: ["Next.js", "React", "TypeScript", "Sanity", "Vercel"],
    github: "",
    live: "https://stuckonyoupj.com",
    gradient: "from-amber-700 to-yellow-600",
    status: "Live",
    category: "Web Design",
    highlight: "Latest Project",
    timeline: "2026",
    clientType: "Permanent Jewelry",
  },
  {
    title: "Muskingum Materials",
    subtitle: "Aggregate & Construction Materials Supplier",
    description:
      "The newest build: a clean, conversion-focused marketing site for a Muskingum County aggregate and construction materials supplier. Showcases products, service areas, and capabilities with a fast, mobile-first experience deployed on Vercel.",
    image: "/images/projects/muskingum-materials.jpg",
    imageWidth: 1280,
    imageHeight: 7101,
    features: [
      "Product and materials catalog presentation",
      "Service-area and capabilities overview",
      "Lead-generation contact and quote pathways",
      "Fast, mobile-first responsive design",
      "SEO-optimized for local material searches",
    ],
    deliverables: [
      "Full marketing site design and build",
      "Information architecture and navigation",
      "Responsive UI implementation",
      "Deployment and analytics wiring on Vercel",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    github: "https://github.com/jordolang/muskingum-materials",
    live: "https://muskingum-materials.vercel.app",
    gradient: "from-amber-600 to-orange-600",
    status: "Live",
    category: "Web Design",
    highlight: "Latest Project",
    timeline: "2026",
    clientType: "Construction Materials",
  },
  {
    title: "Safety Screen",
    image: "/images/projects/drug-finder.png",
    subtitle: "Medication Search & Information Web App",
    description:
      "A fast, search-first web application for looking up medications and their key details. Built for clarity and speed, it helps users find the information they need across a clean, responsive interface deployed on Vercel.",
    features: [
      "Instant medication search and lookup",
      "Clear, structured drug information display",
      "Fast, responsive results as you type",
      "Mobile-first, accessible interface",
      "Deployed on Vercel for global performance",
    ],
    deliverables: [
      "Search UI and results experience",
      "Data integration and querying",
      "Responsive, accessible interface",
      "Deployment and analytics wiring on Vercel",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    github: "",
    live: "https://drug-finder.vercel.app",
    gradient: "from-cyan-600 to-blue-600",
    status: "Live",
    category: "Web App",
    highlight: "New",
    timeline: "2026",
    clientType: "Health & Information",
  },
  {
    title: "Roam",
    image: "/images/projects/roam.png",
    subtitle: "AI Travel Agent & Trip Planner",
    description:
      "An AI-powered travel agent that turns a simple prompt into a complete trip. Roam helps users discover destinations, build itineraries, and plan the details through a conversational, mobile-first experience.",
    features: [
      "Conversational AI trip planning",
      "Personalized destination recommendations",
      "Itinerary building and organization",
      "Responsive, mobile-first design",
      "Fast, modern web experience",
    ],
    deliverables: [
      "Conversational planning UX",
      "AI integration and prompt design",
      "Itinerary and results interface",
      "Responsive UI implementation",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "AI SDK", "Vercel"],
    github: "",
    live: "",
    gradient: "from-teal-600 to-emerald-600",
    status: "In Development",
    category: "Web App",
    highlight: "New",
    timeline: "2026",
    clientType: "Travel & Lifestyle",
  },
  {
    title: "Jose Madrid Salsa",
    subtitle: "Premium Gourmet Salsa – E-commerce & Marketing Site",
    description:
      "Modern marketing and e‑commerce experience for an Ohio‑made gourmet salsa brand. Highlights include heat‑level guided shopping, fundraising and wholesale pathways, and a clean, mobile‑first design deployed on Vercel.",
    image: "/images/projects/josemadrid.png",
    features: [
      "Heat-level browsing (Mild, Medium, Hot)",
      "Fundraising and wholesale information flows",
      "Responsive, performance‑optimized pages",
      "Clear CTAs for shopping and subscriptions",
    ],
    deliverables: [
      "Landing and category page UX",
      "Information architecture & navigation",
      "Responsive UI implementation",
      "Deployment and analytics wiring",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    github: "https://github.com/jordolang/josemadrid",
    live: "https://josemadrid.net",
    gradient: "from-rose-600 to-red-600",
    status: "Live",
    category: "Web Design",
    highlight: "Featured",
    timeline: "2025",
    clientType: "Food & Beverage",
  },
  {
    title: "Muskingum Materials",
    subtitle: "Southeast Ohio's Sand, Soil & Gravel Website",
    description: "Modern, full-featured business website for a family-owned sand, soil, and gravel operation in Zanesville, Ohio. Delivers a clean product catalog, real-time AI-powered customer chat trained on pricing and business data, lead capture system, and a Sanity Studio CMS backend giving owners full content control.",
    image: "/images/projects/muskingum-materials.png",
    features: [
      "Product catalog with 15+ sand, gravel, soil, and stone products",
      "AI chat agent powered by Anthropic Claude (Haiku)",
      "Contact form, quote builder, and newsletter signup",
      "Photo gallery with 23 photos and 3 videos",
      "Sanity Studio CMS with 7 document schemas",
      "Google Maps integration and social media links"
    ],
    deliverables: [
      "Full business website design and development",
      "AI chat integration with Vercel AI SDK",
      "Sanity CMS setup and schema design",
      "Lead capture and email notification system",
      "Responsive mobile-first design",
      "Google Analytics and Postmark email setup"
    ],
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Sanity CMS", "PostgreSQL", "Prisma", "Clerk", "Stripe", "Anthropic Claude", "Framer Motion", "Postmark", "Vercel"],
    github: "https://github.com/jordolang/muskingum-materials",
    live: "https://muskingummaterials.com",
    gradient: "from-amber-700 to-yellow-600",
    status: "Live",
    category: "Web Design",
    highlight: "Client Project",
    timeline: "2025",
    clientType: "Construction & Materials"
  },
  {
    title: "SalsaDocs",
    subtitle: "Jose Madrid Salsa Developer Documentation",
    description: "Comprehensive developer documentation site for the Jose Madrid Salsa e-commerce platform. Built with Next.js and Fumadocs, it serves as the single source of truth for the platform — covering API reference, integration guides, deployment, configuration, and system architecture with Mermaid diagram support.",
    image: "/images/projects/salsadocs.png",
    features: [
      "Full API reference with endpoint schemas and examples",
      "Getting started and developer onboarding guides",
      "Integration docs for Stripe, PayPal, Google Maps, and email",
      "Deployment and CI/CD configuration guides",
      "Mermaid diagram support for system architecture",
      "Fumadocs-powered navigation and full-text search"
    ],
    deliverables: [
      "Documentation site design and development",
      "MDX-based content authoring system",
      "Fumadocs integration with custom theming",
      "Full API reference and feature documentation",
      "Integration and deployment guide structure",
      "Responsive, searchable documentation experience"
    ],
    tech: ["Next.js", "TypeScript", "Fumadocs", "MDX", "Tailwind CSS", "Mermaid", "Framer Motion", "Vercel"],
    github: "https://github.com/jordolang/salsadocs",
    live: "",
    gradient: "from-slate-700 to-gray-800",
    status: "Live",
    category: "Web Design",
    highlight: "Featured",
    timeline: "2025",
    clientType: "Documentation"
  },
  {
    title: "Jessica ASP",
    subtitle: "Creator Subscription Platform",
    description: "A full-featured creator subscription platform where creators publish gated content and fans subscribe to tiers. Includes creator dashboards, admin tools, subscription management, web push notifications, file uploads via UploadThing, and Stripe subscription payments — built on Next.js 14 App Router.",
    image: "/images/projects/jessica-asp.png",
    features: [
      "Creator dashboard for content, earnings, and subscriber management",
      "Subscription tier system for fan access to gated content",
      "Web push notifications via VAPID",
      "Stripe subscription payments and webhook handling",
      "File upload system powered by UploadThing",
      "Admin tools for users, content moderation, and payouts"
    ],
    deliverables: [
      "Full-stack Next.js 14 App Router platform",
      "Stripe subscription and webhook integration",
      "Creator and admin dashboard development",
      "UploadThing file upload system",
      "Web push notification infrastructure",
      "Vitest unit tests and Playwright E2E test suite"
    ],
    tech: ["Next.js 14", "React", "TypeScript", "NextAuth", "Prisma", "PostgreSQL", "Stripe", "UploadThing", "Tailwind CSS", "Radix UI", "Vitest", "Playwright"],
    github: "https://github.com/jordolang/jessica-asp",
    live: "",
    gradient: "from-violet-600 to-purple-700",
    status: "In Development",
    category: "Web Apps",
    highlight: "Current Project",
    timeline: "Ongoing",
    clientType: "Creator Economy"
  },
  {
    title: "Amplinks",
    image: "/images/projects/amplinks.png",
    subtitle: "Self-Hosted iOS/Web Music Platform",
    description:
      "A comprehensive self-hosted iOS/Web application for seamless music downloading directly to iPhone as MP3 files without any user interaction. Features a Linktree-style sharing page for real-time music streaming with friends, integrated web music player, and full music management system.",
    features: [
      "Automatic iOS MP3 downloads with zero clicks",
      "Linktree-style sharing pages for friends",
      "Real-time streaming and chat with friends",
      "Fully featured web music player application",
      "Complete music library management system",
      "Social listening features and guest sharing",
      "Cross-platform synchronization (iOS/Web)",
      "Self-hosted with complete privacy control",
    ],
    deliverables: [
      "Native iOS application development",
      "Progressive web application (PWA)",
      "Real-time streaming infrastructure",
      "Social music sharing system",
      "User management and authentication",
      "API development and integration",
      "Cross-platform data synchronization",
      "Music library management tools",
    ],
    tech: ["React", "React Native", "Node.js", "TypeScript", "WebRTC", "Socket.io", "Swift", "iOS", "MongoDB", "Redis", "Docker", "Tailwind CSS"],
    github: "https://github.com/jordolang/amplinks",
    live: "https://paddle-mobile-web-payments-starter-pi-nine.vercel.app",
    gradient: "from-purple-600 to-blue-600",
    status: "In Development",
    category: "Mobile & Web Apps",
    highlight: "Current Project",
    timeline: "Ongoing",
    clientType: "Mobile & Web Apps",
  },
  {
    title: "Zanesville.store",
    image: "/images/projects/zanesville-store.png",
    subtitle: "Local E-commerce Platform",
    description:
      "A comprehensive e-commerce platform designed to connect local Zanesville businesses with customers. Features intuitive navigation, secure payment processing, and a responsive design optimized for both desktop and mobile shopping.",
    features: [
      "Modern responsive design for all devices",
      "Local business directory integration",
      "Secure payment processing system",
      "Advanced product search and filtering",
      "User account management and profiles",
      "Mobile-first shopping experience",
      "SEO optimization for local searches",
      "Performance optimization for fast loading",
    ],
    deliverables: [
      "Complete e-commerce platform design",
      "Local business onboarding system",
      "Payment gateway integration",
      "Product management interface",
      "Mobile-responsive design",
      "Local SEO implementation",
      "Performance optimization",
      "Security implementation",
    ],
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB", "Stripe", "Vercel", "Figma", "Local SEO", "PWA", "Analytics"],
    github: "https://github.com/jordanlang/zanesville-store",
    live: "https://pallets.sale",
    gradient: "from-emerald-600 to-teal-600",
    status: "In Development",
    category: "Web Design",
    highlight: "Current Project",
    timeline: "Ongoing",
    clientType: "Local E-commerce",
  },
  {
    title: "Homesh.app",
    image: "/images/projects/homesh-app.png",
    subtitle: "Self-Hosted Home Dashboard",
    description:
      "A comprehensive self-hosted home dashboard for home automation enthusiasts and privacy-conscious users. Features a modern, customizable interface for monitoring and controlling smart home devices while keeping all data locally stored.",
    features: [
      "Fully self-hosted with complete data privacy",
      "Customizable dashboard widgets and layouts",
      "Integration with popular home automation platforms",
      "Real-time device monitoring and control",
      "Weather and calendar widget integration",
      "Energy consumption tracking and analytics",
      "Mobile-responsive design for all devices",
      "Docker container deployment support",
    ],
    deliverables: [
      "Self-hosted dashboard application",
      "Docker compose configuration",
      "Widget library and customization tools",
      "API integration framework",
      "Mobile-responsive interface",
      "Installation and setup documentation",
      "Security configuration guidelines",
      "Backup and restore functionality",
    ],
    tech: ["React", "TypeScript", "Node.js", "Docker", "WebSockets", "Chart.js", "Tailwind CSS", "SQLite", "MQTT", "Home Assistant API", "OpenWeatherMap API", "PWA"],
    github: "https://github.com/jordanlang/homesh-app",
    live: "https://homesh.app",
    gradient: "from-indigo-600 to-purple-600",
    status: "In Development",
    category: "Web Design",
    highlight: "Current Project",
    timeline: "Ongoing",
    clientType: "Self-Hosted Solutions",
  },
  {
    title: "Apple-Sider",
    image: "/images/projects/apple-sider.png",
    subtitle: "Self-Hosted Apple Music Library Downloader",
    description:
      "A 1-click self-hosted web application to download your entire Apple Music Library using a Library.xml file. Features a clean Apple-inspired interface with real-time progress tracking, concurrent downloads, and automatic metadata enhancement.",
    features: [
      "Single-page web interface with drag-and-drop",
      "Real-time progress tracking and console output",
      "Concurrent downloads with queue management",
      "High-quality MP3s with metadata enhancement",
      "Automatic album artwork from iTunes API",
      "Docker container deployment support",
      "WebSocket streaming for real-time updates",
      "Smart parsing of Apple Music libraries",
    ],
    deliverables: [
      "Docker container deployment",
      "Web interface development",
      "CLI management tools",
      "Configuration system",
      "Download queue management",
      "Metadata enhancement system",
      "Real-time progress tracking",
      "Cross-platform compatibility",
    ],
    tech: ["Python", "Flask", "Docker", "WebSockets", "yt-dlp", "JavaScript", "HTML5", "CSS3", "MusicBrainz", "iTunes API", "pip", "Docker Compose"],
    github: "https://github.com/jordolang/Apple-Sider",
    live: "https://jordolang.github.io/Apple-Sider/",
    gradient: "from-red-500 to-pink-500",
    status: "Live",
    category: "Self-Hosted Solutions",
    highlight: "Featured",
    timeline: "Ongoing",
    clientType: "Self-Hosted Solutions",
  },
  {
    title: "World Auto Net",
    image: "/images/projects/world-auto-net.png",
    subtitle: "Automotive Marketplace Website",
    description:
      "Modern, responsive website design for an automotive marketplace platform. A comprehensive digital presence with intuitive navigation, advanced search capabilities, and a mobile-first approach connecting car buyers and sellers.",
    features: [
      "Responsive design optimized for all devices",
      "Vehicle inventory system with advanced filtering",
      "Search functionality with location-based results",
      "Interactive image galleries and virtual tours",
      "User-friendly contact forms and lead generation",
      "SEO-optimized content structure",
      "Performance optimization for fast loading",
      "Cross-browser compatibility testing",
    ],
    deliverables: [
      "Fully responsive website design",
      "Custom vehicle listing templates",
      "Mobile-optimized user interface",
      "Search and filter functionality",
      "Contact form integration",
      "SEO implementation and optimization",
      "Performance optimization",
      "Browser compatibility testing",
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "jQuery", "PHP", "MySQL", "Photoshop", "Figma", "WordPress", "SEO Tools", "Google Analytics"],
    github: "https://github.com",
    live: "https://web.archive.org/web/20210508120122/https://www.worldautonet.com",
    gradient: "from-blue-600 to-indigo-600",
    status: "Live",
    category: "Web Design",
    highlight: "Featured",
    timeline: "3 months",
    clientType: "Automotive Industry",
  },
  {
    title: "Neff Paving",
    image: "/images/projects/neff-paving.png",
    subtitle: "Professional Paving Services Website",
    description:
      "Complete website redesign for a professional paving contractor, featuring modern design principles, service showcases, and lead generation optimization focused on converting visitors into qualified leads.",
    features: [
      "Professional brand identity design",
      "Service portfolio with before/after galleries",
      "Mobile-responsive design",
      "Lead generation contact forms",
      "Google Maps integration",
      "Testimonials and reviews section",
      "Fast-loading optimized images",
      "Local SEO optimization",
    ],
    deliverables: [
      "Complete website redesign",
      "Custom service page templates",
      "Photo gallery implementation",
      "Contact form development",
      "Mobile optimization",
      "Local SEO setup",
      "Google My Business integration",
      "Performance optimization",
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "WordPress", "PHP", "Photoshop", "Illustrator", "Google Maps API", "Contact Form 7", "Yoast SEO", "GTmetrix", "PageSpeed Insights"],
    github: "https://github.com",
    live: "https://neffpaving.co",
    gradient: "from-orange-500 to-red-500",
    status: "Live",
    category: "Web Design",
    highlight: "Featured",
    timeline: "2 months",
    clientType: "Construction Services",
    fullPagePreview: true,
    imageWidth: 1440,
    imageHeight: 12000,
  },
  {
    title: "First Baptist Church",
    image: "/images/projects/first-baptist.png",
    subtitle: "Church Community Website",
    description:
      "Comprehensive church website design focused on community engagement and information accessibility. A welcoming digital space that reflects the church's values while providing essential information for members and visitors.",
    features: [
      "Welcoming and accessible design",
      "Event calendar and announcements",
      "Sermon archive and media gallery",
      "Community outreach information",
      "Mobile-friendly responsive layout",
      "Contact and location information",
      "Social media integration",
      "Newsletter signup functionality",
    ],
    deliverables: [
      "Custom church website design",
      "Event management system",
      "Media gallery implementation",
      "Newsletter integration",
      "Mobile-responsive design",
      "Social media connectivity",
      "Contact information setup",
      "Content management training",
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "WordPress", "PHP", "MailChimp", "Photoshop", "Illustrator", "Google Fonts", "Social Media APIs", "Calendar Plugins", "Accessibility Tools"],
    github: "https://github.com",
    live: "https://jordolang.github.io/First-Baptist/index.html",
    gradient: "from-green-500 to-teal-500",
    status: "Live",
    category: "Web Design",
    highlight: "Community Focus",
    timeline: "2.5 months",
    clientType: "Religious Organization",
  },
  {
    title: "Ohio Interests",
    image: "/images/projects/ohio-interests.png",
    subtitle: "Local Interest & Tourism Website",
    description:
      "Engaging website design showcasing Ohio's attractions, events, and local interests. Built with tourism and local business promotion in mind, featuring interactive maps, event listings, and resource directories.",
    features: [
      "Interactive attraction maps",
      "Local business directory",
      "Event calendar and listings",
      "Photo galleries of attractions",
      "Travel guides and recommendations",
      "Mobile-optimized browsing experience",
      "Social sharing capabilities",
      "Search functionality for quick access",
    ],
    deliverables: [
      "Tourism-focused website design",
      "Interactive map implementation",
      "Business directory system",
      "Event calendar development",
      "Photo gallery creation",
      "Mobile optimization",
      "SEO for local searches",
      "Social media integration",
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "WordPress", "PHP", "Google Maps API", "Photoshop", "Lightbox", "Event Calendar", "Directory Plugins", "Social Share", "Local SEO Tools"],
    github: "https://github.com",
    live: "https://web.archive.org/web/20230816090905/https://ohiointerests.com/",
    gradient: "from-purple-500 to-blue-500",
    status: "Live",
    category: "Web Design",
    highlight: "Local Focus",
    timeline: "4 months",
    clientType: "Tourism & Local Business",
  },
  {
    title: "Amplinks",
    image: "/images/projects/amplinks.png",
    subtitle: "Native iOS & Android Music App",
    description:
      "The native mobile companion to the Amplinks platform. Download music straight to your phone as MP3s with zero clicks, stream in real time, and share Linktree-style pages with friends — all from a self-hosted backend you control.",
    features: [
      "Zero-click MP3 downloads to your device",
      "Real-time streaming and listening with friends",
      "Linktree-style sharing pages on the go",
      "Offline library and playback management",
      "Push notifications for shared tracks",
      "Cross-device sync with the web app",
    ],
    deliverables: [
      "Native iOS application (Swift)",
      "Android build via React Native",
      "Real-time streaming integration",
      "Offline-first music library",
      "Authentication and account management",
      "App store release preparation",
    ],
    tech: ["Swift", "React Native", "iOS", "Android", "WebRTC", "Socket.io", "Node.js", "TypeScript", "Redis"],
    github: "https://github.com/jordolang/amplinks",
    live: "https://paddle-mobile-web-payments-starter-pi-nine.vercel.app",
    gradient: "from-purple-600 to-blue-600",
    status: "In Development",
    category: "Mobile App",
    highlight: "iOS & Android",
    timeline: "Ongoing",
    clientType: "Mobile Applications",
    group: "mobile",
  },
  {
    title: "Jose Madrid Salsa",
    image: "/images/projects/josemadrid-ios.png",
    subtitle: "Mobile Shopping App (iOS & Android)",
    description:
      "A mobile commerce experience for the Ohio-made gourmet salsa brand. Browse by heat level, reorder favorites in a tap, and check out fast with a native, mobile-first storefront for iOS and Android.",
    features: [
      "Heat-level guided browsing (Mild, Medium, Hot)",
      "One-tap reorder and saved favorites",
      "Native mobile checkout flow",
      "Order tracking and push notifications",
      "Fundraising and wholesale entry points",
    ],
    deliverables: [
      "Cross-platform mobile app (iOS & Android)",
      "Product catalog and cart UX",
      "Checkout and payment integration",
      "Push notification setup",
      "App store release preparation",
    ],
    tech: ["React Native", "Expo", "TypeScript", "iOS", "Android", "Stripe", "Node.js"],
    github: "https://github.com/jordolang/josemadrid",
    live: "https://josemadrid.net",
    gradient: "from-rose-600 to-red-600",
    status: "In Development",
    category: "Mobile App",
    highlight: "iOS & Android",
    timeline: "2026",
    clientType: "Mobile Applications",
    group: "mobile",
  },
  {
    title: "Radius",
    image: "/images/projects/radius.png",
    subtitle: "Proximity-Based Connection App (iOS & Android)",
    description:
      "A proximity-based mobile app built around mutual consent. When two nearby users are a potential match, each receives a discreet proximity alert and they only connect if both opt in — turning real-world nearness into spontaneous, consent-first introductions.",
    features: [
      "Real-time proximity detection between nearby users",
      "Mutual opt-in — connections only form when both agree",
      "Discreet, privacy-first proximity alerts",
      "Location handling designed with user safety in mind",
      "Native, mobile-first experience for iOS & Android",
    ],
    deliverables: [
      "Cross-platform mobile app (iOS & Android)",
      "Real-time proximity and matching system",
      "Consent and double opt-in flow",
      "Location and privacy controls",
      "Authentication and account management",
    ],
    tech: ["React Native", "Expo", "TypeScript", "iOS", "Android", "Geolocation", "WebSockets", "Node.js"],
    github: "",
    live: "",
    gradient: "from-pink-600 to-rose-600",
    status: "In Development",
    category: "Mobile App",
    highlight: "iOS & Android",
    timeline: "2026",
    clientType: "Mobile Applications",
    group: "mobile",
  },
];

export interface SectionHeading {
  tagText?: string;
  tagIcon?: string;
  heading?: string;
  description?: string;
  ctaText?: string;
}

interface ProjectsSectionProps {
  /** Projects from Sanity. Falls back to the list above when the CMS has none. */
  projects?: Project[];
  heading?: SectionHeading;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function StatusBadge({ status }: { status: Project["status"] }) {
  const isLive = status === "Live";
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 backdrop-blur-sm ${
        isLive
          ? "bg-green-500/20 text-green-100 border border-green-400/40"
          : "bg-orange-500/20 text-orange-100 border border-orange-400/40"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-300" : "bg-orange-300"} animate-pulse`} />
      {status}
    </span>
  );
}

function ProjectLinks({ project, light = false }: { project: Project; light?: boolean }) {
  const primaryClass = light
    ? "bg-white text-gray-900 hover:bg-gray-100"
    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90";
  const secondaryClass = light
    ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.live && (
        <Link
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent(AnalyticsEvents.PROJECT_LINK_CLICKED, { destination: "demo", project: project.title })}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 active:scale-95 ${primaryClass}`}
        >
          <Icon icon="solar:arrow-right-up-linear" width={18} height={18} />
          <span>View Live Site</span>
        </Link>
      )}
      {project.github && (
        <Link
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent(AnalyticsEvents.PROJECT_LINK_CLICKED, { destination: "github", project: project.title })}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 active:scale-95 ${secondaryClass}`}
        >
          <Icon icon="solar:code-bold" width={18} height={18} />
          <span>Repository</span>
        </Link>
      )}
    </div>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <m.div variants={itemVariants} className="group">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 lg:items-stretch">
          {/* Left: details, laid out top to bottom */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30">
                <Icon icon="solar:star-bold" width={13} height={13} />
                {project.highlight}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                {project.category}
              </span>
              <StatusBadge status={project.status} />
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {project.timeline}
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
              {project.title}
            </h3>
            <p className="text-lg md:text-xl text-indigo-600 dark:text-indigo-400 font-medium mb-4">
              {project.subtitle}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                Key Features
              </h4>
              <ul className="space-y-2.5">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300">
                    <Icon icon="solar:check-circle-bold" className="text-green-500 mt-0.5 flex-shrink-0 w-5 h-5" />
                    <span className="text-sm md:text-base leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <ProjectLinks project={project} />
            </div>
          </div>

          {/* Right: full top-to-bottom site screenshot */}
          <div className="relative bg-gray-100 dark:bg-gray-950 border-t lg:border-t-0 lg:border-l border-gray-200/60 dark:border-gray-800">
            <div className="relative h-[420px] sm:h-[560px] lg:h-full lg:max-h-[860px] overflow-y-auto">
              <Image
                src={project.image}
                alt={`${project.title} – full page screenshot`}
                width={project.imageWidth ?? 1280}
                height={project.imageHeight ?? 7101}
                className="w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-[11px] font-medium backdrop-blur-sm flex items-center gap-1.5">
              <Icon icon="solar:mouse-bold" width={12} height={12} />
              Scroll to explore full page
            </span>
          </div>
        </div>
      </div>
    </m.div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const isMobile = project.group === "mobile";
  const isFullPagePreview = project.fullPagePreview === true;

  return (
    <m.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => trackEvent(AnalyticsEvents.PROJECT_CLICKED, { project: project.title })}
      className="group flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Screenshot — portrait & fully visible for mobile apps, wide crop for web */}
      <div
        className={`relative ${
          isMobile
            ? "aspect-[9/16] overflow-hidden bg-gray-900"
            : isFullPagePreview
              ? "aspect-[16/10] overflow-y-auto bg-gray-100 dark:bg-gray-800"
              : "aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800"
        }`}
      >
        {isFullPagePreview ? (
          <Image
            src={project.image}
            alt={`${project.title} – full page screenshot`}
            width={project.imageWidth ?? 1440}
            height={project.imageHeight ?? 12000}
            className="h-auto w-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <Image
            src={project.image}
            alt={`${project.title} app screenshot`}
            fill
            className={
              isMobile
                ? "object-contain"
                : "object-cover object-top transition-transform duration-500 group-hover:scale-105"
            }
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <StatusBadge status={project.status} />
        </div>
        <div className={`absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${project.gradient}`} />
        {isFullPagePreview && (
          <span className="pointer-events-none sticky bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            <Icon icon="solar:mouse-bold" width={12} height={12} />
            Scroll to explore full page
          </span>
        )}
      </div>

      {/* Body: title + brief overview */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {project.category}
          </span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">{project.timeline}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">
          {project.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">
          {project.subtitle}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md text-[11px] font-medium border border-gray-200 dark:border-gray-700"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2 py-0.5 text-[11px] font-medium text-gray-400 dark:text-gray-500">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto">
          <ProjectLinks project={project} />
        </div>
      </div>
    </m.div>
  );
}

/**
 * Mobile app card — a large full portrait screenshot fills the top (the majority
 * of the card), with the project name and a brief, space-saving info block below.
 */
function MobileProjectCard({ project }: { project: Project }) {
  return (
    <m.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => trackEvent(AnalyticsEvents.PROJECT_CLICKED, { project: project.title })}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/80 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-gray-300 hover:shadow-2xl dark:border-gray-700/40 dark:bg-gray-900/80 dark:hover:border-gray-600"
    >
      {/* Full portrait screenshot — the visual majority of the card */}
      <div className="relative aspect-[9/16] overflow-hidden bg-zinc-950">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} mobile app screenshot`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br ${project.gradient} px-5 text-center text-white`}
          >
            <Icon icon="solar:smartphone-2-bold" width={52} height={52} className="opacity-90" />
            <span className="text-xl font-bold leading-tight">{project.title}</span>
            <span className="rounded-full bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm">
              In Development
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <StatusBadge status={project.status} />
        </div>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          <Icon icon="solar:smartphone-2-bold" width={11} height={11} />
          {project.highlight}
        </span>
        <div className={`absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${project.gradient}`} />
      </div>

      {/* Brief info below — name + main points only */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
          {project.title}
        </h3>
        <p className="mt-0.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {project.subtitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-2 dark:text-gray-300">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 text-[11px] font-medium text-gray-400 dark:text-gray-500">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4">
          <ProjectLinks project={project} />
        </div>
      </div>
    </m.div>
  );
}

export default function ProjectsSection({ projects: cmsProjects, heading }: ProjectsSectionProps) {
  const allProjects = cmsProjects?.length ? cmsProjects : projects;
  const desktopProjects = allProjects.filter((project) => project.group !== "mobile");
  const mobileProjects = allProjects.filter((project) => project.group === "mobile");
  const [featured, ...desktopRest] = desktopProjects;

  return (
    <m.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: true }}
      className="mb-16 md:mb-24 lg:mb-32 relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-5 md:top-20 right-2 md:right-16 w-12 sm:w-16 md:w-32 h-12 sm:h-16 md:h-32 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-xl md:blur-3xl" />
        <div className="absolute bottom-5 md:bottom-20 left-2 md:left-16 w-16 sm:w-20 md:w-40 h-16 sm:h-20 md:h-40 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-xl md:blur-2xl" />
      </div>

      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10"
      >
        <SectionHeader
          tagText={heading?.tagText ?? "Portfolio Showcase"}
          tagIcon={heading?.tagIcon ?? "solar:code-square-bold"}
          heading={heading?.heading ?? "Featured Projects"}
          description={
            heading?.description ??
            "Explore my web design portfolio featuring modern, responsive websites and digital solutions for diverse industries"
          }
          showUnderline={true}
          centered={true}
        />

        <div className="max-w-7xl mx-auto px-3 md:px-4">
          {/* Featured project */}
          <FeaturedProject project={featured} />

          {/* Desktop Web Apps — 3 across */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-12 md:mt-16 mb-6 md:mb-8">
            Desktop Web Apps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {desktopRest.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>

          {/* Mobile Applications — iPhone mockups stacked vertically */}
          {mobileProjects.length > 0 && (
            <>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-12 md:mt-16 mb-6 md:mb-8">
                Mobile Applications (iOS &amp; Android)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mobileProjects.map((project) => (
                  <MobileProjectCard key={project.title} project={project} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Call to Action */}
        <m.div variants={itemVariants} className="text-center mt-12 md:mt-16 lg:mt-20 px-4 mb-12">
          <Link href="#contact">
            <m.div
              className="inline-flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 dark:border-purple-500/20 rounded-xl md:rounded-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <Icon icon="solar:programming-bold" className="text-blue-500 dark:text-purple-400 w-5 h-5 md:w-6 md:h-6" />
              <span className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base text-center">
                {heading?.ctaText ?? "Interested in working together? Let's create something amazing!"}
              </span>
            </m.div>
          </Link>
        </m.div>
      </m.div>
    </m.section>
  );
}
