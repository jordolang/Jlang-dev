"use client";

import { useState } from "react";
import Link from "next/link";
import { useSpamGuard } from "@/components/forms/SpamGuard";

export default function DownloadRecoveryForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const spamGuard = useSpamGuard();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/downloads/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...spamGuard.fields() }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Something went wrong. Please try again later.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again later.");
    } finally {
      spamGuard.reset();
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
        <p className="font-semibold">Check your inbox.</p>
        <p className="mt-1 text-sm">
          If <span className="font-medium">{email}</span> has purchases, the links are on their way. Nothing after a few minutes?{" "}
          <Link href="/#contact" className="underline">Contact me</Link> and I&apos;ll sort it out.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="recovery-email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email address
        </label>
        <input
          id="recovery-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "recovery-error" : undefined}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          placeholder="you@example.com"
        />
      </div>
      {spamGuard.element}
      {status === "error" && (
        <p id="recovery-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Email my download links"}
      </button>
    </form>
  );
}
