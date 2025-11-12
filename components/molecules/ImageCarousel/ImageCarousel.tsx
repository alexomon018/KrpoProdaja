"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import cn from "@/lib/utils";
import { ProductImage } from "@/components/atoms";
import { ChevronLeft, ChevronRight } from "@/components/atoms/Icon/Icon";

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
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [isZoomed, setIsZoomed] = React.useState(false);

    const scrollPrev = React.useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = React.useCallback(
      (index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
      },
      [emblaApi]
    );

    const onSelect = React.useCallback(() => {
      if (!emblaApi) return;
      setCurrentIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    React.useEffect(() => {
      if (!emblaApi) return;
      onSelect();
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);

      return () => {
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onSelect);
      };
    }, [emblaApi, onSelect]);

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
          {/* Embla Carousel Container */}
          <div className="overflow-hidden rounded-lg" ref={emblaRef}>
            <div className="flex">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0"
                >
                  <button
                    onClick={handleImageClick}
                    className="w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Uvećaj sliku"
                  >
                    <ProductImage
                      src={image}
                      alt={`${alt} - ${index + 1}`}
                      aspectRatio="square"
                      priority={index === 0}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Counter */}
          {showCounter && images.length > 1 && (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium z-10">
              {currentIndex + 1}/{images.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                  "p-2 rounded-full backdrop-blur-sm shadow-md",
                  "transition-all touch-target",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                  canScrollPrev
                    ? "bg-gray-800/80 hover:bg-gray-800 text-white cursor-pointer"
                    : "bg-gray-300/50 text-gray-400 cursor-not-allowed"
                )}
                aria-label="Prethodna slika"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                  "p-2 rounded-full backdrop-blur-sm shadow-md",
                  "transition-all touch-target",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                  canScrollNext
                    ? "bg-gray-800/80 hover:bg-gray-800 text-white cursor-pointer"
                    : "bg-gray-300/50 text-gray-400 cursor-not-allowed"
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
                  onClick={() => scrollTo(index)}
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
