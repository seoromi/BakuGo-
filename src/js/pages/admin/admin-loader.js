// Admin Panel Module Loader
// This file dynamically loads all admin panel modules in the correct order
// Use this instead of manually adding 10+ script tags

(function() {
    'use strict';
    
    const modules = [
        'rate-limiter.js',
        'admin-panel-core.js',
        'admin-validators.js',
        'admin-utils.js',
        // Add more as they're created:
        // 'admin-data.js',
        // 'admin-renderers.js',
        // 'admin-filters.js',
        // 'admin-modals.js',
        // 'admin-dashboard.js',
        // 'admin-charts.js',
        // 'admin-crud.js',
        // 'admin-sections.js',
        // 'admin-globals.js'
    ];
    
    const basePath = 'src/js/pages/admin/';
    let loadedCount = 0;
    
    function loadModule(index) {
        if (index >= modules.length) {
            // All modules loaded, initialize AdminPanel
            if (typeof AdminPanel !== 'undefined') {
                window.adminPanel = new AdminPanel();
            } else {
                console.error('AdminPanel class not found after loading modules');
            }
            return;
        }
        
        const script = document.createElement('script');
        script.src = basePath + modules[index];
        script.onload = () => {
            loadedCount++;
            loadModule(index + 1);
        };
        script.onerror = () => {
            console.error(`Failed to load module: ${modules[index]}`);
            loadModule(index + 1); // Continue loading other modules
        };
        document.head.appendChild(script);
    }
    
    // Start loading modules
    loadModule(0);
})();

