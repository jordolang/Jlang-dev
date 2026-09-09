"use client";

import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import SectionHeader from "./SectionHeader";

export interface AboutContent {
  greeting?: string;
  role?: string;
  age?: string;
  yearsExperience?: string;
  bio?: string[];
  coreCompetencies?: string[];
  coreCompetenciesLabel?: string;
  emergingSectors?: string[];
  emergingSectorsLabel?: string;
  achievements?: { text: string; icon: string; color: string }[];
  availability?: string[];
  currentRole?: { title?: string; subtitle?: string; period?: string; description?: string; badge?: string } | null;
}

export interface ContactDetails {
  publicEmail?: string;
  website?: string;
  location?: string;
}

interface OverviewSectionProps {
  content?: AboutContent;
  contact?: ContactDetails;
  heading?: { tagText?: string; tagIcon?: string; heading?: string; description?: string };
}

const DEFAULT_BIO = [
  "I specialize in creating visually stunning and user-friendly websites using modern design tools and techniques. I focus on responsive design, user experience optimization, and brand identity development that helps businesses stand out in the digital landscape.",
  "Beyond design, I love collaborating with clients to bring their vision to life, staying updated with the latest design trends, and creating digital experiences that not only look great but also drive results and user engagement.",
];

const DEFAULT_COMPETENCIES = [
  "Adobe Creative Suite", "HTML/CSS", "Javascript", "Full Stack Development", "Brand Identity",
  "Small-Business Marketing", "Digital Media (TV/Radio/Print)", "Responsive Design", "User Experience", "WordPress",
];

const DEFAULT_EMERGING = [
  "AI/Machine Learning", "Cloud Computing", "DevOps", "Mobile Development", "Progressive Web Apps",
  "Open-Source Projects", "Self-Hosted Solutions", "Small-Business Technology Independence", "FREE FOREVER TECHNOLOGY",
];

const DEFAULT_ACHIEVEMENTS = [
  { icon: "solar:star-bold", text: "Head Robotics Build (2000s)", color: "text-yellow-600" },
  { icon: "solar:palette-bold", text: "98% Client Satisfaction Rate", color: "text-blue-600" },
  { icon: "solar:code-square-bold", text: "10+ Websites Deployed", color: "text-green-600" },
];

const DEFAULT_AVAILABILITY = [
  "Open to New Opportunities",
  "On-site Service in Zanesville, OH",
  "Remote Service Nationwide",
];

const AVAILABILITY_ICONS = ["solar:check-circle-bold", "solar:map-point-bold", "solar:global-bold"];
const AVAILABILITY_COLORS = ["text-green-600", "text-cyan-600", "text-blue-600"];

const DEFAULT_ROLE_CARD = {
  title: "Freelance Web Designer",
  subtitle: "Independent Consultant",
  period: "2015 — Present",
  description:
    "Building custom websites and digital solutions for small to medium businesses, helping them establish a strong online presence and grow their digital footprint. Offering expertise in domain and local server configurations, providing on-site support as a specialist, implementing budget-minded fixes, and combining these with strategic marketing and advertising consulting.",
  badge: "50+ Satisfied Tech Clients",
};

export default function OverviewSection({ content, contact, heading }: OverviewSectionProps) {
  const greeting = content?.greeting || "Hello, I'm Jordan Lang";
  const role = content?.role || "Web Designer";
  const age = content?.age || "38 years old";
  const years = content?.yearsExperience || "12+ years";
  const bio = content?.bio?.length ? content.bio : DEFAULT_BIO;
  const competencies = content?.coreCompetencies?.length ? content.coreCompetencies : DEFAULT_COMPETENCIES;
  const competenciesLabel = content?.coreCompetenciesLabel || "Core Competencies (10+ Years Experience)";
  const emerging = content?.emergingSectors?.length ? content.emergingSectors : DEFAULT_EMERGING;
  const emergingLabel =
    content?.emergingSectorsLabel || "Emerging Sectors of Focus (Less than 5 Years Experience or Education)";
  const achievements = content?.achievements?.length ? content.achievements : DEFAULT_ACHIEVEMENTS;
  const availability = content?.availability?.length ? content.availability : DEFAULT_AVAILABILITY;
  const roleCard = { ...DEFAULT_ROLE_CARD, ...(content?.currentRole ?? {}) };
  const email = contact?.publicEmail || "jordolang@gmail.com";
  const website = contact?.website || "jlang.dev";
  const location = contact?.location || "Zanesville, OH";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <m.section
      id="overview"
      className="mb-16 md:mb-24 lg:mb-32 relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: true }}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 md:top-20 right-4 md:right-16 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-blue-400/20 md:from-blue-400/30 to-purple-400/20 md:to-purple-400/30 rounded-full blur-xl md:blur-4xl"
        />
        <div
          style={{ animationDelay: "3s" }}
          className="absolute bottom-8 md:bottom-16 left-4 md:left-16 w-24 md:w-40 h-24 md:h-40 bg-gradient-to-br from-green-400/15 md:from-green-400/20 to-cyan-400/15 md:to-cyan-400/20 rounded-full blur-xl md:blur-2xl"
        />
        <div
          style={{ animationDelay: "6s" }}
          className="hidden md:block absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-pink-400/25 to-orange-400/25 rounded-full blur-xl"
        />
      </div>

      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10"
      >
        {/* Section Header */}
        <SectionHeader
          tagText={heading?.tagText ?? "Get To Know Me"}
          tagIcon={heading?.tagIcon ?? "solar:user-heart-bold"}
          heading={heading?.heading ?? "About Me"}
          description={heading?.description ?? "Crafting digital experiences with passion, precision, and purpose"}
          showUnderline={true}
          centered={true}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-start px-4">

          {/* Main Profile Section */}
          <m.div
            variants={itemVariants}
            className="lg:col-span-8"
          >
            <div className="space-y-6 md:space-y-8">

              {/* Introduction Card */}
              <div className="relative p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/90 to-white/50 dark:from-gray-800/90 dark:to-gray-900/50 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-4 md:top-6 right-4 md:right-6 w-3 md:w-4 h-3 md:h-4 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute top-4 md:top-6 right-10 md:right-14 w-2 md:w-3 h-2 md:h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                <div className="hidden md:block absolute top-6 right-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-500"></div>

                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white flex items-center gap-2 md:gap-3">
                      <span className="text-2xl sm:text-3xl md:text-4xl">👋</span>
                      {greeting}
                    </h3>
                    <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-4 md:mb-6">
                      A passionate <span className="font-bold text-blue-600 dark:text-blue-400">{role}</span> and
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        &nbsp; creative professional</span> at <span className="font-bold text-green-600 dark:text-green-400">{age}</span> with
                      <span className="font-bold text-green-600 dark:text-green-400"> {years}</span> of experience crafting
                      beautiful and functional digital experiences.
                    </p>
                  </div>

                  {/* Expanded About Content */}
                  <div className="space-y-3 md:space-y-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-4 md:pt-6">
                    {bio.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)} className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Skills Highlight */}
                  <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 md:pt-6">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
                      <Icon icon="solar:lightning-bold" className="text-yellow-500 w-4 md:w-5 h-4 md:h-5" width={20} height={20} />
                      {competenciesLabel}
                    </h4>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {competencies.map((skill, index) => (
                        <m.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 text-gray-800 dark:text-gray-200 rounded-lg md:rounded-xl border border-blue-200/50 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300"
                        >
                          {skill}
                        </m.span>
                      ))}
                    </div>
                  </div>

                  {/* Emerging Sectors Section */}
                  <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 md:pt-6">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
                      <Icon icon="solar:book-2-bold" className="text-orange-500 w-4 md:w-5 h-4 md:h-5" width={20} height={20} />
                      {emergingLabel}
                    </h4>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {emerging.map((skill, index) => (
                        <m.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.6 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 text-gray-800 dark:text-gray-200 rounded-lg md:rounded-xl border border-orange-200/50 dark:border-orange-800/30 hover:shadow-lg transition-all duration-300"
                        >
                          {skill}
                        </m.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </m.div>

          {/* Enhanced Sidebar */}
          <m.div variants={itemVariants} className="lg:col-span-4 space-y-6 mt-6 lg:mt-0">
            {/* Contact Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50/90 to-pink-50/90 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-sm border border-white/30 dark:border-gray-700/40 shadow-xl">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Icon icon="solar:chat-round-dots-bold" className="text-purple-500 w-5 h-5" width={20} height={20} />
                Let&apos;s Connect
              </h4>
              <div className="space-y-3">
                <m.a
                  href={`mailto:${email}`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/70 dark:bg-gray-800/30 hover:bg-white/90 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-white/20 dark:border-gray-700/30"
                >
                  <div className="p-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-md group-hover:from-orange-600 group-hover:to-red-600 transition-all shadow-md">
                    <Icon icon="solar:letter-bold" className="text-white w-4 h-4" width={16} height={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white break-all">{email}</div>
                  </div>
                </m.a>

                <m.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/70 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30"
                >
                  <div className="p-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md shadow-md">
                    <Icon icon="solar:global-bold" className="text-white w-4 h-4" width={16} height={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{website}</div>
                  </div>
                </m.div>

                <m.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/70 dark:bg-gray-800/30"
                >
                  <div className="p-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-md shadow-md border border-white/20 dark:border-gray-700/30">
                    <Icon icon="solar:map-point-bold" className="text-white w-4 h-4" width={16} height={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{location}</div>
                  </div>
                </m.div>
              </div>
            </div>

            {/* Achievement Highlights */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/90 to-yellow-50/90 dark:from-amber-950/30 dark:to-yellow-950/30 backdrop-blur-sm border border-white/30 dark:border-gray-700/40 shadow-xl">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Icon icon="solar:cup-star-bold" className="text-amber-600 w-5 h-5" width={20} height={20} />
                Achievements
              </h4>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + index * 0.2 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-amber-100/70 dark:bg-gray-800/30  transition-all duration-300 group border border-white/20 dark:border-gray-700/30"
                  >
                    <Icon icon={achievement.icon} className={`${achievement.color} w-5 h-5`} width={20} height={20} />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">{achievement.text}</span>
                  </m.div>
                ))}
              </div>
            </div>

            {/* Available for Hire */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-cyan-50/90 dark:from-emerald-950/30 dark:to-cyan-950/30 backdrop-blur-sm border border-white/30 dark:border-gray-700/40 shadow-xl">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Icon icon="solar:rocket-bold" className="text-emerald-600 w-5 h-5" width={20} height={20} />
                Available for Hire
              </h4>
              <div className="space-y-3.5">
                {availability.map((item, index) => (
                  <m.div
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0 + index * 0.2 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-green-100/70 dark:bg-gray-800/30  transition-all duration-300 group border border-white/20 dark:border-gray-700/30"
                  >
                    <Icon
                      icon={AVAILABILITY_ICONS[index % AVAILABILITY_ICONS.length]}
                      className={`${AVAILABILITY_COLORS[index % AVAILABILITY_COLORS.length]} w-5 h-5`}
                      width={20}
                      height={20}
                    />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">{item}</span>
                  </m.div>
                ))}
              </div>
            </div>
          </m.div>
        </div>

        {/* Professional Role - Full Width */}
        <m.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="px-4 mt-6 md:mt-8"
        >
          <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-50/80 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 backdrop-blur-sm border border-green-200/50 dark:border-green-800/30 shadow-xl flex flex-col">
            <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-green-500 rounded-lg md:rounded-xl shadow-lg">
                <Icon icon="solar:laptop-bold" className="text-white w-5 md:w-6 h-5 md:h-6" width={24} height={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base md:text-lg">{roleCard.title}</h4>
                <p className="text-green-600 dark:text-green-400 font-medium text-sm md:text-base">{roleCard.subtitle}</p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{roleCard.period}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm leading-relaxed mb-2 md:mb-3 flex-1">
              {roleCard.description}
            </p>
            <div className="flex items-center gap-2 text-xs md:text-sm mt-auto">
              <Icon icon="solar:shield-check-bold" className="text-blue-500 w-3 md:w-4 h-3 md:h-4" width={16} height={16} />
              <span className="font-semibold text-blue-600 dark:text-blue-400">{roleCard.badge}</span>
            </div>
          </div>
        </m.div>
      </m.div>
    </m.section>
  );
} 