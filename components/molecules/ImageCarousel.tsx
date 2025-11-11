"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/atoms";
import { ChevronLeft, ChevronRight } from "@/components/atoms/Icon";

export interface ImageCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[];
  alt: string;
  /**
   * Enable full-screen zoom on click
   */
  zoomable?: boolean;
  /**
   * Show image counter (e.g., "1/8")
   */
  showCounter?: boolean;
}

/**
 * ImageCarousel Component - Atomic Design: Molecule
 *
 * Swipeable image carousel for product detail pages
 * Features:
 * - Touch/swipe support
 * - Dot indicators
 * - Arrow navigation
 * - Full-screen zoom capability
 *
 * @example
 * ```tsx
 * <ImageCarousel
 *   images={product.images}
 *   alt={product.title}
 *   zoomable
 *   showCounter
 * />
 * ```
 */
const ImageCarousel = React.forwardRef<HTMLDivElement, ImageCarouselProps>(
  (
    {
      className,
      images,
      alt,
      zoomable = true,
      showCounter = true,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isZoomed, setIsZoomed] = React.useState(false);
    const touchStartX = React.useRef(0);
    const touchEndX = React.useRef(0);

    const goToNext = () => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrevious = () => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
      setCurrentIndex(index);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const swipeThreshold = 50;
      const diff = touchStartX.current - touchEndX.current;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          goToNext();
        } else {
          goToPrevious();
        }
      }
    };

    const handleImageClick = () => {
      if (zoomable) {
        setIsZoomed(true);
      }
    };

    return (
      <>
        <div
          ref={ref}
          className={cn("relative w-full", className)}
          {...props}
        >
          {/* Main Image */}
          <div
            className="relative overflow-hidden rounded-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={handleImageClick}
              className="w-full focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Uvećaj sliku"
            >
              <ProductImage
                src={images[currentIndex]}
                alt={`${alt} - ${currentIndex + 1}`}
                aspectRatio="square"
                priority={currentIndex === 0}
              />
            </button>

            {/* Counter */}
            {showCounter && images.length > 1 && (
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                {currentIndex + 1}/{images.length}
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2",
                  "p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md",
                  "hover:bg-white transition-colors touch-target",
                  "focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                aria-label="Prethodna slika"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goToNext}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2",
                  "p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md",
                  "hover:bg-white transition-colors touch-target",
                  "focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                aria-label="Sledeća slika"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {images.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-text-tertiary hover:bg-text-secondary"
                  )}
                  aria-label={`Idi na sliku ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Full-Screen Zoom Modal */}
        {isZoomed && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
              onClick={() => setIsZoomed(false)}
              aria-label="Zatvori uvećanu sliku"
            >
              <ChevronRight size={32} className="rotate-45" />
            </button>
            <img
              src={images[currentIndex]}
              alt={`${alt} - uvećano`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </>
    );
  }
);

ImageCarousel.displayName = "ImageCarousel";

export { ImageCarousel };
