# KrpoProdaja API Integration Guide

This document explains how to use the KrpoProdaja API integration in your Next.js application.

## Overview

The application is now connected to the [krpoprodaja-api](https://github.com/alexomon018/krpoprodaja-api) backend with four main resources:

1. **Authentication** - User registration, login, and logout
2. **Products** - Complete CRUD operations for product listings
3. **User Profiles** - User profile management and viewing
4. **Search & Discovery** - Search, categories, and favorites

## Setup

### 1. Environment Configuration

Create a `.env.local` file in the root directory (or copy from `.env.example`):

```bash
# API Base URL (update this for production)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: API timeout in milliseconds
NEXT_PUBLIC_API_TIMEOUT=10000
```

### 2. Ensure API Server is Running

Make sure your krpoprodaja-api backend is running on the specified URL (default: `http://localhost:3000`).

## Usage Examples

### Using React Query Hooks (Recommended)

The easiest way to use the API is through React Query hooks:

#### Authentication

```tsx
'use client';

import { useLogin, useRegister, useLogout, useCurrentUser } from '@/lib/api/hooks';

function LoginForm() {
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await login.mutateAsync({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      // Redirect to home or dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
      {login.isError && <p>Error: {login.error.message}</p>}
    </form>
  );
}

function UserProfile() {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>Please log in</p>;

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <p>{user.email}</p>
      <button onClick={() => logout.mutate()}>Logout</button>
    </div>
  );
}
```

#### Products

```tsx
'use client';

import { useProducts, useProduct, useCreateProduct } from '@/lib/api/hooks';

function ProductList() {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 20,
    condition: 'good',
  });

  if (isLoading) return <p>Loading products...</p>;

  return (
    <div>
      {data?.products.map((product) => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>{product.price} RSD</p>
        </div>
      ))}
    </div>
  );
}

function ProductDetails({ id }: { id: number }) {
  const { data: product, isLoading } = useProduct(id);
  const { data: similar } = useSimilarProducts(id);

  if (isLoading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>{product.price} RSD</p>
      <p>Condition: {product.condition}</p>

      {similar && similar.length > 0 && (
        <div>
          <h2>Similar Products</h2>
          {similar.map((p) => (
            <div key={p.id}>{p.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateProductForm() {
  const createProduct = useCreateProduct();

  const handleSubmit = async (data: CreateProductRequest) => {
    try {
      await createProduct.mutateAsync(data);
      // Redirect to product page or show success
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // Build data object from form
      handleSubmit({
        title: 'Product Title',
        price: 1000,
        categoryId: 1,
        condition: 'good',
        description: 'Product description',
      });
    }}>
      {/* Form fields */}
      <button type="submit" disabled={createProduct.isPending}>
        Create Product
      </button>
    </form>
  );
}
```

#### Search & Discovery

```tsx
'use client';

import {
  useSearchProducts,
  useSearchSuggestions,
  useCategories,
  useFavorites,
  useAddToFavorites,
} from '@/lib/api/hooks';

function SearchBar() {
  const [query, setQuery] = useState('');
  const { data: suggestions } = useSearchSuggestions({ q: query, limit: 5 });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      {suggestions && suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, i) => (
            <li key={i}>{suggestion.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CategoriesFilter() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) return <p>Loading categories...</p>;

  return (
    <select>
      <option value="">All Categories</option>
      {categories?.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}

function FavoriteButton({ productId }: { productId: number }) {
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const handleToggle = async (isFavorite: boolean) => {
    try {
      if (isFavorite) {
        await removeFromFavorites.mutateAsync(productId);
      } else {
        await addToFavorites.mutateAsync(productId);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <button onClick={() => handleToggle(false)}>
      Add to Favorites
    </button>
  );
}
```

#### User Profiles

```tsx
'use client';

import { useUserProfile, useUserProducts, useUpdateCurrentUser } from '@/lib/api/hooks';

function UserProfilePage({ userId }: { userId: number }) {
  const { data: profile, isLoading } = useUserProfile(userId);
  const { data: products } = useUserProducts(userId, { page: 1, limit: 10 });

  if (isLoading) return <p>Loading profile...</p>;
  if (!profile) return <p>User not found</p>;

  return (
    <div>
      <h1>{profile.user.username}</h1>
      <p>{profile.user.bio}</p>

      <div>
        <p>Products Listed: {profile.stats.productsListed}</p>
        <p>Products Sold: {profile.stats.productsSold}</p>
        <p>Rating: {profile.stats.rating}/5</p>
      </div>

      <h2>Products</h2>
      {products?.products.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}

function EditProfileForm() {
  const updateUser = useUpdateCurrentUser();

  const handleSubmit = async (data: UpdateUserRequest) => {
    try {
      await updateUser.mutateAsync(data);
      // Show success message
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        username: 'newusername',
        bio: 'My new bio',
      });
    }}>
      {/* Form fields */}
      <button type="submit">Update Profile</button>
    </form>
  );
}
```

### Using Services Directly (Advanced)

If you need more control, you can use the services directly:

```tsx
import { authService, productsService, usersService, searchService } from '@/lib/api';

// Example: Custom server action
async function loginUser(email: string, password: string) {
  try {
    const response = await authService.login({ email, password });
    console.log('Logged in:', response.user);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
```

## API Structure

### File Organization

```
lib/
└── api/
    ├── index.ts              # Main exports
    ├── client.ts             # HTTP client with auth
    ├── types.ts              # TypeScript types
    ├── hooks.ts              # React Query hooks
    └── services/
        ├── auth.ts           # Authentication service
        ├── products.ts       # Products service
        ├── users.ts          # Users service
        └── search.ts         # Search & discovery service
```

### Available Services

#### `authService`
- `register(data)` - Register new user
- `login(data)` - Login user
- `logout()` - Logout user
- `isAuthenticated()` - Check if user is logged in
- `getToken()` - Get current auth token

#### `productsService`
- `getProducts(filters?)` - List products with filtering
- `getProduct(id)` - Get single product
- `createProduct(data)` - Create new product (auth required)
- `updateProduct(id, data)` - Update product (auth required)
- `deleteProduct(id)` - Delete product (auth required)
- `updateProductStatus(id, data)` - Change product status (auth required)
- `getSimilarProducts(id, limit?)` - Get similar products

#### `usersService`
- `getCurrentUser()` - Get current user (auth required)
- `updateCurrentUser(data)` - Update current user (auth required)
- `getUserProfile(userId)` - Get public user profile
- `getUserProducts(userId, params?)` - Get user's products

#### `searchService`
- `searchProducts(params)` - Search products
- `getSearchSuggestions(params)` - Get autocomplete suggestions
- `getCategories()` - Get all categories
- `getFavorites(params?)` - Get user's favorites (auth required)
- `addToFavorites(productId)` - Add to favorites (auth required)
- `removeFromFavorites(productId)` - Remove from favorites (auth required)

## Authentication Flow

1. User logs in/registers → Token is stored in localStorage
2. Token is automatically included in all authenticated requests
3. User logs out → Token is removed from localStorage

## Error Handling

All API calls can throw `ApiError`:

```tsx
import { ApiError } from '@/lib/api';

try {
  await productsService.getProducts();
} catch (error) {
  if (error instanceof ApiError) {
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Data:', error.data);
  }
}
```

## TypeScript Support

All types are fully typed. Import types from `@/lib/api`:

```tsx
import type {
  ApiProduct,
  ApiUser,
  CreateProductRequest,
  ProductFilters,
  // ... and many more
} from '@/lib/api';
```

## Next Steps

1. Update your existing pages to use the API hooks
2. Remove mock data from `lib/mockData.ts` once you're using real API data
3. Add error boundaries and loading states
4. Implement proper authentication guards for protected routes
5. Add optimistic updates for better UX

## Support

For API issues, check the [krpoprodaja-api repository](https://github.com/alexomon018/krpoprodaja-api).
