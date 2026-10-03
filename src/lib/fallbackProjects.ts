/**
 * Bundled project list. Shown by the portfolio when Sanity has no projects and
 * used by the /projects/[slug] route as the same fallback, so every card links
 * to a page that resolves. Kept out of any "use client" module so server code
 * can import it as data.
 */
export interface Project {
  slug: string;
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
  group?: "desktop" | "mobile" | "desktopApp";
  fullPagePreview?: boolean;
  /** Shown in the large hero slot at the top of the Projects section. */
  featured?: boolean;
  /** Extra screenshots, opened from the card's "View screenshots" button. With `video`, `src` is its poster. */
  gallery?: Array<{ src: string; caption: string; video?: string }>;
  /** Intrinsic size of `image`. Required for full-page captures so the scroll container renders them at true aspect ratio. */
  imageWidth?: number;
  imageHeight?: number;
  /** Code showcase examples */
  codeExamples?: Array<{
    title: string;
    description: string;
    code: string;
    language: string;
  }>;
}

export const projects: Project[] = [
  {
    slug: "the-leather-outlet",
    title: "The Leather Outlet",
    subtitle: "Leather & Outdoor Retailer — Lake George, NY",
    description:
      "A warm, image-led website for The Leather Outlet at the World Famous Tee Pee on Route 9: 30+ years of jackets, boots, handbags and name brands at outlet prices, plus the on-site gold mining sluice. Built to get people off the Northway and through the door.",
    image: "/images/projects/leather-outlet.jpg",
    imageWidth: 1440,
    imageHeight: 14380,
    fullPagePreview: true,
    featured: true,
    features: [
      "Full-bleed hero with click-to-call and directions",
      "Shop-by-category and brands-we-carry sections with a logo marquee",
      "Mining sluice attraction with a three-step how-it-works",
      "Store news, FAQ and contact page with hours and map",
      "Scroll-triggered animations throughout",
    ],
    deliverables: [
      "Brand-led website design",
      "Responsive multi-page build",
      "Local SEO structure for a destination retailer",
      "Vercel deployment",
    ],
    tech: ["HTML5", "SCSS", "Bootstrap 5", "JavaScript", "Gulp", "Vercel"],
    github: "",
    live: "https://leather-outlet.vercel.app",
    gradient: "from-amber-800 to-orange-700",
    status: "Live",
    category: "Web Design",
    highlight: "Latest Project",
    timeline: "2026",
    clientType: "Retail",
  },
  {
    slug: "black-label-barbecue",
    title: "Black Label Barbecue",
    subtitle: "Bold BBQ Sauce Storefront",
    description:
      "A dark, fire-lit storefront for Black Label Brand Barbecue. Five small-batch sauces, gallon jugs for crowds, recipes filtered by how you cook, and a custom-order page that hands off to BigCommerce checkout.",
    image: "/images/projects/black-label-sauce.jpg",
    imageWidth: 1440,
    imageHeight: 10651,
    fullPagePreview: true,
    featured: true,
    features: [
      "Product lineup with bottle and gallon-jug sizes",
      "Cook-by-fire guides: smoker, charcoal, gas, flat top, campfire, pellet",
      "Recipe browser filtered by sauce and method",
      "Custom order page with BigCommerce checkout hand-off",
      "Wholesale enquiries, sitemap and robots for search",
    ],
    deliverables: [
      "Brand storefront design and build",
      "Recipe and product content structure",
      "Checkout integration with BigCommerce",
      "Vercel deployment",
    ],
    tech: ["Next.js", "React", "TypeScript", "BigCommerce", "Vercel"],
    github: "",
    live: "https://blacklabelsauce.vercel.app",
    gradient: "from-neutral-900 to-red-700",
    status: "Live",
    category: "E-Commerce",
    highlight: "Latest Project",
    timeline: "2026",
    clientType: "Food Brand",
  },
  {
    slug: "hey-babe",
    title: "hey babe",
    subtitle: "Permanent Jewelry Studio — CT, RI, MA & NY",
    description:
      "A soft, editorial website for hey babe, a custom permanent jewelry studio serving Connecticut, Rhode Island, Massachusetts and New York. Scroll-scrubbed video walks visitors through the weld, and every chain, charm, event format and FAQ lives in one data file the owner can edit.",
    image: "/images/projects/heybabe.jpg",
    imageWidth: 1440,
    imageHeight: 17910,
    fullPagePreview: true,
    features: [
      "Scroll-scrubbed video sections that follow the weld, frame by frame",
      "Chain and charm menus with materials and pricing",
      "Booking form for parties, pop-ups, weddings and corporate events",
      "Live Instagram feed with a curated fallback gallery",
      "Smooth scrolling and motion throughout",
    ],
    deliverables: [
      "Brand-led website design",
      "Responsive Next.js build",
      "Booking endpoint and content-in-one-file editing",
      "Vercel deployment",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Lenis", "Vercel"],
    github: "",
    live: "https://heybabe.vercel.app",
    gradient: "from-rose-300 to-amber-200",
    status: "Live",
    category: "Web Design",
    highlight: "New",
    timeline: "2026",
    clientType: "Permanent Jewelry",
  },
  {
    slug: "stuck-on-you",
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
    highlight: "Featured",
    timeline: "2026",
    clientType: "Permanent Jewelry",
  },
  {
    slug: "steamers-stonewall-tavern",
    title: "Steamers Stonewall Tavern",
    subtitle: "Upscale-Casual Tavern — North Lima, OH",
    description:
      "A cinematic front end for a family-run Market Street tavern: a scroll-driven walk-in from the parking lot to the octagonal bar, the full 64-dish menu, and every fact on the page traceable to a verified source.",
    image: "/images/projects/steamers.jpg",
    features: [
      "Scroll-scrubbed video hero that walks you into the room",
      "Full 64-dish menu across eight sections, prices current",
      "Live open/closed status from the restaurant's real hours",
      "Editorial typography and a restrained neon-led palette",
      "Tuned for Core Web Vitals — preloaded LCP still, inlined critical CSS",
    ],
    deliverables: [
      "Content research and source-verified copy",
      "Location and dish photography direction",
      "Responsive site design and build",
      "Social card, structured data, and SEO metadata",
      "Deployment on Vercel",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
    github: "https://github.com/jordolang/steamers",
    live: "https://steamers-lima.vercel.app",
    gradient: "from-red-600 to-cyan-500",
    status: "Live",
    category: "Web Design",
    highlight: "Latest Project",
    timeline: "2026",
    clientType: "Restaurant",
  },
  {
    slug: "muskingum-materials-aggregate",
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
    slug: "safety-screen",
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
    codeExamples: [
      {
        title: "Real-Time Search Implementation",
        description: "Instant medication search with debouncing to minimize API calls while providing a responsive user experience.",
        code: `import { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';

interface Medication {
  id: string;
  name: string;
  genericName: string;
  description: string;
}

export function MedicationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`);
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medications..."
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
        <Icon
          icon="solar:magnifier-outline"
          width={20}
          height={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Icon
              icon="solar:spinner-outline"
              width={20}
              height={20}
              className="animate-spin text-blue-500"
            />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((med) => (
            <div
              key={med.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900">{med.name}</h3>
              <p className="text-sm text-gray-600">{med.genericName}</p>
              <p className="text-sm text-gray-500 mt-1">{med.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
        language: "typescript",
      },
    ],
  },
  {
    slug: "roam",
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
    slug: "jose-madrid-salsa",
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
    github: "",
    live: "https://josemadrid.net",
    gradient: "from-rose-600 to-red-600",
    status: "Live",
    category: "Web Design",
    highlight: "Featured",
    timeline: "2025",
    clientType: "Food & Beverage",
  },
  {
    slug: "muskingum-materials",
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
    slug: "salsadocs",
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
    slug: "jessica-asp",
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
    slug: "amplinks",
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
    slug: "zanesville-store",
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
    slug: "homesh-app",
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
    slug: "apple-sider",
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
    slug: "world-auto-net",
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
    slug: "neff-paving",
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
    live: "https://neffpaving.com",
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
    slug: "first-baptist-church",
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
    slug: "ohio-interests",
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
    slug: "amplinks-mobile",
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
    slug: "jose-madrid-mobile",
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
    github: "",
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
    slug: "radius",
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
  {
    slug: "jose-madrid-macos-desktop",
    title: "Jose Madrid Salsa for Mac",
    subtitle: "Native macOS Business Management App",
    description:
      "Run the entire business without ever leaving your desktop. A native macOS app that carries Jose Madrid Salsa's whole admin panel — manage orders, manage content, and run fundraisers, events, wholesale, finances and marketing from one keyboard-driven window. It reads the same live database as the website, so every new admin feature lands on the desktop the day it ships.",
    image: "/images/projects/desktop/jose-madrid-macos.webp",
    gallery: [
      { src: "/images/projects/desktop/jms/01-dashboard.jpg", caption: "Dashboard — today’s revenue, orders, stock and the next shows" },
      { src: "/images/projects/desktop/jms/02-products.jpg", caption: "Products — catalog with retail price, unit cost and margin" },
      { src: "/images/projects/desktop/jms/03-inventory.jpg", caption: "Inventory — on hand, reserved, available and reorder points" },
      { src: "/images/projects/desktop/jms/04-events.jpg", caption: "Events & Shows — month calendar of every show" },
      { src: "/images/projects/desktop/jms/05-email-marketing.jpg", caption: "Email Marketing — campaigns with open and click rates" },
      { src: "/images/projects/desktop/jms/06-lead-generation.jpg", caption: "Lead Generation — prospecting pipeline" },
      { src: "/images/projects/desktop/jms/07-social.jpg", caption: "Social — scheduled and published posts" },
      { src: "/images/projects/desktop/jms/08-command-palette.jpg", caption: "⌘K command palette — jump to any page by name" },
    ],
    imageWidth: 1600,
    imageHeight: 1088,
    features: [
      "Orders — every order with channel, status and totals, plus returns & RMAs and shipping labels",
      "Content & Blog — blog posts, pages, banners, FAQs, redirects and SEO",
      "Dashboard — today's revenue and orders, live fundraisers, jars on hand, reorder alerts, and the next shows",
      "Products — the full catalog with retail price, unit cost and margin",
      "Inventory — on hand, reserved, available and reorder points, flagged when stock runs low",
      "Customers — ranked by lifetime value, with order counts and acquisition source",
      "Purchase Orders — inbound supply by supplier, with goods, freight and what is still outstanding",
      "Invoices — accounts receivable, with open and past-due balances",
      "Fundraisers — every campaign and participant, sales, group share, and the Battle Arena",
      "Events & Shows — a month calendar of every show with booth fees, takings and packing manifests",
      "Wholesale — trade accounts with discounts, minimums, terms and approval, plus the store locator",
      "Financials — the general ledger and reconciliation, with QuickBooks export state",
      "Email Marketing — campaigns, templates, automations, lists & subscribers, suppressions, send log and brand kit",
      "Social — scheduled and published posts, connected accounts, product feeds and reach",
      "Lead Generation — the prospecting pipeline and lead campaigns, with Google ratings behind each lead",
      "Reviews — moderation queue with average rating, plus customer forms",
      "Analytics — year-over-year revenue, channel mix, top products, retention, margin and attribution",
      "Media & Docs — media library, documents archive, mileage log and show archive",
      "Messages — one inbox for support, the contact form and live chat, plus notifications",
      "Users & Roles — staff accounts with role, two-factor state and last sign-in, plus the encrypted credential vault",
      "Audit Logs — who did what, most recent first",
      "Settings — store identity, checkout, payments, shipping and integrations",
      "Database Console — live row counts for the core tables",
      "⌘K command palette to jump to any of 58 pages by name, J/K keyboard navigation, table filtering and a detail inspector",
      "Resizable table columns remembered per window, light and dark appearance, native menus, real printing and save dialogs for every export",
      "Role-based access — each person only sees the sections their permissions allow",
    ],
    deliverables: [
      "Native SwiftUI application for macOS (Intel and Apple silicon)",
      "Full admin panel parity over the live production database",
      "Keyboard-first navigation with a ⌘K command palette",
      "Role-based access, persistent sign-in and audit logging",
    ],
    tech: ["SwiftUI", "macOS", "Swift", "Next.js", "Prisma", "PostgreSQL"],
    github: "",
    live: "",
    gradient: "from-red-600 to-orange-500",
    status: "Live",
    category: "Desktop App",
    highlight: "macOS",
    timeline: "2026",
    clientType: "Food Manufacturer",
    group: "desktopApp",
  },
  {
    slug: "local-lead-scraper-pro",
    title: "Local Lead Scraper Pro",
    subtitle: "Google Maps Prospecting Desktop App",
    description:
      "A licensed Windows desktop app that turns a city and an industry into a worked lead list: scrape Google Maps listings, scan each site for contacts, compose and send personalised outreach, and work the follow-up calls from a prioritised cockpit.",
    image: "/images/projects/desktop/google-scraper.png",
    gallery: [
      { src: "/images/projects/desktop/lead-scraper/00-dashboard.jpg", caption: "Dashboard — scrape Google Maps listings by city and industry" },
      { src: "/images/projects/desktop/lead-scraper/01-listings.jpg", caption: "Business Listings — results with phone, website and rating" },
      { src: "/images/projects/desktop/lead-scraper/02-scraper.jpg", caption: "Website Scraper — crawl each site for emails and contacts" },
      { src: "/images/projects/desktop/lead-scraper/03-outreach.jpg", caption: "Contacts & Outreach — campaigns and call queue" },
      { src: "/images/projects/desktop/lead-scraper/04-licence-plans.jpg", caption: "Licence & Billing — trial, plans and feature tiers" },
      { src: "/images/projects/desktop/lead-scraper/05-tools.jpg", caption: "Tools — phone lookup, package pricing and CSV import" },
    ],
    imageWidth: 1600,
    imageHeight: 820,
    features: [
      "Google Maps listing scraper with radius and result caps",
      "Website crawler that pulls emails and contact details",
      "Templated email generation and campaign sending",
      "Prioritised call cockpit with a built-in pitch script",
      "CSV and XLSX export, plus a licensing and trial system",
    ],
    deliverables: [
      "PySide6 desktop application with eight screens",
      "Selenium scraping pipeline with an embedded browser",
      "Email generation, templating, and sending",
      "Ed25519-signed licensing with a 72-hour trial",
      "Packaged single-file Windows executable",
    ],
    tech: ["Python", "PySide6", "Qt", "Selenium", "PyInstaller"],
    github: "https://github.com/jordolang/Google-Scraper",
    live: "",
    gradient: "from-blue-600 to-indigo-600",
    status: "Live",
    category: "Desktop App",
    highlight: "Windows",
    timeline: "2026",
    clientType: "Lead Generation",
    group: "desktopApp",
  },
  {
    slug: "festivalnet-scraper",
    title: "FestivalNet Scraper",
    subtitle: "Vendor Show-Finder Desktop App",
    description:
      "Finds the most profitable shows for the lowest out-of-pocket cost. It scans every upcoming weekend within driving distance, scores each expo, fair, and festival on what it should actually put in a vendor's pocket, and lays the results out as a table, a map, a calendar, and four charts.",
    image: "/images/projects/desktop/festivalnet-scraper.png",
    gallery: [
      { src: "/images/projects/desktop/festivalnet/01-overview-financials.jpg", caption: "Overview — ranked shows with a per-event money breakdown" },
      { src: "/images/projects/desktop/festivalnet/02-scoring-notes.jpg", caption: "Scoring notes — why each show ranks where it does" },
      { src: "/images/projects/desktop/festivalnet/03-table.jpg", caption: "Table — every column the scraper fills in" },
      { src: "/images/projects/desktop/festivalnet/04-map.jpg", caption: "Map — every event within driving distance" },
      { src: "/images/projects/desktop/festivalnet/05-calendar.jpg", caption: "Calendar — shows by weekend" },
      { src: "/images/projects/desktop/festivalnet/06-charts.jpg", caption: "Charts — top shows, shows per month, by type and score spread" },
      { src: "/images/projects/desktop/festivalnet/07-export.jpg", caption: "Export — CSV, Excel, Markdown and JSON" },
    ],
    imageWidth: 1500,
    imageHeight: 968,
    features: [
      "Scores every event on estimated profit, not just attendance",
      "Geocoding and a drive-time radius from your home town",
      "Results as a table, map, calendar, and four charts",
      "Per-event breakdown: booth fees, travel, cost of goods, return",
      "One-click export and saved search profiles",
    ],
    deliverables: [
      "Cross-platform desktop app for Windows and macOS",
      "Scraping and geocoding pipeline with a scoring model",
      "Map, calendar, and charting views",
      "Windows and macOS builds for Intel and ARM",
    ],
    tech: ["Python", "Qt", "Requests", "Geocoding", "PyInstaller"],
    github: "https://github.com/jordolang/festivalnetwork-scraper",
    live: "",
    gradient: "from-emerald-600 to-teal-600",
    status: "Live",
    category: "Desktop App",
    highlight: "Windows & macOS",
    timeline: "2026",
    clientType: "Event Vendors",
    group: "desktopApp",
  },
  {
    slug: "jose-madrid-salsa-kiosk",
    title: "Salsa Kings Self-Order Kiosk",
    subtitle: "Event Self-Service Kiosk for Jose Madrid Salsa",
    description:
      "A self-service till for Jose Madrid Salsa's expo and festival booth. Customers scan jars under a downward-facing barcode scanner or tap them on screen, the kiosk applies the booth's mix-and-match deals, they pay by tap on a Square reader, and a receipt prints. One tablet on a pole stand does the work of a cashier.",
    image: "/images/projects/desktop/kiosk/02-menu.jpg",
    gallery: [
      { src: "/images/projects/desktop/kiosk/00-expo.jpg", video: "/videos/projects/kiosk-expo.mp4", caption: "Concept video — the pole-stand kiosk at an expo: scan, tap, done (AI-generated)" },
      { src: "/images/projects/desktop/kiosk/01-splash.jpg", video: "/videos/projects/kiosk-walkthrough.mp4", caption: "Screen recording — a full order from splash screen to printed receipt" },
      { src: "/images/projects/desktop/kiosk/01-splash.jpg", caption: "Attract screen with the booth price board" },
      { src: "/images/projects/desktop/kiosk/02-menu.jpg", caption: "Menu — every flavor, filtered by heat or style" },
      { src: "/images/projects/desktop/kiosk/03-order.jpg", caption: "Scanned jars land in the order; the next-deal hint nudges a bigger bundle" },
      { src: "/images/projects/desktop/kiosk/04-pay.jpg", caption: "Payment — tap, insert or swipe on the Square reader" },
      { src: "/images/projects/desktop/kiosk/05-receipt.jpg", caption: "Thank-you screen with the receipt and an automatic reset" },
    ],
    imageWidth: 1600,
    imageHeight: 900,
    features: [
      "Scan jars with a hands-free USB barcode scanner, or tap them on screen",
      "Booth deals (3 for $25, 4 for $32, 5 + chips for $40, case of 12) priced server-side",
      "Card payments through Square Terminal or a Square Reader on the iPad",
      "Thermal receipt printing and automatic reset between customers",
      "Live stock from the store database, with sold-out flavors marked",
      "Runs as a full-screen web app inside Android and iPad kiosk shells",
    ],
    deliverables: [
      "Kiosk web app built into the Jose Madrid Salsa platform",
      "Android and iPadOS kiosk shells with printer and reader bridges",
      "Square payment flow shared with the point-of-sale",
      "Hardware spec: tablet, pole stand, scanner, printer and card reader",
    ],
    tech: ["Next.js", "React", "TypeScript", "Square", "Swift", "Kotlin", "Prisma"],
    github: "",
    live: "",
    gradient: "from-red-600 to-amber-500",
    status: "In Development",
    category: "Kiosk App",
    highlight: "iPad & Android Kiosk",
    timeline: "2026",
    clientType: "Food Manufacturer",
    group: "desktopApp",
  },
];
