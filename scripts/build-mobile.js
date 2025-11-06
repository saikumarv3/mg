/**
 * Build script for mobile (Capacitor)
 * This script:
 * 1. Builds all apps (app1, app2, app3)
 * 2. Copies remoteEntry.js files to host app
 * 3. Builds host app with mobile config
 * 4. Prepares for Capacitor
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building for mobile (Capacitor)...\n');
console.log('This will bundle all apps locally for mobile deployment.\n');

// Step 1: Build all remote apps
console.log('📦 Building remote apps...');
try {
  execSync('npm run build --workspace=app1', { stdio: 'inherit' });
  console.log('✅ App1 built\n');
  
  execSync('npm run build --workspace=app2', { stdio: 'inherit' });
  console.log('✅ App2 built\n');
  
  execSync('npm run build --workspace=app3', { stdio: 'inherit' });
  console.log('✅ App3 built\n');
} catch (error) {
  console.error('❌ Error building remote apps:', error);
  process.exit(1);
}

// Step 2: Create remoteEntries directory in host
const hostRemoteDir = path.join(__dirname, '../packages/host/public/remoteEntries');
if (!fs.existsSync(hostRemoteDir)) {
  fs.mkdirSync(hostRemoteDir, { recursive: true });
  fs.mkdirSync(path.join(hostRemoteDir, 'app1'), { recursive: true });
  fs.mkdirSync(path.join(hostRemoteDir, 'app2'), { recursive: true });
  fs.mkdirSync(path.join(hostRemoteDir, 'app3'), { recursive: true });
}

// Step 3: Copy all files from remote apps (remoteEntry.js and all chunk files)
console.log('📋 Copying remote app files...');
try {
  // Helper function to copy all files from a directory
  const copyAllFiles = (srcDir, destDir, appName) => {
    if (!fs.existsSync(srcDir)) {
      console.log(`⚠️  ${appName} dist folder not found: ${srcDir}`);
      return;
    }
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    const files = fs.readdirSync(srcDir);
    let copiedCount = 0;
    
    files.forEach(file => {
      // Skip main.js for App1 and App2 (not needed for Module Federation)
      // But keep main.js for App3 (needed to bootstrap Angular app in iframe)
      // Keep index.html for App3 (needed for iframe loading on mobile)
      const isApp3 = appName === 'App3';
      if (file === 'main.js' && !isApp3) {
        return;
      }
      
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);
      
      const stat = fs.statSync(srcFile);
      if (stat.isFile()) {
        fs.copyFileSync(srcFile, destFile);
        copiedCount++;
      }
    });
    
    console.log(`✅ ${appName}: ${copiedCount} files copied`);
  };

  // Copy App1 files
  const app1Dist = path.join(__dirname, '../packages/app1/dist');
  const app1Dest = path.join(hostRemoteDir, 'app1');
  copyAllFiles(app1Dist, app1Dest, 'App1');

  // Copy App2 files
  const app2Dist = path.join(__dirname, '../packages/app2/dist');
  const app2Dest = path.join(hostRemoteDir, 'app2');
  copyAllFiles(app2Dist, app2Dest, 'App2');

  // Copy App3 files
  const app3Dist = path.join(__dirname, '../packages/app3/dist');
  const app3Dest = path.join(hostRemoteDir, 'app3');
  copyAllFiles(app3Dist, app3Dest, 'App3');
} catch (error) {
  console.error('❌ Error copying remote app files:', error);
  process.exit(1);
}

// Step 4: Build host app with mobile config
console.log('\n📱 Building host app for mobile...');
try {
  execSync('npm run build:mobile --workspace=host', { stdio: 'inherit' });
  console.log('✅ Host app built for mobile\n');
} catch (error) {
  console.error('❌ Error building host app:', error);
  process.exit(1);
}

// Step 5: Copy remoteEntries to dist folder (Capacitor syncs from dist)
console.log('📋 Copying remoteEntries to dist folder...');
const distRemoteDir = path.join(__dirname, '../packages/host/dist/remoteEntries');

// Helper function to copy entire directory
const copyDirectory = (srcDir, destDir) => {
  if (!fs.existsSync(srcDir)) {
    return;
  }
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    
    const stat = fs.statSync(srcFile);
    if (stat.isDirectory()) {
      copyDirectory(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
};

try {
  // Copy entire remoteEntries folder from public to dist
  copyDirectory(hostRemoteDir, distRemoteDir);
  console.log('✅ All remoteEntries copied to dist');
} catch (error) {
  console.error('❌ Error copying remoteEntries to dist:', error);
  process.exit(1);
}

console.log('\n✅ Mobile build complete!');
console.log('\n📱 Next steps:');
console.log('   1. cd packages/host');
console.log('   2. npx cap init (if not already done)');
console.log('   3. npx cap sync');
console.log('   4. npx cap open ios    # For iOS');
console.log('   5. npx cap open android # For Android');
console.log('\n💡 The mobile app will bundle all apps locally - no servers needed!');

