/**
 * Destinations Service
 * 
 * Handles all destination-related API calls.
 * Replace hardcoded destinations array with API calls when backend is integrated.
 */

import { ApiService } from './api.service.js';
import { API_CONFIG } from '../config/api.config.js';

export class DestinationsService extends ApiService {
  constructor() {
    super();
    const config = API_CONFIG || {};
    this.endpoints = config.endpoints?.destinations || {
      list: '/destinations',
      detail: (id) => `/destinations/${id}`
    };
  }

  /**
   * Get all destinations
   * @returns {Promise<Array>} Array of destinations
   */
  async getDestinations() {
    // TODO: Replace with actual API call when backend is ready
    // return this.get(this.endpoints.list);
    
    // Current: Return empty array (frontend uses hardcoded data)
    // When backend is ready, uncomment above and remove this
    return Promise.resolve([]);
  }

  /**
   * Get destination by ID
   * @param {number|string} id - Destination ID
   * @returns {Promise<Object>} Destination object
   */
  async getDestinationById(id) {
    // TODO: Replace with actual API call when backend is ready
    // return this.get(this.endpoints.detail(id));
    
    return Promise.resolve(null);
  }
}

