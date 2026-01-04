/**
 * Bookings Service
 * 
 * Handles all booking-related API calls.
 * Replace localStorage.saveItem calls with API calls when backend is integrated.
 */

import { ApiService } from './api.service.js';
import { API_CONFIG } from '../config/api.config.js';

export class BookingsService extends ApiService {
  constructor() {
    super();
    const config = API_CONFIG || {};
    this.endpoints = config.endpoints?.bookings || {
      create: '/bookings',
      detail: (id) => `/bookings/${id}`,
      list: '/bookings',
      update: (id) => `/bookings/${id}`,
      delete: (id) => `/bookings/${id}`
    };
  }

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking with ID
   */
  async createBooking(bookingData) {
    // TODO: Replace localStorage with API call when backend is ready
    // return this.post(this.endpoints.create, bookingData);
    
    // Current: Save to localStorage (existing functionality)
    // When backend is ready, uncomment above and remove localStorage code
    const savedData = {
      ...bookingData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('lastBooking', JSON.stringify(savedData));
    return Promise.resolve(savedData);
  }

  /**
   * Get booking by ID
   * @param {number|string} id - Booking ID
   * @returns {Promise<Object>} Booking object
   */
  async getBookingById(id) {
    // TODO: Replace with actual API call when backend is ready
    // return this.get(this.endpoints.detail(id));
    
    return Promise.resolve(null);
  }

  /**
   * Get all bookings (for admin)
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>} Array of bookings
   */
  async getBookings(filters = {}) {
    // TODO: Replace with actual API call when backend is ready
    // return this.get(this.endpoints.list, filters);
    
    return Promise.resolve([]);
  }

  /**
   * Update booking
   * @param {number|string} id - Booking ID
   * @param {Object} bookingData - Updated booking data
   * @returns {Promise<Object>} Updated booking
   */
  async updateBooking(id, bookingData) {
    // TODO: Replace with actual API call when backend is ready
    // return this.put(this.endpoints.update(id), bookingData);
    
    return Promise.resolve(null);
  }

  /**
   * Delete booking
   * @param {number|string} id - Booking ID
   * @returns {Promise<void>}
   */
  async deleteBooking(id) {
    // TODO: Replace with actual API call when backend is ready
    // return this.delete(this.endpoints.delete(id));
    
    return Promise.resolve();
  }
}

