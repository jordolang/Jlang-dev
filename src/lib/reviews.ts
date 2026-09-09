import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

export interface SiteTestimonial {
  _id?: string;
  content: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  featured?: boolean;
}

export interface ReviewRequest {
  _id: string;
  clientName: string;
  company: string;
  role: string;
  status: string;
}

export async function getApprovedTestimonials(): Promise<SiteTestimonial[]> {
  if (!sanityIsConfigured) return [];
  return sanityClient.fetch(
    `*[_type == "testimonial" && approved == true] | order(featured desc, submittedAt desc) {
      _id, content, author, role, company, rating, featured
    }`,
    {},
    { next: { revalidate: 60, tags: ["testimonials"] } },
  );
}

export async function getReviewRequest(token: string) {
  if (!sanityIsConfigured || !token) return null;
  const query: string = `*[_type == "reviewRequest" && token == $token][0]{_id, clientName, company, role, status}`;
  const params: Record<string, unknown> = { token };
  return sanityClient.fetch<ReviewRequest | null>(query, params);
}
