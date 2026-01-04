/**
 * Tours Data Utility
 * 
 * Provides reusable functions to fetch and filter tours from JSON data.
 * This acts as a mock backend - easy to replace with real API calls later.
 */

let toursCache = null;

/**
 * Fetch all tours from JSON file
 * @returns {Promise<Array>} Array of all tours
 */
export async function getTours() {
    // Return cached data if available
    if (toursCache) {
        return toursCache;
    }

    try {
        const response = await fetch('/data/tours.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch tours: ${response.status}`);
        }
        toursCache = await response.json();
        return toursCache;
    } catch (error) {
        if (window.ENV?.DEBUG === true) {
            console.error('Error fetching tours:', error);
        }
        // Return empty array on error to prevent app crashes
        return [];
    }
}

/**
 * Get tour by ID
 * @param {number|string} id - Tour ID
 * @returns {Promise<Object|null>} Tour object or null if not found
 */
export async function getTourById(id) {
    const tours = await getTours();
    const tourId = typeof id === 'string' ? parseInt(id, 10) : id;
    return tours.find(tour => tour.id === tourId) || null;
}

/**
 * Get featured tours (for homepage sliders)
 * @returns {Promise<Array>} Array of featured tours
 */
export async function getFeaturedTours() {
    const tours = await getTours();
    return tours.filter(tour => tour.featured === true);
}

/**
 * Get tours by type
 * @param {string} type - Tour type (group, private, driver, package)
 * @returns {Promise<Array>} Array of tours matching the type
 */
export async function getToursByType(type) {
    const tours = await getTours();
    return tours.filter(tour => tour.type === type);
}

/**
 * Get recommended tours for a given tour
 * Priority: same city -> same country -> exclude current tour
 * @param {number|string} currentTourId - ID of the current tour to exclude
 * @param {number} limit - Maximum number of recommendations (default: 4)
 * @returns {Promise<Array>} Array of recommended tours
 */
export async function getRecommendedTours(currentTourId, limit = 4) {
    const tours = await getTours();
    const currentTour = await getTourById(currentTourId);
    
    if (!currentTour) {
        // If current tour not found, return first N tours
        return tours.slice(0, limit);
    }

    const tourId = typeof currentTourId === 'string' ? parseInt(currentTourId, 10) : currentTourId;
    
    // Filter out current tour
    const otherTours = tours.filter(tour => tour.id !== tourId);
    
    // Priority 1: Same city
    const sameCityTours = otherTours.filter(tour => 
        tour.city && tour.city.toLowerCase() === currentTour.city.toLowerCase()
    );
    
    if (sameCityTours.length >= limit) {
        return sameCityTours.slice(0, limit);
    }
    
    // Priority 2: Same country (if we need more tours)
    const sameCountryTours = otherTours.filter(tour => 
        tour.country && tour.country.toLowerCase() === currentTour.country.toLowerCase() &&
        !sameCityTours.some(st => st.id === tour.id)
    );
    
    // Combine and limit
    const recommended = [...sameCityTours, ...sameCountryTours].slice(0, limit);
    
    // If still not enough, fill with any other tours
    if (recommended.length < limit) {
        const remaining = otherTours.filter(tour => 
            !recommended.some(r => r.id === tour.id)
        );
        recommended.push(...remaining.slice(0, limit - recommended.length));
    }
    
    return recommended;
}

/**
 * Search tours by query string
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching tours
 */
export async function searchTours(query) {
    const tours = await getTours();
    if (!query || query.trim() === '') {
        return tours;
    }
    
    const lowerQuery = query.toLowerCase();
    return tours.filter(tour => 
        tour.title.toLowerCase().includes(lowerQuery) ||
        tour.description.toLowerCase().includes(lowerQuery) ||
        (tour.tags && tour.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
        (tour.city && tour.city.toLowerCase().includes(lowerQuery)) ||
        (tour.country && tour.country.toLowerCase().includes(lowerQuery))
    );
}

/**
 * Clear the tours cache (useful for development/testing)
 */
export function clearToursCache() {
    toursCache = null;
}

// Export for global access (for non-module scripts)
if (typeof window !== 'undefined') {
    window.ToursData = {
        getTours,
        getTourById,
        getFeaturedTours,
        getToursByType,
        getRecommendedTours,
        searchTours,
        clearToursCache
    };
}

