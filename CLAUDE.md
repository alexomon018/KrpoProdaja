# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A fast, modern marketplace exclusively for buying and selling second-hand fashion (clothes, shoes, bags) in Serbia - like Vinted meets KupujemProdajem, but built specifically for Serbian users with superior UX.

## 📱 WHAT IS IT?

### **The Product**

A web-based marketplace (mobile-first) where Serbian users can:

- **List** their used clothing items in under 2 minutes
- **Browse** thousands of second-hand fashion items
- **Message** sellers directly
- **Buy** items (pay each other directly - cash/bank transfer/courier)
- **Leave reviews** to build trust

### **Key Differentiators**

1. **Fashion-only focus** - Not general marketplace clutter
2. **Modern, fast interface** - Unlike KupujemProdajem's outdated design
3. **Serbian-first** - Language, payment methods, shipping options
4. **Mobile-optimized** - 70% of traffic is mobile in Balkans
5. **SEO-optimized** - Built to rank fast on Google

## Development Commands

```bash
# Development
yarn run dev              # Start dev server with Turbopack
yarn run build           # Production build
yarn start               # Start production server
yarn run lint            # Run ESLint

# Testing
yarn test                # Run Jest unit tests
yarn run test:watch      # Run tests in watch mode
yarn run test:coverage   # Generate coverage report
yarn run test:e2e        # Run Playwright E2E tests
yarn run test:e2e:ui     # Run E2E tests with UI
yarn run test:e2e:headed # Run E2E tests in headed mode
yarn run test:e2e:debug  # Debug E2E tests
```

## What NOT to do

- Don't build for imaginary future requirements.
- Don't add complex error handling for edge cases that probably won't happen.
- Don't suggest design patterns unless the problem actually requires them.
- Don't optimize prematurely.
- Don't add configuration for things that rarely change.
- Don't run yarn build when you are finishing the tool call.

---

**Very Important** Always run the following commands before making a commit:

- `yarn run lint:fix`
- `yarn run format`
- `yarn run tsc`

---

## Red Alert Rules (Break = Block)

1. **Zero-Duplication Doctrine**: If a utility exists, _use or extend it_. Re-implementing behavior is technical vandalism.

2. **Mandatory Repo Crawl Before Typing**: Ripgrep the codebase first. If you reinvent an existing function, we'll pin it in a shame-PR.

3. **Scope-Laser Mode**: Edit _only_ files required for the ticket. Touching >2 unrelated modules? Stop. Ping a human. If the change feels "large" (≥200 LOC _or_ ≥5 files), flag **Need-Human-Approval** and wait. No "while I'm here" drive-bys.

4. **One Purpose / One Function**: "And also..." means split it.

5. **Atomic Commits**: One logical change per commit. Unrelated edits = reject.

6. **DRY or Die Tryin'**: 2 copies = warning. 3 copies = felony. CI will fail on detectable duplication.

7. **Expand, Don't Explode**: Extend existing utilities; never fork a `v2` copy-paste tree.

8. **Simplicity Tax**: If reviewers need >30s to grok a diff, refactor until they don't.

9. **Comment Quota Enforcement**: If code needs a paragraph to explain, the code is wrong. Fix the code, then re-evaluate comments.

10. **Kill Dead Code**: Remove unused paths / flags / TODO fossils.

11. **Performance Is a Feature**: New/changed code must meet _or beat_ existing util perf. Slower? Justify with numbers or expect revert.

12. **Linter = Law**: A red ESLint line is a hard stop. Fix or explain. No merges on lint errors.

13. **Context > Cleverness**: Readable beats wizardry. Explain to a sleepy intern in <60s.

14. **Fail Fast, Loud, Early**: Assert aggressively. Silent failures are sabotage.

15. **Docs or It Didn't Ship**: Public utilities need JSDoc/TSDoc. Private helpers: inline types are fine but must be clear.

## Dependency and Constant Management

- If a constant is only used by one file, always prefer dependency injection with a default value instead of relying on the constant being available in closure scope. We can always use it as the default value for that argument.

---

## Architecture

### Atomic Design Pattern

The codebase strictly follows atomic design methodology:

- **atoms/**: Basic building blocks (Button, Input, Badge, Avatar, ProductImage, etc.)
- **molecules/**: Simple component groups (ProductCard, SearchBar, ImageCarousel, SellerInfo, etc.)
- **organisms/**: Complex component assemblies (ProductGrid, FilterPanel, Header, ProductReviews, etc.)

### Import Aliases

Use the configured TypeScript path aliases:

```tsx
import { Button } from "@atoms";
import { ProductCard } from "@molecules";
import { Header } from "@organisms";
import { apiClient } from "@/api";
import { cn } from "@/lib/utils";
```

### App Structure (Next.js 15 App Router)

```
app/
├── (root)/           # Main application routes with shared layout
│   ├── page.tsx      # Homepage
│   ├── sell/         # Product listing creation
│   ├── products/     # Product details
│   ├── profile/      # User profiles
│   └── brands/       # Brand catalog
└── (auth)/           # Authentication routes with separate layout
    ├── login/
    ├── register/
    ├── verify-email/
    └── reset-password/
```

## API Integration

### Backend Connection

The app connects to the [krpoprodaja-api](https://github.com/alexomon018/krpoprodaja-api) backend. API integration is located in `lib/api/`:

```
lib/api/
├── client.ts         # HTTP client with auth token management
├── types.ts          # TypeScript type definitions
├── hooks/            # React Query hooks by resource
│   ├── useAuth.ts    # Authentication hooks
│   ├── useProducts.ts
│   ├── useUsers.ts
│   ├── useSearch.ts
│   └── useBrands.ts
└── services/         # API service functions
    ├── auth.ts
    ├── products.ts
    ├── users.ts
    ├── search.ts
    └── brands.ts
```

### Using API Hooks

Always use React Query hooks (preferred):

```tsx
import { useProducts, useProduct, useLogin } from "@/api";

// In components
const { data: products, isLoading } = useProducts({ page: 1 });
const login = useLogin();
```

## Authentication System

Authentication is handled via JWT tokens stored in HTTP-only cookies:

- **Middleware** (`middleware.ts`): Validates tokens, handles auto-refresh on protected routes
- **Protected routes**: `/profile`, `/messages`, `/my-listings`, `/favorites`, `/settings`
- **Auth routes**: `/login`, `/register` (redirect to home if authenticated)
- **Token management**: `lib/auth/` contains server-side helpers, cookie management, and token validation

The middleware automatically refreshes expired access tokens using refresh tokens before redirecting to login.

## Forms

### React Hook Form Integration

The project uses `react-hook-form` with custom form components:

```tsx
import { useForm, FormProvider } from "react-hook-form";
import { FormInput } from "@atoms";

const methods = useForm<FormData>();

return (
  <FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <FormInput name="title" label="Naziv" required />
      <Button type="submit">Pošalji</Button>
    </form>
  </FormProvider>
);
```

## Styling

### Tailwind Configuration

- **Design system**: Custom color palette, typography scale, and spacing defined in `tailwind.config.ts`
- **Semantic tokens**: Use `background`, `surface`, `foreground`, `border` for theme-aware colors
- **Primary colors**: Red-based palette (`red-100: #CE492C`)
- **Class merging**: Use default import `cn` from `@/lib/utils` for merging Tailwind classes

```tsx
import cn from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class")} />;
```

### Mobile-First Design

- Minimum touch targets: 44x44px
- Bottom tab navigation for mobile
- Responsive breakpoints: `2xs: 375px`, `xs: 425px`, `sm: 640px`, `md: 834px`, `lg: 1024px`, `xl: 1440px`

## State Management

- **React Query**: Server state (API data fetching, caching, mutations)
- **React Context**: Client state (filters, theme, auth)
- **Providers**: Located in `providers/` (AuthProvider, ThemeProvider, QueryProvider, FilterProvider)

## Localization

- **Primary language**: Serbian (Srpski)
- **Currency**: RSD (Serbian Dinar)
- **Date formats**: SR-RS locale
- **Size standards**: European sizing
- Use Serbian text in UI components and error messages

## Testing

### Unit Tests (Jest + React Testing Library)

- Test files: Co-located with components as `*.test.tsx`
- Run with `yarn test` or `yarn run test:watch`
- Mock utilities: Available in `__tests__/` directories
- Wrtite tests next to the component itself always after you create a component you look to test it or after you finish the work you do the tests.

### E2E Tests (Playwright)

- Test files: Located in `e2e/` directory
- Configuration: `playwright.config.ts`
- Base URL: `http://localhost:3000`
- Run with `yarn run test:e2e` or `yarn run test:e2e:ui`

## Environment Variables

Required variables (see `.env.example`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
BACKEND_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
NEXT_PUBLIC_FACEBOOK_APP_ID=your-app-id
```

Create `.env.local` for local development with actual values.

## Key Patterns

### Component Structure

Follow atomic design principles strictly:

1. Create atoms for basic UI elements first check if there is shadcn if there is use that https://ui.shadcn.com/
2. Compose molecules from atoms
3. Build organisms from molecules and atoms
4. Keep components focused and reusable

### Server vs Client Components

- Default to Server Components (Next.js 15 app router)
- Add `'use client'` directive only when needed:
  - Using React hooks (useState, useEffect)
  - Using browser APIs
  - Using event handlers
  - Using React Query hooks

### Data Fetching

Prefer React Query hooks for client-side data fetching:

```tsx
"use client";

const { data, isLoading, error } = useProducts({ page: 1 });
```

For server-side fetching, use service functions directly in Server Components.

If you need to fetch on server side use regular fetch and if the data needs to be rehydrated on client side use react query and prime thr query you can see that in the home component how it is done.

## Code Quality

- **TypeScript**: Strict mode enabled, define proper types
- **ESLint**: Run `yarn run lint` before committing
- **Component exports**: Use barrel exports from `index.ts` files
- **File naming**: PascalCase for components, camelCase for utilities

## Common Gotchas

1. **cn utility**: Import as default (`import cn from '@/lib/utils'`), not named import
2. **FormInput**: Must be wrapped in `<FormProvider>` from react-hook-form
3. **Middleware**: Runs on all routes except API, static files, and images
4. **Auth state**: Use `useCurrentUser()` hook to check authentication, not direct cookie access
5. **Atomic design**: Don't create molecules inside atoms, or organisms inside molecules
