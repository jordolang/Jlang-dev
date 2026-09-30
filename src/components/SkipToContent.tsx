"use client";

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-blue-600 focus:text-white focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:bg-blue-500 dark:focus:ring-offset-gray-900 transition-all duration-200"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}
