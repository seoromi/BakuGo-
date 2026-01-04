/**
 * Tours Service
 * 
 * Handles all tours-related API calls.
 * 
 * BACKEND INTEGRATION:
 * When backend is ready, uncomment the API calls and remove the mock implementations.
 * The service methods will automatically switch from mock data to real API calls.
 */

import { ApiService } from './api.service.js';
import { API_CONFIG } from '../config/api.config.js';

export class ToursService extends ApiService {
  constructor() {
    super();
    this.endpoints = API_CONFIG.endpoints?.tours || {
      list: '/tours',
      detail: (id) => `/tours/${id}`,
      search: '/tours'
    };
  }

  /**
   * Get all tours
   * @param {Object} filters - Filter parameters (type, destination, search)
   * @returns {Promise<Array>} Array of tours
   */
  async getTours(filters = {}) {
    // TODO: When backend is ready, uncomment this:
    // return this.get(this.endpoints.list, filters);
    
    // Current: Return empty array (frontend uses TourSectionsService for now)
    return Promise.resolve([]);
  }

  /**
   * Get tour by ID
   * @param {number|string} id - Tour ID
   * @returns {Promise<Object>} Tour object
   */
  async getTourById(id) {
    // TODO: When backend is ready, uncomment this:
    // return this.get(this.endpoints.detail(id));
    
    // Current: Return null (frontend uses TourSectionsService for now)
    return Promise.resolve(null);
  }

  /**
   * Search tours
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Array>} Array of matching tours
   */
  async searchTours(query, filters = {}) {
    // TODO: When backend is ready, uncomment this:
    // return this.get(this.endpoints.search, { search: query, ...filters });
    
    // Current: Return empty array (frontend uses TourSectionsService for now)
    return Promise.resolve([]);
  }
}

