/**
 * Icon Component - Atomic Design: Atom
 *
 * Re-exports from lucide-react for consistent icon usage
 * All icons from the popular lucide icon library
 */

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
