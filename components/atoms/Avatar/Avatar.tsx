"use client";

import { forwardRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Avatar as ShadcnAvatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { getUserAvatarData } from "@/lib/utils/avatar";

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
  backgroundColor?: string;
  textColor?: string;
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
 * <Avatar fallback="MK" size="lg" backgroundColor="#E57373" textColor="#FFFFFF" />
 * ```
 */
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, backgroundColor, textColor, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

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
        <AvatarFallback
          className="font-semibold"
          style={{
            backgroundColor: backgroundColor || 'hsl(var(--primary) / 0.1)',
            color: textColor || 'hsl(var(--primary))',
          }}
        >
          {fallback || '?'}
        </AvatarFallback>
      </ShadcnAvatar>
    );
  }
);

Avatar.displayName = "Avatar";

/**
 * User Avatar Component - Smart avatar that automatically determines display from user data
 *
 * Priority:
 *   1. Avatar image URL (if provided)
 *   2. Initials from first name + last name (if both provided)
 *   3. Initials from email address
 *
 * @example
 * ```tsx
 * <UserAvatar user={{ email: "john.doe@example.com", firstName: "John", lastName: "Doe" }} size="md" />
 * <UserAvatar user={{ email: "alice@example.com" }} size="lg" />
 * ```
 */
export interface UserAvatarProps
  extends Omit<AvatarProps, 'src' | 'alt' | 'fallback' | 'backgroundColor' | 'textColor'> {
  user: {
    avatar?: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ user, ...props }, ref) => {
    const avatarData = getUserAvatarData(user);

    return (
      <Avatar
        key={user.avatar || user.email}
        ref={ref}
        src={avatarData.type === 'image' ? avatarData.value : undefined}
        fallback={avatarData.type === 'initials' ? avatarData.value : undefined}
        backgroundColor={avatarData.backgroundColor}
        textColor={avatarData.textColor}
        alt={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
        {...props}
      />
    );
  }
);

UserAvatar.displayName = "UserAvatar";

export { Avatar, UserAvatar, avatarVariants };
