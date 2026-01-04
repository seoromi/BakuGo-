/**
 * XSS Sanitization Utility
 * 
 * Provides safe methods for rendering user-generated content
 * to prevent Cross-Site Scripting (XSS) attacks.
 */

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for textContent
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return String(text);
    }
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Sanitize HTML string using DOMPurify if available, otherwise escape
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
function sanitizeHtml(html) {
    if (typeof html !== 'string') {
        return '';
    }
    
    // Use DOMPurify if available (loaded via CDN)
    if (typeof DOMPurify !== 'undefined') {
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
            ALLOWED_ATTR: ['href', 'class', 'style', 'id', 'data-*'],
            ALLOW_DATA_ATTR: true
        });
    }
    
    // Fallback: escape all HTML (safer but less flexible)
    return escapeHtml(html);
}

/**
 * Safely set text content (prevents XSS)
 * @param {HTMLElement} element - Element to set text on
 * @param {string} text - Text content
 */
function setTextContent(element, text) {
    if (!element) return;
    element.textContent = text || '';
}

/**
 * Safely set HTML content with sanitization
 * @param {HTMLElement} element - Element to set HTML on
 * @param {string} html - HTML content to sanitize and set
 */
function setSafeHtml(element, html) {
    if (!element) return;
    element.innerHTML = sanitizeHtml(html);
}

/**
 * Create element with safe text content
 * @param {string} tag - HTML tag name
 * @param {string} text - Text content (will be escaped)
 * @param {Object} attributes - Optional attributes object
 * @returns {HTMLElement} Created element
 */
function createSafeElement(tag, text = '', attributes = {}) {
    const element = document.createElement(tag);
    
    if (text) {
        element.textContent = text;
    }
    
    // Set attributes safely
    Object.keys(attributes).forEach(key => {
        if (key === 'style' && typeof attributes[key] === 'object') {
            // Handle style object
            Object.assign(element.style, attributes[key]);
        } else if (key.startsWith('data-')) {
            // Data attributes are safe
            element.setAttribute(key, String(attributes[key]));
        } else if (key === 'className' || key === 'class') {
            element.className = String(attributes[key]);
        } else if (key === 'innerHTML') {
            // If innerHTML is provided, sanitize it
            setSafeHtml(element, attributes[key]);
        } else {
            // Escape attribute values
            element.setAttribute(key, escapeHtml(String(attributes[key])));
        }
    });
    
    return element;
}

/**
 * Sanitize URL to prevent javascript: and data: XSS
 * @param {string} url - URL to sanitize
 * @returns {string} Sanitized URL or '#' if unsafe
 */
function sanitizeUrl(url) {
    if (typeof url !== 'string') return '#';
    
    const trimmed = url.trim();
    
    // Block javascript: and data: protocols
    if (trimmed.toLowerCase().startsWith('javascript:') || 
        trimmed.toLowerCase().startsWith('data:') ||
        trimmed.toLowerCase().startsWith('vbscript:')) {
        return '#';
    }
    
    // Allow http, https, mailto, tel, and relative URLs
    if (trimmed.startsWith('http://') || 
        trimmed.startsWith('https://') ||
        trimmed.startsWith('mailto:') ||
        trimmed.startsWith('tel:') ||
        trimmed.startsWith('/') ||
        trimmed.startsWith('./') ||
        trimmed.startsWith('../') ||
        !trimmed.includes(':')) {
        return trimmed;
    }
    
    return '#';
}

// ES Module exports
export {
    escapeHtml,
    sanitizeHtml,
    setTextContent,
    setSafeHtml,
    createSafeElement,
    sanitizeUrl
};

