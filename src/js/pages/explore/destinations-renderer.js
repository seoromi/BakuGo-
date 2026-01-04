/**
 * Destinations Renderer
 * 
 * Fetches destination data from destinations.json and renders
 * only active destinations using safe DOM manipulation.
 */

// Safe DOM manipulation utilities
// These functions prevent XSS by using safe DOM methods

/**
 * Sanitize URL to prevent javascript: and data: XSS
 * @param {string} url - URL to sanitize
 * @returns {string} Sanitized URL or '#' if unsafe
 */
function sanitizeUrl(url) {
    if (typeof url !== 'string') return '#';
    const trimmed = url.trim();
    if (trimmed.toLowerCase().startsWith('javascript:') || 
        trimmed.toLowerCase().startsWith('data:') ||
        trimmed.toLowerCase().startsWith('vbscript:')) {
        return '#';
    }
    return trimmed;
}

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
 * Create element with safe text content
 * @param {string} tag - HTML tag name
 * @param {string} text - Text content (will be escaped via textContent)
 * @param {Object} attributes - Optional attributes object
 * @returns {HTMLElement} Created element
 */
function createSafeElement(tag, text = '', attributes = {}) {
    const element = document.createElement(tag);
    
    // Use textContent (safest - automatically escapes)
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
        } else if (key === 'href' || key === 'src') {
            // Sanitize URLs
            element.setAttribute(key, sanitizeUrl(attributes[key]));
        } else if (key !== 'innerHTML') {
            // Escape attribute values for safety
            element.setAttribute(key, escapeHtml(String(attributes[key])));
        }
    });
    
    return element;
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
 * Fetch destinations data from JSON file
 * @returns {Promise<Array>} Array of destination objects
 */
async function fetchDestinations() {
    try {
        const response = await fetch('data/destinations.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch destinations: ${response.statusText}`);
        }
        const data = await response.json();
        return data.destinations || [];
    } catch (error) {
        if (window.ENV?.DEBUG === true) {
            console.error('Error fetching destinations:', error);
        }
        return [];
    }
}

/**
 * Filter destinations by status
 * Only returns destinations with status === 'active'
 * @param {Array} destinations - Array of destination objects
 * @returns {Array} Filtered array of active destinations
 */
function filterActiveDestinations(destinations) {
    return destinations.filter(dest => dest.status === 'active');
}

/**
 * Create a destination card element using safe DOM manipulation
 * @param {Object} destination - Destination data object
 * @returns {HTMLElement} Complete destination card element
 */
function createDestinationCard(destination) {
    // Sanitize URL
    const safeUrl = sanitizeUrl(destination.url || '#');
    
    // Create link wrapper
    const link = createSafeElement('a', '', {
        href: safeUrl,
        'aria-label': `Visit ${destination.name} destination page`
    });
    
    // Create place card container
    const placeCard = createSafeElement('div', '', {
        className: 'place-card',
        'data-destination-id': destination.id
    });
    
    // Create image container with background image
    const placeImage = createSafeElement('div', '', {
        className: 'place-image'
    });
    // Sanitize image URL to prevent XSS (escape single quotes)
    const safeImageUrl = destination.image ? destination.image.replace(/'/g, "\\'") : '';
    if (safeImageUrl) {
        placeImage.style.backgroundImage = `url('${safeImageUrl}')`;
    }
    
    // Create overlay text
    const overlay = createSafeElement('div', destination.overlayText || '', {
        className: 'place-overlay'
    });
    placeImage.appendChild(overlay);
    
    // Create content container
    const placeContent = createSafeElement('div', '', {
        className: 'place-content'
    });
    
    // Create title
    const title = createSafeElement('h3', destination.name || '', {
        className: 'place-title'
    });
    
    // Create description
    const description = createSafeElement('p', destination.shortDescription || '', {
        className: 'place-desc'
    });
    
    // Assemble content
    placeContent.appendChild(title);
    placeContent.appendChild(description);
    
    // Assemble card
    placeCard.appendChild(placeImage);
    placeCard.appendChild(placeContent);
    
    // Add click handler for analytics/tracking (preserves existing functionality)
    placeCard.addEventListener('click', function() {
        if (typeof navigateToPlace === 'function') {
            navigateToPlace(destination.id);
        }
    });
    
    // Assemble link
    link.appendChild(placeCard);
    
    return link;
}

/**
 * Render destinations to the container
 * @param {Array} destinations - Array of destination objects
 * @param {HTMLElement} container - Container element to render into
 */
function renderDestinations(destinations, container) {
    if (!container) {
        if (window.ENV?.DEBUG === true) {
            console.error('Destination container not found');
        }
        return;
    }
    
    // Clear existing content
    container.textContent = '';
    
    // Filter to only active destinations
    const activeDestinations = filterActiveDestinations(destinations);
    
    if (activeDestinations.length === 0) {
        const message = createSafeElement('p', 'No destinations available at this time.', {
            className: 'no-destinations-message',
            style: {
                textAlign: 'center',
                padding: '2rem',
                color: '#666'
            }
        });
        container.appendChild(message);
        return;
    }
    
    // Create and append each destination card
    activeDestinations.forEach(destination => {
        const card = createDestinationCard(destination);
        container.appendChild(card);
    });
    
    if (window.ENV?.DEBUG === true) {
        console.log(`✅ Rendered ${activeDestinations.length} active destinations`);
    }
}

/**
 * Initialize destinations rendering
 * This is the main entry point for the destinations renderer
 */
async function initDestinations() {
    const container = document.getElementById('destinationsContainer');
    
    if (!container) {
        if (window.ENV?.DEBUG === true) {
            console.warn('Destinations container not found. Destinations will not be rendered.');
        }
        return;
    }
    
    // Show loading state
    container.textContent = '';
    const loadingMsg = document.createElement('p');
    loadingMsg.style.cssText = 'text-align: center; padding: 2rem; color: #666;';
    loadingMsg.textContent = 'Loading destinations...';
    container.appendChild(loadingMsg);
    
    try {
        // Fetch destinations
        const destinations = await fetchDestinations();
        
        // Render destinations
        renderDestinations(destinations, container);
        
        // Re-initialize entrance animations if the function exists
        if (typeof initEntranceAnimations === 'function') {
            setTimeout(() => {
                initEntranceAnimations();
            }, 100);
        }
        
        // Re-initialize interactive effects if the function exists
        if (typeof initInteractiveEffects === 'function') {
            setTimeout(() => {
                initInteractiveEffects();
            }, 100);
        }
        
        // Re-initialize accessibility features if the function exists
        if (typeof initAccessibility === 'function') {
            setTimeout(() => {
                initAccessibility();
            }, 100);
        }
        
    } catch (error) {
        if (window.ENV?.DEBUG === true) {
            console.error('Error initializing destinations:', error);
        }
        container.textContent = '';
        const errorMsg = document.createElement('p');
        errorMsg.style.cssText = 'text-align: center; padding: 2rem; color: #d32f2f;';
        errorMsg.textContent = 'Error loading destinations. Please refresh the page.';
        container.appendChild(errorMsg);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDestinations);
} else {
    initDestinations();
}

// Make functions available globally for compatibility
window.DestinationsRenderer = {
    init: initDestinations,
    fetch: fetchDestinations,
    render: renderDestinations,
    filter: filterActiveDestinations
};

