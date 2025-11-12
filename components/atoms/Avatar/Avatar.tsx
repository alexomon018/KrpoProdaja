"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import cn from "@/lib/utils";
import Image from "next/image";

/**
 * Avatar size variants
 */
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full bg-text-tertiary/20 shadow-light",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-2xs",
        md: "h-10 w-10 text-xs",
        lg: "h-12 w-12 text-sm",
        xl: "h-16 w-16 text-base",
        "2xl": "h-24 w-24 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

/**
 * Avatar Component - Atomic Design: Atom
 *
 * User profile picture with automatic fallback to initials
 * Optimized with Next.js Image component
 *
 * @example
 * ```tsx
 * <Avatar src="/user.jpg" alt="Marija K." size="md" />
 * <Avatar fallback="MK" size="lg" />
 * ```
 */
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    // Generate initials from alt text if no fallback provided
    const getInitials = (name?: string) => {
      if (!name) return "?";
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const displayFallback = fallback || getInitials(alt);

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt || "User avatar"}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-semibold">
            {displayFallback}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
