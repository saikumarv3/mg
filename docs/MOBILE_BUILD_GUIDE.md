# Mobile Build Guide - Run on Your Phone

## 📱 How It Works

### **Architecture:**
```
Your Phone
  └── Capacitor App (Native Container)
      └── Host App (Bundled)
          ├── App1 (Bundled - remoteEntry.js)
          ├── App2 (Bundled - remoteEntry.js)
          └── App3 (Bundled - remoteEntry.js)
```

**Key Points:**
- All apps are bundled into ONE mobile app
- No servers needed - everything runs locally
- Capacitor provides native bridge for device features
- Works offline (no internet required)

---

## 🚀 Step-by-Step Build Process

### **Step 1: Install Dependencies**

```bash
# From root directory
npm install
```

This installs all dependencies for all apps.

---

### **Step 2: Build All Apps for Mobile**

```bash
# Build all apps and prepare for mobile
npm run build:mobile
```

**What this does:**
1. Builds App1 → `packages/app1/dist/`
2. Builds App2 → `packages/app2/dist/`
3. Builds App3 → `packages/app3/dist/`
4. Copies `remoteEntry.js` files to Host app
5. Builds Host app → `packages/host/dist/`

**Output:**
- All apps bundled in `packages/host/dist/`
- Ready for Capacitor

---

### **Step 3: Initialize Capacitor (First Time Only)**

```bash
cd packages/host
npx cap init
```

**When prompted, enter:**
- **App name:** `MicroFrontend App`
- **App ID:** `com.microfrontend.app`
- **Web dir:** `dist`

**What this does:**
- Creates native iOS and Android projects
- Sets up Capacitor configuration

---

### **Step 4: Add Platforms**

```bash
# Add iOS platform (macOS only)
npx cap add ios

# Add Android platform
npx cap add android
```

**What this does:**
- Creates `ios/` folder (iOS project)
- Creates `android/` folder (Android project)

---

### **Step 5: Sync with Native Projects**

```bash
npx cap sync
```

**What this does:**
- Copies `dist/` folder to native projects
- Updates native project files
- Syncs Capacitor plugins

---

### **Step 6: Open in Native IDE**

#### **For Android:**
```bash
npx cap open android
```

This opens Android Studio where you can:
1. Connect your phone via USB
2. Enable USB debugging on your phone
3. Click "Run" button in Android Studio
4. App installs on your phone!

#### **For iOS (macOS only):**
```bash
npx cap open ios
```

This opens Xcode where you can:
1. Connect your iPhone via USB
2. Select your device in Xcode
3. Click "Run" button
4. App installs on your iPhone!

---

## 📋 Complete Build Script

```bash
# 1. Install dependencies
npm install

# 2. Build for mobile
npm run build:mobile

# 3. Navigate to host
cd packages/host

# 4. Initialize (first time only)
npx cap init

# 5. Add platforms
npx cap add android
# npx cap add ios  # macOS only

# 6. Sync
npx cap sync

# 7. Open in IDE
npx cap open android
# or
npx cap open ios
```

---

## 🔧 Android Setup (Detailed)

### **Prerequisites:**
1. **Install Android Studio:** https://developer.android.com/studio
2. **Enable USB Debugging on Phone:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go to Settings → Developer Options
   - Enable "USB Debugging"

### **Steps:**
1. Run: `npm run build:mobile`
2. Run: `cd packages/host`
3. Run: `npx cap sync`
4. Run: `npx cap open android`
5. In Android Studio:
   - Wait for Gradle sync to finish
   - Connect your phone via USB
   - Click "Run" button (green play icon)
   - Select your phone from device list
   - App installs and runs!

---

## 🔧 iOS Setup (macOS Only)

### **Prerequisites:**
1. **Install Xcode:** From App Store
2. **Apple Developer Account:** (Free for testing)
3. **Connect iPhone via USB**

### **Steps:**
1. Run: `npm run build:mobile`
2. Run: `cd packages/host`
3. Run: `npx cap sync`
4. Run: `npx cap open ios`
5. In Xcode:
   - Select your iPhone as target device
   - Sign in with Apple ID (for code signing)
   - Click "Run" button
   - App installs and runs!

---

## 📱 How It Works on Mobile

### **When You Build:**
```
1. All Apps Built → Individual bundles
2. remoteEntry.js files copied → Host app
3. Host app bundled → Single dist/ folder
4. Capacitor sync → Copies dist/ to native projects
5. Native projects → Compiled into .apk (Android) or .ipa (iOS)
6. Install on phone → App runs!
```

### **On Your Phone:**
```
Phone App
  ├── Native Container (Capacitor)
  │   ├── Loads index.html from dist/
  │   ├── Provides native bridge
  │   └── Handles device features
  │
  └── Host App (Web Content)
      ├── App1 (Loaded from local bundle)
      ├── App2 (Loaded from local bundle)
      └── App3 (Loaded from local bundle)
```

### **Capacitor Features:**
- **Device Info** → Works! Shows real device info
- **Haptics** → Works! Phone vibrates
- **App Info** → Works! Shows app version
- **All features** → Work natively!

---

## 🐛 Troubleshooting

### **Issue: Build fails**
```bash
# Clean and rebuild
cd packages/host
rm -rf dist
cd ../..
npm run build:mobile
```

### **Issue: Android Studio not detecting phone**
- Enable USB debugging on phone
- Install USB drivers (if needed)
- Try different USB cable/port
- Restart Android Studio

### **Issue: App not installing**
- Check device is unlocked
- Allow USB debugging prompt on phone
- Check device is selected in IDE

### **Issue: Capacitor sync fails**
```bash
# Re-sync
cd packages/host
npx cap sync
```

---

## ✅ Quick Test Checklist

After building and installing:

- [ ] App opens on phone
- [ ] Navigate between Welcome → Home → Dashboard
- [ ] Device Info shows (App1) - real device info!
- [ ] Haptics work (App2) - phone vibrates!
- [ ] App Info shows (App3) - app details!
- [ ] All features work

---

## 📊 Build Output Locations

```
packages/host/
  ├── dist/              # Web bundle (copied to native projects)
  ├── android/           # Android project
  │   └── app/src/main/assets/public/  # dist/ copied here
  └── ios/               # iOS project
      └── App/public/    # dist/ copied here
```

---

## 🎯 Next Steps

1. **Build:** `npm run build:mobile`
2. **Sync:** `cd packages/host && npx cap sync`
3. **Open:** `npx cap open android` (or ios)
4. **Run:** Click Run button in IDE
5. **Test:** All features on your phone!

---

## 💡 Tips

- **First build takes longer** (5-10 minutes)
- **Subsequent builds are faster** (1-2 minutes)
- **Test in browser first** before building for mobile
- **Keep phone unlocked** during development
- **Use USB 3.0 cable** for faster transfers

---

Ready to build! Run `npm run build:mobile` and follow the steps above! 🚀

