# Build Error Troubleshooting

## 🔍 Finding the Actual Error

The deprecation warning is NOT the problem - it's just a warning.

**To see the REAL error:**

### In Android Studio:
1. Look at the **"Build"** tab at the bottom
2. Look for **RED error messages**
3. Scroll up to see the **first error** (errors are usually at the top)

### Or from Command Line:
```bash
cd packages/host/android
./gradlew assembleDebug --stacktrace
```

This will show the full error with details.

---

## 🐛 Common Build Errors & Fixes

### Error 1: "SDK location not found"
**Fix:**
```bash
# Create local.properties file
cd packages/host/android
echo "sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk" > local.properties
```

### Error 2: "Failed to resolve: androidx..."
**Fix:**
- Let Android Studio sync Gradle
- It will download dependencies automatically

### Error 3: "Execution failed for task ':app:mergeDebugResources'"
**Fix:**
```bash
cd packages/host/android
./gradlew clean
```
Then rebuild.

### Error 4: "Build tools version not found"
**Fix:**
- Open Android Studio → Tools → SDK Manager
- Install "Android SDK Build-Tools"
- Install "Android SDK Platform-Tools"

### Error 5: "Missing package.json" or "Module not found"
**Fix:**
- Make sure you ran `npm run build:mobile` first
- Check that `packages/host/dist/` folder exists

---

## ✅ Quick Fix Try This First

```bash
# 1. Clean build
cd packages/host/android
./gradlew clean

# 2. Rebuild
./gradlew assembleDebug
```

---

## 📋 What to Share

If it still fails, share:
1. **The RED error message** (not the deprecation warning)
2. **What line it says the error is on**
3. **Any file names mentioned in the error**

The deprecation warning is normal - ignore it. Focus on finding the actual error!

