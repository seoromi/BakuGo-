/**
 * Reviews Service
 * 
 * Handles all review-related API calls.
 * Replace localStorage.saveItem calls with API calls when backend is integrated.
 */

import { ApiService } from './api.service.js';
import { API_CONFIG } from '../config/api.config.js';

export class ReviewsService extends ApiService {
  constructor() {
    super();
    const config = API_CONFIG || {};
    this.endpoints = config.endpoints?.reviews || {
      create: '/reviews',
      list: '/reviews',
      detail: (id) => `/reviews/${id}`,
      byTour: (tourId) => `/reviews?tourId=${tourId}`
    };
  }

  /**
   * Create a new review
   * @param {Object} reviewData - Review data
   * @returns {Promise<Object>} Created review with ID
   */
  async createReview(reviewData) {
    // TODO: Replace localStorage with API call when backend is ready
    // return this.post(this.endpoints.create, reviewData);
    
    // Current: Save to localStorage/log (existing functionality)
    // When backend is ready, uncomment above and remove localStorage code
    const savedData = {
      ...reviewData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('lastReview', JSON.stringify(savedData));
    console.log('Review saved (localStorage):', savedData);
    return Promise.resolve(savedData);
  }

  /**
   * Get reviews for a specific tour
   * @param {number|string} tourId - Tour ID
   * @returns {Promise<Array>} Array of reviews
   */
  async getReviewsByTour(tourId) {
    // TODO: Replace with actual API call when backend is ready
    // return this.get(this.endpoints.byTour(tourId));
    
    return Promise.resolve([]);
  }

  /**
   * Get all reviews
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>} Array of reviews
   */
  async getReviews(filters = {}) {
    // TODO: Replace with actual API call when backend is ready
    // return this.get(this.endpoints.list, filters);
    
    return Promise.resolve([]);
  }

  /**
   * Get review by ID
   * @param {number|string} id - Review ID
   * @returns {Promise<Object>} Review object
   */
  async getReviewById(id) {
    // TODO: Replace with actual API call when backend is ready
    // return this.get(this.endpoints.detail(id));
    
    return Promise.resolve(null);
  }
}

