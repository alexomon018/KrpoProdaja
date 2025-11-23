/**
 * TypeScript types for KrpoProdaja API
 * Matches the API responses from krpoprodaja-api
 */

// ==================== Auth Types ====================

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: ApiUser;
  accessToken: string;   // 30 min - for API authorization
  idToken: string;        // 30 min - for user identity
  // refreshToken is now managed by backend via httpOnly cookie, not in response
  // Legacy support (deprecated)
  token?: string;
}

// ==================== User Types ====================

export interface ApiUser {
  id: string;  // UUID from backend
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  verified?: boolean;
  verifiedSeller?: boolean;
  responseTime?: string;
  createdAt: string;
  // Legacy fields
  fullName?: string;
  phoneNumber?: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  // Extended fields (may not be supported by backend yet)
  bio?: string;
  avatar?: string;
  location?: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface RequestPasswordResetResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  user?: ApiUser;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
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
export type ProductCondition = 'new' | 'very-good' | 'good' | 'satisfactory';

export interface ApiProduct {
  id: string; // UUID from backend
  userId: string; // UUID from backend
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  categoryId: string; // UUID from backend
  condition: ProductCondition;
  size?: string;
  brand?: string;
  color?: string;
  material?: string;
  location?: string;
  status: ProductStatus;
  viewCount?: number;
  favoriteCount?: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user?: ApiUser;
  seller?: ApiUser;  // API returns seller instead of user for product details
  category?: ApiCategory;
  isFavorite?: boolean;
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  price: number;
  categoryId: string; // Backend expects string, not number
  condition: ProductCondition;
  size?: string;
  brand?: string;
  color?: string;
  location?: string;
  images?: string[];
}

export interface CreateProductResponse {
  message: string;
  product: ApiProduct;
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: string; // UUID
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
  categoryId?: string; // UUID
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  size?: string;
  brand?: string;
  color?: string;
  location?: string;
  status?: ProductStatus;
  userId?: string; // UUID
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  data: ApiProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
  };
}

// ==================== Category Types ====================

export interface ApiCategory {
  id: string; // UUID
  name: string;
  slug: string;
  description?: string;
  parentId?: string; // UUID
  createdAt: string;
  updatedAt: string;
  children?: ApiCategory[];
}

// ==================== Search Types ====================

export interface SearchParams {
  q: string;
  categoryId?: string; // UUID
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
  id: string; // UUID
  userId: string; // UUID
  productId: string; // UUID
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

// ==================== Phone Verification Types ====================

export interface SendPhoneVerificationRequest {
  phone: string; // E.164 format (e.g., +381601234567)
}

export interface SendPhoneVerificationResponse {
  message: string;
}

export interface VerifyPhoneRequest {
  code: string; // 6-digit code
}

export interface VerifyPhoneResponse {
  message: string;
  phoneVerified: boolean;
  verifiedSeller: boolean;
}

export interface ResendPhoneVerificationResponse {
  message: string;
}
