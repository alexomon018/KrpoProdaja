/**
 * React Query Hooks for KrpoProdaja API
 *
 * Organized by resource type:
 * - useAuth.ts: Authentication hooks (register, login, logout)
 * - useProducts.ts: Product management hooks
 * - useUsers.ts: User profile hooks
 * - useSearch.ts: Search, categories, and favorites hooks
 */

// Products hooks
export {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateProductStatus,
  useSimilarProducts,
} from "./useProducts";

// User hooks
export {
  useUpdateCurrentUser,
  useUserProfile,
  useUserProducts,
  useChangePassword,
} from "./useUsers";

// Search & discovery hooks
export {
  useSearchProducts,
  useSearchSuggestions,
  useCategories,
  useFavorites,
  useAddToFavorites,
  useRemoveFromFavorites,
} from "./useSearch";
