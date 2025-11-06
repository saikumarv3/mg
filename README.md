# Micro-Frontend Application with Module Federation

A micro-frontend application using Webpack Module Federation, featuring:
- **Host App** (React) - Main container app
- **App1** (React) - Welcome page
- **App2** (React) - Home page  
- **App3** (Angular) - Dashboard page

## Quick Start

### Install Dependencies
```bash
npm install
```

### Development
Run all apps concurrently:
```bash
npm run dev
```

This will start:
- Host app: http://localhost:3000
- App1: http://localhost:3001
- App2: http://localhost:3002
- App3: http://localhost:3003

### Build
```bash
npm run build
```

### Mobile Build (Capacitor)
```bash
npm run build:mobile
cd packages/host
npx cap sync
npx cap open ios    # or android
```

## Architecture

- **Module Federation**: Enables runtime code sharing between apps
- **Cross-App Communication**: Uses `window.postMessage` and `CustomEvents`
- **Multi-Framework**: React and Angular working together
- **Mobile Ready**: Capacitor integration for iOS/Android

## Project Structure

```
├── packages/
│   ├── host/        # Host React app
│   ├── app1/        # React welcome page
│   ├── app2/        # React home page
│   └── app3/        # Angular dashboard
└── scripts/         # Build scripts
```

