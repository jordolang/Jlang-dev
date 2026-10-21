"use client";

import { Icon as IconifyIcon, type IconProps } from "@iconify/react";
import "@/lib/registerIcons";

// Client wrapper around the Iconify Icon so it can be rendered as an island from
// server components (the underlying @iconify/react component uses hooks). Icons
// resolve from the offline bundle registered in registerIcons.
//
// `ssr` makes the icon render as inline SVG in the server HTML. Without it
// @iconify/react (v5+) renders an empty <span> until hydration, so every icon
// popped in late and shifted the text next to it (layout shift, late paints).
export function Icon(props: IconProps) {
  return <IconifyIcon ssr {...props} />;
}
