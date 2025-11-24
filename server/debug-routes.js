// Add this to your server/index.ts temporarily to debug routes
const debugRoutes = (app) => {
  console.log('🔍 DEBUG: Checking registered routes...');
  
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      console.log(`🛣️  DIRECT: ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      // Router middleware
      console.log(`🛣️  ROUTER: ${middleware.regexp}`);
      if (middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            console.log(`   → ${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
          }
        });
      }
    }
  });
};
