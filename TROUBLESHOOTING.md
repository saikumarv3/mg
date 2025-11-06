# Troubleshooting Guide

## ❌ "localhost refused to connect" Error

### Problem
When clicking on Dashboard (App3), you see:
- "localhost refused to connect"
- Loading spinner that never stops
- Error message in the UI

### Cause
The Angular app (App3) is not running on port 3003.

### Solutions

#### Solution 1: Start All Apps (Recommended)
```bash
# From root directory
npm run dev
```

This starts all 4 apps:
- Host: http://localhost:3000
- App1: http://localhost:3001
- App2: http://localhost:3002
- App3: http://localhost:3003 ✅

#### Solution 2: Start App3 Only
```bash
# From root directory
npm run dev:app3
```

Or:
```bash
cd packages/app3
npm run dev
```

#### Solution 3: Manual Check
1. Open a new terminal
2. Check if port 3003 is in use:
   ```bash
   # Windows PowerShell
   Test-NetConnection localhost -Port 3003
   
   # Or check in browser
   # Visit: http://localhost:3003
   ```

### Verification Steps

1. **Check if App3 is running:**
   - Open browser: http://localhost:3003
   - Should see Angular dashboard

2. **Check terminal output:**
   - Look for: `[webpack-dev-server] Server started: ... port 3003`

3. **Check browser console:**
   - Should see: `Angular app bootstrapped successfully`

### Common Issues

#### Issue: Port 3003 already in use
**Error:** `EADDRINUSE: address already in use :::3003`

**Solution:**
```bash
# Find process using port 3003 (Windows)
netstat -ano | findstr :3003

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### Issue: App3 won't start
**Error:** Various compilation or dependency errors

**Solution:**
```bash
# Clean and reinstall
cd packages/app3
rm -rf node_modules
npm install
npm run dev
```

#### Issue: Module Federation errors
**Error:** `Shared module is not available for eager consumption`

**Solution:**
- Already fixed in current codebase
- Make sure you're using the latest `webpack.config.js` and `main.ts`

### Quick Test

Run this to verify all apps are running:

```bash
# Test all ports
curl http://localhost:3000  # Host
curl http://localhost:3001  # App1
curl http://localhost:3002  # App2
curl http://localhost:3003  # App3
```

All should return HTML (not connection errors).

### Still Not Working?

1. **Check package.json scripts:**
   - Verify `dev:app3` script exists
   - Should be: `"dev": "webpack serve --config webpack.config.js"`

2. **Check webpack config:**
   - Verify `devServer.port: 3003`
   - Check `entry: './src/bootstrap.ts'`

3. **Check Angular dependencies:**
   ```bash
   cd packages/app3
   npm list @angular/core
   ```

4. **Check for TypeScript errors:**
   ```bash
   cd packages/app3
   npx tsc --noEmit
   ```

### Need More Help?

Check the browser console and terminal output for specific error messages.

