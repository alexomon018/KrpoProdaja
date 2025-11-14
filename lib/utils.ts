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
