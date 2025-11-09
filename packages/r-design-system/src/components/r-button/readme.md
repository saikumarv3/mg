# r-button

Button component with variants and sizes.

## Usage

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

### Web Component
```html
<r-button variant="primary">
  Click Me
</r-button>
```

## Properties

| Property | Attribute | Description | Type | Default |
|----------|-----------|-------------|------|---------|
| `disabled` | `disabled` | Disabled state | `boolean` | `false` |
| `size` | `size` | Button size | `"lg" \| "md" \| "sm"` | `"md"` |
| `type` | `type` | Button type | `"button" \| "reset" \| "submit"` | `"button"` |
| `variant` | `variant` | Button variant | `"outline" \| "primary" \| "secondary"` | `"primary"` |

## Events

| Event | Description | Type |
|-------|-------------|------|
| `rClick` | Emitted when button is clicked | `CustomEvent<MouseEvent>` |

