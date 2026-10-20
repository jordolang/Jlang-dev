"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

const CLI_COMMAND = "curl -sL https://jlang.dev/resume | bash";

/** Download (via the browser's print-to-PDF) and the terminal version of the résumé. */
export function ResumeActions() {
  const [copied, setCopied] = useState(false);

  const download = () => {
    trackEvent(AnalyticsEvents.NAVIGATION_CLICKED, { item: "Resume PDF" });
    window.print();
  };

  const copyCli = async () => {
    try {
      await navigator.clipboard.writeText(CLI_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the command is still visible in the button's title.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={copyCli}
        title={CLI_COMMAND}
        className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-white/15 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-gold-400 hover:text-gold-700 dark:hover:text-gold-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
      >
        <Icon icon={copied ? "solar:check-circle-bold" : "solar:code-square-bold"} width={18} height={18} />
        {copied ? "Command copied" : "Terminal version"}
      </button>
      <button
        type="button"
        onClick={download}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-700 px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
      >
        <Icon icon="solar:download-minimalistic-bold" width={18} height={18} />
        Download PDF
      </button>
    </div>
  );
}
