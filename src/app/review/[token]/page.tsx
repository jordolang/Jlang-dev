import type { Metadata } from "next";
import Link from "next/link";
import { getReviewRequest } from "@/lib/reviews";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = { title: "Client Review | JLang Development", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const request = await getReviewRequest(token);
  const unavailable = !request || request.status === "completed";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 px-5 py-16 text-gray-900 dark:from-gray-950 dark:via-slate-950 dark:to-indigo-950 dark:text-white">
      <div className="w-full max-w-3xl">
        <Link href="/" className="mb-7 inline-flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400">← JLang Development</Link>
        {unavailable ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl dark:bg-gray-900">
            <h1 className="text-3xl font-bold">This review link is unavailable</h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300">It may have already been used, expired, or the review service still needs to be configured.</p>
          </div>
        ) : (
          <ReviewForm token={token} clientName={request.clientName} company={request.company} role={request.role} />
        )}
      </div>
    </main>
  );
}
