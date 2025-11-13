"use client";

import React, { useState } from "react";
import { Expand } from "lucide-react";
import cn, { formatPrice } from "@/lib/utils";
import { ImageCarousel } from "@/components/molecules/ImageCarousel/ImageCarousel";
import { ConditionBadge } from "@/components/atoms/ConditionBadge";
import { FullScreenImageModal } from "@/components/molecules/FullScreenImageModal";

export interface ProductDetailsHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  price: number;
  images: string[];
  condition: "new" | "very-good" | "good" | "satisfactory";
  size?: string;
  category?: string;
}

const ProductDetailsHeader = React.forwardRef<
  HTMLDivElement,
  ProductDetailsHeaderProps
>(
  (
    { className, title, price, images, condition, size, category, ...props },
    ref
  ) => {
    const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleImageClick = (index: number) => {
      setCurrentImageIndex(index);
      setIsFullScreenOpen(true);
    };

    return (
      <>
        <div
          ref={ref}
          className={cn("relative max-w-full", className)}
          {...props}
        >
          {/* Image Carousel */}
          <div className="relative">
            <ImageCarousel images={images} alt={title} zoomable={false} />

            {/* Full Screen Button Overlay */}
            <button
              onClick={() => {
                setCurrentImageIndex(0);
                setIsFullScreenOpen(true);
              }}
              className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
              aria-label="View full screen"
            >
              <Expand className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Full Screen Image Modal */}
        <FullScreenImageModal
          images={images}
          initialIndex={currentImageIndex}
          isOpen={isFullScreenOpen}
          onClose={() => setIsFullScreenOpen(false)}
          alt={title}
        />
      </>
    );
  }
);

ProductDetailsHeader.displayName = "ProductDetailsHeader";

export { ProductDetailsHeader };
