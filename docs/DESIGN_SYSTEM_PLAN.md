# Design System Repository - Implementation Plan

## 🎯 Goal
Create a separate GitHub repository for a shared design system that all 40 apps will consume.

## 📋 Best Approach: NPM Package + Module Federation (Hybrid)

### Why This Approach?

1. **Separate Repository** ✅
   - Independent versioning
   - Separate CI/CD
   - Team ownership
   - Can be used outside micro-frontend architecture

2. **NPM Package** ✅
   - Standard consumption method
   - Version control
   - Easy updates (`npm install @your-org/design-system@latest`)
   - Works with any build tool

3. **Module Federation Support** ✅
   - Can also expose via Module Federation for runtime loading
   - Best of both worlds

## 🏗️ Architecture Options

### Option 1: Pure NPM Package (Recommended for Start)
```
design-system repo
├── src/
│   ├── components/
│   ├── tokens/ (colors, spacing, typography)
│   ├── hooks/
│   └── utils/
├── dist/ (built files)
├── package.json
└── README.md

Apps consume via:
import { Button, Card } from '@your-org/design-system';
```

**Pros:**
- Simple to start
- Standard approach
- Works everywhere
- Easy versioning

**Cons:**
- Bundled in each app (but shared React)
- Need to rebuild apps when updating

### Option 2: NPM Package + Module Federation (Advanced)
```
design-system repo
├── src/ (same as above)
├── webpack.config.js (Module Federation)
└── dist/
    ├── remoteEntry.js (for Module Federation)
    └── index.js (for NPM package)
```

**Pros:**
- Can use as NPM package OR Module Federation
- Runtime loading possible
- Flexible consumption

**Cons:**
- More complex setup
- Need to maintain both builds

### Option 3: Hybrid (Best Long-term)
- **Development**: NPM package (simple, fast)
- **Production**: Can switch to Module Federation if needed
- **Both builds**: Support both consumption methods

## 📦 Recommended Repository Structure

```
design-system/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml          # CI/CD pipeline
│   │   └── publish.yml     # Auto-publish on release
│   └── ISSUE_TEMPLATE/
│
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   ├── Button.test.js
│   │   │   └── index.js
│   │   ├── Card/
│   │   ├── Dialog/
│   │   ├── Spinner/
│   │   ├── Bar/
│   │   ├── Graph/
│   │   └── index.js        # Barrel export
│   │
│   ├── tokens/
│   │   ├── colors.js       # Color palette
│   │   ├── spacing.js      # Spacing scale
│   │   ├── typography.js   # Font sizes, weights
│   │   └── index.js
│   │
│   ├── hooks/
│   │   ├── useTheme.js
│   │   ├── useMediaQuery.js
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── classNames.js
│   │   └── index.js
│   │
│   └── index.js            # Main entry point
│
├── dist/                    # Built files (gitignored)
├── storybook/              # Component documentation
│   └── stories/
│
├── .storybook/              # Storybook config
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
├── package.json
├── webpack.config.js        # Build config
├── tsconfig.json           # If using TypeScript
├── README.md
└── CHANGELOG.md
```

## 🚀 Step-by-Step Implementation Plan

### Phase 1: Repository Setup (Week 1)

#### Step 1.1: Create GitHub Repository
```bash
# In GitHub
- Create new repo: design-system
- Set as private/public (your choice)
- Initialize with README
- Add .gitignore (Node, dist, etc.)
```

#### Step 1.2: Local Setup
```bash
# Clone and initialize
git clone https://github.com/your-org/design-system.git
cd design-system
npm init -y
```

#### Step 1.3: Package Configuration
```json
{
  "name": "@your-org/design-system",
  "version": "1.0.0",
  "description": "Shared design system for micro-frontend apps",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch",
    "storybook": "start-storybook -p 6006",
    "test": "jest",
    "lint": "eslint src",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-react": "^7.22.0",
    "babel-loader": "^9.1.3",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4"
  }
}
```

### Phase 2: Build Configuration (Week 1-2)

#### Step 2.1: Webpack Config
```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: 'DesignSystem',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
```

#### Step 2.2: Babel Config
```json
{
  "presets": [
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

### Phase 3: Design Tokens (Week 2)

#### Step 3.1: Create Token Files
```javascript
// src/tokens/colors.js
export const colors = {
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    // ... full scale
    900: '#1a237e',
  },
  secondary: { /* ... */ },
  neutral: { /* ... */ },
};

// src/tokens/spacing.js
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
};

// src/tokens/typography.js
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
};
```

### Phase 4: Core Components (Week 2-3)

#### Step 4.1: Create Base Components
Start with:
1. **Button** - Primary, secondary, variants
2. **Card** - Container component
3. **Dialog** - Modal dialogs
4. **Spinner** - Loading states
5. **Bar** - Progress bars
6. **Input** - Form inputs
7. **Typography** - Text components

#### Step 4.2: Component Structure
```javascript
// src/components/Button/Button.jsx
import React from 'react';
import { colors, spacing } from '../../tokens';
import './Button.css';

const Button = ({ 
  variant = 'primary',
  size = 'md',
  children,
  ...props 
}) => {
  return (
    <button 
      className={`ds-button ds-button--${variant} ds-button--${size}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Phase 5: Publishing Setup (Week 3)

#### Step 5.1: GitHub Packages Setup
```bash
# .npmrc (in design-system repo)
@your-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

#### Step 5.2: Package.json Updates
```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/design-system.git"
  }
}
```

#### Step 5.3: GitHub Actions Workflow
```yaml
# .github/workflows/publish.yml
name: Publish Package
on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          registry-url: 'https://npm.pkg.github.com'
          scope: '@your-org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Phase 6: Consumption in Apps (Week 4)

#### Step 6.1: Install in Apps
```bash
# In each app (app1, app2, etc.)
npm install @your-org/design-system@^1.0.0
```

#### Step 6.2: Use in Components
```javascript
// packages/app1/src/SomePage.jsx
import { Button, Card, Spinner } from '@your-org/design-system';

function SomePage() {
  return (
    <Card>
      <Button variant="primary">Click Me</Button>
      <Spinner size="large" />
    </Card>
  );
}
```

#### Step 6.3: Update Webpack (if needed)
```javascript
// Ensure React is shared
shared: {
  react: { singleton: true },
  'react-dom': { singleton: true },
  '@your-org/design-system': { singleton: true }, // Optional
}
```

## 📝 Versioning Strategy

### Semantic Versioning
- **Major** (2.0.0): Breaking changes
- **Minor** (1.1.0): New features, backward compatible
- **Patch** (1.0.1): Bug fixes

### Release Process
```bash
# 1. Make changes
git checkout -b feature/new-component

# 2. Update version
npm version patch|minor|major

# 3. Create GitHub release
git tag v1.0.1
git push --tags

# 4. GitHub Actions auto-publishes
```

## 🔄 Update Strategy for 40 Apps

### Option A: Gradual Updates (Recommended)
```bash
# Update one app at a time
cd packages/app1
npm install @your-org/design-system@latest
npm run build
# Test, then move to next app
```

### Option B: Batch Update Script
```bash
# scripts/update-design-system.js
const { execSync } = require('child_process');
const apps = ['app1', 'app2', 'app3', /* ... */];

apps.forEach(app => {
  console.log(`Updating ${app}...`);
  execSync(`npm install @your-org/design-system@latest --workspace=${app}`);
});
```

## 🎨 Design System Features

### Must-Have Components
1. **Layout**: Container, Grid, Stack
2. **Forms**: Input, Select, Checkbox, Radio
3. **Feedback**: Spinner, Alert, Toast
4. **Navigation**: Button, Link, Breadcrumb
5. **Data Display**: Card, Table, List
6. **Overlay**: Dialog, Modal, Tooltip

### Capacitor Integration
```javascript
// Components that use Capacitor
import { Haptics } from '@capacitor/haptics';

const Button = ({ onClick, ...props }) => {
  const handleClick = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
    onClick?.();
  };
  return <button onClick={handleClick} {...props} />;
};
```

## 📚 Documentation

### Storybook Setup
```bash
npm install -D @storybook/react
# Create stories for each component
# Host on GitHub Pages or Netlify
```

### README Structure
- Installation
- Quick Start
- Component API
- Design Tokens
- Contributing
- Changelog

## ✅ Checklist

### Repository Setup
- [ ] Create GitHub repository
- [ ] Initialize package.json
- [ ] Set up build configuration
- [ ] Configure GitHub Packages

### Development
- [ ] Create design tokens
- [ ] Build core components (10-15 components)
- [ ] Add TypeScript definitions (optional)
- [ ] Write component tests
- [ ] Set up Storybook

### Publishing
- [ ] Configure GitHub Actions
- [ ] Test publishing process
- [ ] Create first release (v1.0.0)
- [ ] Document installation

### Integration
- [ ] Test in one app (app1)
- [ ] Update all 40 apps
- [ ] Monitor for issues
- [ ] Create update guide

## 🚦 Next Steps

1. **Create the repository** in GitHub
2. **Set up basic structure** (this plan)
3. **Build 3-5 core components** first
4. **Publish v1.0.0** to GitHub Packages
5. **Test in one app** before rolling out
6. **Iterate and improve** based on feedback

## 💡 Pro Tips

1. **Start Small**: Build 5-10 essential components first
2. **Document Early**: Write docs as you build
3. **Version Carefully**: Use semantic versioning strictly
4. **Test Thoroughly**: Test in multiple apps before release
5. **Get Feedback**: Involve app teams early
6. **Maintain Changelog**: Keep track of all changes

---

**Ready to start?** Follow Phase 1 and create the repository structure!

