"use client";

import { forwardRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Avatar as ShadcnAvatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

/**
 * Extended avatar size variants for KrpoProdaja marketplace
 * Built on shadcn/ui Avatar with custom sizes
 */
const avatarVariants = cva("shadow-light", {
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
});

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
 * Built on shadcn/ui Avatar with Next.js Image optimization
 *
 * @example
 * ```tsx
 * <Avatar src="/user.jpg" alt="Marija K." size="md" />
 * <Avatar fallback="MK" size="lg" />
 * ```
 */
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

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
      <ShadcnAvatar
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {src && !imageError && (
          <AvatarImage
            src={src}
            alt={alt || "User avatar"}
            onError={(e) => {
              console.error("Avatar image failed to load:", src, e);
              setImageError(true);
            }}
          />
        )}
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {displayFallback}
        </AvatarFallback>
      </ShadcnAvatar>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
