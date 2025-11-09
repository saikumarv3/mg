# R Design System - Stencil Web Components

Framework-agnostic design system using Stencil. Works with React, Angular, and Vue.

## 🚀 Quick Start

### Build
```bash
npm run build
```

### Development (Watch Mode)
```bash
npm run dev
```

## 📦 Components

All components use `r-` prefix:
- `r-button` - Button component
- `r-card` - Card component (coming soon)
- `r-dialog` - Dialog component (coming soon)
- `r-bar` - Progress bar (coming soon)
- `r-spinner` - Loading spinner (coming soon)

## 💻 Usage

### React
```jsx
import { RButton } from 'r-design-system/react';

<RButton variant="primary" onRClick={handleClick}>
  Click Me
</RButton>
```

### Angular
```html
<r-button variant="primary" (rClick)="handleClick()">
  Click Me
</r-button>
```

### Vanilla JS / Web Components
```html
<r-button variant="primary">
  Click Me
</r-button>

<script>
  document.querySelector('r-button').addEventListener('rClick', (e) => {
    console.log('Clicked!', e.detail);
  });
</script>
```

## 🎨 Design Tokens

All design tokens are CSS variables with `r-` prefix:
- `--r-color-primary`
- `--r-spacing-md`
- `--r-radius-lg`
- etc.

