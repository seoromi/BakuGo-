// Admin Panel API Methods
// Handles API requests, authentication, and CSRF tokens

/**
 * Security: API request helper with authentication
 * Note: Authentication is handled via httpOnly cookies (set by backend)
 * Cookies are sent automatically by the browser, no JavaScript access needed
 */
export function getAuthToken() {
    // Authentication is handled via httpOnly cookies
    // No token access needed - cookies are sent automatically with requests
    // This function returns null to indicate no manual token handling is needed
    return null;
}

/**
 * Security: CSRF token helper (for future backend integration)
 */
export function getCSRFToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.content : null;
}

/**
 * Security: API request helper with authentication
 */
export async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const csrfToken = getCSRFToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
    }
    
    // Note: Authentication token is handled via httpOnly cookies
    // No Authorization header needed - cookies sent automatically
    
    try {
        const response = await fetch(endpoint, {
            ...options,
            credentials: 'include', // Send httpOnly cookies automatically
            headers,
            body: options.body ? JSON.stringify(options.body) : options.body
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        if (window.ENV?.DEBUG === true) {
            if (window.ENV?.DEBUG === true) {
                console.error('API request error:', error);
            }
        }
        throw error;
    }
}

/**
 * Mixin function to add API methods to AdminPanel
 */
export function mixinApiMethods(AdminPanelClass) {
    AdminPanelClass.prototype.getAuthToken = function() {
        return getAuthToken();
    };
    
    AdminPanelClass.prototype.getCSRFToken = function() {
        return getCSRFToken();
    };
    
    AdminPanelClass.prototype.apiRequest = function(endpoint, options = {}) {
        return apiRequest(endpoint, options);
    };
}

