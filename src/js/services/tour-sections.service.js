/**
 * Tour Sections Service
 * 
 * Handles all tour sections data operations:
 * - Loading from localStorage (current fallback)
 * - Saving to localStorage (current fallback)
 * - Default data management
 * - Data filtering and transformation
 * 
 * This service extends ApiService for backend integration.
 * When backend is ready, replace localStorage calls with API calls.
 */

import { ApiService } from './api.service.js';
import { API_CONFIG } from '../config/api.config.js';

export class TourSectionsService extends ApiService {
    constructor() {
        super();
        const config = API_CONFIG || {};
        this.endpoints = config.endpoints?.tourSections || {
            list: '/tour-sections',
            detail: (id) => `/tour-sections/${id}`,
            create: '/tour-sections',
            update: (id) => `/tour-sections/${id}`,
            delete: (id) => `/tour-sections/${id}`,
            addTour: (sectionId) => `/tour-sections/${sectionId}/tours`,
            updateTour: (sectionId, tourId) => `/tour-sections/${sectionId}/tours/${tourId}`,
            deleteTour: (sectionId, tourId) => `/tour-sections/${sectionId}/tours/${tourId}`
        };
        this.storageKey = "tourSections";
        this.sections = [];
        this.loadData();
    }

    /**
     * Get all tour sections
     * @returns {Promise<Array>} Array of tour sections
     */
    async getSections() {
        // TODO: When backend is ready, uncomment this:
        // return this.get(this.endpoints.list);
        
        // Current: Return from localStorage (existing functionality)
        return Promise.resolve(this.sections);
    }

    /**
     * Get section by ID
     * @param {string} sectionId - Section ID
     * @returns {Promise<Object|null>} Section object or null
     */
    async getSectionById(sectionId) {
        const section = this.sections.find(s => s.id === sectionId);
        return Promise.resolve(section || null);
    }

    /**
     * Get sections by type
     * @param {string} type - Section type (group, package, private, driver)
     * @returns {Promise<Array>} Filtered sections
     */
    async getSectionsByType(type) {
        const filtered = this.sections.filter(section => section.sectionType === type);
        return Promise.resolve(filtered);
    }

    /**
     * Get filtered sections based on component options
     * This is the business logic for filtering - moved from component
     * @param {Object} options - Filter options { type, sectionId, all, limit }
     * @returns {Promise<Array>} Filtered sections
     */
    async getFilteredSections(options) {
        const { type, sectionId, all, limit } = options;
        
        let filtered = [...this.sections];
        
        // Filter by section ID
        if (sectionId) {
            filtered = filtered.filter(section => section.id === sectionId);
        }
        // Filter by type (if not "all")
        else if (type && !all) {
            filtered = filtered.filter(section => section.sectionType === type);
        }
        
        // Apply limit (slice tours in each section)
        if (limit && filtered.length > 0) {
            filtered = filtered.map(section => ({
                ...section,
                tours: section.tours.slice(0, limit)
            }));
        }
        
        return Promise.resolve(filtered);
    }

    /**
     * Add new section
     * @param {Object} sectionData - Section data
     * @returns {Promise<Object>} Created section
     */
    async addSection(sectionData) {
        // TODO: When backend is ready, uncomment this:
        // return this.post(this.endpoints.create, sectionData);
        
        // Current: Save to localStorage (existing functionality)
        const newSection = {
            id: `section_${Date.now()}`,
            ...sectionData,
            tours: sectionData.tours || []
        };
        
        this.sections.push(newSection);
        await this.saveData();
        return Promise.resolve(newSection);
    }

    /**
     * Update section
     * @param {string} sectionId - Section ID
     * @param {Object} updates - Updates to apply
     * @returns {Promise<Object>} Updated section
     */
    async updateSection(sectionId, updates) {
        // TODO: When backend is ready, uncomment this:
        // return this.put(this.endpoints.update(sectionId), updates);
        
        // Current: Update in localStorage (existing functionality)
        const index = this.sections.findIndex(s => s.id === sectionId);
        if (index === -1) {
            throw new Error(`Section ${sectionId} not found`);
        }
        
        this.sections[index] = { ...this.sections[index], ...updates };
        await this.saveData();
        return Promise.resolve(this.sections[index]);
    }

    /**
     * Delete section
     * @param {string} sectionId - Section ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteSection(sectionId) {
        // TODO: When backend is ready, uncomment this:
        // await this.delete(this.endpoints.delete(sectionId));
        // return Promise.resolve(true);
        
        // Current: Delete from localStorage (existing functionality)
        const index = this.sections.findIndex(s => s.id === sectionId);
        if (index === -1) {
            throw new Error(`Section ${sectionId} not found`);
        }
        
        this.sections.splice(index, 1);
        await this.saveData();
        return Promise.resolve(true);
    }

    /**
     * Add tour to section
     * @param {string} sectionId - Section ID
     * @param {Object} tourData - Tour data
     * @returns {Promise<Object>} Created tour
     */
    async addTourToSection(sectionId, tourData) {
        // TODO: When backend is ready, uncomment this:
        // return this.post(this.endpoints.addTour(sectionId), tourData);
        
        // Current: Add to localStorage (existing functionality)
        const section = this.sections.find(s => s.id === sectionId);
        if (!section) {
            throw new Error(`Section ${sectionId} not found`);
        }
        
        const newTour = {
            id: `tour_${Date.now()}`,
            ...tourData
        };
        
        section.tours.push(newTour);
        await this.saveData();
        return Promise.resolve(newTour);
    }

    /**
     * Update tour in section
     * @param {string} sectionId - Section ID
     * @param {string} tourId - Tour ID
     * @param {Object} updates - Updates to apply
     * @returns {Promise<Object>} Updated tour
     */
    async updateTourInSection(sectionId, tourId, updates) {
        // TODO: When backend is ready, uncomment this:
        // return this.put(this.endpoints.updateTour(sectionId, tourId), updates);
        
        // Current: Update in localStorage (existing functionality)
        const section = this.sections.find(s => s.id === sectionId);
        if (!section) {
            throw new Error(`Section ${sectionId} not found`);
        }
        
        const tourIndex = section.tours.findIndex(t => t.id === tourId);
        if (tourIndex === -1) {
            throw new Error(`Tour ${tourId} not found in section ${sectionId}`);
        }
        
        section.tours[tourIndex] = { ...section.tours[tourIndex], ...updates };
        await this.saveData();
        return Promise.resolve(section.tours[tourIndex]);
    }

    /**
     * Delete tour from section
     * @param {string} sectionId - Section ID
     * @param {string} tourId - Tour ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteTourFromSection(sectionId, tourId) {
        // TODO: When backend is ready, uncomment this:
        // await this.delete(this.endpoints.deleteTour(sectionId, tourId));
        // return Promise.resolve(true);
        
        // Current: Delete from localStorage (existing functionality)
        const section = this.sections.find(s => s.id === sectionId);
        if (!section) {
            throw new Error(`Section ${sectionId} not found`);
        }
        
        const tourIndex = section.tours.findIndex(t => t.id === tourId);
        if (tourIndex === -1) {
            throw new Error(`Tour ${tourId} not found in section ${sectionId}`);
        }
        
        section.tours.splice(tourIndex, 1);
        await this.saveData();
        return Promise.resolve(true);
    }

    /**
     * Export data as JSON
     * @returns {Promise<string>} JSON string
     */
    async exportData() {
        return Promise.resolve(JSON.stringify(this.sections, null, 2));
    }

    /**
     * Import data from JSON
     * @param {string} jsonData - JSON string
     * @returns {Promise<boolean>} Success status
     */
    async importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (!Array.isArray(data)) {
                throw new Error("Invalid data format. Expected an array of tour sections.");
            }
            
            this.sections = data;
            await this.saveData();
            return Promise.resolve(true);
        } catch (error) {
            throw new Error(`Error importing data: ${error.message}`);
        }
    }

    /**
     * Clear all data
     * @returns {Promise<boolean>} Success status
     */
    async clearAllData() {
        this.sections = [];
        await this.saveData();
        return Promise.resolve(true);
    }

    /**
     * Load data from localStorage
     */
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.sections = JSON.parse(stored);
            } else {
                this.loadDefaultData();
            }
        } catch (error) {
            console.error("Error loading data:", error);
            this.loadDefaultData();
        }
    }

    /**
     * Save data to localStorage
     */
    async saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.sections));
        } catch (error) {
            console.error("Error saving data:", error);
            throw error;
        }
    }

    /**
     * Load default data
     */
    loadDefaultData() {
        this.sections = [{
            id: "section_daily",
            title: "Ежедневные групповые туры",
            sectionType: "group",
            tours: [
                {
                    id: "tour_1",
                    title: "Групповой тур в Разноцветные горы, Алтыагадж, гора Беш-Бармаг, Розовое озеро",
                    description: "Откройте для себя невероятные природные красоты Азербайджана в этом захватывающем однодневном туре.",
                    price: "от 49$",
                    badge: "👥 с гидом",
                    duration: "8 часов",
                    image: "img/firstslider1.jpg",
                    link: "page/dailytours/coloredmountainsslider.html"
                },
                {
                    id: "tour_2",
                    title: "Гобустан, Грязевые вулканы, Храм Огня, Пылающая гора",
                    description: "Погрузитесь в древнюю историю Азербайджана в национальном парке Гобустан.",
                    price: "от 38$",
                    badge: "👥 с гидом",
                    duration: "8 часов",
                    image: "img/page-card-img/daily-gobustan-main.jpeg",
                    link: "page/dailytours/gobustanpage.html"
                }
            ],
            showMore: {
                text: "Все групповые туры",
                link: "all-tours.html?type=group"
            }
        }];
        this.saveData();
    }
}

