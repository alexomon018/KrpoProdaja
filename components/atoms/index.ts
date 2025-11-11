/**
 * Atoms - Atomic Design Pattern
 *
 * Smallest building blocks of the UI
 * Cannot be broken down further without losing meaning
 */

export { Button, buttonVariants } from "./Button";
export type { ButtonProps } from "./Button";

export { Input } from "./Input";
export type { InputProps } from "./Input";

export { Badge, badgeVariants, ConditionBadge, SizeBadge } from "./Badge";
export type { BadgeProps } from "./Badge";

export { Avatar, avatarVariants } from "./Avatar";
export type { AvatarProps } from "./Avatar";

export { ProductImage } from "./ProductImage";
export type { ProductImageProps } from "./ProductImage";

export { Typography, textVariants, Price } from "./Typography";
export type { TypographyProps } from "./Typography";

export * from "./Icon";
