import { forwardRef } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";

/**
 * Component to track page views
 * Should be placed inside BrowserRouter
 */
export const PageTracker = forwardRef<HTMLDivElement>((props, ref) => {
  usePageTracking();
  return null;
});

PageTracker.displayName = "PageTracker";

