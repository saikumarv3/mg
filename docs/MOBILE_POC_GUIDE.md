# Mobile POC Guide - Capacitor Integration

## What We Can Implement for POC

### ✅ Already Implemented:
1. **Mobile Build Configuration** (`webpack.mobile.config.js`)
   - Bundles all apps locally (no servers needed)
   - Copies remoteEntry.js files to host app

2. **Capacitor Configuration** (`capacitor.config.js`)
   - App ID: `com.microfrontend.app`
   - App Name: `MicroFrontend App`
   - Web directory: `dist`

3. **Build Script** (`scripts/build-mobile.js`)
   - Automatically builds all apps
   - Copies remoteEntry.js files
   - Prepares for Capacitor sync

### 🚀 Quick Start for POC

#### Step 1: Install Dependencies
```bash
npm install
```

#### Step 2: Build for Mobile
```bash
npm run build:mobile
```

This will:
- Build App1, App2, and App3
- Copy all remoteEntry.js files to host
- Build host app with mobile config

#### Step 3: Initialize Capacitor (First Time Only)
```bash
cd packages/host
npx cap init
```

When prompted:
- App name: `MicroFrontend App`
- App ID: `com.microfrontend.app`
- Web dir: `dist`

#### Step 4: Sync with Native Projects
```bash
npx cap sync
```

#### Step 5: Open in Native IDE
```bash
# For iOS (requires macOS)
npx cap open ios

# For Android
npx cap open android
```

### 📱 What Works on Mobile

1. **All Apps Bundled Locally**
   - No network requests needed
   - Works completely offline
   - Fast loading

2. **Module Federation Works**
   - App1, App2, App3 load from local bundle
   - No iframe needed (can be removed for mobile)
   - All apps share React dependencies

3. **Cross-App Communication**
   - `window.postMessage` still works
   - `CustomEvents` work
   - Message bridge not needed (same window)

### 🔧 POC Features to Test

1. **Navigation**
   - Navigate between Welcome → Home → Dashboard
   - All apps load from local bundle

2. **Message Passing**
   - Send messages between apps
   - Verify cross-app communication works

3. **Counter Updates**
   - Increment counters in each app
   - Verify events propagate

4. **Offline Mode**
   - Test with airplane mode on
   - All apps should still work

### 🎯 Optional Enhancements for POC

1. **Native Features**
   ```bash
   npm install @capacitor/camera
   npm install @capacitor/geolocation
   ```
   - Add camera access
   - Add location services

2. **Performance Monitoring**
   - Add loading time tracking
   - Monitor bundle sizes

3. **Error Handling**
   - Add error boundaries
   - Show user-friendly error messages

### 📝 Notes

- **Angular App**: Currently uses iframe in web, but for mobile can be loaded directly
- **Bundle Size**: All apps bundled together - check total size
- **Performance**: Should be faster than web (no network latency)

### 🐛 Troubleshooting

**Issue**: "Module not found" errors
- **Solution**: Run `npm run build:mobile` again

**Issue**: Capacitor sync fails
- **Solution**: Make sure `dist` folder exists in `packages/host`

**Issue**: Apps not loading on mobile
- **Solution**: Check that remoteEntry.js files are in `packages/host/public/remoteEntries/`

### ✅ Success Criteria for POC

- [x] All apps build successfully
- [x] Mobile build script works
- [x] Capacitor config created
- [ ] App runs on iOS simulator
- [ ] App runs on Android emulator
- [ ] All three apps load correctly
- [ ] Navigation works between apps
- [ ] Cross-app communication works
- [ ] App works offline

