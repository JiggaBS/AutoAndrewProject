import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * VisuallyHidden component for screen reader accessibility
 * Hides content visually but keeps it accessible to screen readers
 */
const VisuallyHidden = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("sr-only", className)}
    {...props}
  />
));
VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden };
