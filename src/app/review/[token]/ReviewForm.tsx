"use client";

import { useState } from "react";

interface ReviewFormProps {
  token: string;
  clientName: string;
  company: string;
  role: string;
}

export default function ReviewForm({ token, clientName, company, role }: ReviewFormProps) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "complete" | "error">("idle");
  const [message, setMessage] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (content.trim().length < 10 || rating === 0) {
      setStatus("error");
      setMessage("Please write a little about your experience and select a star rating.");
      return;
    }
    setStatus("sending");
    const response = await fetch("/api/reviews/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, content, rating }),
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(result.error || "The review could not be submitted.");
      return;
    }
    setGoogleReviewUrl(result.googleReviewUrl || "");
    setStatus("complete");
  };

  if (status === "complete") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl dark:border-emerald-900 dark:bg-gray-900">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
        <h1 className="text-3xl font-bold">Thank you, {clientName}!</h1>
        <p className="mx-auto mt-3 max-w-lg text-gray-600 dark:text-gray-300">Your review is now part of the JLang Development testimonial score.</p>
        {googleReviewUrl && (
          <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            Also share your review on Google
          </a>
        )}
        {googleReviewUrl && <p className="mt-3 text-xs text-gray-500">Google requires you to submit this separately on its review page.</p>}
      </div>
    );
  }

  const visibleRating = hoveredRating || rating;
  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/40 bg-white/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-gray-700 dark:bg-gray-900/90">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Client review</p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Share your experience</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-300">Your details are already filled in. Just write your review and choose a rating.</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[['Name', clientName], ['Company', company], ['Role', role]].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>
            <div className="mt-1 font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <label htmlFor="review" className="mt-7 block text-sm font-semibold">Your review</label>
      <textarea id="review" value={content} onChange={(event) => setContent(event.target.value)} rows={7} maxLength={3000} required placeholder="Tell others what it was like working with Jordan…" className="mt-2 w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-950" />

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">Your rating</legend>
        <div className="mt-2 flex gap-2" onMouseLeave={() => setHoveredRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onMouseEnter={() => setHoveredRating(star)} onFocus={() => setHoveredRating(star)} onBlur={() => setHoveredRating(0)} onClick={() => setRating(star)} aria-label={`${star} star${star === 1 ? "" : "s"}`} aria-pressed={rating === star} className={`text-5xl leading-none transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${star <= visibleRating ? "text-yellow-400" : "text-gray-300 dark:text-gray-700"}`}>
              ★
            </button>
          ))}
        </div>
      </fieldset>

      {status === "error" && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{message}</p>}
      <button type="submit" disabled={status === "sending"} className="mt-7 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 font-bold text-white shadow-lg disabled:opacity-60">
        {status === "sending" ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
