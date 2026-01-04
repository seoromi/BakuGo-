// Admin Panel Entry Point
// This is the main entry file that imports and initializes all modules

/**
 * SECURITY NOTES FOR PRODUCTION:
 * 
 * 1. Content Security Policy (CSP) - Add to HTML <head>:
 *    <meta http-equiv="Content-Security-Policy" 
 *          content="default-src 'self'; 
 *                   script-src 'self' 'unsafe-inline'; 
 *                   style-src 'self' 'unsafe-inline'; 
 *                   img-src 'self' data: https: blob:;
 *                   connect-src 'self' https:;
 *                   font-src 'self' data:;">
 * 
 * 2. Authentication - Use httpOnly cookies instead of localStorage:
 *    - localStorage.getItem('authToken') is vulnerable to XSS
 *    - Backend should set httpOnly cookies that cannot be accessed via JavaScript
 * 
 * 3. CSV Export - All fields are sanitized to prevent formula injection attacks
 * 
 * 4. File Uploads - Validated for type and size, using object URLs for memory efficiency
 */

// Import core dependencies
import { RateLimiter } from './rate-limiter.js';
import { AdminPanel } from './admin-panel-core.js';

// Import base mixins FIRST (these provide methods used by core and other mixins)
import { mixinUtilityMethods } from './admin-utils.js';
import { mixinValidatorMethods } from './admin-validators.js';

// Import feature mixins
import { mixinApiMethods } from './admin-api.js';
import { mixinDataMethods } from './admin-data.js';
import { mixinRendererMethods } from './admin-renderers.js';
import { mixinFormMethods } from './admin-forms.js';
import { mixinCrudMethods } from './admin-crud.js';
import { mixinFilterMethods } from './admin-filters.js';
import { mixinChartMethods } from './admin-charts.js';
import { mixinDashboardMethods } from './admin-dashboard.js';

// Apply base mixins FIRST (before other mixins that may depend on them)
mixinUtilityMethods(AdminPanel);
mixinValidatorMethods(AdminPanel);

// Import globals (for HTML onclick handlers)
import './admin-globals.js';

// Apply feature mixins (after base mixins)
mixinApiMethods(AdminPanel);
mixinDataMethods(AdminPanel);
mixinRendererMethods(AdminPanel);
mixinFormMethods(AdminPanel);
mixinCrudMethods(AdminPanel);
mixinFilterMethods(AdminPanel);
mixinChartMethods(AdminPanel);
mixinDashboardMethods(AdminPanel);

// Make AdminPanel available globally for HTML onclick handlers and debugging
if (typeof window !== 'undefined') {
    window.AdminPanel = AdminPanel;
}

// Initialize admin panel when DOM is loaded
// Optimized: Single initialization point with proper error handling
(function initAdminPanel() {
    'use strict';
    
    function initialize() {
        try {
            // AdminPanel is imported at module level, so it's always available here
            if (window.adminPanel) {
                if (window.ENV?.DEBUG === true) {
                    console.warn('⚠️ AdminPanel already initialized.');
                }
                return;
            }
            
            window.adminPanel = new AdminPanel();
            if (window.ENV?.DEBUG === true) {
                console.log('✅ AdminPanel initialized successfully');
            }
        } catch (error) {
            if (window.ENV?.DEBUG === true) {
                console.error('❌ Failed to initialize AdminPanel:', error);
                console.error('Error details:', error.stack);
            }
        }
    }
    
    // Handle DOM ready state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded
        initialize();
    }
    
    // Suppress browser extension errors (harmless)
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.lastError) {
        // Silently ignore extension port closure errors
        const originalError = chrome.runtime.lastError;
        Object.defineProperty(chrome.runtime, 'lastError', {
            get: function() {
                try {
                    return originalError;
                } catch (e) {
                    return null;
                }
            }
        });
    }
})();

// Export AdminPanel for potential external use
export { AdminPanel };

