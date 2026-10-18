import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { ResumeActions } from "./ResumeActions";
import { formatCredentialDate, type ResumeContent, type ResumeRole } from "@/lib/resumeContent";

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-700 dark:text-gold-300 mb-5 print:mb-3 print:text-black">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/10 ring-1 ring-gold-500/30 print:hidden">
        <Icon icon={icon} width={16} height={16} />
      </span>
      {children}
      <span className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" />
    </h2>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 print:border-gray-300 print:bg-transparent print:px-2 print:py-0.5">
      {children}
    </span>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 shadow-xl shadow-black/5 dark:shadow-black/40 print:rounded-none print:border-0 print:bg-transparent print:p-0 print:shadow-none ${className}`}
    >
      {children}
    </div>
  );
}

function TimelineRole({ item }: { item: ResumeRole }) {
  return (
    <li className="relative pl-8 pb-8 last:pb-0 break-inside-avoid">
      <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-gold-500 bg-white dark:bg-gray-950" />
      <span className="absolute left-[5px] top-5 bottom-0 w-px bg-gradient-to-b from-gold-500/40 to-transparent" aria-hidden />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {item.role} <span className="font-normal text-gray-500 dark:text-gray-400">· {item.company}</span>
        </h3>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 tabular-nums">
          {item.period}
          {item.type ? ` · ${item.type}` : ""}
        </span>
      </div>
      {item.description && <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.description}</p>}
      {item.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {item.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ResumeView({ resume }: { resume: ResumeContent }) {
  const { currentRole } = resume;
  const contact = [
    { icon: "solar:map-point-bold", label: resume.location },
    { icon: "solar:letter-bold", label: resume.email, href: `mailto:${resume.email}` },
    ...(resume.phone ? [{ icon: "solar:phone-bold", label: resume.phone, href: `tel:${resume.phone.replace(/[^+\d]/g, "")}` }] : []),
    ...resume.links.map((link) => ({ icon: link.icon, label: link.label, href: link.href })),
  ];

  return (
    <div className="resume-root relative min-h-screen overflow-x-clip bg-[#FAF8F3] dark:bg-gray-950 text-gray-900 dark:text-white print:bg-white print:text-black">
      {/* Ambient brand glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 print:hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gold-400/20 dark:bg-gold-500/10 blur-3xl" />
        <div className="absolute top-[40%] -right-40 h-[420px] w-[420px] rounded-full bg-silver-400/20 dark:bg-silver-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-6 md:px-6 print:hidden">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gold-700 dark:hover:text-gold-300 transition-colors">
          <Icon icon="solar:arrow-left-outline" width={18} height={18} />
          jlang.dev
        </Link>
        <ResumeActions />
      </header>

      <main id="main-content" className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-10 md:px-6 md:pt-14 print:max-w-none print:p-0">
        {/* Hero */}
        <Reveal>
          <section className="relative overflow-hidden rounded-[2rem] border border-gold-500/25 bg-white/90 dark:bg-transparent dark:bg-gradient-to-br dark:from-white/[0.06] dark:to-white/[0.01] p-6 md:p-12 shadow-2xl shadow-gold-900/10 print:rounded-none print:border-0 print:border-b print:border-gray-300 print:p-0 print:pb-4 print:shadow-none">
            <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-gold-400/30 to-transparent blur-2xl print:hidden" />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
              <div className="relative h-28 w-28 shrink-0 md:h-36 md:w-36 print:h-20 print:w-20">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-300 via-gold-600 to-gold-900 p-[3px] print:hidden">
                  <div className="h-full w-full rounded-full bg-white dark:bg-gray-950" />
                </div>
                <div className="absolute inset-[6px] overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  {resume.photo ? (
                    <Image src={resume.photo} alt={resume.name} fill sizes="144px" className="object-cover" priority />
                  ) : (
                    <Image src="/favicon.png" alt="" width={72} height={72} className="h-1/2 w-1/2 object-contain" priority />
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 print:hidden">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Available for new projects
                </p>
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl print:text-4xl">
                  <span className="bg-gradient-to-r from-gold-700 via-gold-500 to-gold-800 dark:from-gold-200 dark:via-gold-400 dark:to-gold-200 bg-clip-text text-transparent print:bg-none print:text-black">
                    {resume.name}
                  </span>
                </h1>
                <p className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-200 md:text-2xl print:text-lg">{resume.headline}</p>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300 print:text-sm">{resume.summary}</p>

                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm print:mt-3 print:text-xs">
                  {contact.map((item) => (
                    <li key={item.label}>
                      {item.href ? (
                        <a href={item.href} className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-gold-700 dark:hover:text-gold-300 transition-colors">
                          <Icon icon={item.icon} width={16} height={16} className="text-gold-600 dark:text-gold-400" />
                          {item.label}
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                          <Icon icon={item.icon} width={16} height={16} className="text-gold-600 dark:text-gold-400" />
                          {item.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {resume.stats.length > 0 && (
              <dl className="relative mt-10 grid grid-cols-1 gap-4 border-t border-gray-200 dark:border-white/10 pt-8 sm:grid-cols-3 print:hidden">
                {resume.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block text-3xl font-bold tabular-nums text-gray-900 dark:text-white md:text-4xl">{stat.value}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 print:mt-4 print:block">
          {/* Main column */}
          <div className="space-y-8 lg:col-span-8 print:space-y-5">
            <Reveal>
              <Panel className="relative overflow-hidden ring-1 ring-gold-500/30 print:ring-0">
                <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-300 via-gold-600 to-gold-300 print:hidden" />
                <SectionTitle icon="solar:case-round-bold">Current role</SectionTitle>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white print:text-lg">{currentRole.role}</h3>
                    <p className="mt-1 text-lg font-medium text-gold-700 dark:text-gold-300 print:text-base print:text-black">
                      {currentRole.website ? (
                        <a href={currentRole.website} className="hover:underline">
                          {currentRole.company}
                        </a>
                      ) : (
                        currentRole.company
                      )}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-gold-500/10 px-3 py-1 text-sm font-semibold text-gold-800 dark:text-gold-200 ring-1 ring-gold-500/30 tabular-nums print:bg-transparent print:ring-0 print:px-0">
                    <Icon icon="solar:calendar-bold" width={14} height={14} className="print:hidden" />
                    {currentRole.period}
                  </span>
                </div>
                <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300 print:text-sm">{currentRole.description}</p>
                {currentRole.highlights.length > 0 && (
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2 print:block print:space-y-1">
                    {currentRole.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3 rounded-2xl bg-gray-50 dark:bg-white/[0.04] p-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300 print:bg-transparent print:p-0">
                        <Icon icon="solar:check-circle-bold" width={18} height={18} className="mt-0.5 shrink-0 text-gold-600 dark:text-gold-400" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
                {currentRole.technologies && currentRole.technologies.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {currentRole.technologies.map((tech) => (
                      <Chip key={tech}>{tech}</Chip>
                    ))}
                  </div>
                )}
              </Panel>
            </Reveal>

            {resume.projects.length > 0 && (
              <Reveal>
                <Panel>
                  <SectionTitle icon="solar:widget-5-bold">Recent projects</SectionTitle>
                  <ul className="grid gap-4 sm:grid-cols-2 print:grid-cols-2 print:gap-2">
                    {resume.projects.map((project) => (
                      <li key={project.slug} className="break-inside-avoid">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="group flex h-full gap-4 rounded-2xl border border-gray-200 dark:border-white/10 p-3 hover:border-gold-500/50 hover:bg-gold-500/[0.04] transition-colors print:border-0 print:p-0"
                        >
                          <div className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${project.gradient || "from-gold-500 to-gold-800"} print:hidden`}>
                            {project.image && (
                              <Image src={project.image} alt="" fill sizes="80px" className="object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                            )}
                          </div>
                          <div className="min-w-0 py-0.5">
                            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              <span className={`h-1.5 w-1.5 rounded-full ${project.status === "Live" ? "bg-emerald-500" : "bg-amber-500"}`} />
                              {project.status} · {project.timeline}
                            </p>
                            <h3 className="mt-1 font-semibold text-gray-900 dark:text-white group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors">
                              {project.title}
                            </h3>
                            <p className="mt-0.5 line-clamp-2 text-sm text-gray-600 dark:text-gray-400 print:line-clamp-none print:text-xs">{project.subtitle}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/projects"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 dark:text-gold-300 hover:gap-3 transition-all print:hidden"
                  >
                    See every project
                    <Icon icon="solar:arrow-right-outline" width={16} height={16} />
                  </Link>
                </Panel>
              </Reveal>
            )}

            {resume.experience.length > 0 && (
              <Reveal>
                <Panel>
                  <SectionTitle icon="solar:history-bold">Previous experience</SectionTitle>
                  <ol>
                    {resume.experience.map((item) => (
                      <TimelineRole key={`${item.company}-${item.period}`} item={item} />
                    ))}
                  </ol>
                </Panel>
              </Reveal>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:col-span-4 print:mt-5 print:space-y-5">
            {resume.credentials.length > 0 && (
              <Reveal>
                <Panel>
                  <SectionTitle icon="solar:diploma-verified-bold">Credentials</SectionTitle>
                  <ul className="space-y-4 print:space-y-2">
                    {resume.credentials.map((credential) => {
                      const issued = formatCredentialDate(credential.issued);
                      const expires = formatCredentialDate(credential.expires);
                      const proof = credential.url || credential.file || credential.image;
                      return (
                        <li
                          key={`${credential.title}-${credential.issuer}`}
                          className="group relative flex gap-4 rounded-2xl border border-gold-500/20 bg-gradient-to-br from-gold-500/[0.07] to-transparent p-4 break-inside-avoid print:border-0 print:bg-none print:p-0"
                        >
                          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-gray-900 ring-1 ring-gold-500/30 print:hidden">
                            {credential.image ? (
                              <Image src={credential.image} alt="" fill sizes="56px" className="object-cover" />
                            ) : (
                              <Icon icon="solar:medal-ribbons-star-bold" width={28} height={28} className="text-gold-600 dark:text-gold-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold leading-snug text-gray-900 dark:text-white">{credential.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{credential.issuer}</p>
                            {(issued || expires) && (
                              <p className="mt-1 text-xs tabular-nums text-gray-500 dark:text-gray-500">
                                {issued ? `Issued ${issued}` : ""}
                                {issued && expires ? " · " : ""}
                                {expires ? `Expires ${expires}` : ""}
                              </p>
                            )}
                            {credential.credentialId && (
                              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">ID {credential.credentialId}</p>
                            )}
                            {proof && (
                              <a
                                href={proof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold-700 dark:text-gold-300 hover:underline print:hidden"
                              >
                                <Icon icon="solar:shield-check-bold" width={14} height={14} />
                                {credential.url ? "Verify" : "View certificate"}
                              </a>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Panel>
              </Reveal>
            )}

            <Reveal delay={0.05}>
              <Panel>
                <SectionTitle icon="solar:cpu-bolt-bold">Skills</SectionTitle>
                <div className="space-y-5 print:space-y-2">
                  {resume.skillGroups.map((group) => (
                    <div key={group.title} className="break-inside-avoid">
                      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">{group.title}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {group.skills.map((skill) => (
                          <Chip key={skill}>{skill}</Chip>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </Reveal>

            {resume.education.length > 0 && (
              <Reveal delay={0.1}>
                <Panel>
                  <SectionTitle icon="solar:square-academic-cap-bold">Education</SectionTitle>
                  <ul className="space-y-4">
                    {resume.education.map((item) => (
                      <li key={`${item.school}-${item.program ?? ""}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.school}</h3>
                        {item.program && <p className="text-sm text-gray-600 dark:text-gray-400">{item.program}</p>}
                        {item.period && <p className="text-xs tabular-nums text-gray-500">{item.period}</p>}
                      </li>
                    ))}
                  </ul>
                </Panel>
              </Reveal>
            )}

            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-black p-6 md:p-8 text-white shadow-2xl ring-1 ring-gold-500/30 print:hidden lg:sticky lg:top-8">
                <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-500/30 blur-3xl" />
                <h2 className="relative text-xl font-bold">Have a project in mind?</h2>
                <p className="relative mt-2 text-sm text-gray-300">Websites, web apps, kiosks and the IT that keeps them running.</p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  <Link href="/#contact" className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-2 text-sm font-semibold text-black hover:bg-gold-300 transition-colors">
                    <Icon icon="solar:chat-round-dots-bold" width={16} height={16} />
                    Get in touch
                  </Link>
                  <Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:border-gold-400 transition-colors">
                    Services
                  </Link>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </main>
    </div>
  );
}
