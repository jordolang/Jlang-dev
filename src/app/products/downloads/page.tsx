import type { Metadata } from "next";
import DownloadRecoveryForm from "./DownloadRecoveryForm";

export const metadata: Metadata = {
  title: "Get Your Downloads | JLang Development",
  description: "Lost your download link? Enter the email you bought with and we'll send fresh links.",
  robots: { index: false, follow: true },
};

export default function DownloadsPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 px-5 py-16 text-gray-900 dark:from-gray-950 dark:via-slate-950 dark:to-indigo-950 dark:text-white"
    >
      <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
        <h1 className="mb-3 text-3xl font-bold">Get your downloads</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Enter the email address you used at checkout. If it matches a purchase, we&apos;ll email you fresh download links for everything you bought.
        </p>
        <DownloadRecoveryForm />
      </div>
    </main>
  );
}
