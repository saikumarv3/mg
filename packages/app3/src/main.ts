/**
 * Bootstrap Angular application with retry logic
 * 
 * This retry mechanism is necessary because:
 * - Module Federation loads shared modules asynchronously
 * - Angular requires Zone.js to be loaded before bootstrap
 * - Dynamic imports can have timing issues with Module Federation
 * - Retries ensure Angular bootstraps after all dependencies are ready
 * 
 * @param retries - Number of retry attempts (default: 3)
 */
async function bootstrapAngular(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await import('zone.js');

      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Import design system CSS
      await import('@r-design-system/dist/r-design-system/r-design-system.css');
      
      // Define custom elements for r-design-system
      const { defineCustomElements } = await import('@r-design-system/loader');
      defineCustomElements();

      const platformBrowserDynamicModule = await import('@angular/platform-browser-dynamic');
      const appModule = await import('./app/app.module');

      const { platformBrowserDynamic } = platformBrowserDynamicModule;
      const { AppModule } = appModule;

      await platformBrowserDynamic().bootstrapModule(AppModule);
      if (process.env.NODE_ENV === 'development') {
        console.log('Angular app bootstrapped successfully');
      }
      return;
    } catch (err) {
      if (i === retries - 1) {
        console.error('Error bootstrapping Angular after', retries, 'attempts:', err);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Bootstrap attempt ${i + 1} failed, retrying...`);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
}

bootstrapAngular();

// Export empty object to make this a proper module
export {};

