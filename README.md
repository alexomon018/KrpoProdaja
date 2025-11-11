# Krpo Prodaja - Serbian Fashion Resale Marketplace

A modern, mobile-first fashion resale marketplace built with Next.js 15, following atomic design principles and inspired by successful platforms like Vinted, Depop, and Poshmark.

## 🏗️ Architecture

### Atomic Design Pattern

This project follows atomic design methodology for maximum reusability and maintainability:

```
components/
├── atoms/          # Basic building blocks
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── ProductImage.tsx
│   ├── Typography.tsx
│   └── Icon.tsx
├── molecules/      # Simple component groups
│   ├── ProductCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterChip.tsx
│   ├── ReviewCard.tsx
│   ├── ImageCarousel.tsx
│   ├── ChatBubble.tsx
│   └── SellerInfo.tsx
└── organisms/      # Complex component assemblies
    ├── ProductGrid.tsx
    ├── FilterPanel.tsx
    ├── Header.tsx
    └── BottomNavigation.tsx
```

## 🎨 Design System

### Color Palette

```css
Primary:     #E63946  /* Energetic red for CTAs */
Background:  #F8F9FA  /* Clean, light background */
Surface:     #FFFFFF  /* Cards and elevated elements */
Text:        #212529  /* Primary text */
```

### Typography

- **Font**: Inter (with Cyrillic support)
- **Scale**: 12px, 14px, 16px, 18px, 24px, 32px
- **Line heights**: Optimized for readability

### Spacing

- Touch targets: Minimum 44x44px (mobile accessibility)
- Grid gap: 12px mobile, 16px desktop
- Safe areas: Proper handling of notches and home indicators

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Features

### MVP Phase 1 (Current)

✅ Homepage with product grid
✅ Clean, Vinted-style card design
✅ Mobile-first responsive layout
✅ Search functionality
✅ Advanced filtering system
✅ Bottom tab navigation (mobile)
✅ Design system with reusable components

### Upcoming Features

- Product detail pages
- Listing creation flow (5-step wizard)
- User authentication
- Messaging system
- Payment integration
- User profiles and reviews

## 🧩 Key Components

### Atoms

- **Button**: Primary, secondary, ghost variants with loading states
- **Input**: Form fields with label, error states, icon support
- **Badge**: Condition badges, size badges, status indicators
- **Avatar**: User profile pictures with fallback to initials
- **ProductImage**: Optimized images with WebP support
- **Typography**: Consistent text hierarchy

### Molecules

- **ProductCard**: Grid item showing product image, price, seller info
- **SearchBar**: Auto-complete search with suggestions
- **FilterChip**: Dismissible active filter indicators
- **ReviewCard**: Star ratings and user reviews
- **ImageCarousel**: Swipeable product image gallery
- **ChatBubble**: Message bubbles for chat interface
- **SellerInfo**: Seller profile with trust indicators

### Organisms

- **ProductGrid**: Responsive grid layout (2/3/4 columns)
- **FilterPanel**: Comprehensive filtering (desktop sidebar, mobile slide-out)
- **Header**: Logo, search, user menu, notifications
- **BottomNavigation**: Mobile tab bar (5 main actions)

## 🌍 Localization

Primary language: **Serbian** (Srpski)

- Support for both Cyrillic and Latin scripts
- Currency: RSD (Serbian Dinar)
- Date formats: SR-RS locale
- Size standards: European sizing

## 🎯 Design Decisions

### Why Vinted's Approach?

1. **Practical over trendy** - Better fit for Serbian market
2. **Transaction-focused** - Not social media
3. **Faster to build** - Simpler components
4. **Easier moderation** - Less user-generated content

### Mobile-First Strategy

- Bottom tab navigation (standard in marketplace apps)
- Touch-optimized targets (min 44x44px)
- Swipe gestures for carousels
- Responsive images with proper sizing

### Performance Optimizations

- Next.js 15 with Turbopack
- Image optimization (WebP format)
- Virtual scrolling for long lists
- Lazy loading for off-screen content

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Component Variants**: Class Variance Authority (CVA)
- **Utilities**: clsx, tailwind-merge

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a solo project. Not accepting external contributions at this time.

---

**Built with ❤️ for the Serbian fashion community**
