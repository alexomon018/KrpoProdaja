/**
 * KrpoProdaja API - Main export file
 * Import everything you need from this file
 */

// Client and utilities
export { apiClient, ApiError } from './client';
export type { ApiRequestOptions } from './client';

// All types
export * from './types';

// Services
export { authService } from './services/auth';
export { productsService } from './services/products';
export { usersService } from './services/users';
export { searchService } from './services/search';
export { uploadService } from './services/upload';
export type { UploadImageResponse } from './services/upload';

// React Query Hooks
export * from './hooks';
