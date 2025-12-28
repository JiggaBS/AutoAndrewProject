import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Maximize2, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const resetTransform = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      resetTransform();
    }
  }, [isFullscreen, resetTransform]);

  useEffect(() => {
    setIsImageLoading(true);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          setIsFullscreen(false);
          break;
        case "+":
        case "=":
          setZoom((z) => Math.min(z + 0.5, 4));
          break;
        case "-":
          setZoom((z) => Math.max(z - 0.5, 0.5));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full">
        <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground px-6">
            <ImageOff className="mx-auto mb-2 h-6 w-6" aria-hidden="true" />
            <p className="text-sm font-medium">Nessuna foto disponibile</p>
          </div>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetTransform();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetTransform();
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    resetTransform();
  };

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-lg overflow-hidden bg-muted mb-3 group">
        {isImageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={images[currentIndex]}
          alt={`${title} - Immagine ${currentIndex + 1}`}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            "group-hover:scale-[1.02]",
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsImageLoading(false)}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Image Counter */}
        <div className="absolute top-3 right-3 bg-foreground/80 text-background px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card hover:scale-110 transition-all shadow-lg opacity-0 group-hover:opacity-100"
          aria-label="Immagine precedente"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card hover:scale-110 transition-all shadow-lg opacity-0 group-hover:opacity-100"
          aria-label="Immagine successiva"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-3 right-3 p-2.5 bg-card/80 backdrop-blur-sm rounded-lg hover:bg-card hover:scale-105 transition-all flex items-center gap-2 text-sm font-medium"
          aria-label="Schermo intero"
        >
          <Maximize2 className="w-4 h-4 text-foreground" />
          <span className="hidden sm:inline text-foreground">Fullscreen</span>
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={cn(
              "relative flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all duration-200",
              currentIndex === index
                ? "border-primary ring-2 ring-primary/30 scale-105"
                : "border-transparent hover:border-muted-foreground/50 opacity-70 hover:opacity-100"
            )}
          >
            <img
              src={image}
              alt={`${title} - Miniatura ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {currentIndex === index && (
              <div className="absolute inset-0 bg-primary/10" />
            )}
          </button>
        ))}
      </div>

      {/* Fullscreen Modal with Zoom */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-background/98 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom((z) => Math.max(z - 0.5, 0.5));
              }}
              className="p-2 bg-card/80 backdrop-blur-sm rounded-lg hover:bg-card transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-sm text-foreground font-medium bg-card/80 px-3 py-2 rounded-lg">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom((z) => Math.min(z + 0.5, 4));
              }}
              className="p-2 bg-card/80 backdrop-blur-sm rounded-lg hover:bg-card transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRotation((r) => (r + 90) % 360);
              }}
              className="p-2 bg-card/80 backdrop-blur-sm rounded-lg hover:bg-card transition-colors"
              aria-label="Ruota"
            >
              <RotateCw className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 bg-destructive/80 backdrop-blur-sm rounded-lg hover:bg-destructive transition-colors ml-2"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5 text-destructive-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card hover:scale-110 transition-all"
          >
            <ChevronLeft className="w-8 h-8 text-foreground" />
          </button>

          {/* Image with zoom and rotation */}
          <div
            className="max-w-[90vw] max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`${title} - Immagine ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain transition-transform duration-300"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
              draggable={false}
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card hover:scale-110 transition-all"
          >
            <ChevronRight className="w-8 h-8 text-foreground" />
          </button>

          {/* Bottom thumbnails in fullscreen */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/80 backdrop-blur-sm p-2 rounded-xl">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(index);
                }}
                className={cn(
                  "w-12 h-8 rounded overflow-hidden border-2 transition-all",
                  currentIndex === index
                    ? "border-primary scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-foreground text-sm font-medium bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Keyboard hints */}
          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-card/60 backdrop-blur-sm px-3 py-2 rounded-lg hidden lg:block">
            ← → Naviga • +/- Zoom • ESC Chiudi
          </div>
        </div>
      )}
    </div>
  );
}
