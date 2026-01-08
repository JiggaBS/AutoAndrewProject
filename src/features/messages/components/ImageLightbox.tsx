import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageLightboxProps {
  images: { url: string; name: string }[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pinch-to-zoom state
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialPinchScale, setInitialPinchScale] = useState(1);
  const [pinchCenter, setPinchCenter] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;
  const minSwipeDistance = 50;

  // Calculate distance between two touch points
  const getDistance = useCallback((touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Get center point between two touches
  const getCenter = useCallback((touch1: React.Touch, touch2: React.Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }, []);

  // Reset zoom when changing images
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasMultiple) goToPrevious();
          break;
        case 'ArrowRight':
          if (hasMultiple) goToNext();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [hasMultiple, goToPrevious, goToNext, zoomIn, zoomOut, onClose]);

  // Touch handlers for swipe and pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't handle touches on buttons or header
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[class*="absolute top-0"]')) {
      return;
    }

    // Pinch-to-zoom: two fingers
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const center = getCenter(e.touches[0], e.touches[1]);
      setInitialPinchDistance(distance);
      setInitialPinchScale(scale);
      setPinchCenter(center);
      setIsPinching(true);
      return;
    }

    // Single finger swipe (only when not zoomed)
    if (scale <= 1) {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
      // Also track Y for vertical swipe to close
      if (e.targetTouches[0].clientY) {
        setDragStart({ 
          x: e.targetTouches[0].clientX, 
          y: e.targetTouches[0].clientY 
        });
      }
    } else {
      // Panning when zoomed
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Pinch-to-zoom
    if (e.touches.length === 2 && initialPinchDistance !== null) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scaleChange = currentDistance / initialPinchDistance;
      const newScale = Math.min(Math.max(initialPinchScale * scaleChange, 1), 4);
      
      setScale(newScale);
      
      // Reset position if zooming back to 1
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return;
    }

    // Single finger
    if (e.touches.length === 1) {
      if (scale <= 1 && !isPinching) {
        // Swipe navigation
        setTouchEnd(e.targetTouches[0].clientX);
      } else if (isDragging && scale > 1) {
        // Panning
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y,
        });
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Don't handle touches on buttons or header
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[class*="absolute top-0"]')) {
      return;
    }

    // End pinch-to-zoom
    if (isPinching) {
      setInitialPinchDistance(null);
      setIsPinching(false);
      
      // If remaining touches, start panning
      if (e.touches.length === 1 && scale > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        });
      }
      return;
    }

    // End panning
    if (isDragging && scale > 1) {
      setIsDragging(false);
      return;
    }

    // Check for vertical swipe down to close (when not zoomed and single finger)
    if (scale <= 1 && touchStart && dragStart.y && e.changedTouches[0]) {
      const verticalDistance = e.changedTouches[0].clientY - dragStart.y;
      const horizontalDistance = Math.abs(e.changedTouches[0].clientX - dragStart.x);
      
      // If swiped down significantly more than horizontally, close
      if (verticalDistance > 100 && verticalDistance > horizontalDistance * 2) {
        onClose();
        setTouchStart(null);
        setTouchEnd(null);
        return;
      }
    }

    // Swipe navigation (horizontal)
    if (!touchStart || !touchEnd || scale > 1) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (hasMultiple) {
      if (isLeftSwipe) goToNext();
      else if (isRightSwipe) goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse handlers for panning when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double tap/click to zoom
  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentImage.name || 'image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.target === containerRef.current) {
      onClose();
    }
  };

  const handleBackdropTouch = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.target === containerRef.current) {
      onClose();
    }
  };

  const handleClose = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={handleBackdropClick}
      onTouchStart={handleBackdropTouch}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white text-sm truncate max-w-[50%]">
          {currentImage.name}
          {hasMultiple && (
            <span className="ml-2 text-white/60">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); if (scale > 1) zoomOut(); }}
            disabled={scale <= 1}
            className="p-3 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-6 h-6 sm:w-5 sm:h-5 text-white" />
          </button>
          <button
            onClick={zoomIn}
            onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); if (scale < 4) zoomIn(); }}
            disabled={scale >= 4}
            className="p-3 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-6 h-6 sm:w-5 sm:h-5 text-white" />
          </button>
          <button
            onClick={handleDownload}
            onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleDownload(); }}
            className="p-3 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Download"
          >
            <Download className="w-6 h-6 sm:w-5 sm:h-5 text-white" />
          </button>
          <button
            onClick={handleClose}
            onTouchEnd={handleClose}
            className="p-3 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-6 h-6 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={goToPrevious}
            onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); goToPrevious(); }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors z-10 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); goToNext(); }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors z-10 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Image container */}
      <div
        className={cn(
          "w-full h-full flex items-center justify-center p-4 pt-16 pb-20",
          scale > 1 ? "cursor-grab" : "cursor-zoom-in",
          isDragging && "cursor-grabbing"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.url}
          alt={currentImage.name}
          className="max-w-full max-h-full object-contain select-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isPinching || isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          draggable={false}
        />
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 p-4 bg-gradient-to-t from-black/50 to-transparent overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                index === currentIndex
                  ? "border-white scale-110"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
