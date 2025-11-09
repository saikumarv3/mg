# Stencil Setup Guide

## 🚀 Initial Setup

### Step 1: Install Dependencies
```bash
cd packages/r-design-system
npm install
```

### Step 2: Build
```bash
npm run build
```

This will:
- Compile Stencil components to Web Components
- Generate React wrappers in `react/` folder
- Generate Angular wrappers in `angular/` folder
- Create `dist/` with compiled components

## 📁 Generated Folders

After first build, you'll see:
```
r-design-system/
├── dist/                    # Compiled web components
├── react/                   # React wrappers (auto-generated)
│   └── src/
│       └── components/
│           └── stencil-generated/
└── angular/                 # Angular wrappers (auto-generated)
    └── src/
        └── directives/
            └── proxies.ts
```

## 🔧 Usage in Apps

### React Apps (App1, App2, Host)

After building, you can use:

```jsx
// Import React wrapper
import { RButton } from '../../r-design-system/react/src/components/stencil-generated';

// Or import directly (web component)
import '../../r-design-system/dist/r-design-system/r-design-system.js';

// Use in component
<RButton variant="primary" onRClick={handleClick}>
  Click Me
</RButton>
```

### Angular App (App3)

```typescript
// Import in app.module.ts
import { defineCustomElements } from '../../r-design-system/loader';
defineCustomElements();

// Use in template
<r-button variant="primary" (rClick)="handleClick()">
  Click Me
</r-button>
```

## 🎯 Component Naming

All components use `r-` prefix:
- `r-button` ✅
- `r-card` (coming soon)
- `r-dialog` (coming soon)
- `r-bar` (coming soon)
- `r-spinner` (coming soon)

## 📝 Next Steps

1. Build: `npm run build`
2. Test in App1 (React)
3. Test in App3 (Angular)
4. Add more components (Card, Dialog, etc.)

