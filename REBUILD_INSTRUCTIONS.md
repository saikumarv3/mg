# How to Rebuild Android App in Android Studio

## 🔄 Quick Rebuild Steps

### **Option 1: Clean and Rebuild (Recommended)**

1. **In Android Studio:**
   - Click **Build** → **Clean Project**
   - Wait for it to finish (you'll see "Build finished" in the bottom status bar)

2. **Then rebuild:**
   - Click **Build** → **Rebuild Project**
   - Wait for the build to complete

3. **Run the app:**
   - Click the green **▶️ Run** button (or press `Shift+F10`)
   - Or click **Run** → **Run 'app'**

### **Option 2: Quick Rebuild (Faster)**

1. **Just rebuild:**
   - Click **Build** → **Rebuild Project**
   - Wait for it to finish

2. **Run the app:**
   - Click the green **▶️ Run** button

### **Option 3: Using Gradle (Command Line)**

If you prefer the terminal:

```bash
cd packages/host/android
.\gradlew clean
.\gradlew assembleDebug
```

Then install manually or use Android Studio to run.

## 📱 After Rebuild

Once the build completes:

1. **The app will automatically install** on your connected phone
2. **The app will launch automatically**
3. **You should see the Welcome page** (no more blank screen!)

## ✅ What to Expect

After rebuilding, the app should:
- ✅ Load successfully (no blank screen)
- ✅ Show the Welcome page from App1
- ✅ Allow navigation to Home (App2) and Dashboard (App3)
- ✅ All Capacitor features should work

## 🐛 If Still Blank Screen

If you still see a blank screen after rebuilding:

1. **Check Logcat** for errors
2. **Uninstall the app** from your phone first:
   - Long press app icon → Uninstall
   - Or in Android Studio: **Run** → **Uninstall 'app'**
3. **Then rebuild and run again**

## 💡 Pro Tip

**Keyboard Shortcuts:**
- `Ctrl+F9` - Build project
- `Shift+F10` - Run app
- `Shift+F9` - Debug app

