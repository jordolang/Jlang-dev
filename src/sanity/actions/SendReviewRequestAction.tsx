"use client";

import { useState } from "react";
import { useClient, type DocumentActionComponent } from "sanity";

export const SendReviewRequestAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2026-01-01" });
  const [working, setWorking] = useState(false);
  const draft = props.draft as Record<string, unknown> | null;
  const published = props.published as Record<string, unknown> | null;
  const document = draft || published;
  const complete = ["clientName", "company", "role", "email"].every((field) => Boolean(document?.[field]));

  return {
    label: working ? "Queueing…" : "Send review request",
    disabled: working || !complete,
    tone: "positive",
    onHandle: async () => {
      setWorking(true);
      const token = typeof document?.token === "string" ? document.token : crypto.randomUUID();
      await client
        .patch(props.id)
        .set({ token, status: "queued" })
        .commit({ autoGenerateArrayKeys: true });
      setWorking(false);
      props.onComplete();
    },
  };
};
