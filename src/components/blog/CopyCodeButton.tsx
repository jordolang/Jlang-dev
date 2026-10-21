"use client";

import { Icon } from '@/components/Icon';

export default function CopyCodeButton({ code }: { code: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(code)}
      className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
    >
      <Icon icon="solar:copy-outline" width={14} height={14} />
      Copy
    </button>
  );
}
