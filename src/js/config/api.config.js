/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints and settings.
 * Reads from env.js for environment-specific values.
 * 
 * Load order:
 * 1. env.js (sets window.ENV)
 * 2. api.config.js (uses window.ENV if available)
 */

// Get environment variables
// Note: env.js sets window.ENV, which is acceptable for config initialization
const env = (typeof window !== 'undefined' && window.ENV) || {
  API_BASE_URL: '/api',
  API_TIMEOUT: 30000
};

const API_CONFIG = {
  // Base API URL (from env.js or default)
  baseURL: env.API_BASE_URL || '/api',
  
  // API Timeout (milliseconds, from env.js or default)
  timeout: env.API_TIMEOUT || 30000,
  
  // Default request headers
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // API Endpoints
  endpoints: {
    // Tours
    tours: {
      list: '/tours',
      detail: (id) => `/tours/${id}`,
      search: '/tours'
    },
    
    // Bookings
    bookings: {
      create: '/bookings',
      detail: (id) => `/bookings/${id}`,
      list: '/bookings',
      update: (id) => `/bookings/${id}`,
      delete: (id) => `/bookings/${id}`
    },
    
    // Reviews
    reviews: {
      create: '/reviews',
      list: '/reviews',
      detail: (id) => `/reviews/${id}`,
      byTour: (tourId) => `/reviews?tourId=${tourId}`
    },
    
    // Destinations
    destinations: {
      list: '/destinations',
      detail: (id) => `/destinations/${id}`
    },
    
    // Tour Sections
    tourSections: {
      list: '/tour-sections',
      detail: (id) => `/tour-sections/${id}`,
      create: '/tour-sections',
      update: (id) => `/tour-sections/${id}`,
      delete: (id) => `/tour-sections/${id}`,
      addTour: (sectionId) => `/tour-sections/${sectionId}/tours`,
      updateTour: (sectionId, tourId) => `/tour-sections/${sectionId}/tours/${tourId}`,
      deleteTour: (sectionId, tourId) => `/tour-sections/${sectionId}/tours/${tourId}`
    },
    
    // Admin endpoints
    admin: {
      tours: {
        list: '/admin/tours',
        create: '/admin/tours',
        update: (id) => `/admin/tours/${id}`,
        delete: (id) => `/admin/tours/${id}`
      },
      bookings: {
        list: '/admin/bookings',
        create: '/admin/bookings',
        update: (id) => `/admin/bookings/${id}`,
        delete: (id) => `/admin/bookings/${id}`
      },
      customers: {
        list: '/admin/customers',
        create: '/admin/customers',
        update: (id) => `/admin/customers/${id}`,
        delete: (id) => `/admin/customers/${id}`
      },
      reviews: {
        list: '/admin/reviews',
        update: (id) => `/admin/reviews/${id}`,
        delete: (id) => `/admin/reviews/${id}`
      },
      destinations: {
        list: '/admin/destinations',
        create: '/admin/destinations',
        update: (id) => `/admin/destinations/${id}`,
        delete: (id) => `/admin/destinations/${id}`
      },
      promoCodes: {
        list: '/admin/promo-codes',
        create: '/admin/promo-codes',
        update: (id) => `/admin/promo-codes/${id}`,
        delete: (id) => `/admin/promo-codes/${id}`
      },
      dashboard: '/admin/dashboard'
    },
    
    // Authentication
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      validate: '/auth/validate'
    }
  }
};

// ES Module export
export { API_CONFIG };

