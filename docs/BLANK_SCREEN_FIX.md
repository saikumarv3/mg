# Blank Screen Fix - App Launches But Shows Blank Screen

## 🔍 What's Happening

The app is **installing and launching** successfully (good!), but showing a **blank screen**.

This usually means:
1. Web assets not loading properly
2. JavaScript errors preventing React/Angular from loading
3. Capacitor not initialized correctly

## 🔧 Quick Fixes

### Fix 1: Check Logcat for Errors

**In Android Studio:**
1. Open **"Logcat"** tab at the bottom
2. Look for **RED errors** or **JavaScript errors**
3. Filter by: `chromium` or `WebView` or `Capacitor`

**Common errors you might see:**
- `Failed to load resource`
- `Uncaught Error`
- `Module not found`
- `CORS error`

### Fix 2: Verify Assets Were Copied

**Check if dist folder was synced:**
```bash
# Check if index.html exists in Android project
packages/host/android/app/src/main/assets/public/index.html
```

If this file doesn't exist, assets weren't copied properly.

### Fix 3: Re-sync Capacitor

```bash
cd packages/host
npx cap sync
```

This will copy the dist folder again.

### Fix 4: Check Capacitor Config

Make sure `capacitor.config.js` has correct paths.

## 🐛 Common Causes

### Cause 1: Assets Not Synced
**Fix:** Run `npx cap sync` again

### Cause 2: JavaScript Errors
**Fix:** Check Logcat for errors

### Cause 3: WebView Not Loading
**Fix:** Check AndroidManifest.xml permissions

### Cause 4: Module Federation Issues
**Fix:** Check if remoteEntry.js files are in the right place

## 📋 What to Check

1. **Logcat errors** - Share any red errors you see
2. **File exists?** - Check if `packages/host/android/app/src/main/assets/public/index.html` exists
3. **Re-sync** - Run `npx cap sync` again

## ✅ Quick Test

**Run this:**
```bash
cd packages/host
npx cap sync
```

Then in Android Studio:
1. **Uninstall** the app from your phone (or uninstall via Android Studio)
2. **Run** again (green play button)
3. **Check Logcat** for errors

Share what you see in Logcat - that will tell us what's wrong!

