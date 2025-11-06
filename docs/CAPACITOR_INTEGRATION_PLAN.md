# Capacitor Integration Plan

## 📋 Overview

This document outlines the plan for integrating Capacitor.js into the micro-frontend architecture, including feature distribution across apps and installation strategy.

---

## 🎯 Features Distribution by App

### **Host App** (Main Container)
**Purpose:** Central coordination and native device access

**Features:**
1. **App Lifecycle Management**
   - App state (background/foreground)
   - Splash screen control
   - App initialization

2. **Device Information**
   - Device info (platform, OS version, model)
   - Network status monitoring
   - Battery status

3. **Navigation & Routing**
   - Deep linking (custom URL schemes)
   - Push notification routing
   - Back button handling (Android)

4. **Shared Services**
   - Native storage (Capacitor Preferences)
   - File system access
   - Security (biometric auth)

5. **Cross-App Communication Hub**
   - Message broker between apps
   - Shared state management
   - Event broadcasting

**Why Host?**
- Single entry point for native features
- Avoids duplicate permissions/plugins
- Centralized error handling
- Better performance (one native bridge)

---

### **App1 (Welcome Page)**
**Purpose:** Onboarding and user introduction

**Features:**
1. **Camera Access**
   - Profile picture capture
   - Photo upload
   - Image preview

2. **Geolocation**
   - Location-based welcome
   - Show user's location on map
   - Location permissions handling

3. **Device Info Display**
   - Show device details (from Host)
   - Platform information
   - App version

4. **Local Notifications**
   - Welcome notifications
   - Reminder notifications

**Why App1?**
- First user interaction
- Good place for permissions
- Sets up user profile

---

### **App2 (Home Page)**
**Purpose:** Main content and daily operations

**Features:**
1. **File System**
   - Document viewer
   - File picker
   - Download files
   - Share files

2. **Contacts**
   - Access contacts
   - Add new contacts
   - Share contact info

3. **Clipboard**
   - Copy/paste functionality
   - Share text between apps
   - Clipboard monitoring

4. **Network**
   - Check connectivity
   - API calls status
   - Offline mode indicator

5. **Haptics**
   - Tactile feedback
   - Button press feedback
   - Success/error vibrations

**Why App2?**
- Main content area
- Most user interactions
- Core functionality hub

---

### **App3 (Dashboard - Angular)**
**Purpose:** Analytics and advanced features

**Features:**
1. **Barcode Scanner**
   - QR code scanning
   - Product barcode scanning
   - Generate QR codes

2. **Biometric Authentication**
   - Fingerprint/Face ID
   - Secure access to dashboard
   - Session management

3. **Status Bar**
   - Change status bar style
   - Hide/show status bar
   - Color customization

4. **App Tracking**
   - Analytics
   - User behavior tracking
   - Performance metrics

5. **Share**
   - Share dashboard data
   - Export reports
   - Social sharing

**Why App3?**
- Advanced features
- Analytics dashboard
- Security-sensitive data

---

## 📦 Installation Strategy

### **Option 1: App-Level Installation (RECOMMENDED)**

**What to Install:**

#### Host App (`packages/host/`)
```json
{
  "@capacitor/core": "^5.5.0",
  "@capacitor/cli": "^5.5.0",
  "@capacitor/ios": "^5.5.0",
  "@capacitor/android": "^5.5.0",
  "@capacitor/app": "^5.0.0",
  "@capacitor/status-bar": "^5.0.0",
  "@capacitor/preferences": "^5.0.0",
  "@capacitor/filesystem": "^5.0.0",
  "@capacitor/network": "^5.0.0",
  "@capacitor/device": "^5.0.0",
  "@capacitor/keyboard": "^5.0.0"
}
```

#### App1 (`packages/app1/`)
```json
{
  "@capacitor/camera": "^5.0.0",
  "@capacitor/geolocation": "^5.0.0",
  "@capacitor/local-notifications": "^5.0.0"
}
```

#### App2 (`packages/app2/`)
```json
{
  "@capacitor/filesystem": "^5.0.0",
  "@capacitor/share": "^5.0.0",
  "@capacitor/clipboard": "^5.0.0",
  "@capacitor/contacts": "^5.0.0",
  "@capacitor/haptics": "^5.0.0"
}
```

#### App3 (`packages/app3/`)
```json
{
  "@capacitor/barcode-scanner": "^5.0.0",
  "@capacitor/biometric": "^5.0.0",
  "@capacitor/app": "^5.0.0"
}
```

**Why App-Level?**
✅ **Isolation**: Each app manages its own dependencies
✅ **Independent Updates**: Update plugins per app without affecting others
✅ **Smaller Bundles**: Only load plugins needed by each app
✅ **Clear Ownership**: Each app owns its native features
✅ **Better for Micro-Frontends**: Matches the architecture pattern
✅ **Easier Testing**: Test plugins in isolation
✅ **Version Control**: Different apps can use different plugin versions

**Challenges:**
⚠️ **Duplicate Core**: Each app has Capacitor core (but it's shared at runtime)
⚠️ **More Installation Steps**: Need to install in each app
⚠️ **Potential Conflicts**: If two apps need same plugin (but can share)

---

### **Option 2: Global/Root-Level Installation**

**What to Install:**
```json
// Root package.json
{
  "@capacitor/core": "^5.5.0",
  "@capacitor/cli": "^5.5.0",
  "@capacitor/ios": "^5.5.0",
  "@capacitor/android": "^5.5.0",
  // All plugins here
}
```

**Why Global?**
✅ **Single Installation**: Install once at root
✅ **Consistent Versions**: Same plugin versions everywhere
✅ **Easier Management**: One place to update

**Why NOT Global?**
❌ **Tight Coupling**: All apps depend on root
❌ **Larger Bundles**: All plugins in every app
❌ **Version Conflicts**: Can't use different versions
❌ **Against Micro-Frontend Pattern**: Breaks independence
❌ **Harder to Scale**: Adding new apps becomes complex

---

### **Option 3: Hybrid (Recommended for Production)**

**What to Install:**

#### Root Level (Shared Infrastructure)
```json
{
  "@capacitor/core": "^5.5.0",
  "@capacitor/cli": "^5.5.0",
  "@capacitor/ios": "^5.5.0",
  "@capacitor/android": "^5.5.0"
}
```

#### Host App (Shared Plugins)
```json
{
  "@capacitor/app": "^5.0.0",
  "@capacitor/device": "^5.0.0",
  "@capacitor/preferences": "^5.0.0",
  "@capacitor/network": "^5.0.0"
}
```

#### Individual Apps (App-Specific Plugins)
- App1: Camera, Geolocation, Notifications
- App2: Filesystem, Share, Clipboard, Haptics
- App3: Barcode, Biometric

**Why Hybrid?**
✅ **Best of Both**: Shared infrastructure + app-specific features
✅ **Optimal Bundles**: Only load what's needed
✅ **Flexibility**: Apps can add plugins independently
✅ **Maintainability**: Clear separation of concerns

---

## 🏗️ Architecture Decision

### **Recommended: Option 1 (App-Level) with Host Coordination**

**Implementation Strategy:**

1. **Host App** installs:
   - Core Capacitor packages
   - Shared plugins (app, device, preferences, network)
   - Acts as native bridge coordinator

2. **Individual Apps** install:
   - Only their specific plugins
   - Can access Host's shared plugins via postMessage

3. **Communication Pattern:**
   ```
   App1 → postMessage → Host → Native Plugin → Result → Host → postMessage → App1
   ```

4. **Shared Plugin Access:**
   - Host exposes native features via custom events
   - Apps request features through message passing
   - Host handles native calls and returns results

---

## 📊 Feature Matrix

| Feature | Host | App1 | App2 | App3 | Plugin |
|---------|------|------|------|------|--------|
| App Lifecycle | ✅ | ❌ | ❌ | ❌ | @capacitor/app |
| Device Info | ✅ | ✅ | ❌ | ❌ | @capacitor/device |
| Camera | ❌ | ✅ | ❌ | ❌ | @capacitor/camera |
| Geolocation | ❌ | ✅ | ❌ | ❌ | @capacitor/geolocation |
| Filesystem | ✅ | ❌ | ✅ | ❌ | @capacitor/filesystem |
| Share | ❌ | ❌ | ✅ | ✅ | @capacitor/share |
| Clipboard | ❌ | ❌ | ✅ | ❌ | @capacitor/clipboard |
| Contacts | ❌ | ❌ | ✅ | ❌ | @capacitor/contacts |
| Haptics | ❌ | ❌ | ✅ | ❌ | @capacitor/haptics |
| Barcode Scanner | ❌ | ❌ | ❌ | ✅ | @capacitor/barcode-scanner |
| Biometric | ❌ | ❌ | ❌ | ✅ | @capacitor/biometric |
| Notifications | ❌ | ✅ | ❌ | ❌ | @capacitor/local-notifications |
| Preferences | ✅ | ✅ | ✅ | ✅ | @capacitor/preferences |
| Network | ✅ | ✅ | ✅ | ✅ | @capacitor/network |
| Status Bar | ✅ | ❌ | ❌ | ✅ | @capacitor/status-bar |

---

## 🔄 Communication Flow

### **Scenario 1: App1 needs Camera**
```
App1 → window.postMessage({ type: 'CAPACITOR_CALL', plugin: 'camera', method: 'getPhoto' })
Host → Listens for message → Calls @capacitor/camera → Returns result
Host → window.postMessage({ type: 'CAPACITOR_RESULT', data: photoData })
App1 → Receives photo data → Updates UI
```

### **Scenario 2: App2 needs Shared Preferences**
```
App2 → window.postMessage({ type: 'CAPACITOR_CALL', plugin: 'preferences', method: 'get', key: 'user' })
Host → Calls @capacitor/preferences → Returns stored value
Host → window.postMessage({ type: 'CAPACITOR_RESULT', data: userData })
App2 → Updates state with user data
```

### **Scenario 3: App3 needs Biometric**
```
App3 → window.postMessage({ type: 'CAPACITOR_CALL', plugin: 'biometric', method: 'check' })
Host → Calls @capacitor/biometric → Returns auth result
Host → window.postMessage({ type: 'CAPACITOR_RESULT', data: authResult })
App3 → Shows dashboard if authenticated
```

---

## 📝 Implementation Checklist

### Phase 1: Setup
- [ ] Install Capacitor core in Host app
- [ ] Initialize Capacitor in Host app
- [ ] Create native bridge service in Host
- [ ] Set up message passing for plugins

### Phase 2: Host App Plugins
- [ ] Install shared plugins (app, device, preferences, network)
- [ ] Create plugin wrapper service
- [ ] Implement message listener
- [ ] Test plugin calls from Host

### Phase 3: App1 Integration
- [ ] Install camera plugin
- [ ] Install geolocation plugin
- [ ] Install notifications plugin
- [ ] Implement feature requests via postMessage
- [ ] Test camera capture
- [ ] Test location access
- [ ] Test notifications

### Phase 4: App2 Integration
- [ ] Install filesystem plugin
- [ ] Install share plugin
- [ ] Install clipboard plugin
- [ ] Install contacts plugin
- [ ] Install haptics plugin
- [ ] Test file operations
- [ ] Test sharing
- [ ] Test clipboard
- [ ] Test haptics

### Phase 5: App3 Integration
- [ ] Install barcode scanner plugin
- [ ] Install biometric plugin
- [ ] Test QR scanning
- [ ] Test biometric authentication

### Phase 6: Mobile Build
- [ ] Configure mobile webpack
- [ ] Test native builds
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical devices

---

## 🎯 Key Decisions Summary

1. **Installation**: App-level (Option 1) ✅
   - Each app installs its own plugins
   - Host app installs shared plugins
   - Best for micro-frontend architecture

2. **Communication**: Message Passing
   - Apps request native features via postMessage
   - Host app handles all native calls
   - Results returned via postMessage

3. **Shared Plugins**: Host App
   - Device info, preferences, network, app lifecycle
   - Accessible by all apps via Host bridge

4. **App-Specific Plugins**: Individual Apps
   - Camera, Geolocation → App1
   - Filesystem, Share, Clipboard → App2
   - Barcode, Biometric → App3

5. **Build Strategy**: Host App Builds
   - Only Host app builds for mobile
   - Other apps bundled as remoteEntry.js
   - All plugins bundled in Host app

---

## ❓ Why This Approach?

### **Why App-Level Installation?**
1. **Micro-Frontend Philosophy**: Each app is independent
2. **Bundle Size**: Only load what's needed
3. **Maintainability**: Clear ownership of features
4. **Scalability**: Easy to add new apps
5. **Testing**: Test plugins in isolation

### **Why Host Coordinates Native Calls?**
1. **Single Native Bridge**: One connection to native layer
2. **Performance**: Avoid multiple native bridges
3. **Security**: Centralized permission handling
4. **Consistency**: Same plugin instance across apps
5. **Error Handling**: Centralized error management

### **Why Message Passing?**
1. **Cross-Origin**: Works with iframe (App3)
2. **Loose Coupling**: Apps don't directly import Capacitor
3. **Flexibility**: Easy to change implementation
4. **Testing**: Can mock native calls
5. **Debugging**: Clear message flow

---

## 🚀 Next Steps (When Ready)

1. Review and approve this plan
2. Start with Host app setup
3. Implement message bridge
4. Add plugins app by app
5. Test each feature
6. Build for mobile
7. Test on devices

---

## 📚 Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Module Federation + Capacitor](https://webpack.js.org/concepts/module-federation/)

