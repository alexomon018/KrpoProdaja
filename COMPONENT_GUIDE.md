# Component Guide - Krpo Prodaja

Complete reference for all UI components in the Serbian Fashion Resale Marketplace.

## 🧱 Atomic Design Hierarchy

```
Atoms → Molecules → Organisms → Templates → Pages
```

---

## ⚛️ ATOMS

### Button
```tsx
import { Button } from "@/components/atoms";

// Variants
<Button variant="primary">Kupi odmah</Button>
<Button variant="secondary">Pošalji poruku</Button>
<Button variant="ghost">Otkaži</Button>

// Sizes
<Button size="sm">Mala</Button>
<Button size="md">Srednja</Button>
<Button size="lg">Velika</Button>

// States
<Button loading>Učitavanje...</Button>
<Button disabled>Onemogućeno</Button>
<Button fullWidth>Puna širina</Button>
```

**Props:**
- `variant`: "primary" | "secondary" | "ghost" | "danger" | "success"
- `size`: "sm" | "md" | "lg" | "icon"
- `fullWidth`: boolean
- `loading`: boolean

---

### Input
```tsx
import { Input } from "@/components/atoms";

<Input
  label="Cena"
  type="number"
  placeholder="0 RSD"
  error="Cena je obavezna"
  helperText="Unesite cenu u dinarima"
  startIcon={<DollarSign size={20} />}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `startIcon`: ReactNode
- `endIcon`: ReactNode

---

### Badge
```tsx
import { Badge, ConditionBadge, SizeBadge } from "@/components/atoms";

// Basic badge
<Badge>M</Badge>

// Variants
<Badge variant="primary">Novo</Badge>
<Badge variant="success">Dostupno</Badge>
<Badge variant="sold">Prodato</Badge>

// Specialized badges
<ConditionBadge condition="new" />
<SizeBadge clothingSize="M" />
```

**Variants:**
- default, primary, success, warning, error, info
- new, veryGood, good, satisfactory
- sold, reserved

---

### Avatar
```tsx
import { Avatar } from "@/components/atoms";

<Avatar
  src="/user.jpg"
  alt="Marija K."
  size="md"
  fallback="MK"
/>
```

**Sizes:** "sm" | "md" | "lg" | "xl" | "2xl"

---

### ProductImage
```tsx
import { ProductImage } from "@/components/atoms";

<ProductImage
  src="/products/dress.jpg"
  alt="Black Zara Dress"
  aspectRatio="square"
  priority
/>
```

**Aspect Ratios:** "square" | "portrait" | "landscape"

---

### Typography
```tsx
import { Typography, Price } from "@/components/atoms";

<Typography variant="h1">Naslov</Typography>
<Typography variant="body">Tekst</Typography>
<Typography variant="caption">Sitno</Typography>

<Price amount={2500} originalPrice={4990} />
```

**Variants:**
- h1, h2, h3
- body, bodySmall, caption
- price, priceLarge

---

## 🧬 MOLECULES

### ProductCard
```tsx
import { ProductCard } from "@/components/molecules";

<ProductCard
  product={productData}
  onFavoriteClick={(id) => handleFavorite(id)}
/>
```

**Features:**
- Square product image
- Price display
- Seller avatar overlay
- Favorite button
- Status badges (sold, reserved)
- Size, brand, condition indicators

---

### SearchBar
```tsx
import { SearchBar } from "@/components/molecules";

<SearchBar
  placeholder="Pretraži po nazivu, brendu..."
  onSearch={(query) => handleSearch(query)}
  suggestions={["Zara haljina", "Nike patike"]}
  showSuggestions
/>
```

**Features:**
- Auto-complete suggestions
- Recent searches
- Clear button
- Search icon

---

### FilterChip
```tsx
import { FilterChip, FilterChipGroup } from "@/components/molecules";

<FilterChipGroup onClearAll={clearFilters}>
  <FilterChip
    label="Veličina: M"
    onRemove={() => removeFilter('size')}
  />
  <FilterChip label="Brend: Zara" />
</FilterChipGroup>
```

**Use Case:** Display active filters below search bar

---

### ReviewCard
```tsx
import { ReviewCard, RatingDisplay } from "@/components/molecules";

<ReviewCard review={reviewData} />

<RatingDisplay
  rating={4.9}
  reviewCount={127}
  size="md"
/>
```

**Features:**
- Star rating visualization
- Reviewer avatar
- Comment text
- Timestamp

---

### ImageCarousel
```tsx
import { ImageCarousel } from "@/components/molecules";

<ImageCarousel
  images={product.images}
  alt={product.title}
  zoomable
  showCounter
/>
```

**Features:**
- Swipe navigation
- Dot indicators
- Arrow buttons
- Full-screen zoom
- Image counter (1/8)

---

### ChatBubble
```tsx
import { ChatBubble } from "@/components/molecules";

<ChatBubble
  message="Da li je ovo još uvek dostupno?"
  timestamp={new Date()}
  isOwn={false}
  status="read"
/>
```

**Message Types:**
- User messages (isOwn: true/false)
- System messages (isSystem: true)
- With image attachments

---

### SellerInfo
```tsx
import { SellerInfo } from "@/components/molecules";

<SellerInfo
  seller={sellerData}
  onMessageClick={() => openChat()}
  onProfileClick={() => viewProfile()}
/>
```

**Features:**
- Seller avatar & username
- Rating display
- Response time indicator
- Stats (items for sale, sold, member since)
- Message and profile buttons

---

## 🏗️ ORGANISMS

### ProductGrid
```tsx
import { ProductGrid } from "@/components/organisms";

<ProductGrid
  products={productList}
  onFavoriteClick={(id) => toggleFavorite(id)}
  loading={false}
  emptyMessage="Nema dostupnih proizvoda"
/>
```

**Layout:**
- 2 columns on mobile
- 3 columns on tablet
- 4 columns on desktop
- Responsive gaps
- Loading skeletons
- Empty state

---

### FilterPanel
```tsx
import { FilterPanel } from "@/components/organisms";

// Desktop sidebar
<FilterPanel
  filters={activeFilters}
  onFiltersChange={(newFilters) => setFilters(newFilters)}
/>

// Mobile slide-out
<FilterPanel
  mobile
  isOpen={isFilterPanelOpen}
  onClose={() => setIsFilterPanelOpen(false)}
  filters={activeFilters}
  onFiltersChange={setFilters}
/>
```

**Filter Options:**
- Price range (min/max)
- Sizes (multi-select)
- Brands (checkboxes)
- Conditions (checkboxes)
- Colors (color swatches)
- Location

---

### Header
```tsx
import { Header } from "@/components/organisms";

<Header
  showSearch
  onFilterClick={() => setFiltersOpen(true)}
  onSearch={(q) => handleSearch(q)}
  user={currentUser}
  notificationCount={3}
/>
```

**Features:**
- Logo & branding
- Search bar (desktop full, mobile compact)
- Filter button (mobile)
- User avatar/login button
- Notification indicator

---

### BottomNavigation
```tsx
import { BottomNavigation } from "@/components/organisms";

<BottomNavigation messageCount={2} />
```

**Navigation Items:**
1. Početna (Home)
2. Pretraga (Search)
3. Prodaj (Sell) - center button
4. Poruke (Messages) - with badge
5. Profil (Profile)

**Mobile Only:** Hidden on desktop (md: breakpoint)

---

## 🎨 Design System Tokens

### Colors
```tsx
// Tailwind classes
bg-primary          // #E63946 - Primary red
bg-background       // #F8F9FA - Page background
bg-surface          // #FFFFFF - Cards
text-primary        // #212529 - Primary text
text-secondary      // #6C757D - Secondary text
text-tertiary       // #ADB5BD - Tertiary text

// Semantic
bg-semantic-success   // #28A745
bg-semantic-warning   // #FFC107
bg-semantic-error     // #DC3545
```

### Spacing
```tsx
gap-3              // 12px - Grid gap mobile
gap-4              // 16px - Grid gap desktop
p-4                // 16px - Standard padding
min-h-touch        // 44px - Touch target minimum
```

### Typography
```tsx
text-xs            // 12px
text-sm            // 14px
text-base          // 16px
text-lg            // 18px
text-xl            // 24px - Prices
text-2xl           // 32px - Page titles
```

---

## 📐 Layout Patterns

### Product Grid Layout
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### Two-Column Layout (Desktop Filters)
```tsx
<div className="flex gap-6">
  <aside className="hidden lg:block w-80 shrink-0">
    <FilterPanel />
  </aside>
  <div className="flex-1 min-w-0">
    <ProductGrid />
  </div>
</div>
```

### Responsive Container
```tsx
<div className="container mx-auto px-4 py-6">
  {/* Content */}
</div>
```

---

## 🔧 Utility Functions

### formatPrice
```tsx
import { formatPrice } from "@/lib/utils";

formatPrice(2500); // "2.500 RSD"
```

### formatRelativeTime
```tsx
import { formatRelativeTime } from "@/lib/utils";

formatRelativeTime(new Date()); // "Upravo sada"
formatRelativeTime(yesterday);  // "Pre 1 dana"
```

### cn (classnames utility)
```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)} />
```

---

## 📱 Responsive Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Mobile-First Pattern
```tsx
// Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns
className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
```

---

## ♿ Accessibility

All components follow WCAG 2.1 AA standards:

- ✅ Minimum touch targets: 44x44px
- ✅ Focus indicators on all interactive elements
- ✅ ARIA labels for icon buttons
- ✅ Semantic HTML (nav, main, aside)
- ✅ Color contrast ratios: 4.5:1 minimum

---

## 🚀 Performance Tips

1. **Images**: Use ProductImage component for automatic optimization
2. **Lazy Loading**: Off-screen products load as user scrolls
3. **Virtual Scrolling**: Implemented for long product lists
4. **Code Splitting**: Each page bundles only required components

---

## 📝 Type Definitions

```tsx
import type {
  ProductType,
  UserType,
  ReviewType,
  ConditionType,
  SizeType,
  CategoryType,
} from "@/lib/types";
```

All TypeScript types are fully documented in `/lib/types.ts`

---

**Last Updated:** January 2025
**Version:** MVP 1.0
