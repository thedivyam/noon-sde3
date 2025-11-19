# Noon Quick-Commerce App

A React Native mobile application built with Expo for browsing and purchasing starships from the Star Wars API.

## Features

### UI/UX
- Design system with consistent colors, typography, spacing, and shadows
- Gradient backgrounds and rounded cards
- Skeleton loaders for loading states
- Haptic feedback and animations
- Optimized FlatList rendering

### Shopping
- Browse starships from SWAPI
- Real-time search with debouncing and request cancellation
- Persistent cart using AsyncStorage
- Sticky cart indicator with item count and total
- Order confirmation bottom sheet
- Toast notifications for user feedback

### Technical
- TypeScript with full type safety
- Error boundaries for error handling
- Centralized API service layer
- Utility functions for calculations and formatting
- Performance optimizations with memoization
- Clean architecture and code structure

## Project Structure

```
noon-sde3/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Home screen
│   │   ├── search.tsx       # Search screen
│   │   └── cart.tsx         # Cart screen
│   └── _layout.tsx          # Root layout
├── components/              # Reusable components
│   ├── ui/                  # UI primitives
│   │   ├── BottomSheet.tsx
│   │   ├── GradientView.tsx
│   │   ├── Header.tsx
│   │   └── SkeletonLoader.tsx
│   ├── AnimatedButton.tsx   # Animated button with haptics
│   ├── CartIndicator.tsx    # Sticky cart button
│   └── StarshipCard.tsx        # Product card component
├── constants/               # Design system
│   ├── design.ts            # Colors, spacing, typography, shadows
│   └── theme.ts             # Navigation theme
├── context/                 # State management
│   └── CartContext.tsx      # Cart state with persistence
├── services/                # API layer
│   └── api.ts               # SWAPI service
├── utils/                   # Utility functions
│   ├── calculations.ts      # Price calculations
│   └── formatting.ts       # Text/price formatting
└── types/                   # TypeScript definitions
```

## Design System

The app uses a centralized design system defined in `constants/design.ts`:
- Colors: Primary green (#00B761), accent orange (#FF6B35), and theme-aware variants
- Typography: Font sizes from xs (12) to 4xl (36), weights from normal to extrabold
- Spacing: Scale from xs (4px) to 3xl (64px)
- Shadows: Four levels (sm, md, lg, xl) with primary-colored variants

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

```bash
npm install
npx expo start
```

## Screens

- **Home**: Displays all starships from SWAPI with pull-to-refresh
- **Search**: Real-time search with 400ms debounce and request cancellation
- **Cart**: Persistent cart with quantity controls, payment selection, and order confirmation

## Technologies

- Expo SDK 54
- React Native 0.81
- Expo Router for navigation
- React Native Reanimated for animations
- TypeScript for type safety

## Performance

- Optimized FlatList with `removeClippedSubviews` and `getItemLayout`
- Memoization with `useMemo` and `useCallback`
- Request cancellation with AbortController
- Image optimization with Expo Image

## Assignment Requirements

- Home screen with starships list
- Search screen with live search
- Cart screen with payment and order summary
- Data from SWAPI
- Price conversion: 1 AED = 10,000 space credits
- Placeholder images from picsum.photos
- Three tabs navigation
