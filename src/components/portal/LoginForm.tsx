"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "complete" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("sending");
    const response = await fetch("/api/portal/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(result.error || "Could not send magic link.");
      return;
    }
    setStatus("complete");
  };

  if (status === "complete") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl dark:border-emerald-900 dark:bg-gray-900">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
        <h1 className="text-3xl font-bold">Check your email!</h1>
        <p className="mx-auto mt-3 max-w-lg text-gray-600 dark:text-gray-300">
          We've sent a magic link to <strong>{email}</strong>. Click the link in the email to access your client portal.
        </p>
        <p className="mt-5 text-sm text-gray-500">The link will expire in 15 minutes.</p>
      </div>
    );
  }

  const hasError = status === "error";
  const describedBy = hasError ? "form-description error-message" : "form-description";

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/40 bg-white/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-gray-700 dark:bg-gray-900/90"> {/* email magic link form */}
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Client portal</p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Sign in to your portal</h1>
      <p id="form-description" className="mt-3 text-gray-600 dark:text-gray-300">
        Enter your email address and we'll send you a secure magic link to access your client portal.
      </p>

      <label htmlFor="email" className="mt-7 block text-sm font-semibold">Email address</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        placeholder="you@example.com"
        aria-describedby={describedBy}
        aria-invalid={hasError}
        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-950"
      />

      {hasError && (
        <p id="error-message" role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-7 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 font-bold text-white shadow-lg disabled:opacity-60"
      >
        {status === "sending" ? "Sending magic link…" : "Send magic link"}
      </button>
    </form>
  );
}
