# Capacitor Version Management & Dependency Issues

## ⚠️ Potential Issues with Different Versions

### **1. Capacitor Core Version Conflicts**

**Problem:**
If each app has different `@capacitor/core` versions:
- App1: `@capacitor/core@5.5.0`
- App2: `@capacitor/core@5.4.0`
- App3: `@capacitor/core@5.6.0`
- Host: `@capacitor/core@5.5.0`

**Impact:**
- ❌ **Runtime Conflicts**: Different core versions may have different APIs
- ❌ **Bridge Incompatibility**: Native bridge expects specific core version
- ❌ **Plugin Mismatch**: Plugins may require specific core version
- ❌ **Build Errors**: Webpack may bundle multiple versions
- ❌ **Runtime Errors**: "Method not found" or "API changed" errors

**Example Error:**
```
Error: Capacitor.getPlatform() is not a function
- App1 uses new API (5.5.0)
- App2 uses old API (5.4.0)
- Host expects 5.5.0 API
```

---

### **2. Plugin Version Mismatches**

**Problem:**
Same plugin, different versions across apps:
- App1: `@capacitor/device@5.0.0`
- App2: `@capacitor/device@5.1.0`
- Host: `@capacitor/device@5.0.0`

**Impact:**
- ❌ **API Differences**: Methods may have changed between versions
- ❌ **Parameter Changes**: Method signatures may differ
- ❌ **Return Value Changes**: Response structure may be different
- ❌ **Bug Fixes Missing**: One app has fix, another doesn't

**Example:**
```javascript
// Version 5.0.0
Device.getInfo() → { platform, osVersion }

// Version 5.1.0
Device.getInfo() → { platform, osVersion, isVirtual } // New field
```

If Host expects 5.1.0 but App1 uses 5.0.0, response handling breaks.

---

### **3. Module Federation Sharing**

**How Module Federation Handles It:**

**Scenario 1: Shared Dependencies**
```javascript
// Host webpack.config.js
shared: {
  '@capacitor/core': {
    singleton: true,
    requiredVersion: '^5.5.0'
  }
}
```

**What Happens:**
- ✅ Webpack ensures only ONE version of `@capacitor/core` is loaded
- ✅ All apps use the same version (singleton)
- ✅ Version must match `requiredVersion` constraint

**If Versions Don't Match:**
- ❌ Webpack throws error during build
- ❌ Apps can't load if version mismatch
- ❌ Build fails with version conflict

---

**Scenario 2: Non-Shared Dependencies**
```javascript
// Host webpack.config.js
shared: {
  // @capacitor/core NOT in shared
}
```

**What Happens:**
- ⚠️ Each app bundles its own version
- ⚠️ Multiple versions loaded at runtime
- ⚠️ Potential conflicts if APIs differ
- ⚠️ Larger bundle size (duplicate code)

---

### **4. Runtime Behavior**

**When Host Coordinates Calls:**

```
App1 (core@5.4.0) → postMessage → Host (core@5.5.0) → Native Plugin
```

**Potential Issues:**
1. **API Mismatch**: App1 expects old API, Host uses new API
2. **Response Format**: Different response structures
3. **Error Handling**: Different error formats

**Example:**
```javascript
// App1 (5.4.0) expects:
Device.getInfo().then(result => {
  console.log(result.platform); // Old API
});

// Host (5.5.0) returns:
Device.getInfo().then(result => {
  // New API may have different structure
});
```

---

## ✅ Solutions & Best Practices

### **Solution 1: Shared Capacitor Core (RECOMMENDED)**

**Installation:**
```json
// Root package.json OR Host app
{
  "@capacitor/core": "^5.5.0",  // Exact version
  "@capacitor/cli": "^5.5.0",
  "@capacitor/ios": "^5.5.0",
  "@capacitor/android": "^5.5.0"
}
```

**Host Webpack Config:**
```javascript
shared: {
  '@capacitor/core': {
    singleton: true,
    requiredVersion: '5.5.0',  // Exact version, not range
    strictVersion: true  // Enforce exact version
  }
}
```

**Individual Apps:**
```json
// App1, App2, App3 - DON'T install @capacitor/core
// They use the shared version from Host
{
  "@capacitor/status-bar": "^5.0.0"  // Only plugin, not core
}
```

**Benefits:**
- ✅ Single version across all apps
- ✅ No conflicts
- ✅ Consistent API
- ✅ Smaller bundles

---

### **Solution 2: Version Lock (Package.json)**

**Use Workspace Dependencies:**
```json
// Root package.json
{
  "workspaces": ["packages/*"],
  "dependencies": {
    "@capacitor/core": "5.5.0"  // Lock version
  }
}
```

**All Apps Reference Same Version:**
```json
// packages/app1/package.json
{
  "dependencies": {
    "@capacitor/status-bar": "^5.0.0"
  }
  // No @capacitor/core - uses workspace version
}
```

**Benefits:**
- ✅ Version managed at root
- ✅ All apps use same core
- ✅ Easy to update

---

### **Solution 3: Plugin Version Strategy**

**Option A: Same Version Everywhere**
```json
// All apps use same plugin version
{
  "@capacitor/device": "5.0.0"  // Exact version
}
```

**Option B: Version Ranges (Flexible)**
```json
// Allow minor/patch updates
{
  "@capacitor/device": "^5.0.0"  // 5.0.0 to 5.x.x
}
```

**Option C: Host Coordinates (Recommended)**
```json
// Only Host installs plugins
// Apps request via message passing
// Host ensures single version
```

---

### **Solution 4: Host-Only Plugin Installation**

**Architecture:**
```
Host App:
  - Installs ALL Capacitor plugins
  - Coordinates ALL plugin calls
  - Ensures single version

Apps:
  - NO Capacitor dependencies
  - Request features via postMessage
  - Host handles all native calls
```

**Benefits:**
- ✅ Zero version conflicts
- ✅ Single source of truth
- ✅ Easy to manage
- ✅ Consistent behavior

**Trade-offs:**
- ⚠️ Apps can't directly call plugins
- ⚠️ Must use message passing
- ⚠️ Slightly more complex communication

---

## 🔍 Dependency Analysis

### **What Gets Bundled?**

**Scenario 1: Shared Core**
```
Host Bundle:
  - @capacitor/core@5.5.0 (shared)
  - Plugin code

App1 Bundle:
  - RemoteEntry.js
  - No Capacitor core (uses shared)

Total: 1x @capacitor/core
```

**Scenario 2: Non-Shared Core**
```
Host Bundle:
  - @capacitor/core@5.5.0

App1 Bundle:
  - @capacitor/core@5.4.0 (different!)
  - RemoteEntry.js

Total: 2x @capacitor/core (different versions)
```

---

### **Runtime Behavior**

**Shared Core:**
- ✅ Single instance loaded
- ✅ All apps use same instance
- ✅ No conflicts

**Non-Shared Core:**
- ⚠️ Multiple instances may load
- ⚠️ Potential conflicts
- ⚠️ Larger memory footprint

---

## 📊 Version Compatibility Matrix

| Component | Recommended | Minimum | Maximum |
|-----------|-------------|---------|---------|
| @capacitor/core | 5.5.0 | 5.0.0 | 5.x.x |
| @capacitor/ios | 5.5.0 | 5.0.0 | 5.x.x |
| @capacitor/android | 5.5.0 | 5.0.0 | 5.x.x |
| Plugins | ^5.0.0 | 5.0.0 | 5.x.x |

**Rule:** Core versions must match exactly, plugin versions can use ranges.

---

## 🚨 Common Issues & Fixes

### **Issue 1: Build Error - Version Conflict**

**Error:**
```
ModuleNotFoundError: Shared module @capacitor/core version mismatch
Host requires 5.5.0, App1 has 5.4.0
```

**Fix:**
```bash
# Update all apps to same version
cd packages/app1
npm install @capacitor/core@5.5.0

cd packages/app2
npm install @capacitor/core@5.5.0
```

---

### **Issue 2: Runtime Error - Method Not Found**

**Error:**
```
TypeError: Capacitor.getPlatform is not a function
```

**Cause:** Version mismatch - API changed between versions

**Fix:**
- Ensure all apps use same `@capacitor/core` version
- Use shared core in webpack config

---

### **Issue 3: Plugin Method Not Working**

**Error:**
```
Plugin method 'getInfo' not found or signature changed
```

**Cause:** Plugin version mismatch

**Fix:**
```bash
# Align plugin versions
npm install @capacitor/device@5.0.0 --workspace=app1
npm install @capacitor/device@5.0.0 --workspace=app2
```

---

## ✅ Recommended Architecture

### **Best Practice: Host-Only Installation**

```
Host App:
├── @capacitor/core@5.5.0 (exact)
├── @capacitor/cli@5.5.0
├── @capacitor/ios@5.5.0
├── @capacitor/android@5.5.0
├── @capacitor/device@5.0.0
├── @capacitor/status-bar@5.0.0
├── @capacitor/haptics@5.0.0
└── @capacitor/app@5.0.0

App1, App2, App3:
└── NO Capacitor dependencies
    └── Request via postMessage
```

**Webpack Config:**
```javascript
// Host webpack.config.js
shared: {
  '@capacitor/core': {
    singleton: true,
    requiredVersion: '5.5.0',
    strictVersion: true
  }
}
```

**Benefits:**
- ✅ Zero version conflicts
- ✅ Single source of truth
- ✅ Easy updates
- ✅ Consistent behavior
- ✅ Smaller app bundles

---

## 📝 Implementation Checklist

### **Version Management:**
- [ ] Install Capacitor core in Host only
- [ ] Use exact versions (not ranges) for core
- [ ] Share core via webpack Module Federation
- [ ] Install plugins in Host only
- [ ] Use version ranges for plugins (^5.0.0)
- [ ] Document version in README

### **Testing:**
- [ ] Test with same versions
- [ ] Test with version mismatches (negative test)
- [ ] Verify build succeeds
- [ ] Verify runtime works
- [ ] Check bundle sizes

### **Documentation:**
- [ ] Document version strategy
- [ ] Add version to package.json
- [ ] Document update process
- [ ] Add troubleshooting guide

---

## 🔄 Update Strategy

### **Updating Capacitor Core:**

```bash
# 1. Update in Host only
cd packages/host
npm install @capacitor/core@5.6.0

# 2. Update webpack shared config
shared: {
  '@capacitor/core': {
    singleton: true,
    requiredVersion: '5.6.0',  // Update here
    strictVersion: true
  }
}

# 3. Update native projects
npx cap sync

# 4. Test all apps
npm run dev
```

### **Updating Plugins:**

```bash
# Update in Host
cd packages/host
npm install @capacitor/device@5.1.0

# Test feature
npm run dev
```

---

## 💡 Summary

### **Key Points:**

1. **Core Version Must Match**
   - Use exact version for `@capacitor/core`
   - Share via Module Federation
   - Install in Host only

2. **Plugin Versions Can Vary**
   - Use version ranges (^5.0.0)
   - Install in Host only (recommended)
   - Or align versions across apps

3. **Host-Only Installation**
   - Best practice for micro-frontends
   - Zero conflicts
   - Single source of truth

4. **Version Conflicts Cause:**
   - Build errors
   - Runtime errors
   - API mismatches
   - Inconsistent behavior

5. **Solution:**
   - Share core in webpack
   - Install plugins in Host
   - Use exact core version
   - Use ranges for plugins

---

## 🎯 Recommendation

**For This Project:**
1. Install Capacitor core in **Host app only**
2. Share core via Module Federation (singleton)
3. Install plugins in **Host app only**
4. Apps request features via postMessage
5. Use exact version for core (5.5.0)
6. Use version ranges for plugins (^5.0.0)

**This ensures:**
- ✅ No version conflicts
- ✅ Consistent behavior
- ✅ Easy maintenance
- ✅ Smaller bundles
- ✅ Better performance

