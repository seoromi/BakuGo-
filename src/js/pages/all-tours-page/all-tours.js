/**
 * All Tours Page
 * 
 * Refactored to load tours from JSON file instead of hardcoded array.
 * This makes it easy to switch to a real API later.
 */

// Import tours data utility
import { getTours } from '../../utils/tours-data.js';
import { sanitizeUrl } from '../../utils/sanitize.js';

// Tours will be loaded from JSON file
let allTours = [];
let filteredTours = [];
let currentPage = 1;
const toursPerPage = 9;

// Initialize page
document.addEventListener('DOMContentLoaded', async function () {
    // Load tours from JSON file
    try {
        allTours = await getTours();
        filteredTours = [...allTours];
        if (window.ENV?.DEBUG === true) {
            console.log(`Loaded ${allTours.length} tours from JSON`);
        }
    } catch (error) {
        if (window.ENV?.DEBUG === true) {
            console.error('Error loading tours:', error);
        }
        allTours = []; // Fallback to empty array
        filteredTours = [];
        
        // Show user-visible error message
        const toursGrid = document.getElementById('toursGrid');
        if (toursGrid) {
            toursGrid.innerHTML = '<div class="error-message" style="text-align: center; padding: 40px; color: #d32f2f;"><p>Не удалось загрузить туры. Пожалуйста, обновите страницу.</p></div>';
        } else {
            alert('Не удалось загрузить туры. Пожалуйста, обновите страницу.');
        }
    }

    // Check URL parameters for filtering
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('destination');
    const type = urlParams.get('type');

    if (destination) {
        const destCheckbox = document.getElementById(`dest-${destination}`);
        if (destCheckbox) destCheckbox.checked = true;
    }
    if (type) {
        const typeCheckbox = document.getElementById(`type-${type}`);
        if (typeCheckbox) typeCheckbox.checked = true;
    }

    // Initialize mobile menu functionality
    initializeMobileMenu();

    // Hide loading spinner and show tours after a brief delay
    setTimeout(() => {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        filterTours();
    }, 500);

    // Update counts
    updateFilterCounts();
});

function initializeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.getElementById('menuClose');

    function openMenu() {
        sideMenu.classList.add('open');
        menuOverlay.style.display = 'block';
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        sideMenu.classList.remove('open');
        menuOverlay.style.display = 'none';
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // Handle menu item clicks
    document.querySelectorAll('.side-menu-item').forEach(item => {
        item.addEventListener('click', closeMenu);
    });
}

// Mobile Filter Functions
function openMobileFilters() {
    const modal = document.getElementById('mobileFilterModal');
    const button = document.querySelector('.mobile-filter-toggle');

    // Sync desktop filters to mobile
    syncFiltersToMobile();

    modal.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMobileFilters() {
    const modal = document.getElementById('mobileFilterModal');
    const button = document.querySelector('.mobile-filter-toggle');

    modal.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function syncFiltersToMobile() {
    // Sync search
    const desktopSearch = document.getElementById('searchInput').value;
    document.getElementById('mobileSearchInput').value = desktopSearch;

    // Sync checkboxes
    const filterTypes = ['type-group', 'type-private', 'type-driver', 'type-package',
        'dest-baku', 'dest-gobustan', 'dest-gabala', 'dest-shamakhi',
        'dest-quba', 'dest-sheki', 'dest-lankaran',
        'duration-2h', 'duration-day', 'duration-2-3', 'duration-4plus'];

    filterTypes.forEach(type => {
        const desktopCheckbox = document.getElementById(type);
        const mobileCheckbox = document.getElementById(`mobile-${type}`);
        if (desktopCheckbox && mobileCheckbox) {
            mobileCheckbox.checked = desktopCheckbox.checked;
        }
    });

    // Sync price inputs
    document.getElementById('mobilePriceMin').value = document.getElementById('priceMin').value;
    document.getElementById('mobilePriceMax').value = document.getElementById('priceMax').value;
}

function syncFiltersToDesktop() {
    // Sync search
    const mobileSearch = document.getElementById('mobileSearchInput').value;
    document.getElementById('searchInput').value = mobileSearch;

    // Sync checkboxes
    const filterTypes = ['type-group', 'type-private', 'type-driver', 'type-package',
        'dest-baku', 'dest-gobustan', 'dest-gabala', 'dest-shamakhi',
        'dest-quba', 'dest-sheki', 'dest-lankaran',
        'duration-2h', 'duration-day', 'duration-2-3', 'duration-4plus'];

    filterTypes.forEach(type => {
        const mobileCheckbox = document.getElementById(`mobile-${type}`);
        const desktopCheckbox = document.getElementById(type);
        if (mobileCheckbox && desktopCheckbox) {
            desktopCheckbox.checked = mobileCheckbox.checked;
        }
    });

    // Sync price inputs
    document.getElementById('priceMin').value = document.getElementById('mobilePriceMin').value;
    document.getElementById('priceMax').value = document.getElementById('mobilePriceMax').value;
}

function applyMobileFilters() {
    syncFiltersToDesktop();
    filterTours();
    closeMobileFilters();
}

function clearMobileFilters() {
    // Clear mobile inputs
    document.getElementById('mobileSearchInput').value = '';
    document.getElementById('mobilePriceMin').value = '';
    document.getElementById('mobilePriceMax').value = '';

    // Clear mobile checkboxes
    document.querySelectorAll('#mobileFilterModal input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Update counts display
    const activeFiltersCount = 0;
    const applyBtn = document.querySelector('.filter-apply-btn');
    if (applyBtn) {
        applyBtn.textContent = '';
        const icon = document.createElement('i');
        icon.className = 'fas fa-check';
        applyBtn.appendChild(icon);
        const text = document.createTextNode(` Применить ${activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}`);
        applyBtn.appendChild(text);
    }
}

// Mobile filter modal event listeners
document.getElementById('mobileFilterClose').addEventListener('click', closeMobileFilters);

// Close modal when clicking outside
document.getElementById('mobileFilterModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeMobileFilters();
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('mobileFilterModal').classList.contains('open')) {
        closeMobileFilters();
    }
});

// Update apply button with filter count
function updateMobileFilterCount() {
    const mobileInputs = document.querySelectorAll('#mobileFilterModal input[type="checkbox"]:checked');
    const hasSearch = document.getElementById('mobileSearchInput').value.trim() !== '';
    const hasPrice = document.getElementById('mobilePriceMin').value || document.getElementById('mobilePriceMax').value;

    const activeFiltersCount = mobileInputs.length + (hasSearch ? 1 : 0) + (hasPrice ? 1 : 0);

    const applyBtn = document.querySelector('.filter-apply-btn');
    if (applyBtn) {
        applyBtn.textContent = '';
        const icon = document.createElement('i');
        icon.className = 'fas fa-check';
        applyBtn.appendChild(icon);
        const text = document.createTextNode(` Применить ${activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}`);
        applyBtn.appendChild(text);
    }
}

// Add event listeners to mobile filter inputs
document.addEventListener('DOMContentLoaded', function () {
    // Add listeners to mobile filter inputs
    document.querySelectorAll('#mobileFilterModal input').forEach(input => {
        input.addEventListener('change', updateMobileFilterCount);
        input.addEventListener('input', updateMobileFilterCount);
    });
});

function updateFilterCounts() {
    // Update type counts
    document.getElementById('count-group').textContent = allTours.filter(t => t.type === 'group').length;
    document.getElementById('count-private').textContent = allTours.filter(t => t.type === 'private').length;
    document.getElementById('count-driver').textContent = allTours.filter(t => t.type === 'driver').length;
    document.getElementById('count-package').textContent = allTours.filter(t => t.type === 'package').length;

    // Update mobile counts
    document.getElementById('mobile-count-group').textContent = allTours.filter(t => t.type === 'group').length;
    document.getElementById('mobile-count-private').textContent = allTours.filter(t => t.type === 'private').length;
    document.getElementById('mobile-count-driver').textContent = allTours.filter(t => t.type === 'driver').length;
    document.getElementById('mobile-count-package').textContent = allTours.filter(t => t.type === 'package').length;
}

function filterTours() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedTypes = getSelectedCheckboxes('type-');
    const selectedDestinations = getSelectedCheckboxes('dest-');
    const selectedDurations = getSelectedCheckboxes('duration-');
    const minPrice = parseInt(document.getElementById('priceMin').value) || 0;
    const maxPrice = parseInt(document.getElementById('priceMax').value) || 600;

    // Debug: Log the price values being used
    if (window.ENV?.DEBUG === true) {
        console.log(`Price filter: $${minPrice} - $${maxPrice}`);
    }

    filteredTours = allTours.filter(tour => {
        // Search filter
        const matchesSearch = tour.title.toLowerCase().includes(searchTerm) ||
            tour.description.toLowerCase().includes(searchTerm) ||
            (tour.highlights && tour.highlights.some(h => h.toLowerCase().includes(searchTerm)));

        // Type filter
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(tour.type);

        // Destination filter
        const matchesDestination = selectedDestinations.length === 0 ||
            (tour.destinations && tour.destinations.some(dest => selectedDestinations.includes(dest)));

        // Duration filter
        const matchesDuration = selectedDurations.length === 0 ||
            selectedDurations.some(duration => {
                if (duration === '2-4h' && (tour.duration.includes('2 часа') || tour.duration.includes('3 часа') || tour.duration.includes('4.5 часа'))) return true;
                if (duration === '1day' && (tour.duration.includes('8 часов') || tour.duration.includes('10 часов') || tour.duration.includes('12 часов') || tour.duration.includes('6 часов'))) return true;
                if (duration === '2-3days' && (tour.duration.includes('3 дня') || tour.duration.includes('2 дня'))) return true;
                if (duration === '4plus' && (tour.duration.includes('4 дня') || tour.duration.includes('5 дней') || tour.duration.includes('6 дней') || tour.duration.includes('7 дней') || tour.duration.includes('8 дней') || tour.duration.includes('9 дней'))) return true;
                return false;
            });

        // Price filter - this is the key part
        const matchesPrice = tour.price >= minPrice && tour.price <= maxPrice;

        return matchesSearch && matchesType && matchesDestination && matchesDuration && matchesPrice;
    });

    if (window.ENV?.DEBUG === true) {
        console.log(`Found ${filteredTours.length} tours matching price range $${minPrice}-$${maxPrice}`);
    }

    currentPage = 1;
    displayTours();
    updateResultsCount();
    generatePagination();
}

function getSelectedCheckboxes(prefix) {
    const checkboxes = document.querySelectorAll(`input[id^="${prefix}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

function displayTours() {
    const grid = document.getElementById('toursGrid');
    const startIndex = (currentPage - 1) * toursPerPage;
    const endIndex = startIndex + toursPerPage;
    const toursToShow = filteredTours.slice(startIndex, endIndex);

    // Clear grid
    grid.textContent = '';
    
    if (toursToShow.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-search';
        noResults.appendChild(icon);
        
        const heading = document.createElement('h3');
        heading.textContent = 'Туры не найдены';
        noResults.appendChild(heading);
        
        const paragraph = document.createElement('p');
        paragraph.textContent = 'Попробуйте изменить параметры фильтра или поиска';
        noResults.appendChild(paragraph);
        
        const button = document.createElement('button');
        button.textContent = 'Сбросить фильтры';
        button.style.cssText = 'margin-top: 1rem; padding: 0.5rem 1rem; background: var(--secondary-color); color: white; border: none; border-radius: 6px; cursor: pointer;';
        button.addEventListener('click', clearAllFilters);
        noResults.appendChild(button);
        
        grid.appendChild(noResults);
        return;
    }

    // Create tour cards using safe DOM methods
    toursToShow.forEach(tour => {
        const link = document.createElement('a');
        link.href = sanitizeUrl(tour.link || '#');
        link.className = 'tour-card';
        link.tabIndex = 0;
        
        // Create image container
        const imageDiv = document.createElement('div');
        imageDiv.className = 'tour-image';
        
        // Create image if exists
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
        title.className = 'tour-title';
        title.textContent = tour.title || '';
        contentDiv.appendChild(title);
        
        // Create description
        const description = document.createElement('p');
        description.className = 'tour-description';
        description.textContent = tour.description || '';
        contentDiv.appendChild(description);
        
        // Create highlights
        const highlightsDiv = document.createElement('div');
        highlightsDiv.className = 'tour-highlights';
        if (tour.highlights && Array.isArray(tour.highlights)) {
            tour.highlights.forEach(highlight => {
                const tag = document.createElement('span');
                tag.className = 'highlight-tag';
                tag.textContent = highlight;
                highlightsDiv.appendChild(tag);
            });
        }
        contentDiv.appendChild(highlightsDiv);
        
        // Create meta container
        const metaDiv = document.createElement('div');
        metaDiv.className = 'tour-meta';
        
        // Create rating
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'tour-rating';
        
        const stars = document.createElement('span');
        stars.className = 'rating-stars';
        stars.textContent = '⭐⭐⭐⭐⭐';
        ratingDiv.appendChild(stars);
        
        const ratingCount = document.createElement('span');
        ratingCount.className = 'rating-count';
        ratingCount.textContent = `${tour.rating || 0} (${tour.reviewCount || 0})`;
        ratingDiv.appendChild(ratingCount);
        
        metaDiv.appendChild(ratingDiv);
        
        // Create price
        const price = document.createElement('div');
        price.className = 'tour-price';
        price.textContent = `от $${tour.price || 0}`;
        metaDiv.appendChild(price);
        
        contentDiv.appendChild(metaDiv);
        link.appendChild(contentDiv);
        
        grid.appendChild(link);
    });
}

function updateResultsCount() {
    const count = filteredTours.length;
    document.getElementById('resultsCount').textContent = `Показано ${count} ${getTourWord(count)}`;
}

function getTourWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'тур';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'тура';
    return 'туров';
}

function generatePagination() {
    const totalPages = Math.ceil(filteredTours.length / toursPerPage);
    const pagination = document.getElementById('pagination');

    // Clear pagination
    pagination.textContent = '';
    
    if (totalPages <= 1) {
        return;
    }

    // Previous button
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.setAttribute('aria-label', 'Предыдущая страница');
        prevBtn.textContent = '‹ Назад';
        prevBtn.addEventListener('click', () => changePage(currentPage - 1));
        pagination.appendChild(prevBtn);
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn active';
            pageBtn.setAttribute('aria-current', 'page');
            pageBtn.setAttribute('aria-label', `Страница ${i}`);
            pageBtn.textContent = String(i);
            pagination.appendChild(pageBtn);
        } else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn';
            pageBtn.setAttribute('aria-label', `Страница ${i}`);
            pageBtn.textContent = String(i);
            pageBtn.addEventListener('click', () => changePage(i));
            pagination.appendChild(pageBtn);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-btn';
            ellipsis.setAttribute('aria-hidden', 'true');
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }
    }

    // Next button
    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.setAttribute('aria-label', 'Следующая страница');
        nextBtn.textContent = 'Вперед ›';
        nextBtn.addEventListener('click', () => changePage(currentPage + 1));
        pagination.appendChild(nextBtn);
    }
}

function changePage(page) {
    currentPage = page;
    displayTours();
    generatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function sortTours() {
    const sortValue = document.getElementById('sortSelect').value;

    switch (sortValue) {
        case 'price-low':
            filteredTours.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredTours.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredTours.sort((a, b) => b.rating - a.rating);
            break;
        case 'popular':
            filteredTours.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
        case 'duration':
            filteredTours.sort((a, b) => {
                const getDurationHours = (duration) => {
                    if (duration.includes('2 часа')) return 2;
                    if (duration.includes('3 часа')) return 3;
                    if (duration.includes('4.5 часа')) return 4.5;
                    if (duration.includes('6 часов')) return 6;
                    if (duration.includes('8 часов')) return 8;
                    if (duration.includes('10 часов')) return 10;
                    if (duration.includes('12 часов')) return 12;
                    if (duration.includes('дня') || duration.includes('дней')) return parseInt(duration) * 24;
                    return 8;
                };
                return getDurationHours(a.duration) - getDurationHours(b.duration);
            });
            break;
        default:
            // Reset to original order
            filteredTours = [...allTours].filter(tour =>
                filteredTours.some(filtered => filtered.id === tour.id)
            );
    }

    currentPage = 1;
    displayTours();
    generatePagination();
}

function switchView(viewType) {
    const grid = document.getElementById('toursGrid');
    const buttons = document.querySelectorAll('.view-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${viewType}"]`).classList.add('active');

    if (viewType === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
}

function clearAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    document.getElementById('sortSelect').value = 'default';

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    filteredTours = [...allTours];
    currentPage = 1;
    displayTours();
    updateResultsCount();
    generatePagination();
}

// Auto-filter on input with debouncing
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterTours, 300);
});

// Price input validation
document.getElementById('priceMin').addEventListener('input', function () {
    if (this.value < 0) this.value = 0;
});

document.getElementById('priceMax').addEventListener('input', function () {
    if (this.value < 0) this.value = 0;
    const minPrice = document.getElementById('priceMin').value;
    if (minPrice && this.value && parseInt(this.value) < parseInt(minPrice)) {
        this.value = minPrice;
    }
});

// Mobile price input validation
document.getElementById('mobilePriceMin').addEventListener('input', function () {
    if (this.value < 0) this.value = 0;
});

document.getElementById('mobilePriceMax').addEventListener('input', function () {
    if (this.value < 0) this.value = 0;
    const minPrice = document.getElementById('mobilePriceMin').value;
    if (minPrice && this.value && parseInt(this.value) < parseInt(minPrice)) {
        this.value = minPrice;
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('tour-card')) {
            e.preventDefault();
            e.target.click();
        }
    }
});

// URL filtering support for external links
function filterByDestination(destination) {
    clearAllFilters();
    const destCheckbox = document.getElementById(`dest-${destination}`);
    if (destCheckbox) {
        destCheckbox.checked = true;
        filterTours();
    }
}

// Double Range Slider Functionality
class DoubleRangeSlider {
    constructor(container, minPrice = 0, maxPrice = 600) {
        this.container = container;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.currentMin = minPrice;
        this.currentMax = maxPrice;

        this.slider = container.querySelector('.double-range-slider');
        this.track = container.querySelector('.slider-track');
        this.range = container.querySelector('.slider-range');
        this.minThumb = container.querySelector('.slider-thumb-min');
        this.maxThumb = container.querySelector('.slider-thumb-max');
        this.minTooltip = container.querySelector('#minTooltip, #mobileMinTooltip');
        this.maxTooltip = container.querySelector('#maxTooltip, #mobileMaxTooltip');
        this.minDisplay = container.querySelector('#priceMinDisplay, #mobilePriceMinDisplay');
        this.maxDisplay = container.querySelector('#priceMaxDisplay, #mobilePriceMaxDisplay');
        this.minInput = container.querySelector('#priceMin, #mobilePriceMin');
        this.maxInput = container.querySelector('#priceMax, #mobilePriceMax');

        this.isDragging = false;
        this.activeThumb = null;
        this.dragStartX = 0;
        this.thumbStartLeft = 0;

        this.init();
    }

    init() {
        this.updateSlider();
        this.updateDisplay();
        this.bindEvents();
    }

    bindEvents() {
        // Mouse events for both thumbs
        this.minThumb.addEventListener('mousedown', (e) => this.startDrag(e, 'min'));
        this.maxThumb.addEventListener('mousedown', (e) => this.startDrag(e, 'max'));

        // Touch events for mobile
        this.minThumb.addEventListener('touchstart', (e) => this.startDrag(e, 'min'));
        this.maxThumb.addEventListener('touchstart', (e) => this.startDrag(e, 'max'));

        // Global events
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('touchend', this.endDrag.bind(this));

        // Click on track
        this.slider.addEventListener('click', this.handleTrackClick.bind(this));

        // Input change events
        if (this.minInput) {
            this.minInput.addEventListener('change', this.handleInputChange.bind(this));
        }
        if (this.maxInput) {
            this.maxInput.addEventListener('change', this.handleInputChange.bind(this));
        }

        // Keyboard navigation
        this.minThumb.addEventListener('keydown', (e) => this.handleKeyDown(e, 'min'));
        this.maxThumb.addEventListener('keydown', (e) => this.handleKeyDown(e, 'max'));

        // Make thumbs focusable and accessible
        this.minThumb.setAttribute('tabindex', '0');
        this.maxThumb.setAttribute('tabindex', '0');
        this.minThumb.setAttribute('role', 'slider');
        this.maxThumb.setAttribute('role', 'slider');
        this.minThumb.setAttribute('aria-label', 'Minimum price');
        this.maxThumb.setAttribute('aria-label', 'Maximum price');
        this.minThumb.setAttribute('aria-valuemin', this.minPrice);
        this.minThumb.setAttribute('aria-valuemax', this.maxPrice);
        this.maxThumb.setAttribute('aria-valuemin', this.minPrice);
        this.maxThumb.setAttribute('aria-valuemax', this.maxPrice);
    }

    startDrag(e, thumbType) {
        e.preventDefault();
        this.isDragging = true;
        this.activeThumb = thumbType;

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.dragStartX = clientX;
        this.thumbStartLeft = this.getThumbPosition(thumbType);

        // Add dragging class for smoother performance
        this.container.classList.add('dragging');

        // Show tooltip for the active thumb
        if (thumbType === 'min' && this.minTooltip) {
            this.minTooltip.classList.add('show');
        } else if (thumbType === 'max' && this.maxTooltip) {
            this.maxTooltip.classList.add('show');
        }

        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
    }

    drag(e) {
        if (!this.isDragging || !this.activeThumb) return;

        e.preventDefault();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const deltaX = clientX - this.dragStartX;
        const sliderRect = this.slider.getBoundingClientRect();
        const sliderWidth = sliderRect.width;

        // Calculate new position as percentage with higher precision
        const newPosition = Math.max(0, Math.min(100, (this.thumbStartLeft + (deltaX / sliderWidth) * 100)));

        // Update thumb position immediately for smooth visual feedback
        this.updateThumbPosition(this.activeThumb, newPosition);

        // Calculate new price with higher precision
        const priceRange = this.maxPrice - this.minPrice;
        const newPrice = Math.round(this.minPrice + (newPosition / 100) * priceRange);

        // Update current values
        if (this.activeThumb === 'min') {
            this.currentMin = Math.min(newPrice, this.currentMax - 1);
        } else {
            this.currentMax = Math.max(newPrice, this.currentMin + 1);
        }

        // Update displays immediately for real-time feedback
        this.updateSlider();
        this.updateDisplay();
        this.updateInputs();

        // Trigger filter update for real-time filtering
        if (typeof filterTours === 'function') {
            filterTours();
        }
    }

    endDrag(e) {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.activeThumb = null;

        // Remove dragging class
        this.container.classList.remove('dragging');

        // Keep tooltips visible after dragging
        // Don't hide them - they should stay visible

        document.body.style.userSelect = '';
        document.body.style.cursor = '';

        // Trigger filter update
        if (typeof filterTours === 'function') {
            filterTours();
        }
    }

    handleTrackClick(e) {
        if (this.isDragging) return;

        const rect = this.slider.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickPercentage = (clickX / rect.width) * 100;

        // Determine which thumb to move based on click position
        const minDistance = Math.abs(clickPercentage - this.getThumbPosition('min'));
        const maxDistance = Math.abs(clickPercentage - this.getThumbPosition('max'));

        const thumbToMove = minDistance < maxDistance ? 'min' : 'max';
        this.updateThumbPosition(thumbToMove, clickPercentage);

        // Show tooltip for the clicked thumb
        if (thumbToMove === 'min' && this.minTooltip) {
            this.minTooltip.classList.add('show');
        } else if (thumbToMove === 'max' && this.maxTooltip) {
            this.maxTooltip.classList.add('show');
        }

        // Calculate new price with higher precision
        const priceRange = this.maxPrice - this.minPrice;
        const newPrice = Math.round(this.minPrice + (clickPercentage / 100) * priceRange);

        if (thumbToMove === 'min') {
            this.currentMin = Math.min(newPrice, this.currentMax - 1);
        } else {
            this.currentMax = Math.max(newPrice, this.currentMin + 1);
        }

        this.updateSlider();
        this.updateDisplay();
        this.updateInputs();

        // Trigger filter update
        if (typeof filterTours === 'function') {
            filterTours();
        }
    }

    handleInputChange(e) {
        const value = parseInt(e.target.value) || 0;

        if (e.target === this.minInput) {
            this.currentMin = Math.max(this.minPrice, Math.min(value, this.currentMax - 1));
        } else if (e.target === this.maxInput) {
            this.currentMax = Math.min(this.maxPrice, Math.max(value, this.currentMin + 1));
        }

        this.updateSlider();
        this.updateDisplay();

        // Trigger filter update
        if (typeof filterTours === 'function') {
            filterTours();
        }
    }

    handleKeyDown(e, thumbType) {
        const step = e.shiftKey ? 1 : 5; // Smaller steps for more precision
        let newPrice;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                e.preventDefault();
                newPrice = thumbType === 'min' ?
                    Math.max(this.minPrice, this.currentMin - step) :
                    Math.max(this.currentMin + 1, this.currentMax - step);
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                e.preventDefault();
                newPrice = thumbType === 'min' ?
                    Math.min(this.currentMax - 1, this.currentMin + step) :
                    Math.min(this.maxPrice, this.currentMax + step);
                break;
            case 'Home':
                e.preventDefault();
                newPrice = thumbType === 'min' ? this.minPrice : this.currentMin + 1;
                break;
            case 'End':
                e.preventDefault();
                newPrice = thumbType === 'min' ? this.currentMax - 1 : this.maxPrice;
                break;
            default:
                return; // Don't prevent default for other keys
        }

        if (thumbType === 'min') {
            this.currentMin = newPrice;
        } else {
            this.currentMax = newPrice;
        }

        this.updateSlider();
        this.updateDisplay();
        this.updateInputs();

        // Trigger filter update
        if (typeof filterTours === 'function') {
            filterTours();
        }
    }

    getThumbPosition(thumbType) {
        const thumb = thumbType === 'min' ? this.minThumb : this.maxThumb;
        const left = thumb.style.left;
        return parseFloat(left) || (thumbType === 'min' ? 0 : 100);
    }

    updateThumbPosition(thumbType, percentage) {
        const thumb = thumbType === 'min' ? this.minThumb : this.maxThumb;
        thumb.style.left = percentage + '%';
    }

    updateSlider() {
        const minPercentage = ((this.currentMin - this.minPrice) / (this.maxPrice - this.minPrice)) * 100;
        const maxPercentage = ((this.currentMax - this.minPrice) / (this.maxPrice - this.minPrice)) * 100;

        // Update thumb positions
        this.minThumb.style.left = minPercentage + '%';
        this.maxThumb.style.left = maxPercentage + '%';

        // Update range bar
        this.range.style.left = minPercentage + '%';
        this.range.style.width = (maxPercentage - minPercentage) + '%';
    }

    updateDisplay() {
        // Update MIN and MAX displays - try multiple selectors
        const minDisplay = document.querySelector('#priceMinDisplay') || document.querySelector('#mobilePriceMinDisplay');
        const maxDisplay = document.querySelector('#priceMaxDisplay') || document.querySelector('#mobilePriceMaxDisplay');

        if (minDisplay) {
            minDisplay.textContent = '$' + this.currentMin;
        }

        if (maxDisplay) {
            maxDisplay.textContent = '$' + this.currentMax;
        }

        // Update tooltips
        if (this.minTooltip) {
            this.minTooltip.textContent = '$' + this.currentMin;
        }
        if (this.maxTooltip) {
            this.maxTooltip.textContent = '$' + this.currentMax;
        }

        // Update ARIA attributes
        this.minThumb.setAttribute('aria-valuenow', this.currentMin);
        this.minThumb.setAttribute('aria-valuetext', '$' + this.currentMin);
        this.maxThumb.setAttribute('aria-valuenow', this.currentMax);
        this.maxThumb.setAttribute('aria-valuetext', '$' + this.currentMax);

        // Update input placeholders to show current range
        if (this.minInput) {
            this.minInput.placeholder = this.currentMin.toString();
        }
        if (this.maxInput) {
            this.maxInput.placeholder = this.currentMax.toString();
        }
    }

    updateInputs() {
        if (this.minInput) {
            this.minInput.value = this.currentMin;
        }
        if (this.maxInput) {
            this.maxInput.value = this.currentMax;
        }
    }

    setRange(min, max) {
        this.currentMin = Math.max(this.minPrice, Math.min(min, this.maxPrice));
        this.currentMax = Math.min(this.maxPrice, Math.max(max, this.minPrice));

        // Ensure min < max with minimum 1 difference
        if (this.currentMin >= this.currentMax) {
            this.currentMin = this.currentMax - 1;
        }

        this.updateSlider();
        this.updateDisplay();
        this.updateInputs();
    }

    getRange() {
        return {
            min: this.currentMin,
            max: this.currentMax
        };
    }
}

// Initialize double range sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize desktop slider
    const desktopContainer = document.querySelector('.filters-sidebar .double-range-slider-container');
    if (desktopContainer) {
        new DoubleRangeSlider(desktopContainer);
    }

    // Initialize mobile slider
    const mobileContainer = document.querySelector('.mobile-filter-body .double-range-slider-container');
    if (mobileContainer) {
        new DoubleRangeSlider(mobileContainer);
    }
});

function filterByType(type) {
    clearAllFilters();
    const typeCheckbox = document.getElementById(`type-${type}`);
    if (typeCheckbox) {
        typeCheckbox.checked = true;
        filterTours();
    }
}

// Handle URL parameters on page load
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');

    if (type) {
        // Apply the filter based on URL parameter
        filterByType(type);

        // Also check the mobile filter checkbox if it exists
        const mobileTypeCheckbox = document.getElementById(`mobile-type-${type}`);
        if (mobileTypeCheckbox) {
            mobileTypeCheckbox.checked = true;
        }
    }
}

// Export functions for external use
window.filterByDestination = filterByDestination;
window.filterByType = filterByType;
window.openMobileFilters = openMobileFilters;
window.closeMobileFilters = closeMobileFilters;
window.applyMobileFilters = applyMobileFilters;
window.clearMobileFilters = clearMobileFilters;
window.changePage = changePage;
window.clearAllFilters = clearAllFilters;
window.sortTours = sortTours;
window.switchView = switchView;

// Initialize URL parameter handling when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    handleURLParameters();
});
