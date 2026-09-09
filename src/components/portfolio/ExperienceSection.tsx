import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import SectionHeader from "./SectionHeader";

export const experience = [
  {
    role: "Web Designer",
    company: "Neff Paving",
    period: "2022 — Current",
    type: "Contract",
    companyColor: "from-orange-500 to-red-600",
    companyIcon: "mdi:road-variant",
    description: "Created modern web presence for established paving contractor, transforming their digital footprint with professional design and improved functionality.",
    achievements: [
      "Redesigned company website with modern, professional aesthetic",
      "Implemented project portfolio showcase with before/after galleries",
      "Enhanced contact forms and quote request system",
      "Improved mobile responsiveness and site navigation"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "WordPress", "Bootstrap", "Adobe Photoshop", "SEO Optimization"]
  },
  {
    role: "Freelance Web Designer",
    company: "Ohio Interests",
    period: "2020 — 2021",
    type: "Freelance",
    companyColor: "from-green-500 to-teal-600",
    companyIcon: "mdi:web",
    description: "Provided web design services for various local Ohio businesses, creating custom solutions tailored to each client's unique needs and industry requirements.",
    achievements: [
      "Delivered custom web solutions for 8+ local businesses",
      "Specialized in small business branding and digital presence",
      "Maintained ongoing client relationships with regular updates",
      "Achieved 100% client satisfaction with repeat business referrals"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "WordPress", "Wix", "Squarespace", "Google Analytics", "Local SEO"]
  },
  {
    role: "Web Designer",
    company: "First Baptist Church",
    period: "2023",
    type: "Volunteer",
    companyColor: "from-purple-500 to-blue-600",
    companyIcon: "mdi:church",
    description: "Developed comprehensive website solution for local church community, focusing on accessibility and community engagement features.",
    achievements: [
      "Built user-friendly website with event calendar and sermon archives",
      "Implemented online donation system and member portal",
      "Created responsive design accessible across all devices",
      "Established social media integration and newsletter signup"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "WordPress", "MySQL", "PayPal Integration", "Accessibility Standards"]
  },
  {
    role: "Lead Sales, Finance, and Marketing Manager",
    company: "World Auto Net",
    period: "2020 — 2021",
    type: "Contract",
    companyIcon: "mdi:car",
    companyColor: "from-blue-600 to-indigo-600",
    description: "Managed multiple roles including sales, finance, and marketing. Created and managed the company's website, leading to significant achievements in customer engagement and sales growth.",
    achievements: [
      "Increased website traffic by 60% through targeted marketing campaigns",
      "Streamlined finance operations, resulting in a 20% improvement in efficiency",
      "Developed a digital sales strategy that boosted sales by 30%",
      "Handled customer inquiries and support, improving satisfaction rates by 25%"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Adobe Creative Suite"]
  }
];

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  type?: string;
  companyColor: string;
  companyIcon: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface ExperienceStats {
  yearsExperience?: string;
  websitesCreated?: string;
  clientSatisfaction?: string;
}

interface ExperienceSectionProps {
  /** Roles from Sanity. Falls back to the list above when the CMS has none. */
  items?: ExperienceItem[];
  stats?: ExperienceStats;
  heading?: { tagText?: string; tagIcon?: string; heading?: string; description?: string };
}

export default function ExperienceSection({ items, stats, heading }: ExperienceSectionProps) {
  const experienceItems = items?.length ? items : experience;
  return (
    <section id="experience" className="mb-16 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/3 to-blue-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <SectionHeader
          tagText={heading?.tagText ?? "Professional Journey"}
          tagIcon={heading?.tagIcon ?? "solar:case-bold"}
          heading={heading?.heading ?? "Experience"}
          showUnderline={false}
          description={heading?.description ?? "My professional journey and the impact I've made across different domains"}
          centered={true}
        />

        <div className="max-w-5xl mx-auto space-y-6 md:space-y-12 px-4 md:px-6">
          {experienceItems.map((exp, index) => (
            <Reveal key={index} className="relative group" delay={index * 0.05}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-6 md:gap-8 lg:gap-12">
                {/* Company Icon & Info */}
                <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
                  <div
                    className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${exp.companyColor} flex items-center justify-center shadow-xl md:shadow-2xl mb-3 md:mb-4 relative overflow-hidden group-hover:shadow-2xl md:group-hover:shadow-3xl hover:scale-110 hover:rotate-3 transition-all duration-500`}
                  >
                    <Icon
                      icon={exp.companyIcon!}
                      className="text-white w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 relative z-10"
                      width={40}
                      height={40}
                    />
                    {/* Hover gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${exp.companyColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4 md:space-y-6 min-w-0">
                  {/* Header */}
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center gap-2 md:gap-3 text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">
                      <Icon icon="solar:calendar-outline" width={14} height={14} className="md:w-4 md:h-4" />
                      <span>{exp.period}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                      {exp.role}
                    </h3>

                    <p className="text-lg md:text-xl text-blue-600 dark:text-blue-400 font-semibold">
                      {exp.company}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  <div className="space-y-3 md:space-y-4">
                    <h4 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <Icon icon="solar:cup-star-bold" className="text-amber-500" width={22} height={22} />
                      Key Achievements
                    </h4>

                    <div className="space-y-2 md:space-y-3">
                      {exp.achievements.map((achievement, achIndex) => (
                        <div
                          key={achIndex}
                          className="flex items-start gap-3 md:gap-4 group/achievement hover:translate-x-1 md:hover:translate-x-2 transition-transform duration-300"
                        >
                          <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mt-0.5 shadow-md md:shadow-lg group-hover/achievement:scale-110 transition-transform duration-300">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                            {achievement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-3 md:space-y-4">
                    <h4 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <Icon icon="solar:programming-bold" className="text-purple-500" width={18} height={18} />
                      Technologies & Skills
                    </h4>

                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-100/80 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 rounded-lg md:rounded-xl font-medium text-xs md:text-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              {index < experience.length - 1 && (
                <div className="mt-6 md:mt-12 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent origin-left" />
              )}
            </Reveal>
          ))}
        </div>

        {/* Experience Summary Stats */}
        <Reveal className="mt-16 md:mt-24 text-center px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="group p-6 md:p-8 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-200/30 dark:border-blue-800/20 hover:border-blue-300/50 dark:hover:border-blue-600/30 hover:scale-105 hover:-translate-y-1 transition-all duration-500">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">{stats?.yearsExperience ?? "4+"}</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium text-base md:text-lg">Years Experience</div>
            </div>

            <div className="group p-6 md:p-8 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10 border border-green-200/30 dark:border-green-800/20 hover:border-green-300/50 dark:hover:border-green-600/30 hover:scale-105 hover:-translate-y-1 transition-all duration-500">
              <div className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">{stats?.websitesCreated ?? "25+"}</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium text-base md:text-lg">Websites Created</div>
            </div>

            <div className="group p-6 md:p-8 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 border border-purple-200/30 dark:border-purple-800/20 hover:border-purple-300/50 dark:hover:border-purple-600/30 hover:scale-105 hover:-translate-y-1 transition-all duration-500 sm:col-span-2 lg:col-span-1">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">{stats?.clientSatisfaction ?? "100%"}</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium text-base md:text-lg">Client Satisfaction</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
