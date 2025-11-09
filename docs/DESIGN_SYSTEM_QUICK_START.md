# Design System - Quick Start Guide

## 🎯 TL;DR - What You're Building

A **separate GitHub repository** that publishes an **NPM package** containing React components. All 40 apps install it via `npm install @your-org/design-system`.

## 📦 Repository Structure (Minimal Start)

```
design-system/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   └── index.js
│   │   └── index.js
│   ├── tokens/
│   │   ├── colors.js
│   │   └── index.js
│   └── index.js
├── dist/              # Built files (gitignored)
├── package.json
├── webpack.config.js
└── README.md
```

## 🚀 5-Minute Setup

### 1. Create GitHub Repo
```bash
# On GitHub
- New repository: design-system
- Private/Public: Your choice
- Initialize with README: Yes
```

### 2. Clone and Initialize
```bash
git clone https://github.com/your-org/design-system.git
cd design-system
npm init -y
```

### 3. Install Dependencies
```bash
npm install --save-dev \
  webpack webpack-cli \
  babel-loader @babel/core @babel/preset-react \
  css-loader style-loader

npm install --save-peer react react-dom
```

### 4. Create Basic package.json
```json
{
  "name": "@your-org/design-system",
  "version": "1.0.0",
  "main": "dist/index.js",
  "files": ["dist"],
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### 5. Create webpack.config.js
```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: 'DesignSystem',
      type: 'umd',
    },
    globalObject: 'this',
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
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
};
```

### 6. Create First Component
```javascript
// src/components/Button/Button.jsx
import React from 'react';
import './Button.css';

export const Button = ({ children, variant = 'primary', ...props }) => {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
};

// src/components/Button/index.js
export { Button } from './Button';

// src/components/index.js
export { Button } from './Button';

// src/index.js
export * from './components';
```

### 7. Build
```bash
npm run build
```

### 8. Publish to GitHub Packages
```bash
# Create .npmrc
echo "@your-org:registry=https://npm.pkg.github.com" > .npmrc

# Publish
npm publish
```

## 📥 Using in Your Apps

### 1. Install in App
```bash
cd packages/app1
npm install @your-org/design-system@^1.0.0
```

### 2. Use Component
```javascript
import { Button } from '@your-org/design-system';

function MyPage() {
  return <Button variant="primary">Click Me</Button>;
}
```

## 🔄 Update Process

```bash
# 1. Update design-system repo
# 2. Bump version
npm version patch

# 3. Publish
npm publish

# 4. Update apps
cd packages/app1
npm install @your-org/design-system@latest
```

## ✅ That's It!

You now have a design system that:
- ✅ Lives in separate repo
- ✅ Published to GitHub Packages
- ✅ Can be used in all 40 apps
- ✅ Version controlled
- ✅ Easy to update

See `DESIGN_SYSTEM_PLAN.md` for detailed implementation guide.

