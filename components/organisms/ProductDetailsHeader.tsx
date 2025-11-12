'use client';

import React, { useState } from 'react';
import { Expand } from 'lucide-react';
import cn, { formatPrice } from '@/lib/utils';
import { ImageCarousel } from '@/components/molecules/ImageCarousel/ImageCarousel';
import { ConditionBadge } from '@/components/atoms/ConditionBadge';
import { FullScreenImageModal } from '@/components/molecules/FullScreenImageModal';

export interface ProductDetailsHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  price: number;
  images: string[];
  condition: 'new' | 'very-good' | 'good' | 'satisfactory';
  size?: string;
  category?: string;
}

const ProductDetailsHeader = React.forwardRef<HTMLDivElement, ProductDetailsHeaderProps>(
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
          className={cn('grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12', className)}
          {...props}
        >
          {/* Left Column - Image Carousel */}
          <div className="relative max-w-2xl">
            <div className="relative">
              <ImageCarousel
                images={images}
                alt={title}
                zoomable={false}
              />

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

          {/* Right Column - Product Info */}
          <div className="space-y-6 lg:min-w-[400px] lg:max-w-[500px]">
            {/* Category */}
            {category && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {category}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(price)}
              </span>
            </div>

            {/* Condition and Size */}
            <div className="flex flex-wrap items-center gap-3">
              <ConditionBadge condition={condition} />
              {size && (
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                  Size: {size}
                </div>
              )}
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Condition</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {condition.replace('-', ' ')}
                </p>
              </div>
              {size && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Size</p>
                  <p className="font-medium text-gray-900 dark:text-white">{size}</p>
                </div>
              )}
            </div>
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

ProductDetailsHeader.displayName = 'ProductDetailsHeader';

export { ProductDetailsHeader };
