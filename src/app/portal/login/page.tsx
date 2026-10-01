import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/portal/LoginForm";

export const metadata: Metadata = { title: "Client Portal Login | JLang Development", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; redirect?: string }>;
}) {
  const { token, redirect } = await searchParams;
  // Only same-site portal paths, so the post-login redirect can't be turned into an open redirect
  const next = redirect?.startsWith("/portal/") && !redirect.startsWith("//") ? redirect : "/portal/dashboard";

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 px-5 py-16 text-gray-900 dark:from-gray-950 dark:via-slate-950 dark:to-indigo-950 dark:text-white">
        <div className="w-full max-w-3xl">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 font-semibold text-indigo-600 transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:rounded dark:text-indigo-400 dark:hover:text-indigo-300"
            aria-label="Return to JLang Development homepage"
          >
            ← JLang Development
          </Link>
          <LoginForm token={token} next={next} />
        </div>
      </main>
    </>
  );
}
