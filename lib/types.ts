/**
 * Common types for the application
 */

export type ConditionType = "new" | "very-good" | "good" | "satisfactory";

export type SizeType = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";

export type CategoryType = {
  id: string;
  name: string;
  slug: string;
  parent?: string;
};

export type ProductType = {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  size: SizeType;
  condition: ConditionType;
  brand?: string;
  color?: string;
  material?: string;
  category: string;
  location: string;
  seller: UserType;
  createdAt: Date;
  isFavorite?: boolean;
  isReserved?: boolean;
  isSold?: boolean;
};

export type UserType = {
  id: string;
  email: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  rating?: number;
  reviewCount?: number;
  responseTime?: string;
  memberSince: Date;
  itemsForSale?: number;
  itemsSold?: number;
};

export type ReviewType = {
  id: string;
  rating: number;
  comment: string;
  reviewer: UserType;
  createdAt: Date;
  reviewType?: 'this-item' | 'appearance' | 'delivery-packaging' | 'seller-service' | 'condition';
  images?: string[];
  sellerResponse?: {
    comment: string;
    createdAt: Date;
  };
};

export type ReviewSummaryType = {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    itemQuality: number;
    delivery: number;
    customerService: number;
  };
  recommendationPercentage: number;
  highlights: string[];
};
