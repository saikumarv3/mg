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

// Step 3: Copy remoteEntry.js files
console.log('📋 Copying remoteEntry.js files...');
try {
  // Copy App1
  const app1Remote = path.join(__dirname, '../packages/app1/dist/remoteEntry.js');
  const app1Dest = path.join(hostRemoteDir, 'app1/remoteEntry.js');
  if (fs.existsSync(app1Remote)) {
    fs.copyFileSync(app1Remote, app1Dest);
    console.log('✅ App1 remoteEntry copied');
  }

  // Copy App2
  const app2Remote = path.join(__dirname, '../packages/app2/dist/remoteEntry.js');
  const app2Dest = path.join(hostRemoteDir, 'app2/remoteEntry.js');
  if (fs.existsSync(app2Remote)) {
    fs.copyFileSync(app2Remote, app2Dest);
    console.log('✅ App2 remoteEntry copied');
  }

  // Copy App3
  const app3Remote = path.join(__dirname, '../packages/app3/dist/remoteEntry.js');
  const app3Dest = path.join(hostRemoteDir, 'app3/remoteEntry.js');
  if (fs.existsSync(app3Remote)) {
    fs.copyFileSync(app3Remote, app3Dest);
    console.log('✅ App3 remoteEntry copied');
  }
} catch (error) {
  console.error('❌ Error copying remoteEntry files:', error);
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

console.log('\n✅ Mobile build complete!');
console.log('\n📱 Next steps:');
console.log('   1. cd packages/host');
console.log('   2. npx cap init (if not already done)');
console.log('   3. npx cap sync');
console.log('   4. npx cap open ios    # For iOS');
console.log('   5. npx cap open android # For Android');
console.log('\n💡 The mobile app will bundle all apps locally - no servers needed!');

