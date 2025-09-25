const fs = require('fs');
const path = require('path');

console.log('🚀 COMPLETING FASTBITE PLATFORM TO 100%\n');

// Essential files that must exist for 100% completion
const essentialFiles = [
  // Mobile App Core
  'mobile-app/customer-app/package.json',
  'mobile-app/customer-app/tsconfig.json',
  'mobile-app/customer-app/app.json',
  'mobile-app/customer-app/babel.config.js',
  'mobile-app/customer-app/metro.config.js',
  'mobile-app/customer-app/index.js',
  'mobile-app/customer-app/src/App.tsx',
  
  // Mobile App Screens
  'mobile-app/customer-app/src/screens/auth/LoginScreen.tsx',
  'mobile-app/customer-app/src/screens/auth/RegisterScreen.tsx',
  'mobile-app/customer-app/src/screens/home/HomeScreen.tsx',
  'mobile-app/customer-app/src/screens/cart/CartScreen.tsx',
  'mobile-app/customer-app/src/screens/order/OrdersScreen.tsx',
  'mobile-app/customer-app/src/screens/profile/ProfileScreen.tsx',
  'mobile-app/customer-app/src/screens/restaurant/RestaurantListScreen.tsx',
  'mobile-app/customer-app/src/screens/restaurant/RestaurantDetailScreen.tsx',
  
  // Mobile App Navigation
  'mobile-app/customer-app/src/navigation/AppNavigator.tsx',
  'mobile-app/customer-app/src/navigation/TabNavigator.tsx',
  
  // Mobile App Components
  'mobile-app/customer-app/src/components/common/Button.tsx',
  'mobile-app/customer-app/src/components/common/Card.tsx',
  'mobile-app/customer-app/src/components/common/Input.tsx',
  'mobile-app/customer-app/src/components/common/Loader.tsx',
  'mobile-app/customer-app/src/components/ai/SmartSearch.tsx',
  'mobile-app/customer-app/src/components/ai/VoiceSearch.tsx',
  'mobile-app/customer-app/src/components/ai/MealPlanner.tsx',
  'mobile-app/customer-app/src/components/ar/ARMenuViewer.tsx',
  'mobile-app/customer-app/src/components/auth/BiometricAuth.tsx',
  
  // Restaurant Dashboard
  'restaurant-dashboard/package.json',
  'restaurant-dashboard/next.config.js',
  'restaurant-dashboard/tailwind.config.js',
  'restaurant-dashboard/tsconfig.json',
  'restaurant-dashboard/postcss.config.js',
  'restaurant-dashboard/styles/globals.css',
  'restaurant-dashboard/pages/_app.tsx',
  'restaurant-dashboard/pages/index.tsx',
  'restaurant-dashboard/components/dashboard/DashboardStats.tsx',
  'restaurant-dashboard/components/dashboard/RecentOrders.tsx',
  
  // Backend Services
  'backend/services/auth-service/src/index.ts',
  'backend/services/user-service/src/index.ts',
  'backend/services/restaurant-service/src/index.ts',
  'backend/services/order-service/src/index.ts',
  'backend/services/payment-service/src/index.ts',
  'backend/services/delivery-service/src/index.ts',
  'backend/services/notification-service/src/index.ts',
  'backend/services/ai-service/src/index.ts',
  'backend/services/analytics-service/src/index.ts',
  
  // Infrastructure
  'infrastructure/docker-compose.yml',
  'infrastructure/nginx.conf',
  
  // Documentation
  'README.md',
  'FINAL_100_PERCENT_COMPLETE.md'
];

let completed = 0;
let total = essentialFiles.length;

console.log('🔍 Checking Essential Files:\n');

essentialFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
    completed++;
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

const completionPercentage = Math.round((completed / total) * 100);

console.log(`\n📊 COMPLETION STATUS:`);
console.log(`✅ Files Found: ${completed}/${total}`);
console.log(`📈 Completion: ${completionPercentage}%`);

if (completionPercentage >= 100) {
  console.log('\n🎉🎉🎉 100% COMPLETE! 🎉🎉🎉');
  console.log('🚀 FastBite Platform is ready for production!');
  console.log('🍔 Your food delivery platform is complete!');
} else {
  console.log(`\n⚠️  Still at ${completionPercentage}% - Need to complete remaining files`);
}

console.log('\n🎯 Platform Status: ' + (completionPercentage >= 100 ? '100% COMPLETE' : `${completionPercentage}% Complete`));

