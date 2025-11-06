# Capacitor Simple POC Plan - Small Features

## 🎯 Goal
Start with **minimal, easy-to-test** Capacitor features in each app to validate the integration pattern.

---

## 📦 Simple Features by App

### **Host App** - Device Information
**Plugin:** `@capacitor/device`

**Feature:**
- Display device information (platform, OS version, model)
- Show it in a simple card/box
- Trigger on app load

**Why This?**
- ✅ No permissions needed
- ✅ Works immediately
- ✅ Easy to verify (just display text)
- ✅ No user interaction required

**Test:**
- Open app → See device info displayed
- Check: iOS/Android platform, OS version, device model

---

### **App1 (Welcome)** - Status Bar Color
**Plugin:** `@capacitor/status-bar`

**Feature:**
- Change status bar color when page loads
- Welcome page changes status bar to blue/purple
- Revert when leaving page

**Why This?**
- ✅ Visual feedback (easy to see)
- ✅ No permissions
- ✅ Simple API call
- ✅ Works on both iOS and Android

**Test:**
- Navigate to Welcome page → Status bar changes color
- Navigate away → Status bar reverts
- Check: Color change visible

---

### **App2 (Home)** - Haptics (Vibration)
**Plugin:** `@capacitor/haptics`

**Feature:**
- Button to trigger haptic feedback
- Light vibration when button clicked
- Success haptic on counter increment

**Why This?**
- ✅ Tactile feedback (easy to feel)
- ✅ No permissions needed
- ✅ Simple API call
- ✅ Works on physical devices (emulator limitation)

**Test:**
- Click "Haptic Test" button → Feel vibration
- Increment counter → Feel success vibration
- Check: Phone vibrates (on device)

---

### **App3 (Dashboard - Angular)** - App Info
**Plugin:** `@capacitor/app`

**Feature:**
- Display app version and build number
- Show app state (active/background)
- Display when app state changes

**Why This?**
- ✅ No permissions
- ✅ Simple info display
- ✅ Easy to verify
- ✅ Tests app lifecycle

**Test:**
- Navigate to Dashboard → See app version
- Put app in background → See state change
- Check: Version displayed, state updates

---

## 📋 Installation Plan

### Step 1: Host App Setup
```bash
cd packages/host
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android @capacitor/device
```

**Files to Modify:**
- `package.json` - Add dependencies
- `src/App.jsx` - Add device info display
- Create `src/services/capacitorBridge.js` - Bridge service

---

### Step 2: App1 Setup
```bash
cd packages/app1
npm install @capacitor/status-bar
```

**Files to Modify:**
- `package.json` - Add dependency
- `src/WelcomePage.jsx` - Add status bar color change
- Use Host bridge to call plugin

---

### Step 3: App2 Setup
```bash
cd packages/app2
npm install @capacitor/haptics
```

**Files to Modify:**
- `package.json` - Add dependency
- `src/HomePage.jsx` - Add haptic button
- Use Host bridge to call plugin

---

### Step 4: App3 Setup
```bash
cd packages/app3
npm install @capacitor/app
```

**Files to Modify:**
- `package.json` - Add dependency
- `src/app/dashboard/dashboard.component.ts` - Add app info display
- Use Host bridge to call plugin

---

## 🔄 Communication Pattern

### Simple Message Flow:
```
App → window.postMessage({ type: 'CAPACITOR_CALL', plugin: 'device', method: 'getInfo' })
Host → Receives message → Calls Capacitor plugin → Gets result
Host → window.postMessage({ type: 'CAPACITOR_RESULT', plugin: 'device', data: result })
App → Receives result → Updates UI
```

### Host Bridge Service Structure:
```javascript
// packages/host/src/services/capacitorBridge.js
class CapacitorBridge {
  constructor() {
    this.setupListeners();
  }
  
  setupListeners() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'CAPACITOR_CALL') {
        this.handleCapacitorCall(event.data);
      }
    });
  }
  
  async handleCapacitorCall({ plugin, method, args }) {
    try {
      const result = await this.callPlugin(plugin, method, args);
      this.sendResult(result);
    } catch (error) {
      this.sendError(error);
    }
  }
  
  async callPlugin(plugin, method, args) {
    // Switch based on plugin name
    // Call appropriate Capacitor plugin
  }
  
  sendResult(data) {
    window.postMessage({ type: 'CAPACITOR_RESULT', data }, '*');
  }
}
```

---

## 🎨 UI Changes (Minimal)

### Host App (`App.jsx`)
```jsx
// Add device info card at top
<div style={deviceInfoCard}>
  <h3>Device Info</h3>
  <p>Platform: {deviceInfo.platform}</p>
  <p>OS: {deviceInfo.osVersion}</p>
  <p>Model: {deviceInfo.model}</p>
</div>
```

### App1 (`WelcomePage.jsx`)
```jsx
// Add useEffect to change status bar
useEffect(() => {
  requestCapacitorCall('status-bar', 'setStyle', { style: 'DARK' });
  requestCapacitorCall('status-bar', 'setBackgroundColor', { color: '#667eea' });
  
  return () => {
    // Revert on unmount
    requestCapacitorCall('status-bar', 'setStyle', { style: 'LIGHT' });
  };
}, []);
```

### App2 (`HomePage.jsx`)
```jsx
// Add haptic button
<button onClick={triggerHaptic}>
  Test Haptic Feedback
</button>

// Add haptic to counter increment
const incrementCounter = () => {
  triggerHaptic('impact', { style: 'MEDIUM' });
  // ... existing counter logic
};
```

### App3 (`dashboard.component.ts`)
```typescript
// Add app info display
<div class="app-info">
  <p>App Version: {{ appVersion }}</p>
  <p>Build: {{ appBuild }}</p>
  <p>State: {{ appState }}</p>
</div>

// Listen for app state changes
ngOnInit() {
  requestCapacitorCall('app', 'getInfo');
  requestCapacitorCall('app', 'addListener', { eventName: 'appStateChange' });
}
```

---

## ✅ Testing Checklist

### Host App - Device Info
- [ ] App loads → Device info displayed
- [ ] Platform shows: iOS/Android/Web
- [ ] OS version displayed
- [ ] Device model displayed

### App1 - Status Bar
- [ ] Navigate to Welcome page
- [ ] Status bar color changes (visible on device)
- [ ] Navigate away → Status bar reverts

### App2 - Haptics
- [ ] Click "Test Haptic" button
- [ ] Feel vibration (on physical device)
- [ ] Increment counter → Feel success vibration
- [ ] Note: Won't work in emulator/simulator

### App3 - App Info
- [ ] Navigate to Dashboard
- [ ] App version displayed
- [ ] Build number displayed
- [ ] Put app in background → State updates

---

## 🚧 Implementation Steps

### Phase 1: Host App Setup
1. Install Capacitor dependencies in Host
2. Initialize Capacitor in Host
3. Create CapacitorBridge service
4. Add device info display
5. Test device info shows

### Phase 2: Message Bridge
1. Create message listener in Host
2. Implement plugin call handler
3. Add result broadcaster
4. Test message passing

### Phase 3: App1 Integration
1. Install status-bar plugin in App1
2. Add message sender function
3. Add status bar color change on mount
4. Test status bar changes

### Phase 4: App2 Integration
1. Install haptics plugin in App2
2. Add message sender function
3. Add haptic button
4. Add haptic to counter
5. Test vibrations

### Phase 5: App3 Integration
1. Install app plugin in App3
2. Add message sender function
3. Add app info display
4. Add app state listener
5. Test app info and state

### Phase 6: Mobile Build
1. Build all apps
2. Run mobile build script
3. Sync with Capacitor
4. Test on iOS simulator
5. Test on Android emulator
6. Test on physical devices

---

## 📊 Feature Matrix

| App | Plugin | Feature | Test Method | Complexity |
|-----|--------|---------|-------------|------------|
| Host | device | Show device info | Visual check | ⭐ Easy |
| App1 | status-bar | Change color | Visual check | ⭐ Easy |
| App2 | haptics | Vibration | Feel vibration | ⭐ Easy |
| App3 | app | App info/state | Visual check | ⭐ Easy |

---

## 🎯 Why These Features?

### ✅ Criteria Met:
1. **No Permissions** - All features work without user permission prompts
2. **Easy to Test** - Visual or tactile feedback
3. **Simple API** - One or two method calls
4. **Quick Integration** - Minimal code changes
5. **Cross-Platform** - Work on iOS, Android, Web

### ✅ Learning Value:
1. **Device Info** - Basic plugin usage
2. **Status Bar** - Platform-specific styling
3. **Haptics** - Tactile feedback (device-only feature)
4. **App Info** - App lifecycle awareness

---

## 🔍 Testing Strategy

### Web Testing (Development)
- All features can be tested in browser
- Some features may be limited (haptics won't vibrate)
- Visual feedback works
- Good for development/debugging

### Mobile Testing (Required)
- **iOS Simulator**: Test status bar, app info, device info
- **Android Emulator**: Test status bar, app info, device info
- **Physical Device**: Test haptics (vibration)
- **Physical Device**: Test status bar color (more accurate)

---

## 📝 Files to Create/Modify

### New Files:
1. `packages/host/src/services/capacitorBridge.js` - Bridge service
2. `packages/host/src/utils/capacitorHelpers.js` - Helper functions

### Modified Files:
1. `packages/host/package.json` - Add Capacitor dependencies
2. `packages/host/src/App.jsx` - Add device info display
3. `packages/app1/package.json` - Add status-bar plugin
4. `packages/app1/src/WelcomePage.jsx` - Add status bar change
5. `packages/app2/package.json` - Add haptics plugin
6. `packages/app2/src/HomePage.jsx` - Add haptic button
7. `packages/app3/package.json` - Add app plugin
8. `packages/app3/src/app/dashboard/dashboard.component.ts` - Add app info

---

## 🚀 Next Steps (After Implementation)

Once these simple features work:
1. ✅ Validate message passing works
2. ✅ Test on mobile devices
3. ✅ Verify cross-app communication
4. ✅ Then add more complex features (camera, geolocation, etc.)

---

## 💡 Quick Reference

### Plugin APIs Used:

**Device:**
```javascript
Device.getInfo() → { platform, osVersion, model, ... }
```

**Status Bar:**
```javascript
StatusBar.setStyle({ style: 'DARK' })
StatusBar.setBackgroundColor({ color: '#667eea' })
```

**Haptics:**
```javascript
Haptics.impact({ style: 'MEDIUM' })
Haptics.notification({ type: 'SUCCESS' })
```

**App:**
```javascript
App.getInfo() → { version, build, ... }
App.addListener('appStateChange', callback)
```

---

## 📚 Summary

**Simple Features:**
- Host: Device info (display)
- App1: Status bar color (visual)
- App2: Haptics (tactile)
- App3: App info (display)

**Installation:**
- Each app installs its own plugin
- Host coordinates all calls
- Message passing for communication

**Testing:**
- Visual check for most features
- Physical device for haptics
- Easy to verify all features work

**Goal:**
- Validate integration pattern
- Test message passing
- Verify mobile builds work
- Then expand to bigger features

---

Ready to implement? Start with Host app setup, then add features one by one!

