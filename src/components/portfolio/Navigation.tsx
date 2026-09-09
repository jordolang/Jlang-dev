"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

/** Mount every lazy section, then scroll once async sections have settled. */
function scrollToSection(id: string) {
  window.dispatchEvent(new CustomEvent("lazymount-all"));

  let lastPageHeight = 0;
  let stableFrames = 0;
  let attempts = 0;

  const scrollWhenStable = () => {
    const target = document.getElementById(id);
    const pageHeight = document.documentElement.scrollHeight;
    stableFrames = pageHeight === lastPageHeight ? stableFrames + 1 : 0;
    lastPageHeight = pageHeight;
    attempts += 1;

    const targetIsMounted = Boolean(target?.firstElementChild);
    if ((targetIsMounted && stableFrames >= 3) || attempts >= 180) {
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    requestAnimationFrame(scrollWhenStable);
  };

  requestAnimationFrame(scrollWhenStable);
}

export interface NavItem {
  label: string;
  href: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Overview", href: "/#overview" },
  { label: "Blog", href: "/#blog" },
  { label: "Stack", href: "/#stack" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Services", href: "/services" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
];

interface NavigationProps {
  /** Nav items from Sanity. Falls back to the list above when the CMS has none. */
  items?: NavItem[];
}

export default function Navigation({ items }: NavigationProps) {
  const { theme, toggleTheme } = useTheme();
  const navItems = items?.length ? items : defaultNavItems;

  // Honor a hash on initial load (e.g. arriving at /#projects from another page).
  useEffect(() => {
    if (window.location.pathname !== "/" || !window.location.hash) return;
    const id = window.location.hash.slice(1);
    scrollToSection(id);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    trackEvent(AnalyticsEvents.NAVIGATION_CLICKED, { item: item.label });
    if (!item.href.startsWith("/#")) return; // real route → let the link navigate
    // On the home page, take over so the jump is instant and reliable even before
    // the target section has lazily mounted.
    if (window.location.pathname === "/") {
      e.preventDefault();
      const id = item.href.slice(2);
      history.replaceState(null, "", `/#${id}`);
      scrollToSection(id);
    }
  };

  return (
    <nav className="fixed top-0 md:top-4 w-full z-50 ">
      <div className="md:max-w-fit md:border-2 md:rounded-full mx-auto px-7 py-2 bg-zinc-200/50 dark:bg-slate-900/50 backdrop-blur-3xl">
        <div className="flex justify-between items-center gap-10">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Image src="/favicon.png" alt="JL Logo" width={32} height={32} className="h-8 w-8" />
          </m.div>
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <m.a
                  key={item.label}
                  href={item.href}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, item)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-300 text-sm font-medium"
                >
                  {item.label}
                </m.a>
              ))}
            </div>
            {/* Theme Toggle */}
            <m.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Icon icon="solar:sun-bold" className="text-yellow-500" width={20} height={20} />
              ) : (
                <Icon icon="solar:moon-bold" className="text-blue-500" width={20} height={20} />
              )}
            </m.button>
          </div>
        </div>
      </div>
    </nav>
  );
}
