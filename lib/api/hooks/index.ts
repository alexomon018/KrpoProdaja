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

// Business logic hooks
export { useHomeProducts } from "./useHomeProducts";
export { useUserProductsManagement } from "./useUserProductsManagement";
export { useProfileEditor } from "./useProfileEditor";
export { useProductCreation } from "./useProductCreation";
export { useProductDetails } from "./useProductDetails";
export { useLogin } from "./useLogin";
export { useRegister } from "./useRegister";
export { usePasswordChange } from "./usePasswordChange";

// User hooks
export {
  useUpdateCurrentUser,
  useUserProfile,
  useUserProducts,
  useChangePassword,
  useSendPhoneVerification,
  useVerifyPhone,
  useResendPhoneVerification,
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

// Brand hooks
export { useBrands } from "./useBrands";

// City hooks
export { useCities } from "./useCities";
