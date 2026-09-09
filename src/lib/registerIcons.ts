// Side-effect module: registers the bundled icons with @iconify/react's store
// at import time. Once registered, <Icon icon="prefix:name" /> renders inline
// (including during SSR) with no network request to the Iconify API. Any icon
// not present in the bundle falls back to @iconify/react's default runtime
// fetch, so nothing breaks if an icon was missed.
//
// Icons are registered in two tiers to keep the critical path light:
//   - criticalIcons: used by eagerly server-rendered components. Registered
//     synchronously so their inline SSR SVG hydrates without a mismatch.
//   - deferredIcons: used only inside `ssr:false` lazy sections (never in the
//     SSR HTML). Registered on browser idle so their JSON does not execute
//     during hydration, cutting Total Blocking Time.
import { addIcon, type IconifyIcon } from "@iconify/react";
import { criticalIcons, deferredIcons } from "./generatedIcons";

function register(icons: Record<string, IconifyIcon>) {
  for (const [name, data] of Object.entries(icons)) {
    addIcon(name, data);
  }
}

register(criticalIcons);

if (typeof window === "undefined") {
  // On the server, register everything up front so SSR can inline any icon.
  register(deferredIcons);
} else {
  // On the client, defer the lazy-section icons until the browser is idle.
  const run = () => register(deferredIcons);
  const ric = (
    window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }
  ).requestIdleCallback;
  if (typeof ric === "function") {
    ric(run, { timeout: 2000 });
  } else {
    setTimeout(run, 1);
  }
}
