# Responsive Design Guide

## Breakpoints

The site uses Tailwind's default breakpoints:

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

## Mobile-First Approach

All styles are mobile-first. Desktop styles are added using breakpoint prefixes:

```jsx
// Mobile: padding 4, Desktop: padding 8
className="px-4 lg:px-8"

// Mobile: text base, Desktop: text xl
className="text-base lg:text-xl"
```

## Touch Targets

All interactive elements have minimum 44x44px touch targets on mobile:

```jsx
// Buttons
className="min-h-[44px] sm:min-h-0"

// Links in mobile menu
className="min-h-[44px] flex items-center"
```

## Responsive Patterns

### Stacking on Mobile
```jsx
// Stack vertically on mobile, horizontal on desktop
className="flex flex-col sm:flex-row"
```

### Grid Layouts
```jsx
// 1 column mobile, 2 tablet, 3 desktop
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
```

### Spacing
```jsx
// Tighter spacing on mobile
className="gap-4 sm:gap-6 lg:gap-8"
className="py-12 sm:py-16 lg:py-24"
```

### Typography
```jsx
// Smaller text on mobile
className="text-sm sm:text-base lg:text-lg"
className="text-2xl sm:text-3xl lg:text-4xl"
```

## Performance Optimizations

### Reduced Animations on Mobile
- Blur effects reduced from 120px to 40px
- Float animations slowed from 20s to 30s
- Smoother transitions (200ms instead of 300ms)

### Code Splitting
- React vendor bundle separate
- UI vendor bundle (framer-motion, lucide-react)
- Route-based lazy loading

### Build Optimizations
- Terser minification
- Console.log removal in production
- Optimized chunk sizes

## Component-Specific Notes

### Navbar
- Height: 80px mobile → 96px desktop
- Logo: 32px mobile → 40px desktop
- Mobile menu: Full-screen overlay with smooth animation

### Footer
- Padding: 48px mobile → 96px desktop
- Grid: 1 column mobile → 2 tablet → 12-column desktop
- Newsletter: Stacked mobile → inline desktop

### Buttons
- Padding: 12px mobile → 10px desktop
- Touch targets: 44px minimum on mobile
- Full width on mobile where appropriate

## Testing Checklist

- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1280px+)

## Common Issues & Solutions

### Text Overflow
```jsx
// Use truncate or break-all
className="truncate" // Single line with ellipsis
className="break-all" // Break long words
```

### Images
```jsx
// Responsive images
className="w-full h-auto"
// Maintain aspect ratio
className="aspect-video object-cover"
```

### Containers
```jsx
// Max width with responsive padding
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```
