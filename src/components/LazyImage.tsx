import { useState, useRef, useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage = forwardRef<HTMLDivElement, LazyImageProps>(({
  src,
  alt,
  className,
  aspectRatio = "aspect-[4/3]",
  fallback,
  onLoad,
  onError,
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const internalRef = useRef<HTMLDivElement>(null);

  // Merge refs
  const setRefs = (node: HTMLDivElement | null) => {
    internalRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before the image enters the viewport
        threshold: 0.01,
      }
    );

    if (internalRef.current) {
      observer.observe(internalRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={setRefs} className={cn("relative overflow-hidden bg-muted", aspectRatio, className)}>
      {/* Skeleton/Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent animate-shimmer"
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          {fallback || (
            <div className="text-center text-muted-foreground">
              <ImageOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <span className="text-xs">Immagine non disponibile</span>
            </div>
          )}
        </div>
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
});

LazyImage.displayName = "LazyImage";
