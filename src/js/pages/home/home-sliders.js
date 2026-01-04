/**
 * Home Page Sliders
 * 
 * Dynamically renders tour sliders on the homepage from JSON data.
 * Replaces hard-coded HTML with JavaScript-rendered content.
 */

import { getFeaturedTours, getToursByType, getTours } from '../../utils/tours-data.js';
import { sanitizeUrl } from '../../utils/sanitize.js';

/**
 * Render a slider with tours
 * @param {string} containerId - ID of the slider container element
 * @param {Array} tours - Array of tour objects to render
 */
function renderSlider(containerId, tours) {
    const container = document.getElementById(containerId);
    if (!container) {
        if (window.ENV?.DEBUG === true) {
            console.warn(`Slider container ${containerId} not found`);
        }
        return;
    }

    if (!tours || tours.length === 0) {
        container.textContent = '';
        const loadingMsg = document.createElement('p');
        loadingMsg.textContent = 'Туры загружаются...';
        container.appendChild(loadingMsg);
        return;
    }

    // Clear existing content
    container.textContent = '';

    // Render each tour as a slide using safe DOM methods
    tours.forEach(tour => {
        const slideElement = createSlideElement(tour);
        container.appendChild(slideElement);
    });

    // Reinitialize slider after content is added
    // The slider.js should handle this automatically, but we trigger it
    if (window.cleanSliderManager) {
        setTimeout(() => {
            const slider = window.cleanSliderManager.getSlider(containerId);
            if (slider) {
                slider.handleResize();
            }
        }, 100);
    }
}

/**
 * Create slide element using safe DOM manipulation
 * @param {Object} tour - Tour object
 * @returns {HTMLElement} Slide element
 */
function createSlideElement(tour) {
    const safeUrl = sanitizeUrl(tour.link || '#');
    
    // Create link element
    const link = document.createElement('a');
    link.href = safeUrl;
    link.className = 'unified-slide';
    
    // Create image container
    const imageDiv = document.createElement('div');
    imageDiv.className = 'unified-slide-image';
    
    // Create badge
    const badge = document.createElement('div');
    badge.className = 'unified-slide-badge';
    badge.textContent = tour.badge || '';
    imageDiv.appendChild(badge);
    
    // Create duration badge
    const durationBadge = document.createElement('div');
    durationBadge.className = 'unified-duration-badge';
    durationBadge.textContent = tour.duration || '';
    imageDiv.appendChild(durationBadge);
    
    link.appendChild(imageDiv);
    
    // Create content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'unified-slide-content';
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = tour.title || '';
    contentDiv.appendChild(title);
    
    // Create description
    const description = document.createElement('p');
    description.textContent = tour.description || '';
    contentDiv.appendChild(description);
    
    // Create price
    const price = document.createElement('div');
    price.className = 'unified-slide-price';
    price.textContent = `от ${tour.price || 0}$`;
    contentDiv.appendChild(price);
    
    link.appendChild(contentDiv);
    return link;
}

/**
 * Template for unified slider slide (deprecated - use createSlideElement)
 * @param {Object} tour - Tour object
 * @returns {string} HTML string for the slide
 * @deprecated Use createSlideElement instead for XSS safety
 */
function unifiedSlideTemplate(tour) {
    // This function is kept for backward compatibility but should not be used
    // Use createSlideElement instead
    return '';
}

/**
 * Initialize all sliders on homepage
 */
async function initializeHomeSliders() {
    try {
        // Daily Tours Slider (Group tours, featured)
        const featuredGroupTours = (await getFeaturedTours()).filter(t => t.type === 'group');
        if (featuredGroupTours.length > 0) {
            renderSlider('toursSlider', featuredGroupTours);
        }

        // Packages Slider (Package tours, featured)
        const featuredPackageTours = (await getFeaturedTours()).filter(t => t.type === 'package');
        if (featuredPackageTours.length > 0) {
            renderSlider('packagesNewSlider', featuredPackageTours);
        }

        // Private Tours Slider (Private tours, all or featured)
        const privateTours = await getToursByType('private');
        // Show first 6 private tours (or all if less than 6)
        const privateToursToShow = privateTours.slice(0, 6);
        if (privateToursToShow.length > 0) {
            renderSlider('privateNewSlider', privateToursToShow);
        }

        // Driver Tours Slider (Driver tours, all or featured)
        const driverTours = await getToursByType('driver');
        // Show first 4 driver tours (or all if less than 4)
        const driverToursToShow = driverTours.slice(0, 4);
        if (driverToursToShow.length > 0) {
            renderSlider('driverNewSlider', driverToursToShow);
        }

        // Reinitialize all sliders after a brief delay to ensure DOM is ready
        setTimeout(() => {
            if (window.cleanSliderManager) {
                window.cleanSliderManager.initializeSliders();
            }
        }, 200);

        // Populate the "All Tours" grid on homepage
        await populateHomeToursGrid();

    } catch (error) {
        if (window.ENV?.DEBUG === true) {
            console.error('Error initializing home sliders:', error);
        }
    }
}

/**
 * Populate the home tours grid with all tours
 */
async function populateHomeToursGrid() {
    const grid = document.getElementById('homeToursGrid');
    if (!grid) {
        if (window.ENV?.DEBUG === true) {
            console.warn('Home tours grid not found');
        }
        return;
    }

    try {
        const allTours = await getTours();
        
        if (!allTours || allTours.length === 0) {
            grid.textContent = '';
            const loadingMsg = document.createElement('p');
            loadingMsg.textContent = 'Туры загружаются...';
            grid.appendChild(loadingMsg);
            return;
        }

        // Show first 9 tours (or all if less than 9)
        const toursToShow = allTours.slice(0, 9);
        
        // Clear grid
        grid.textContent = '';

        // Create tour cards using safe DOM methods
        toursToShow.forEach(tour => {
            const safeLink = sanitizeUrl(tour.link || '#');
            
            // Create link element
            const link = document.createElement('a');
            link.href = safeLink;
            link.className = 'tour-category';
            
            // Create image container
            const imageDiv = document.createElement('div');
            imageDiv.className = 'tour-image';
            
            // Create image element if image exists
            if (tour.image) {
                const img = document.createElement('img');
                img.src = sanitizeUrl(tour.image);
                img.alt = tour.title || '';
                img.loading = 'lazy';
                
                // Add error handler using addEventListener (not inline)
                img.addEventListener('error', function() {
                    this.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;color:#666;';
                    placeholder.textContent = '📸 Фото загружается';
                    this.parentElement.appendChild(placeholder);
                });
                
                imageDiv.appendChild(img);
            } else {
                const placeholder = document.createElement('div');
                placeholder.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;color:#666;';
                placeholder.textContent = '📸 Фото скоро появится';
                imageDiv.appendChild(placeholder);
            }
            
            // Create badge
            const badge = document.createElement('div');
            badge.className = 'tour-badge';
            badge.textContent = tour.badge || '';
            imageDiv.appendChild(badge);
            
            // Create duration badge
            const durationBadge = document.createElement('div');
            durationBadge.className = 'duration-badge';
            durationBadge.textContent = tour.duration || '';
            imageDiv.appendChild(durationBadge);
            
            link.appendChild(imageDiv);
            
            // Create content container
            const contentDiv = document.createElement('div');
            contentDiv.className = 'tour-content';
            
            // Create title
            const title = document.createElement('h3');
            title.textContent = tour.title || '';
            contentDiv.appendChild(title);
            
            // Create description
            const description = document.createElement('p');
            description.textContent = tour.description || '';
            contentDiv.appendChild(description);
            
            // Create price
            const price = document.createElement('div');
            price.className = 'tour-price';
            price.textContent = `от ${tour.price || 0}$`;
            contentDiv.appendChild(price);
            
            link.appendChild(contentDiv);
            grid.appendChild(link);
        });

    } catch (error) {
        if (window.ENV?.DEBUG === true) {
            console.error('Error populating home tours grid:', error);
        }
        grid.textContent = '';
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Не удалось загрузить туры. Пожалуйста, попробуйте позже.';
        grid.appendChild(errorMsg);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHomeSliders);
} else {
    initializeHomeSliders();
}

// Export for potential external use
if (typeof window !== 'undefined') {
    window.homeSliders = {
        initialize: initializeHomeSliders
    };
}

