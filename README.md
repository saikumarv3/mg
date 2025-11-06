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
# Build all apps for mobile
npm run build:mobile

# Navigate to host app
cd packages/host

# Initialize Capacitor (first time only)
npx cap init

# Add platforms
npx cap add android
# npx cap add ios  # macOS only

# Sync with native projects
npx cap sync

# Open in native IDE
npx cap open android  # or ios
```

**See `MOBILE_BUILD_GUIDE.md` for detailed instructions!**

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

