// Admin Panel Validation Methods
// This module extends AdminPanel with validation functionality via mixin pattern

/**
 * Mixin function to add validation methods to AdminPanel
 * @param {Function} AdminPanelClass - The AdminPanel class to extend
 */
export function mixinValidatorMethods(AdminPanelClass) {
    // Security: HTML escaping helper
    AdminPanelClass.prototype.escapeHtml = function(text) {
        if (typeof text !== 'string') {
            return String(text || '');
        }
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Security: Safe HTML rendering using Sanitize utility
    AdminPanelClass.prototype.setSafeHtml = function(element, html) {
        if (!element) return;
        if (window.Sanitize && window.Sanitize.setSafeHtml) {
            window.Sanitize.setSafeHtml(element, html);
        } else {
            // Fallback: use textContent for safety
            element.textContent = '';
            const temp = document.createElement('div');
            temp.textContent = html;
            element.appendChild(temp);
        }
    };

    // Security: Input validation methods
    AdminPanelClass.prototype.validateEmail = function(email) {
        if (!email || typeof email !== 'string') return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    };

    AdminPanelClass.prototype.validatePhone = function(phone) {
        if (!phone || typeof phone !== 'string') return false;
        // Allow international format with +, digits, spaces, dashes, parentheses
        return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(phone.trim());
    };

    AdminPanelClass.prototype.validatePrice = function(price) {
        const num = parseFloat(price);
        return !isNaN(num) && num >= 0 && isFinite(num);
    };

    AdminPanelClass.prototype.validateRequired = function(value) {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        return true;
    };

    AdminPanelClass.prototype.validateId = function(id) {
        const num = parseInt(id);
        return !isNaN(num) && num > 0 && isFinite(num);
    };

    // Security: Whitelist validation for status/type values (prevents XSS in className)
    AdminPanelClass.prototype.validateStatus = function(status) {
        const allowedStatuses = ['active', 'inactive', 'pending', 'confirmed', 'completed', 'cancelled', 'draft', 'published'];
        if (!status || typeof status !== 'string') return 'pending';
        const normalized = status.toLowerCase().trim();
        return allowedStatuses.includes(normalized) ? normalized : 'pending';
    };

    AdminPanelClass.prototype.validateTourType = function(type) {
        const allowedTypes = ['group', 'private', 'package', 'custom'];
        if (!type || typeof type !== 'string') return 'group';
        const normalized = type.toLowerCase().trim();
        return allowedTypes.includes(normalized) ? normalized : 'group';
    };

    AdminPanelClass.prototype.validateContentType = function(type) {
        const allowedTypes = ['page', 'blog', 'announcement', 'news'];
        if (!type || typeof type !== 'string') return 'page';
        const normalized = type.toLowerCase().trim();
        return allowedTypes.includes(normalized) ? normalized : 'page';
    };

    // Security: Image URL validation
    AdminPanelClass.prototype.validateImageUrl = function(url) {
        if (!url || typeof url !== 'string') return { valid: false, error: 'URL is required' };
        
        const trimmed = url.trim();
        if (!trimmed) return { valid: false, error: 'URL cannot be empty' };
        
        try {
            // Try to parse as absolute URL
            const parsed = new URL(trimmed, window.location.origin);
            // Only allow http, https, and relative URLs
            if (!['http:', 'https:', ''].includes(parsed.protocol)) {
                return { valid: false, error: 'Only HTTP, HTTPS, and relative URLs are allowed' };
            }
            return { valid: true, url: trimmed };
        } catch {
            // If URL parsing fails, check if it's a relative path
            if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
                return { valid: true, url: trimmed };
            }
            // Check if it's a data URL (for previews only)
            if (trimmed.startsWith('data:image/')) {
                return { valid: true, url: trimmed };
            }
            return { valid: false, error: 'Invalid URL format' };
        }
    };

    // Security: Enhanced file upload validation
    AdminPanelClass.prototype.validateImageFile = function(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!file) {
            return { valid: false, error: 'No file provided' };
        }
        
        if (!allowedTypes.includes(file.type)) {
            return { 
                valid: false, 
                error: 'Only JPEG, PNG, GIF, and WebP images are allowed' 
            };
        }
        
        if (file.size > maxSize) {
            return { 
                valid: false, 
                error: 'File size must be less than 5MB' 
            };
        }
        
        return { valid: true };
    };

    // Security: CSRF token helper (for future backend integration)
    AdminPanelClass.prototype.getCSRFToken = function() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.content : null;
    };

    // Security: CSV injection protection - escape special characters
    AdminPanelClass.prototype.escapeCSVField = function(field) {
        if (field === null || field === undefined) return '';
        
        const str = String(field);
        
        // CSV injection protection: escape formulas starting with =, +, -, @, \t, \r
        // These can be used for formula injection attacks in Excel/Google Sheets
        if (/^[=+\-@\t\r]/.test(str)) {
            return "'" + str.replace(/'/g, "''"); // Prefix with ' and escape single quotes
        }
        
        // If field contains comma, quote, or newline, wrap in quotes and escape quotes
        if (/[,"\n\r]/.test(str)) {
            return '"' + str.replace(/"/g, '""') + '"'; // Escape double quotes
        }
        
        return str;
    };

    // Security: Authentication token helper (for future backend integration)
    // Note: Authentication is handled via httpOnly cookies (set by backend)
    // Cookies are sent automatically by the browser, no JavaScript access needed
    // This method is kept for backward compatibility but should not be used
    AdminPanelClass.prototype.getAuthToken = function() {
        // Authentication is handled via httpOnly cookies
        // No token access needed - cookies are sent automatically with requests
        // This method returns null to indicate no manual token handling is needed
        return null;
    };

    // Security: API request helper with authentication
    AdminPanelClass.prototype.apiRequest = async function(endpoint, options = {}) {
        const token = this.getAuthToken();
        const csrfToken = this.getCSRFToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (csrfToken) {
            headers['X-CSRF-Token'] = csrfToken;
        }
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(endpoint, {
                ...options,
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
                console.error('API request error:', error);
            }
            throw error;
        }
    };
}

