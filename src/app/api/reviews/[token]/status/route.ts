import { NextResponse } from "next/server";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

interface RouteParams {
  params: Promise<{ token: string }>;
}

interface ReviewRequestStatus {
  _id: string;
  clientName: string;
  company: string;
  role: string;
  status: string;
  sentAt?: string;
  viewedAt?: string;
  submittedAt?: string;
  publishedAt?: string;
  completedAt?: string;
  interactions?: Array<{
    _key: string;
    type: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Review service is not configured." }, { status: 503 });
  }

  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: "Token is required." }, { status: 400 });
  }

  const query: string = `*[_type == "reviewRequest" && token == $token][0]{_id, clientName, company, role, status, sentAt, viewedAt, submittedAt, publishedAt, completedAt, interactions}`;
  const queryParams: Record<string, unknown> = { token };
  const reviewRequest = await sanityClient.fetch<ReviewRequestStatus | null>(query, queryParams);

  if (!reviewRequest) {
    return NextResponse.json({ error: "Review request not found." }, { status: 404 });
  }

  return NextResponse.json({
    status: reviewRequest.status,
    timestamps: {
      sentAt: reviewRequest.sentAt,
      viewedAt: reviewRequest.viewedAt,
      submittedAt: reviewRequest.submittedAt,
      publishedAt: reviewRequest.publishedAt,
      completedAt: reviewRequest.completedAt,
    },
    interactions: reviewRequest.interactions || [],
    clientName: reviewRequest.clientName,
    company: reviewRequest.company,
    role: reviewRequest.role,
  });
}
