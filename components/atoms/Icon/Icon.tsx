/**
 * Icon Component - Atomic Design: Atom
 *
 * Re-exports from lucide-react for consistent icon usage
 * All icons from the popular lucide icon library
 */

import * as React from "react";
import * as LucideIcons from "lucide-react";

export {
  Heart,
  Search,
  ShoppingBag,
  MessageCircle,
  User,
  Home,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
  Package,
  Camera,
  Upload,
  Check,
  AlertCircle,
  Info,
  Filter,
  SlidersHorizontal,
  Menu,
  Share2,
  Flag,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Send,
  Image as ImageIcon,
  Clock,
  TrendingUp,
  Zap,
  Shield,
  Award,
  Settings,
  LogOut,
  Bell,
  BellOff,
  Moon,
  Sun,
  BadgeCheck,
  CheckCircle,
  CheckCircle2,
  ShieldCheck,
  Loader2 as Loader,
} from "lucide-react";

/**
 * Icon sizes following the design system
 */
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconSize = keyof typeof iconSizes;

/**
 * Icon names that can be used
 */
export type IconName = keyof typeof LucideIcons;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
  /**
   * Name of the icon from lucide-react
   */
  name: IconName;
  /**
   * Size of the icon in pixels or using design system sizes
   */
  size?: number | IconSize;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Icon Component
 *
 * A unified icon component that wraps lucide-react icons
 *
 * @example
 * ```tsx
 * <Icon name="Heart" size={24} />
 * <Icon name="User" size="md" />
 * ```
 */
export function Icon({ name, size = 20, className, ...props }: Readonly<IconProps>) {
  const IconComponent = LucideIcons[name] as React.ComponentType<
    LucideIcons.LucideProps
  >;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  const iconSize = typeof size === "string" ? iconSizes[size] : size;

  return (
    <IconComponent
      size={iconSize}
      className={className}
      {...(props as LucideIcons.LucideProps)}
    />
  );
}
