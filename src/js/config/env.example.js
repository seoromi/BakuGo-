/**
 * Environment Configuration Example
 * 
 * Copy this file to env.js and customize for your environment.
 * Or set window.ENV in HTML before loading env.js
 */

// Option 1: Set in HTML (before env.js loads)
/*
<script>
  window.ENV = {
    ENVIRONMENT: 'production',
    API_BASE_URL: 'https://api.example.com/api',
    API_TIMEOUT: 30000,
    DEBUG: false,
    LOG_LEVEL: 'error',
    FEATURES: {
      ANALYTICS: true,
      ERROR_TRACKING: true
    }
  };
</script>
<script src="js/config/env.js"></script>
*/

// Option 2: Create environment-specific files
// - env.js (default/development)
// - env.prod.js (production - replace env.js in build)
// - env.staging.js (staging - replace env.js in build)

