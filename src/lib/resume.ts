import "server-only";

import { getExperience, getSiteSettings, isDraftMode } from "./cms";
import { getAllProjects } from "./projects";
import { getSanityClient, sanityIsConfigured } from "@/sanity/lib/client";
import { urlForImage, type SanityImageRef } from "@/sanity/lib/image";
import { experience as fallbackExperience } from "@/components/portfolio/ExperienceSection";
import {
  DEFAULT_RESUME,
  pick,
  pickRecentProjects,
  sameCompany,
  type ResumeContent,
  type ResumeCredential,
  type ResumeProject,
  type ResumeRole,
} from "./resumeContent";

interface RawResume {
  headline?: string;
  summary?: string;
  location?: string;
  email?: string;
  phone?: string;
  photo?: SanityImageRef | null;
  stats?: { value: string; label: string }[];
  currentRole?: Partial<ResumeRole> | null;
  credentials?: Array<
    Omit<ResumeCredential, "image" | "file"> & { image?: SanityImageRef | null; file?: string | null }
  >;
  skillGroups?: { title: string; skills?: string[] }[];
  education?: { school: string; program?: string; period?: string }[];
  recentProjects?: string[];
}

async function getRawResume(): Promise<RawResume | null> {
  if (!sanityIsConfigured) return null;
  const draft = await isDraftMode();
  try {
    return await getSanityClient(draft).fetch<RawResume | null>(
      `*[_type == "resume"][0] {
        headline, summary, location, email, phone, stats[]{ value, label },
        photo { asset->{ _id, url } },
        currentRole { role, company, period, website, description, highlights },
        credentials[]{ title, issuer, issued, expires, credentialId, url, image { asset->{ _id, url } }, "file": file.asset->url },
        skillGroups[]{ title, skills },
        education[]{ school, program, period },
        "recentProjects": recentProjects[]->slug.current
      }`,
      {},
      draft ? { cache: "no-store" } : { next: { revalidate: 60, tags: ["resume"] } },
    );
  } catch (error) {
    console.error("[resume] query failed:", error);
    return null;
  }
}

/** Everything the /resume page shows, with Studio content layered over the bundled defaults. */
export async function getResume(): Promise<ResumeContent> {
  const [raw, settings, cmsExperience, allProjects] = await Promise.all([
    getRawResume(),
    getSiteSettings(),
    getExperience(),
    getAllProjects(),
  ]);

  const role = raw?.currentRole ?? {};
  const currentRole: ResumeRole = {
    ...DEFAULT_RESUME.currentRole,
    role: pick(role.role, DEFAULT_RESUME.currentRole.role),
    company: pick(role.company, DEFAULT_RESUME.currentRole.company),
    period: pick(role.period, DEFAULT_RESUME.currentRole.period),
    website: pick(role.website, DEFAULT_RESUME.currentRole.website),
    description: pick(role.description, DEFAULT_RESUME.currentRole.description),
    highlights: pick(role.highlights, DEFAULT_RESUME.currentRole.highlights),
  };

  // The current role leads the page, so don't list the same company again under prior roles.
  const experience: ResumeRole[] = (cmsExperience ?? fallbackExperience)
    .filter((item) => !sameCompany(item.company, currentRole.company))
    .map((item) => ({
      role: item.role,
      company: item.company,
      period: item.period,
      type: item.type,
      description: item.description,
      highlights: item.achievements ?? [],
      technologies: item.technologies ?? [],
    }));

  const bySlug = new Map(allProjects.map((project) => [project.slug, project]));
  const chosen = (raw?.recentProjects ?? []).flatMap((slug) => {
    const project = slug ? bySlug.get(slug) : undefined;
    return project ? [project] : [];
  });
  const projects: ResumeProject[] = (chosen.length ? chosen : pickRecentProjects(allProjects)).map((project) => ({
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle,
    category: project.category,
    status: project.status,
    timeline: project.timeline,
    image: project.image,
    gradient: project.gradient,
    tech: project.tech,
    live: project.live,
  }));

  const credentials: ResumeCredential[] = (raw?.credentials ?? [])
    .filter((credential) => credential?.title && credential?.issuer)
    .map((credential) => ({
      title: credential.title,
      issuer: credential.issuer,
      issued: credential.issued,
      expires: credential.expires,
      credentialId: credential.credentialId,
      url: credential.url,
      image: urlForImage(credential.image) ?? undefined,
      file: credential.file ?? undefined,
    }));

  return {
    ...DEFAULT_RESUME,
    name: pick(settings?.name, DEFAULT_RESUME.name),
    headline: pick(raw?.headline, DEFAULT_RESUME.headline),
    summary: pick(raw?.summary, DEFAULT_RESUME.summary),
    location: pick(raw?.location, pick(settings?.location, DEFAULT_RESUME.location)),
    email: pick(raw?.email, pick(settings?.publicEmail, DEFAULT_RESUME.email)),
    phone: raw?.phone || undefined,
    photo: urlForImage(raw?.photo) ?? DEFAULT_RESUME.photo,
    stats: pick(raw?.stats, DEFAULT_RESUME.stats),
    currentRole,
    experience,
    credentials,
    skillGroups: pick(
      raw?.skillGroups?.filter((group) => group.title && group.skills?.length).map((group) => ({ title: group.title, skills: group.skills ?? [] })),
      DEFAULT_RESUME.skillGroups,
    ),
    education: raw?.education ?? [],
    projects,
  };
}
