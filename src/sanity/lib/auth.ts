import { apiVersion, projectId } from "@/sanity/env";

/**
 * Studio-called API routes run in the browser, so they are publicly reachable and would otherwise be
 * open to anyone who finds them. The Studio sends the signed-in user's own Sanity token;
 * we hand it straight back to Sanity on a project-scoped host, which 401s unless the token belongs
 * to a real member of *this* project. No shared secret to leak into the client bundle.
 */
export async function authenticatedSanityUser(request: Request): Promise<string | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  const response = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const user = (await response.json()) as { id?: string };
  return user?.id ?? null;
}
