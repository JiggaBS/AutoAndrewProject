import { forwardRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const VehicleCardSkeleton = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="bg-card rounded-xl overflow-hidden border border-border animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-muted">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent animate-shimmer" 
          style={{ backgroundSize: '200% 100%' }} 
        />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-18" />
        </div>
      </div>
    </div>
  );
});

VehicleCardSkeleton.displayName = "VehicleCardSkeleton";

export const VehicleGridSkeleton = forwardRef<HTMLElement, { count?: number }>(({ count = 8 }, ref) => {
  return (
    <section ref={ref} className="py-8">
      <div className="container">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: count }).map((_, index) => (
            <VehicleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

VehicleGridSkeleton.displayName = "VehicleGridSkeleton";
