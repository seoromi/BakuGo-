/**
 * Tour Component
 * 
 * Renders tour sections and individual tour cards.
 * Pure presentation component - no business logic.
 */

import { sanitizeUrl } from '../utils/sanitize.js';

export class TourComponent {
    constructor(container, tourSectionsService) {
        this.container = container;
        this.tourSectionsService = tourSectionsService;
        this.options = this.parseOptions();
        this.init();
    }

    /**
     * Parse options from data attributes
     * @returns {Object} Parsed options
     */
    parseOptions() {
        const data = this.container.dataset;
        return {
            type: data.tourType || null,
            sectionId: data.tourSection || null,
            all: data.tourAll === "true",
            limit: parseInt(data.limit) || null,
            style: data.style || "default",
            columns: parseInt(data.columns) || 3,
            showMore: data.showMore !== "false"
        };
    }

    /**
     * Initialize component
     */
    async init() {
        this.showLoading();
        try {
            // Service handles all filtering logic
            const sections = await this.tourSectionsService.getFilteredSections(this.options);
            this.render(sections);
        } catch (error) {
            this.showError(error.message);
        }
    }

    /**
     * Show loading state (safe - static text)
     */
    showLoading() {
        this.container.classList.add("loading");
        this.container.innerHTML = "";
        const loadingSpan = document.createElement("span");
        loadingSpan.textContent = "Загрузка туров...";
        this.container.appendChild(loadingSpan);
    }

    /**
     * Show error message (safe - uses textContent)
     * @param {string} message - Error message
     */
    showError(message) {
        this.container.classList.remove("loading");
        this.container.innerHTML = "";
        
        const errorDiv = document.createElement("div");
        errorDiv.className = "tour-error";
        
        const icon = document.createElement("i");
        icon.className = "fas fa-exclamation-triangle";
        errorDiv.appendChild(icon);
        
        const heading = document.createElement("h3");
        heading.textContent = "Ошибка загрузки";
        errorDiv.appendChild(heading);
        
        const paragraph = document.createElement("p");
        paragraph.textContent = message || "Произошла ошибка";
        errorDiv.appendChild(paragraph);
        
        this.container.appendChild(errorDiv);
    }


    /**
     * Render tour sections (safe DOM manipulation)
     * @param {Array} sections - Tour sections to render
     */
    render(sections) {
        this.container.classList.remove("loading");
        
        if (!sections || sections.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        // Clear container
        this.container.innerHTML = "";
        
        // Render each section
        sections.forEach(section => {
            const sectionElement = this.renderSection(section);
            this.container.appendChild(sectionElement);
        });
    }

    /**
     * Render empty state (safe - static content)
     */
    renderEmptyState() {
        this.container.innerHTML = "";
        
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "tour-error";
        
        const icon = document.createElement("i");
        icon.className = "fas fa-search";
        emptyDiv.appendChild(icon);
        
        const heading = document.createElement("h3");
        heading.textContent = "Туры не найдены";
        emptyDiv.appendChild(heading);
        
        const paragraph = document.createElement("p");
        paragraph.textContent = "По вашему запросу туры не найдены.";
        emptyDiv.appendChild(paragraph);
        
        this.container.appendChild(emptyDiv);
    }

    /**
     * Render a tour section (safe DOM manipulation)
     * @param {Object} section - Section data
     * @returns {HTMLElement} Section element
     */
    renderSection(section) {
        const { style, columns, showMore } = this.options;
        
        const sectionDiv = document.createElement("div");
        sectionDiv.className = `tour-section ${style !== "default" ? `style-${style}` : ""}`;
        
        const container = document.createElement("div");
        container.className = "container";
        
        // Section title
        const title = document.createElement("h2");
        title.className = "tour-section-title";
        title.textContent = section.title || "";
        container.appendChild(title);
        
        // Tour grid
        const grid = document.createElement("div");
        grid.className = `tour-grid columns-${columns}`;
        
        section.tours.forEach(tour => {
            const tourElement = this.renderTour(tour);
            grid.appendChild(tourElement);
        });
        
        container.appendChild(grid);
        
        // Show more link
        if (showMore && section.showMore) {
            const showMoreElement = this.renderShowMore(section.showMore);
            container.appendChild(showMoreElement);
        }
        
        sectionDiv.appendChild(container);
        return sectionDiv;
    }

    /**
     * Render a single tour card (safe DOM manipulation)
     * @param {Object} tour - Tour data
     * @returns {HTMLElement} Tour card element
     */
    renderTour(tour) {
        // Sanitize URL
        const safeLink = sanitizeUrl(tour.link || "#");
        const safeImage = sanitizeUrl(tour.image || "");
        
        const link = document.createElement("a");
        link.href = safeLink;
        link.className = "tour-card";
        
        // Tour image container
        const imageDiv = document.createElement("div");
        imageDiv.className = "tour-image";
        if (safeImage) {
            imageDiv.style.backgroundImage = `url('${safeImage.replace(/'/g, "\\'")}')`;
        }
        
        // Badge
        const badge = document.createElement("div");
        badge.className = "tour-badge";
        badge.textContent = tour.badge || "";
        imageDiv.appendChild(badge);
        
        // Duration badge
        const durationBadge = document.createElement("div");
        durationBadge.className = "duration-badge";
        durationBadge.textContent = tour.duration || "";
        imageDiv.appendChild(durationBadge);
        
        link.appendChild(imageDiv);
        
        // Tour content
        const contentDiv = document.createElement("div");
        contentDiv.className = "tour-content";
        
        // Title
        const title = document.createElement("h3");
        title.className = "tour-title";
        title.textContent = tour.title || "";
        contentDiv.appendChild(title);
        
        // Description
        const description = document.createElement("p");
        description.className = "tour-description";
        description.textContent = tour.description || "";
        contentDiv.appendChild(description);
        
        // Price
        const price = document.createElement("div");
        price.className = "tour-price";
        price.textContent = tour.price || "";
        contentDiv.appendChild(price);
        
        link.appendChild(contentDiv);
        return link;
    }

    /**
     * Render "show more" link (safe DOM manipulation)
     * @param {Object} showMore - Show more data
     * @returns {HTMLElement} Show more element
     */
    renderShowMore(showMore) {
        const showMoreDiv = document.createElement("div");
        showMoreDiv.className = "tour-show-more";
        
        const safeLink = sanitizeUrl(showMore.link || "#");
        const link = document.createElement("a");
        link.href = safeLink;
        link.className = "tour-show-more-btn";
        link.textContent = showMore.text || "";
        
        const icon = document.createElement("i");
        icon.className = "fas fa-arrow-right";
        link.appendChild(icon);
        
        showMoreDiv.appendChild(link);
        return showMoreDiv;
    }

    /**
     * Initialize all tour components on page
     * @param {TourSectionsService} tourSectionsService - Service instance
     */
    static initAll(tourSectionsService) {
        document.querySelectorAll(".tour-container").forEach(container => {
            new TourComponent(container, tourSectionsService);
        });
    }

    /**
     * Refresh component
     */
    refresh() {
        this.init();
    }
}

