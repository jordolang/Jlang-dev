import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

/**
 * Portal utility functions: getClientProjects, getProjectMessages, getProjectDeliverables
 */

export interface ClientProject {
  _id: string;
  clientId: string;
  projectId: string;
  projectTitle: string;
  projectSlug: string;
  status: string;
  startDate?: string;
  endDate?: string;
}

export interface ProjectMessage {
  _id: string;
  sender: string;
  recipient: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface ProjectDeliverable {
  _id: string;
  title: string;
  description?: string;
  fileType?: string;
  version?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  isVisible: boolean;
  uploadedAt?: string;
  downloadCount: number;
  lastDownloadedAt?: string;
}

export async function getClientProjects(clientId: string): Promise<ClientProject[]> {
  if (!sanityIsConfigured || !clientId) return [];
  const query = `*[_type == "clientProject" && client._ref == $clientId] | order(startDate desc) {
    _id,
    "clientId": client._ref,
    "projectId": project._ref,
    "projectTitle": project->title,
    "projectSlug": project->slug.current,
    status,
    startDate,
    endDate
  }`;
  const params: Record<string, unknown> = { clientId };
  try {
    return await sanityClient.fetch<ClientProject[]>(query, params, {
      next: { revalidate: 60, tags: ["clientProjects"] },
    });
  } catch (error) {
    return [];
  }
}

export async function getProjectMessages(clientProjectId: string): Promise<ProjectMessage[]> {
  if (!sanityIsConfigured || !clientProjectId) return [];
  const query = `*[_type == "portalMessage" && clientProject._ref == $clientProjectId] | order(coalesce(createdAt, _createdAt) asc) {
    _id,
    sender,
    recipient,
    message,
    isRead,
    "createdAt": coalesce(createdAt, _createdAt),
    readAt
  }`;
  const params: Record<string, unknown> = { clientProjectId };
  try {
    return await sanityClient.fetch<ProjectMessage[]>(query, params, {
      next: { revalidate: 30, tags: ["portalMessages"] },
    });
  } catch (error) {
    return [];
  }
}

export async function getProjectDeliverables(clientProjectId: string): Promise<ProjectDeliverable[]> {
  if (!sanityIsConfigured || !clientProjectId) return [];
  const query = `*[_type == "portalDeliverable" && clientProject._ref == $clientProjectId && isVisible == true] | order(uploadedAt desc) {
    _id,
    title,
    description,
    fileType,
    version,
    "fileUrl": file.asset->url,
    "fileName": file.asset->originalFilename,
    "fileSize": file.asset->size,
    isVisible,
    uploadedAt,
    downloadCount,
    lastDownloadedAt
  }`;
  const params: Record<string, unknown> = { clientProjectId };
  try {
    return await sanityClient.fetch<ProjectDeliverable[]>(query, params, {
      next: { revalidate: 60, tags: ["portalDeliverables"] },
    });
  } catch (error) {
    return [];
  }
}

export async function getClientProject(clientProjectId: string): Promise<ClientProject | null> {
  if (!sanityIsConfigured || !clientProjectId) return null;
  const query = `*[_type == "clientProject" && _id == $clientProjectId][0] {
    _id,
    "clientId": client._ref,
    "projectId": project._ref,
    "projectTitle": project->title,
    "projectSlug": project->slug.current,
    status,
    startDate,
    endDate
  }`;
  const params: Record<string, unknown> = { clientProjectId };
  try {
    return await sanityClient.fetch<ClientProject | null>(query, params, {
      next: { revalidate: 60, tags: ["clientProjects"] },
    });
  } catch (error) {
    return null;
  }
}
