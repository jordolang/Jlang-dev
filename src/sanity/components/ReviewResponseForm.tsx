"use client";

import { useState } from "react";
import { Card, Stack, Text, Box, Flex, Button, Heading, TextArea, Label, Radio } from "@sanity/ui";

interface ReviewResponseFormProps {
  requestId: string;
  clientName: string;
  onSuccess?: () => void;
}

export function ReviewResponseForm({ requestId, clientName, onSuccess }: ReviewResponseFormProps) {
  const [message, setMessage] = useState("");
  const [action, setAction] = useState<"publish" | "request_revision">("publish");
  const [status, setStatus] = useState<"idle" | "sending" | "complete" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (message.trim().length < 5) {
      setStatus("error");
      setErrorMessage("Please write a message (at least 5 characters).");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/reviews/${requestId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), action }),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(result.error || "Failed to send response.");
        return;
      }

      setStatus("complete");
      setMessage("");

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Network error occurred.");
    }
  };

  if (status === "complete") {
    return (
      <Card padding={4} tone="positive" border>
        <Stack space={3}>
          <Box>
            <Text size={2} weight="semibold">
              ✓ Response sent successfully!
            </Text>
          </Box>
          <Text size={1} muted>
            {action === "publish"
              ? `The review has been published and ${clientName} has been notified.`
              : `${clientName} has been notified about your revision request.`}
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card padding={4} border>
      <form onSubmit={handleSubmit}>
        <Stack space={4}>
          <Box>
            <Heading size={2}>Respond to {clientName}&rsquo;s Review</Heading>
            <Text size={1} muted style={{ marginTop: "8px" }}>
              Send a thank-you message or request revisions before publishing
            </Text>
          </Box>

          <Stack space={3}>
            <Box>
              <Label size={1} weight="semibold">
                Your message
              </Label>
              <Text size={1} muted style={{ marginTop: "4px" }}>
                This will be sent to the client via email
              </Text>
            </Box>
            <TextArea
              value={message}
              onChange={(event) => setMessage(event.currentTarget.value)}
              rows={5}
              placeholder="Thank you for your thoughtful review! I really appreciate..."
              disabled={status === "sending"}
            />
          </Stack>

          <Stack space={3}>
            <Box>
              <Label size={1} weight="semibold">
                Action
              </Label>
              <Text size={1} muted style={{ marginTop: "4px" }}>
                Choose what to do with this review
              </Text>
            </Box>
            <Stack space={2}>
              <Flex align="center" gap={2}>
                <Radio
                  id="action-publish"
                  name="action"
                  checked={action === "publish"}
                  onChange={() => setAction("publish")}
                  disabled={status === "sending"}
                />
                <Label htmlFor="action-publish" size={1}>
                  <Text size={1}>
                    <strong>Publish</strong> — Approve and publish the testimonial
                  </Text>
                </Label>
              </Flex>
              <Flex align="center" gap={2}>
                <Radio
                  id="action-request-revision"
                  name="action"
                  checked={action === "request_revision"}
                  onChange={() => setAction("request_revision")}
                  disabled={status === "sending"}
                />
                <Label htmlFor="action-request-revision" size={1}>
                  <Text size={1}>
                    <strong>Request revision</strong> — Ask for changes before publishing
                  </Text>
                </Label>
              </Flex>
            </Stack>
          </Stack>

          {status === "error" && (
            <Card tone="critical" padding={3}>
              <Text size={1}>{errorMessage}</Text>
            </Card>
          )}

          <Box>
            <Button
              type="submit"
              text={status === "sending" ? "Sending..." : "Send response"}
              tone="primary"
              disabled={status === "sending"}
              style={{ width: "100%" }}
            />
          </Box>
        </Stack>
      </form>
    </Card>
  );
}
