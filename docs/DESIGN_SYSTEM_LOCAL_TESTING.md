# Design System - Local Testing Approach

## 🎯 Strategy: Test Locally First, Then Extract

**Approach**: Create shared folder in monorepo → Build components → Test in apps → Move to separate repo later

## 📁 Recommended Structure

```
mg/
├── packages/
│   ├── host/
│   ├── app1/
│   ├── app2/
│   ├── app3/
│   └── shared-ui/          ← NEW: Design system (local testing)
│       ├── src/
│       │   ├── components/
│       │   │   ├── Button/
│       │   │   ├── Card/
│       │   │   ├── Dialog/
│       │   │   ├── Bar/
│       │   │   ├── Spinner/
│       │   │   └── ...
│       │   ├── tokens/
│       │   └── index.js
│       ├── dist/
│       ├── package.json
│       └── webpack.config.js
└── package.json
```

## 🚀 Step-by-Step Setup

### Step 1: Create Shared UI Package

```bash
# Create folder
mkdir packages/shared-ui
cd packages/shared-ui

# Initialize package
npm init -y
```

### Step 2: Package.json Setup

```json
{
  "name": "shared-ui",
  "version": "1.0.0",
  "private": true,
  "main": "dist/index.js",
  "scripts": {
    "dev": "webpack --mode development --watch",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-react": "^7.22.0",
    "babel-loader": "^9.1.3",
    "css-loader": "^7.1.2",
    "style-loader": "^4.0.0",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4"
  }
}
```

### Step 3: Webpack Config (Simple Build)

```javascript
// packages/shared-ui/webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: 'SharedUI',
      type: 'umd',
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

### Step 4: Create Design Tokens

```javascript
// packages/shared-ui/src/tokens/index.js
export const tokens = {
  colors: {
    primary: '#667eea',
    primaryDark: '#5568d3',
    secondary: '#48bb78',
    secondaryDark: '#38a169',
    gray50: '#f7fafc',
    gray100: '#edf2f7',
    gray200: '#e2e8f0',
    gray500: '#718096',
    gray700: '#2d3748',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },
};
```

### Step 5: Build Components (8-10 Components)

Start with these essential components:

1. **Button** - Primary, secondary, sizes
2. **Card** - Container component
3. **Dialog** - Modal dialogs
4. **Bar** - Progress bars
5. **Spinner** - Loading indicators
6. **Input** - Form inputs
7. **Alert** - Notification messages
8. **Badge** - Status badges
9. **Avatar** - User avatars
10. **Container** - Layout container

## 📦 Usage in Apps

### Option A: Direct Import (Simple)

```javascript
// In app1/src/WelcomePage.jsx
import { Button, Card } from '../../shared-ui/src/components';
// Or after build:
import { Button, Card } from 'shared-ui';
```

### Option B: Workspace Reference

Update app's package.json:
```json
{
  "dependencies": {
    "shared-ui": "workspace:*"
  }
}
```

Then use:
```javascript
import { Button, Card } from 'shared-ui';
```

## 🔄 Testing Workflow

1. **Build shared-ui**: `npm run build --workspace=shared-ui`
2. **Use in app1**: Import and test
3. **Iterate**: Fix issues, rebuild
4. **Test in app3**: Test Angular compatibility
5. **Refine**: Based on feedback

## ✅ Benefits of This Approach

1. **Fast Iteration** - No publishing needed
2. **Easy Testing** - Test in real apps immediately
3. **No External Dependencies** - Everything local
4. **Quick Refactoring** - Change and test instantly
5. **Team Collaboration** - Everyone can see changes

## 🚀 Migration Path (Later)

Once components are tested and working:

1. **Extract to Separate Repo**
   ```bash
   # Create new repo
   git clone https://github.com/your-org/design-system.git
   
   # Copy packages/shared-ui/* to new repo
   # Update package.json name to @your-org/design-system
   # Publish to GitHub Packages
   ```

2. **Update Apps**
   ```bash
   # Remove local reference
   npm uninstall shared-ui
   
   # Install from registry
   npm install @your-org/design-system@^1.0.0
   ```

## 📋 Quick Start Checklist

- [ ] Create `packages/shared-ui/` folder
- [ ] Initialize package.json
- [ ] Set up webpack config
- [ ] Create design tokens
- [ ] Build first component (Button)
- [ ] Test in App1
- [ ] Build remaining components
- [ ] Test in all apps
- [ ] Document components
- [ ] Plan extraction to separate repo

---

**This approach lets you:**
- ✅ Test components in real apps
- ✅ Iterate quickly
- ✅ No publishing overhead
- ✅ Easy to extract later
- ✅ Team can collaborate easily

