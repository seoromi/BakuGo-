/**
 * Main Application Entry Point
 * 
 * Initializes the application and all components.
 * This is the single entry point for the frontend application.
 */

import { TourComponent } from './core/tour-component.js';
import { TourSectionsService } from './services/tour-sections.service.js';

/**
 * Initialize the application
 */
async function init() {
    try {
        // Initialize services
        const tourSectionsService = new TourSectionsService();
        
        // Initialize tour components
        TourComponent.initAll(tourSectionsService);
        
        if (window.ENV?.DEBUG === true) {
            console.log('✅ Application initialized successfully');
        }
    } catch (error) {
        if (window.ENV?.DEBUG === true) {
            console.error('❌ Failed to initialize application:', error);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded
    init();
}

