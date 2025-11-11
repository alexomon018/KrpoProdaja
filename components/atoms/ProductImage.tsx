import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface ProductImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  /**
   * Aspect ratio - defaults to square (1:1) for product grids
   */
  aspectRatio?: "square" | "portrait" | "landscape";
  /**
   * Priority loading for above-the-fold images
   */
  priority?: boolean;
  /**
   * Show overlay badges (sold, reserved)
   */
  overlay?: React.ReactNode;
  /**
   * Fill container - useful for variable sizes
   */
  fill?: boolean;
}

/**
 * ProductImage Component - Atomic Design: Atom
 *
 * Optimized product image with WebP support, lazy loading, and blur placeholders
 * Follows Vinted's approach: square thumbnails for grid consistency
 *
 * @example
 * ```tsx
 * <ProductImage
 *   src="/products/dress.jpg"
 *   alt="Black Zara Dress"
 *   aspectRatio="square"
 *   priority
 * />
 * ```
 */
const ProductImage = React.forwardRef<HTMLDivElement, ProductImageProps>(
  (
    {
      className,
      src,
      alt,
      aspectRatio = "square",
      priority = false,
      overlay,
      fill = false,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);

    const aspectRatioClasses = {
      square: "aspect-square",
      portrait: "aspect-[3/4]",
      landscape: "aspect-[4/3]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg bg-background",
          !fill && aspectRatioClasses[aspectRatio],
          fill && "w-full h-full",
          className
        )}
        {...props}
      >
        {!imageError ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background text-text-tertiary">
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {overlay && (
          <div className="absolute inset-0 pointer-events-none">
            {overlay}
          </div>
        )}
      </div>
    );
  }
);

ProductImage.displayName = "ProductImage";

export { ProductImage };
