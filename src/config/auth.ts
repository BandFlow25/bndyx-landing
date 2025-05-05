/**
 * Authentication configuration for bndy-centrestage (formerly bndy-landing)
 * This centralizes all environment-specific auth configuration
 */

// Environment detection
const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

// Auth service configuration
export const AUTH_CONFIG = {
  // Base URLs for services
  urls: {
    // Auth service (bndy-centrestage, formerly bndy-landing)
    auth: isDevelopment 
      ? 'https://localhost:3001' 
      : 'https://bndy.co.uk',
    
    // Backstage application (bndy-backstage, formerly bndy-core)
    core: isDevelopment
      ? 'https://localhost:3002'
      : 'https://backstage.bndy.co.uk',
    
    // Frontstage application (bndy-frontstage, formerly bndy-live)
    live: isDevelopment
      ? 'https://localhost:3000'
      : 'https://bndy.live',
  },
  
  // Token configuration
  tokens: {
    storageKey: 'bndyAuthToken',
    exchangeEndpoint: '/api/auth/exchange',
    loginEndpoint: '/api/auth/login',
  },
  
  // Default redirect paths
  redirects: {
    afterLogin: '/dashboard',
    afterLogout: '/',
  },
  
  // Auth code configuration
  authCode: {
    expirationMinutes: 5,
  }
};

// Log configuration in development
if (isDevelopment) {
  console.log('AUTH_CONFIG: Using development configuration', AUTH_CONFIG);
}

export default AUTH_CONFIG;
