"use client";

import posthog from "posthog-js";
import { logger } from "./logger";

export enum AnalyticsEvents {
  NAVIGATION_CLICKED = "navigation_clicked",
  SECTION_VIEWED = "section_viewed",
  PROJECT_CLICKED = "project_clicked",
  PROJECT_VIEWED = "project_viewed",
  PROJECT_LINK_CLICKED = "project_link_clicked",
  CONTACT_FORM_OPENED = "contact_form_opened",
  CONTACT_FORM_SUBMITTED = "contact_form_submitted",
  SOCIAL_LINK_CLICKED = "social_link_clicked",
  SECTION_TIME_SPENT = "section_time_spent",
  SCROLL_DEPTH = "scroll_depth",
  PRICING_CTA_CLICKED = "pricing_cta_clicked",
  FAQ_TOGGLED = "faq_toggled",
  PACKAGE_SELECTED = "package_selected",
  SERVICE_ORDER_SUBMITTED = "service_order_submitted",
  FEATURE_CLICKED = "feature_clicked",
  FEATURE_ADDED = "feature_added",
  FEATURE_REMOVED = "feature_removed",
  FEATURE_TOGGLED = "feature_toggled",
}

// Generate a unique visitor ID for anonymous users
export const generateVisitorId = (): string => {
  if (typeof window === "undefined") return "";
  
  let visitorId = localStorage.getItem("portfolio_visitor_id");
  
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("portfolio_visitor_id", visitorId);
  }
  
  return visitorId;
};

// Initialize visitor tracking on page load
export const initializeVisitorTracking = () => {
  if (typeof window === "undefined") return;
  
  const visitorId = generateVisitorId();
  
  // Set anonymous ID for PostHog
  if (posthog && !posthog.get_distinct_id()) {
    posthog.identify(visitorId);
  }
};

// Identify user when they provide contact information
export const identifyUser = (email: string, name: string, additionalProperties?: Record<string, string | number | boolean>) => {
  if (!posthog) {
    logger.warn("PostHog not initialized");
    return;
  }

  const properties = {
    email,
    name,
    first_contact_date: new Date().toISOString(),
    visitor_id: generateVisitorId(),
    ...additionalProperties,
  };

  // Use email as the distinct ID for identified users
  posthog.identify(email, properties);
  
  // Also capture a contact form submission event
  posthog.capture("contact_form_submitted", {
    email,
    name,
    submission_date: new Date().toISOString(),
  });
};

// Track custom events
export const trackEvent = (eventName: string, properties?: Record<string, string | number | boolean>) => {
  if (!posthog) {
    logger.warn("PostHog not initialized");
    return;
  }

  posthog.capture(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
};

// Reset identification (useful for testing or logout scenarios)
export const resetIdentification = () => {
  if (!posthog) {
    logger.warn("PostHog not initialized");
    return;
  }

  posthog.reset();
  localStorage.removeItem("portfolio_visitor_id");
  initializeVisitorTracking();
};

// Get current user properties
export const getCurrentUserProperties = () => {
  if (!posthog) return null;
  
  return {
    distinct_id: posthog.get_distinct_id(),
    visitor_id: generateVisitorId(),
    session_id: posthog.get_session_id(),
  };
};
