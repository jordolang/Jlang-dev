import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/portal/LoginForm";

export const metadata: Metadata = { title: "Client Portal Login | JLang Development", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function PortalLoginPage() {
  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 px-5 py-16 text-gray-900 dark:from-gray-950 dark:via-slate-950 dark:to-indigo-950 dark:text-white">
      <div className="w-full max-w-3xl">
        <Link href="/" className="mb-7 inline-flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400">← JLang Development</Link>
        <LoginForm />
      </div>
    </main>
  );
}
