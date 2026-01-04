/**
 * Environment Configuration
 * 
 * Manages environment-specific settings.
 * 
 * Usage:
 * - Development: Use default values or set window.ENV in HTML
 * - Production: Create env.prod.js with production values, or set window.ENV in HTML
 * - Staging: Create env.staging.js with staging values, or set window.ENV in HTML
 * 
 * Example in HTML:
 * <script>
 *   window.ENV = {
 *     API_BASE_URL: 'https://api.example.com',
 *     ENVIRONMENT: 'production'
 *   };
 * </script>
 * <script src="js/config/env.js"></script>
 */

// Read environment from window.ENV (set in HTML) or detect from hostname
const getEnvFromHostname = () => {
  if (typeof window === 'undefined') return 'development';
  
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
    return 'development';
  }
  
  if (hostname.includes('staging') || hostname.includes('stage')) {
    return 'staging';
  }
  
  return 'production';
};

// Get environment value
const ENV_VARS = window.ENV || {};

// Environment detection
const ENVIRONMENT = ENV_VARS.ENVIRONMENT || getEnvFromHostname();

// Environment-specific configurations
const ENV_CONFIG = {
  development: {
    API_BASE_URL: '/api',
    API_TIMEOUT: 30000,
    DEBUG: true,
    LOG_LEVEL: 'debug'
  },
  
  staging: {
    API_BASE_URL: 'https://staging-api.example.com/api',
    API_TIMEOUT: 30000,
    DEBUG: true,
    LOG_LEVEL: 'info'
  },
  
  production: {
    API_BASE_URL: 'https://api.example.com/api',
    API_TIMEOUT: 30000,
    DEBUG: false,
    LOG_LEVEL: 'error'
  }
};

// Merge environment config with window.ENV overrides
const config = {
  ...ENV_CONFIG[ENVIRONMENT],
  ...ENV_VARS,
  ENVIRONMENT
};

// Export environment variables
const ENV = {
  // Environment name
  ENVIRONMENT: config.ENVIRONMENT,
  
  // API Configuration
  API_BASE_URL: config.API_BASE_URL || '/api',
  API_TIMEOUT: config.API_TIMEOUT || 30000,
  
  // Debug settings
  DEBUG: config.DEBUG || false,
  LOG_LEVEL: config.LOG_LEVEL || 'error',
  
  // Feature flags (can be overridden via window.ENV)
  FEATURES: {
    ANALYTICS: config.FEATURES?.ANALYTICS !== false,
    ERROR_TRACKING: config.FEATURES?.ERROR_TRACKING !== false,
    ...config.FEATURES
  },
  
  // Custom config from window.ENV
  ...config
};

// Make available globally
if (typeof window !== 'undefined') {
  window.ENV = ENV;
}

// Export for Node.js environments (if needed for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ENV;
}

