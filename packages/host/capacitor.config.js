const { CapacitorConfig } = require('@capacitor/cli');

const config = {
  appId: 'com.microfrontend.app',
  appName: 'MicroFrontend App',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2d3748',
      showSpinner: true,
      spinnerColor: '#667eea',
    },
  },
};

module.exports = config;

