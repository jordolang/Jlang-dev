"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, m } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import SectionHeader from "./SectionHeader";

type Certificate = {
  title: string;
  provider: string;
  platform: string;
  issued: string;
  credentialId: string;
  skills: string[];
  providerIcon: string;
  platformIcon: string;
  color: string;
  certificatePreview: string;
  providerIconSize: number;
  platformIconSize: number;
};

export const certifications: Certificate[] = [
  {
    title: "DevOps Essentials",
    provider: "IBM",
    platform: "Coursera",
    issued: "November 2023",
    credentialId: "P67DLWJP2GL7",
    skills: ["Continuous Integration", "DevOps", "Product Development", "IaaC"],
    providerIcon: "lineicons:ibm",
    platformIcon: "logos:coursera",
    color: "from-blue-500 to-blue-600",
    certificatePreview: "/certificates/P67DLWJP2GL7_DEVOPS.png",
    providerIconSize: 64,
    platformIconSize: 88,
  },
  {
    title: "Git and GitHub Essentials",
    provider: "IBM",
    platform: "Coursera",
    issued: "January 2023",
    credentialId: "YYQL3U4QAZJF",
    skills: ["Version Control", "Git", "GitHub", "GitLab", "Open Source"],
    providerIcon: "lineicons:ibm",
    platformIcon: "logos:coursera",
    color: "from-blue-500 to-blue-600",
    certificatePreview: "/certificates/ YYQL3U4QAZJF_GIT_GITHUB.png",
    providerIconSize: 64,
    platformIconSize: 88,
  },
  {
    title: "Web Development with HTML, CSS, JavaScript Essentials",
    provider: "IBM",
    platform: "Coursera",
    issued: "January 2023",
    credentialId: "3UPD6SABRD3B",
    skills: ["IBM Cloud", "HTML", "CSS", "Full-Stack Development"],
    providerIcon: "lineicons:ibm",
    platformIcon: "logos:coursera",
    color: "from-blue-500 to-blue-600",
    certificatePreview: "/certificates/3UPD6SABRD3B_INTRO_WEB.png",
    providerIconSize: 64,
    platformIconSize: 88,
  },
  {
    title: "Introduction to Cloud Computing",
    provider: "IBM",
    platform: "Coursera",
    issued: "January 2023",
    credentialId: "verified-credly",
    skills: ["Container", "IaaS", "IBM Cloud", "Architecture", "Cloud Computing", "PaaS", "DevOps"],
    providerIcon: "lineicons:ibm",
    platformIcon: "logos:coursera",
    color: "from-blue-500 to-blue-600",
    certificatePreview: "/certificates/EXFQ7QMJYUQQ_AWS.png",
    providerIconSize: 64,
    platformIconSize: 88,
  },
  {
    title: "Introduction to Databases for Back-End Development",
    provider: "Meta",
    platform: "Coursera",
    issued: "February 2023",
    credentialId: "5FNQEGLH78UD",
    skills: ["Database Design", "SQL", "Backend Development", "Data Management"],
    providerIcon: "logos:meta-icon",
    platformIcon: "logos:coursera",
    color: "from-blue-500 to-purple-600",
    certificatePreview: "/certificates/5FNQEGLH78UD_DATABASES_FOR_BACKEND.png",
    providerIconSize: 64,
    platformIconSize: 88,
  },
  {
    title: "Introduction to Back-End Development",
    provider: "Meta",
    platform: "Coursera",
    issued: "January 2023",
    credentialId: "2Y8NRQC5MP96",
    skills: ["Backend Development", "APIs", "Server-Side Programming", "Web Development"],
    providerIcon: "logos:meta-icon",
    platformIcon: "logos:coursera",
    color: "from-blue-500 to-purple-600",
    certificatePreview: "/certificates/2Y8NRQC5MP96_INTRO_BE.png",
    providerIconSize: 64,
    platformIconSize: 88,
  },
  {
    title: "Django Web Framework",
    provider: "Meta",
    platform: "Coursera",
    issued: "February 2023",
    credentialId: "3YRA842UKERB",
    skills: ["Django", "Python", "Web Framework", "MVC Architecture"],
    providerIcon: "logos:meta-icon",
    platformIcon: "logos:coursera",
    color: "from-blue-500 to-purple-600",
    certificatePreview: "/certificates/3YRA842UKERB_DJANGO.png",
    providerIconSize: 64,
    platformIconSize: 88,
  },
  {
    title: "Programming in Python",
    provider: "Meta",
    platform: "Coursera",
    issued: "January 2023",
    credentialId: "2AUUVS958L5Y",
    skills: ["Python", "Programming", "Data Structures", "Algorithms"],
    providerIcon: "logos:meta-icon",
    platformIcon: "logos:coursera",
    color: "from-blue-500 to-purple-600",
    certificatePreview: "/certificates/2AUUVS958L5Y_PYTHON.png",
    providerIconSize: 64,
    platformIconSize: 88,
  },
  {
    title: "Version Control",
    provider: "Meta",
    platform: "Coursera",
    issued: "January 2023",
    credentialId: "BLGJKHN6UTSF",
    skills: ["Git", "Version Control", "Collaboration", "Software Development"],
    providerIcon: "logos:meta-icon",
    platformIcon: "logos:coursera",
    color: "from-blue-500 to-purple-600",
    certificatePreview: "/certificates/BLGJKHN6UTSF_version_control.png",
    providerIconSize: 64,
    platformIconSize: 88,
  },
  {
    title: "Introduction to Databases",
    provider: "Meta",
    platform: "Coursera",
    issued: "February 2023",
    credentialId: "N9LJFAWZXTMA",
    skills: ["Database Fundamentals", "SQL", "Data Management", "Database Design"],
    providerIcon: "logos:meta-icon",
    platformIcon: "logos:coursera",
    color: "from-blue-500 to-purple-600",
    certificatePreview: "/certificates/N9LJFAWZXTMA_DATABASES.png",
    providerIconSize: 64,
    platformIconSize: 88,
  },
  {
    title: "AWS Cloud Technical Essentials",
    provider: "Amazon Web Services",
    platform: "Coursera",
    issued: "February 2023",
    credentialId: "EXFQ7QMJYUQQ",
    skills: ["AWS", "Cloud Computing", "EC2", "S3", "IAM", "VPC"],
    providerIcon: "skill-icons:aws-dark",
    platformIcon: "logos:coursera",
    color: "from-orange-500 to-red-600",
    certificatePreview: "/certificates/EXFQ7QMJYUQQ_AWS.png",
    providerIconSize: 44,
    platformIconSize: 88,
  },
  {
    title: "Foundations: Data, Data, Everywhere",
    provider: "Google",
    platform: "Coursera",
    issued: "November 2022",
    credentialId: "6RUAYHXFV5XZ",
    skills: ["Data Analysis", "Data Management", "Statistical Analysis"],
    providerIcon: "logos:google",
    platformIcon: "logos:coursera",
    color: "from-indigo-500 to-purple-600",
    certificatePreview: "/certificates/6RUAYHXFV5XZ_Foundations_data.png",
    providerIconSize: 64,
    platformIconSize: 88,
  },
  {
    title: "Databases with SQL",
    provider: "CS50",
    platform: "HarvardX",
    issued: "May 2025",
    credentialId: "d7be6646-4c57-431e-88a9-ad7b882864e3",
    skills: ["SQL", "Database", "Data Management", "Data Analysis"],
    providerIcon: "fa-solid:university",
    platformIcon: "simple-icons:edx",
    color: "from-indigo-500 to-purple-600",
    certificatePreview: "/certificates/CS50_SQL.png",
    providerIconSize: 44,
    platformIconSize: 44,
  },
];

/** Only Coursera issues the public /verify/<id> pages; anything else has no linkable credential. */
function verifyUrl(cert: Certificate): string | null {
  if (cert.platform !== "Coursera" || !cert.credentialId || cert.credentialId === "verified-credly") return null;
  return `https://www.coursera.org/verify/${cert.credentialId}`;
}

interface CertificationsSectionProps {
  /** Certifications from Sanity. Falls back to the list above when the CMS has none. */
  items?: Certificate[];
  heading?: { tagText?: string; tagIcon?: string; heading?: string; description?: string };
}

export default function CertificationsSection({ items, heading }: CertificationsSectionProps) {
  const certs = items?.length ? items : certifications;
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <>
      <m.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16 md:mb-24 lg:mb-32"
      >
        <SectionHeader
          tagText={heading?.tagText ?? "Professional Credentials"}
          tagIcon={heading?.tagIcon ?? "solar:verified-check-bold"}
          heading={heading?.heading ?? "Certifications"}
          description={
            heading?.description ??
            "Credentials backing the stack and the experience above. Select one to view the certificate."
          }
          centered
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-4">
          {certs.map((cert) => (
            <m.button
              key={cert.credentialId || cert.title}
              type="button"
              onClick={() => setSelected(cert)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -3 }}
              aria-label={`View ${cert.title} certificate`}
              className="group flex h-full flex-col items-start gap-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 p-4 text-left backdrop-blur-sm transition-colors hover:border-blue-400 dark:hover:border-blue-600"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon icon={cert.providerIcon} width={28} height={28} />
                  <span className="text-xs font-bold text-gray-400">×</span>
                  <Icon icon={cert.platformIcon} width={40} height={20} />
                </div>
                <Icon icon="solar:verified-check-bold" className="text-blue-500 shrink-0" width={18} height={18} />
              </div>

              <h3 className="text-sm font-semibold leading-snug text-gray-900 dark:text-white line-clamp-2">
                {cert.title}
              </h3>

              <p className="mt-auto text-xs text-gray-500 dark:text-gray-400">
                {cert.provider} · {cert.issued}
              </p>
            </m.button>
          ))}
        </div>

        <div className="mt-8 flex justify-center px-4">
          <div className="inline-flex items-center gap-3 rounded-xl border border-blue-200/50 dark:border-blue-800/50 bg-blue-50/80 dark:bg-blue-900/20 px-5 py-3 backdrop-blur-sm">
            <Icon icon="solar:star-bold" className="text-blue-500" width={18} height={18} />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              {certs.length} professional certifications
            </span>
            <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">
              · verified by industry leaders
            </span>
          </div>
        </div>
      </m.section>

      <AnimatePresence>
        {selected && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <m.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(event: React.MouseEvent) => event.stopPropagation()}
              className="max-h-[90vh] max-w-3xl overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-700 p-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selected.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selected.provider} · {selected.platform} · {selected.issued}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close certificate preview"
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Icon icon="solar:close-outline" className="text-gray-500" width={20} height={20} />
                </button>
              </div>

              {selected.certificatePreview && (
                <div className="flex justify-center bg-gray-50 dark:bg-gray-800/50 p-5">
                  <Image
                    src={selected.certificatePreview}
                    alt={`${selected.title} certificate`}
                    width={800}
                    height={600}
                    className="h-auto w-full max-w-full rounded-lg border border-gray-200 dark:border-gray-700"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 dark:border-gray-700 p-5">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {selected.skills.slice(0, 4).join(" · ")}
                </div>
                {verifyUrl(selected) && (
                  <a
                    href={verifyUrl(selected)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <Icon icon="solar:arrow-right-up-bold" width={16} height={16} />
                    Verify credential
                  </a>
                )}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
