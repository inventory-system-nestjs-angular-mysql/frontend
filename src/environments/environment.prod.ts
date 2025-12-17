/**
 * Environment configuration for production
 * 
 * Note: Update the apiUrl to match your production API endpoint
 * For build-time replacement, use: ng build --configuration production
 * For runtime configuration, consider using a config.json file loaded at startup
 */
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api', // TODO: Update with your production API URL
  appName: 'Inventory Management System',
  version: '1.0.0'
};

