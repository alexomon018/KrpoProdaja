/**
 * TypeScript types for KrpoProdaja API
 * Matches the API responses from krpoprodaja-api
 */

// ==================== Auth Types ====================

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  fullName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

// ==================== User Types ====================

export interface ApiUser {
  id: number;
  email: string;
  username: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  username?: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  phoneNumber?: string;
}

export interface UserProfileResponse {
  user: ApiUser;
  stats: {
    productsListed: number;
    productsSold: number;
    rating: number;
    reviewCount: number;
  };
}

// ==================== Product Types ====================

export type ProductStatus = 'available' | 'reserved' | 'sold';
export type ProductCondition = 'new' | 'like-new' | 'good' | 'fair';

export interface ApiProduct {
  id: number;
  userId: number;
  title: string;
  description?: string;
  price: number;
  categoryId: number;
  condition: ProductCondition;
  size?: string;
  brand?: string;
  color?: string;
  location?: string;
  status: ProductStatus;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user?: ApiUser;
  category?: ApiCategory;
  isFavorite?: boolean;
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  price: number;
  categoryId: number;
  condition: ProductCondition;
  size?: string;
  brand?: string;
  color?: string;
  location?: string;
  images?: string[];
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  condition?: ProductCondition;
  size?: string;
  brand?: string;
  color?: string;
  location?: string;
  images?: string[];
}

export interface UpdateProductStatusRequest {
  status: ProductStatus;
}

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  size?: string;
  brand?: string;
  color?: string;
  location?: string;
  status?: ProductStatus;
  userId?: number;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: ApiProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== Category Types ====================

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  children?: ApiCategory[];
}

// ==================== Search Types ====================

export interface SearchParams {
  q: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  size?: string;
  brand?: string;
  color?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export interface SearchSuggestionsParams {
  q: string;
  limit?: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand';
}

// ==================== Favorites Types ====================

export interface FavoriteProduct {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product: ApiProduct;
}

export interface FavoritesResponse {
  favorites: FavoriteProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== Common Types ====================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
