"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyOnScrollProps {
  children: ReactNode;
  /** Anchor id, rendered on the always-present wrapper so nav links resolve before mount. */
  id?: string;
  /** Reserved space before mount so scroll position / layout stays stable. */
  minHeight?: number;
  /** How far ahead of the viewport to begin mounting. */
  rootMargin?: string;
}

// Mounts its children once they scroll near the viewport (or immediately when a
// nav action requests it). Paired with a dynamic(ssr:false) import, this keeps a
// section's JavaScript out of the initial load while still letting navigation jump
// to — and pre-load — any section instantly. The anchor `id` lives on the wrapper,
// which is always in the DOM, so `#section` links resolve even before the section
// has mounted.
export function LazyOnScroll({
  children,
  id,
  minHeight = 400,
  rootMargin = "800px",
}: LazyOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    // Mount immediately when the page is opened directly at this section's hash,
    // or when navigation asks every section to mount (so layout is final before a jump).
    if (id && window.location.hash === `#${id}`) {
      setVisible(true);
      return;
    }

    const forceMount = () => setVisible(true);
    window.addEventListener("lazymount-all", forceMount);

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setVisible(true);
            observer?.disconnect();
          }
        },
        { rootMargin },
      );
      observer.observe(el);
    }

    return () => {
      window.removeEventListener("lazymount-all", forceMount);
      observer?.disconnect();
    };
  }, [rootMargin, visible, id]);

  return (
    <div
      ref={ref}
      id={id}
      className={id ? "scroll-mt-24" : undefined}
      style={visible ? undefined : { minHeight }}
    >
      {visible ? children : null}
    </div>
  );
}
