"use client";

import { forwardRef } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";

export interface Screenshot {
  src: string;
  caption: string;
  video?: string;
}

interface ScreenshotLightboxProps {
  title: string;
  shots: Screenshot[];
  index: number;
  onIndexChange: (index: number) => void;
}

/**
 * Native <dialog> lightbox for a project's screenshots. The dialog gives focus
 * trapping, Esc-to-close and the backdrop for free; arrow keys and the
 * prev/next buttons step through the set. Open it with `ref.current.showModal()`.
 */
export const ScreenshotLightbox = forwardRef<HTMLDialogElement, ScreenshotLightboxProps>(function ScreenshotLightbox(
  { title, shots, index, onIndexChange },
  ref,
) {
  if (!shots.length) return null;

  const step = (delta: number) => onIndexChange((index + delta + shots.length) % shots.length);
  const close = (dialog: HTMLDialogElement | null) => dialog?.close();
  const shot = shots[Math.min(index, shots.length - 1)];

  return (
    <dialog
      ref={ref}
      aria-label={`${title} screenshots`}
      onClick={(e) => e.target === e.currentTarget && close(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      className="m-auto w-[min(1200px,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] rounded-2xl bg-gray-950 p-0 text-white backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="truncate text-sm font-semibold">
          {title}
          <span className="ml-2 font-normal text-gray-400">
            {index + 1} / {shots.length}
          </span>
        </p>
        <button
          type="button"
          onClick={(e) => close(e.currentTarget.closest("dialog"))}
          aria-label="Close screenshots"
          className="rounded-lg p-1.5 text-gray-300 hover:bg-white/10 hover:text-white"
        >
          <Icon icon="solar:close-circle-bold" width={24} height={24} />
        </button>
      </div>
      <div className="relative aspect-[16/10] w-full bg-black">
        {shot.video ? (
          <video
            key={shot.video}
            src={shot.video}
            poster={shot.src}
            controls
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <Image key={shot.src} src={shot.src} alt={shot.caption} fill className="object-contain" sizes="(max-width: 1200px) 100vw, 1200px" />
        )}
        {shots.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous screenshot"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm hover:bg-black/80"
            >
              <Icon icon="solar:alt-arrow-left-linear" width={24} height={24} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next screenshot"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm hover:bg-black/80"
            >
              <Icon icon="solar:alt-arrow-right-linear" width={24} height={24} />
            </button>
          </>
        )}
      </div>
      <p className="px-4 py-3 text-center text-sm text-gray-300">{shot.caption}</p>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4">
        {shots.map((s, i) => (
          <button
            key={s.video ?? s.src}
            type="button"
            onClick={() => onIndexChange(i)}
            aria-label={`Show screenshot ${i + 1}: ${s.caption}`}
            aria-current={i === index}
            className={`relative h-14 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition ${
              i === index ? "border-indigo-400" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={s.src} alt="" fill className="object-cover object-top" sizes="96px" />
          </button>
        ))}
      </div>
    </dialog>
  );
});
