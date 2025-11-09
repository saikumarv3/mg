# Design System Implementation Prompt

## 🎯 Goal
Create a **framework-agnostic design system** using **Stencil + Ionic** that works with:
- ✅ React (current apps: App1, App2, Host)
- ✅ Angular (current app: App3)
- ✅ Vue (future apps)
- ✅ Capacitor integration (mobile features)

## 📊 Current State Analysis

### What We Have:
1. **React Apps**: Inline styles, duplicate button/card code
2. **Angular App**: SCSS styles, similar patterns
3. **Common Colors**: `#667eea` (primary), `#48bb78` (secondary)
4. **Common Patterns**: Cards, buttons, dialogs, progress bars
5. **Capacitor**: Already integrated, needs component-level support

### What We Need:
- Shared design tokens (colors, spacing, typography)
- Reusable components (Button, Card, Dialog, Bar, Spinner)
- Framework wrappers (React, Angular, Vue)
- Capacitor integration (Haptics, etc.)
- Mobile-first design (Ionic)

## 🏗️ Recommended Architecture: Stencil

### Why Stencil?
- ✅ **Framework Agnostic**: One codebase → React, Angular, Vue
- ✅ **Ionic Integration**: Built by Ionic team, perfect for Capacitor
- ✅ **Web Components**: Future-proof, native browser support
- ✅ **Type Safe**: TypeScript first
- ✅ **Small Bundle**: Tree-shakeable, efficient

### Structure:
```
design-system/
├── src/components/        # Stencil web components
│   ├── my-button/
│   ├── my-card/
│   ├── my-dialog/
│   ├── my-bar/
│   └── my-spinner/
├── src/tokens/            # Design tokens (CSS variables)
├── react/                 # React wrappers
├── angular/               # Angular wrappers
├── vue/                   # Vue wrappers
└── dist/                  # Compiled web components
```

## 📋 Implementation Steps

### Step 1: Setup (Week 1)
```bash
# Create repo
git clone https://github.com/your-org/design-system.git

# Initialize Stencil
npm init stencil component design-system

# Install Ionic
npm install @ionic/core @stencil/core
```

### Step 2: Design Tokens (Week 1-2)
Extract from current apps:
- **Colors**: `#667eea` (primary), `#48bb78` (secondary), grays
- **Spacing**: `1rem`, `1.5rem`, `2rem` → CSS variables
- **Typography**: Font sizes, weights
- **Border Radius**: `6px`, `8px`, `12px`
- **Shadows**: Current shadow patterns

### Step 3: Core Components (Week 2-3)
Build with Stencil:
1. **Button** - Primary, secondary variants, sizes
2. **Card** - Container with header/footer slots
3. **Dialog** - Modal with Ionic integration
4. **Bar** - Progress/status bars
5. **Spinner** - Loading indicators
6. **ButtonHaptic** - Button with Capacitor haptics

### Step 4: Framework Wrappers (Week 3-4)
- React: `@stencil/react-output-target`
- Angular: `@stencil/angular-output-target`
- Vue: Auto-registration

### Step 5: Publish & Integrate (Week 4)
- Publish to GitHub Packages
- Test in App1 (React)
- Test in App3 (Angular)
- Create migration guide

## 🎨 Design Tokens (Based on Current Code)

```css
:root {
  /* Colors - From your apps */
  --color-primary: #667eea;
  --color-primary-dark: #5568d3;
  --color-secondary: #48bb78;
  --color-secondary-dark: #38a169;
  
  /* Grays - From your apps */
  --color-gray-50: #f7fafc;
  --color-gray-100: #edf2f7;
  --color-gray-200: #e2e8f0;
  --color-gray-500: #718096;
  --color-gray-700: #2d3748;
  
  /* Spacing - From your apps */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;    /* 16px */
  --spacing-lg: 1.5rem;  /* 24px */
  --spacing-xl: 2rem;    /* 32px */
  
  /* Border Radius - From your apps */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  
  /* Shadows - From your apps */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);
}
```

## 💻 Usage Examples

### React (App1, App2, Host)
```jsx
import { MyButton, MyCard } from '@your-org/design-system/react';
import '@your-org/design-system/dist/my-design-system.css';

<MyCard>
  <MyButton variant="primary" onClick={handleClick}>
    Click Me
  </MyButton>
</MyCard>
```

### Angular (App3)
```typescript
// Import in module
import '@your-org/design-system/dist/my-design-system.css';

// Use in template
<my-card>
  <my-button variant="primary" (myClick)="handleClick()">
    Click Me
  </my-button>
</my-card>
```

### Vue (Future)
```vue
<template>
  <my-card>
    <my-button variant="primary" @myClick="handleClick">
      Click Me
    </my-button>
  </my-card>
</template>
```

## ✅ Benefits

1. **One Codebase** → All Frameworks
2. **Ionic Integration** → Mobile-first, Capacitor ready
3. **Future-Proof** → Web Components standard
4. **Scalable** → Works with 40+ apps
5. **Type Safe** → TypeScript everywhere
6. **Small Bundle** → Tree-shakeable

## 🚀 Quick Start Command

```bash
# 1. Create repo and initialize
npm init stencil component design-system

# 2. Install dependencies
npm install @ionic/core @stencil/core

# 3. Start building components
# Follow the comprehensive plan in DESIGN_SYSTEM_COMPREHENSIVE_PLAN.md
```

## 📚 Full Documentation

See `DESIGN_SYSTEM_COMPREHENSIVE_PLAN.md` for:
- Complete code examples
- Stencil configuration
- Component implementations
- Framework wrapper setup
- Publishing guide

---

**This approach gives you everything you need:**
- ✅ React + Ionic support (now)
- ✅ Angular support (now)
- ✅ Vue support (future)
- ✅ Capacitor integration
- ✅ Scalable to 40+ apps
- ✅ One codebase, all frameworks

