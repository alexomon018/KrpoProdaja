/**
 * Atoms - Atomic Design Pattern
 *
 * Smallest building blocks of the UI
 * Cannot be broken down further without losing meaning
 */

export { Button, buttonVariants } from "./Button/Button";
export type { ButtonProps } from "./Button/Button";

export { Input } from "./Input/Input";
export type { InputProps } from "./Input/Input";

export { Checkbox } from "./Checkbox/Checkbox";
export type { CheckboxProps } from "./Checkbox/Checkbox";

export { Textarea } from "./Textarea/Textarea";
export type { TextareaProps } from "./Textarea/Textarea";

export { FormInput } from "./FormInput/FormInput";
export type { FormInputProps } from "./FormInput/FormInput";

export { Badge, badgeVariants, ConditionBadge, SizeBadge } from "./Badge/Badge";
export type { BadgeProps } from "./Badge/Badge";

export { Avatar, avatarVariants } from "./Avatar/Avatar";
export type { AvatarProps } from "./Avatar/Avatar";

export { ProductImage } from "./ProductImage/ProductImage";
export type { ProductImageProps } from "./ProductImage/ProductImage";

export { Typography, textVariants, Price } from "./Typography/Typography";
export type { TypographyProps } from "./Typography/Typography";

export { Container } from "./Container/Container";
export type { ContainerProps } from "./Container/Container";

export { RatingMetric } from "./RatingMetric/RatingMetric";
export type { RatingMetricProps } from "./RatingMetric/RatingMetric";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "./Select/Select";

export * from "./Icon/Icon";
