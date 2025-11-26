import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Keep default export for backward compatibility
export default cn;

/**
 * Format price in Serbian Dinar
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format relative time in Serbian
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Upravo sada";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Pre ${minutes} min`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Pre ${hours}h`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Pre ${days} dana`;
  }

  return date.toLocaleDateString("sr-RS");
}

/**
 * Format membership duration in Serbian
 * Returns days if less than 30 days, months if less than a year, years otherwise
 */
export function formatMembershipDuration(memberSince: Date): {
  value: number;
  unit: string;
} {
  const now = new Date();
  const diffInMs = now.getTime() - memberSince.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 30) {
    return {
      value: diffInDays,
      unit: diffInDays === 1 ? "dan" : "dana",
    };
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return {
      value: diffInMonths,
      unit: diffInMonths === 1 ? "mesec" : diffInMonths < 5 ? "meseca" : "meseci",
    };
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return {
    value: diffInYears,
    unit: diffInYears === 1 ? "god" : "god",
  };
}
