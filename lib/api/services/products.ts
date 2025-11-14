/**
 * Products Service
 * Handles all product-related operations (CRUD)
 */

import { apiClient } from '../client';
import type {
  ApiProduct,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateProductStatusRequest,
  ProductFilters,
} from '../types';

export const productsService = {
  /**
   * Get all products with optional filtering
   * GET /api/products
   */
  async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const query = params.toString();
    const endpoint = query ? `/products?${query}` : '/products';

    return apiClient.get<ProductListResponse>(endpoint);
  },

  /**
   * Get a single product by ID
   * GET /api/products/:id
   */
  async getProduct(id: number): Promise<ApiProduct> {
    return apiClient.get<ApiProduct>(`/products/${id}`);
  },

  /**
   * Create a new product listing
   * POST /api/products
   * Requires authentication
   */
  async createProduct(data: CreateProductRequest): Promise<ApiProduct> {
    return apiClient.post<ApiProduct>('/products', data, { requiresAuth: true });
  },

  /**
   * Update an existing product
   * PUT /api/products/:id
   * Requires authentication (owner only)
   */
  async updateProduct(id: number, data: UpdateProductRequest): Promise<ApiProduct> {
    return apiClient.put<ApiProduct>(`/products/${id}`, data, { requiresAuth: true });
  },

  /**
   * Delete a product
   * DELETE /api/products/:id
   * Requires authentication (owner only)
   */
  async deleteProduct(id: number): Promise<void> {
    return apiClient.delete<void>(`/products/${id}`, { requiresAuth: true });
  },

  /**
   * Update product status (available, reserved, sold)
   * PATCH /api/products/:id/status
   * Requires authentication (owner only)
   */
  async updateProductStatus(
    id: number,
    data: UpdateProductStatusRequest
  ): Promise<ApiProduct> {
    return apiClient.patch<ApiProduct>(`/products/${id}/status`, data, {
      requiresAuth: true,
    });
  },

  /**
   * Get similar products
   * GET /api/products/:id/similar
   */
  async getSimilarProducts(id: number, limit = 10): Promise<ApiProduct[]> {
    return apiClient.get<ApiProduct[]>(`/products/${id}/similar?limit=${limit}`);
  },
};
