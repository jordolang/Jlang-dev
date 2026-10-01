"use client";

import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { Card, Stack, Heading, Text, Box, Flex, Badge, Spinner } from "@sanity/ui";
import { ReviewResponseForm } from "./ReviewResponseForm";

interface ReviewRequest {
  _id: string;
  clientName: string;
  company: string;
  role: string;
  email: string;
  status: "draft" | "queued" | "sent" | "viewed" | "submitted" | "awaiting_response" | "published" | "completed" | "failed";
  token: string;
  sentAt?: string;
  viewedAt?: string;
  submittedAt?: string;
  publishedAt?: string;
  completedAt?: string;
}

interface GroupedReviews {
  [status: string]: ReviewRequest[];
}

const STATUS_ORDER = ["sent", "viewed", "submitted", "awaiting_response", "published", "queued", "draft", "completed", "failed"];

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  queued: "Queued",
  sent: "Sent",
  viewed: "Viewed",
  submitted: "Submitted",
  awaiting_response: "Awaiting Response",
  published: "Published",
  completed: "Completed",
  failed: "Failed",
};

const STATUS_TONES: Record<string, "default" | "primary" | "positive" | "caution" | "critical"> = {
  draft: "default",
  queued: "default",
  sent: "primary",
  viewed: "primary",
  submitted: "caution",
  awaiting_response: "caution",
  published: "positive",
  completed: "positive",
  failed: "critical",
};

export function ReviewDashboard() {
  const client = useClient({ apiVersion: "2026-01-01" });
  const [reviews, setReviews] = useState<ReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const query = `*[_type == "reviewRequest"] | order(_createdAt desc) {
          _id,
          clientName,
          company,
          role,
          email,
          status,
          token,
          sentAt,
          viewedAt,
          submittedAt,
          publishedAt,
          completedAt
        }`;
        const data = await client.fetch<ReviewRequest[]>(query);
        setReviews(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch review requests");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [client, reloadKey]);

  if (loading) {
    return (
      <Box padding={4}>
        <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
          <Spinner muted />
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={4}>
        <Card tone="critical" padding={4}>
          <Text size={2}>Error loading review requests: {error}</Text>
        </Card>
      </Box>
    );
  }

  // Group reviews by status
  const groupedReviews = reviews.reduce<GroupedReviews>((acc, review) => {
    const status = review.status || "draft";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(review);
    return acc;
  }, {});

  // Sort statuses by priority
  const sortedStatuses = STATUS_ORDER.filter((status) => groupedReviews[status]?.length > 0);

  if (reviews.length === 0) {
    return (
      <Box padding={4}>
        <Card padding={4}>
          <Text size={2} muted>
            No review requests found. Create a new review request to get started.
          </Text>
        </Card>
      </Box>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Box>
          <Heading size={3}>Review Requests Dashboard</Heading>
          <Text size={1} muted style={{ marginTop: "8px" }}>
            Track and manage client review requests across all stages
          </Text>
        </Box>

        {sortedStatuses.map((status) => {
          const statusReviews = groupedReviews[status];
          const label = STATUS_LABELS[status] || status;
          const tone = STATUS_TONES[status] || "default";

          return (
            <Card key={status} padding={4} border>
              <Stack space={3}>
                <Flex align="center" gap={2}>
                  <Badge tone={tone} fontSize={2}>
                    {label}
                  </Badge>
                  <Text size={1} muted>
                    ({statusReviews.length})
                  </Text>
                </Flex>

                <Stack space={3}>
                  {statusReviews.map((review) => {
                    const mostRecentDate =
                      review.publishedAt ||
                      review.submittedAt ||
                      review.viewedAt ||
                      review.sentAt ||
                      review.completedAt;

                    return (
                      <Card key={review._id} padding={3} tone="transparent" border>
                        <Stack space={2}>
                          <Flex justify="space-between" align="flex-start">
                            <Box flex={1}>
                              <Text size={2} weight="semibold">
                                {review.clientName}
                              </Text>
                              <Text size={1} muted>
                                {review.company} · {review.role}
                              </Text>
                            </Box>
                          </Flex>

                          <Flex gap={3} wrap="wrap">
                            {review.sentAt && (
                              <Text size={1} muted>
                                📧 Sent: {formatDate(review.sentAt)}
                              </Text>
                            )}
                            {review.viewedAt && (
                              <Text size={1} muted>
                                👁️ Viewed: {formatDate(review.viewedAt)}
                              </Text>
                            )}
                            {review.submittedAt && (
                              <Text size={1} muted>
                                ✍️ Submitted: {formatDate(review.submittedAt)}
                              </Text>
                            )}
                            {review.publishedAt && (
                              <Text size={1} muted>
                                ✅ Published: {formatDate(review.publishedAt)}
                              </Text>
                            )}
                          </Flex>

                          {!mostRecentDate && (
                            <Text size={1} muted>
                              Draft - not yet sent
                            </Text>
                          )}

                          {review.status === "submitted" && (
                            <ReviewResponseForm
                              requestId={review._id}
                              clientName={review.clientName}
                              onSuccess={() => setReloadKey((key) => key + 1)}
                            />
                          )}
                        </Stack>
                      </Card>
                    );
                  })}
                </Stack>
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
