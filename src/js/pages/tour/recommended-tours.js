/**
 * Recommended Tours for Tour Detail Pages
 * 
 * Dynamically renders recommended tours section on tour detail pages.
 * Recommendations are based on: same city -> same country -> exclude current tour
 * 
 * Automatically detects the current page and matches it to a tour in tours.json
 */

import { getRecommendedTours, getTours } from '../../utils/tours-data.js';

/**
 * Get the current page path relative to root
 * @returns {string} Current page path (e.g., "page/dailytours/gobustanpage.html")
 */
function getCurrentPagePath() {
    const pathname = window.location.pathname;
    // Remove leading slash and handle different path formats
    let pagePath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    
    // If pathname is just "/" or empty, try to get from window.location
    if (!pagePath || pagePath === 'index.html') {
        const fullPath = window.location.href;
        const url = new URL(fullPath);
        pagePath = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
    }
    
    return pagePath;
}

/**
 * Find tour ID by matching current page path to tour.link in JSON
 * @returns {Promise<number|null>} Tour ID or null if not found
 */
async function findTourIdByCurrentPage() {
    const currentPath = getCurrentPagePath();
    const tours = await getTours();
    
    // Try exact match first
    let tour = tours.find(t => t.link === currentPath);
    
    // If no exact match, try matching just the filename
    if (!tour) {
        const currentFilename = currentPath.split('/').pop();
        tour = tours.find(t => {
            const tourLinkFilename = t.link ? t.link.split('/').pop() : '';
            return tourLinkFilename === currentFilename;
        });
    }
    
    return tour ? tour.id : null;
}

/**
 * Adjust image path for pages in subdirectories
 * Pages in page/* subdirectories need ../../ prefix for images
 * @param {string} imagePath - Original image path from JSON
 * @returns {string} Adjusted image path
 */
function adjustImagePathForSubdirectory(imagePath) {
    if (!imagePath) return '';
    
    const currentPath = getCurrentPagePath();
    // Check if we're in a subdirectory (page/*)
    if (currentPath.startsWith('page/')) {
        // Images in JSON are relative to root (src/assets/img/...)
        // From page/* subdirectories, we need ../../src/assets/img/...
        if (imagePath.startsWith('src/assets/')) {
            return '../../' + imagePath;
        }
    }
    
    return imagePath;
}

/**
 * Render recommended tours in the recommended-tours section
 * @param {number|string} currentTourId - ID of the current tour (optional, will auto-detect if not provided)
 * @param {number} limit - Maximum number of recommendations (default: 4)
 */
export async function renderRecommendedTours(currentTourId = null, limit = 4) {
    const recommendedSection = document.querySelector('.recommended-tours');
    if (!recommendedSection) {
        if (window.ENV?.DEBUG === true) {
            console.warn('Recommended tours section not found');
        }
        return;
    }

    const toursGrid = recommendedSection.querySelector('.tours-grid');
    if (!toursGrid) {
        if (window.ENV?.DEBUG === true) {
            console.warn('Tours grid not found in recommended section');
        }
        return;
    }

    try {
        // Auto-detect tour ID if not provided
        if (!currentTourId) {
            currentTourId = await findTourIdByCurrentPage();
            if (!currentTourId) {
                if (window.ENV?.DEBUG === true) {
                    console.warn('Could not find tour ID for current page:', getCurrentPagePath());
                }
                toursGrid.textContent = '';
                const loadingMsg = document.createElement('p');
                loadingMsg.textContent = 'Рекомендуемые туры загружаются...';
                toursGrid.appendChild(loadingMsg);
                return;
            }
        }

        // Get recommended tours
        const recommendedTours = await getRecommendedTours(currentTourId, limit);
        
        if (!recommendedTours || recommendedTours.length === 0) {
            toursGrid.textContent = '';
            const loadingMsg = document.createElement('p');
            loadingMsg.textContent = 'Рекомендуемые туры загружаются...';
            toursGrid.appendChild(loadingMsg);
            return;
        }

        // Clear existing content
        toursGrid.textContent = '';

        // Render each recommended tour
        recommendedTours.forEach(tour => {
            const tourCard = createRecommendedTourCard(tour);
            toursGrid.appendChild(tourCard);
        });

    } catch (error) {
        if (window.ENV?.DEBUG === true) {
            console.error('Error loading recommended tours:', error);
        }
        toursGrid.textContent = '';
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Не удалось загрузить рекомендуемые туры.';
        toursGrid.appendChild(errorMsg);
    }
}

/**
 * Adjust link path for pages in subdirectories
 * Converts absolute paths (from root) to relative paths based on current page location
 * @param {string} linkPath - Original link path from JSON (e.g., "page/dailytours/gobustanpage.html")
 * @returns {string} Adjusted relative link path
 */
function adjustLinkPathForSubdirectory(linkPath) {
    if (!linkPath) return '#';
    
    const currentPath = getCurrentPagePath();
    
    // If current page is in a subdirectory (page/*)
    if (currentPath.startsWith('page/')) {
        // If link is also a full path starting with "page/"
        if (linkPath.startsWith('page/')) {
            const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
            const linkDir = linkPath.substring(0, linkPath.lastIndexOf('/'));
            const linkFile = linkPath.substring(linkPath.lastIndexOf('/') + 1);
            
            // If same directory, use just filename
            if (currentDir === linkDir) {
                return linkFile;
            }
            // If different directory, calculate relative path
            // For now, use full path from root (browsers handle this)
            return '../../' + linkPath;
        }
    }
    
    // Default: return as-is
    return linkPath;
}

/**
 * Create a tour card element for recommended tours
 * @param {Object} tour - Tour object
 * @returns {HTMLElement} Tour card element
 */

function createRecommendedTourCard(tour) {
    // Create card link
    const cardLink = document.createElement('a');
    const adjustedLink = adjustLinkPathForSubdirectory(tour.link);
    cardLink.href = adjustedLink;
    cardLink.className = 'tour-card';

    // Create image container
    const imageDiv = document.createElement('div');
    imageDiv.className = 'tour-card-image';
    if (tour.image) {
        const adjustedImagePath = adjustImagePathForSubdirectory(tour.image);
        imageDiv.style.backgroundImage = `url('${adjustedImagePath}')`;
    }

    // Create badge
    const badgeDiv = document.createElement('div');
    badgeDiv.className = 'tour-card-badge';
    badgeDiv.textContent = tour.badge || '';

    // Create duration badge
    const durationDiv = document.createElement('div');
    durationDiv.className = 'tour-card-duration';
    durationDiv.textContent = tour.duration || '';

    imageDiv.appendChild(badgeDiv);
    imageDiv.appendChild(durationDiv);

    // Create content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'tour-card-content';

    // Create title
    const title = document.createElement('h3');
    title.textContent = tour.title || '';

    // Create description
    const description = document.createElement('p');
    description.textContent = tour.description || '';

    // Create price
    const priceDiv = document.createElement('div');
    priceDiv.className = 'tour-card-price';
    priceDiv.textContent = `от $${tour.price || 0}`;

    contentDiv.appendChild(title);
    contentDiv.appendChild(description);
    contentDiv.appendChild(priceDiv);

    // Assemble card
    cardLink.appendChild(imageDiv);
    cardLink.appendChild(contentDiv);

    return cardLink;
}

/**
 * Initialize recommended tours automatically
 * First tries URL parameter ?id=, then auto-detects from current page path
 */
async function initializeRecommendedTours() {
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');
    
    if (tourId) {
        // Use tour ID from URL parameter if provided
        await renderRecommendedTours(tourId);
    } else {
        // Auto-detect tour ID from current page path
        await renderRecommendedTours();
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRecommendedTours);
} else {
    initializeRecommendedTours();
}

// Export for external use
if (typeof window !== 'undefined') {
    window.renderRecommendedTours = renderRecommendedTours;
}

