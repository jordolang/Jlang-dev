"use client";

// Client re-export of the Iconify Icon so it can be rendered as an island from
// server components (the underlying @iconify/react component uses hooks). Icons
// still resolve from the offline bundle registered in registerIcons.
export { Icon } from "@iconify/react";
