/**
 * Base API Service Class
 * 
 * Provides base functionality for all API service classes.
 * Handles request/response, error handling, and authentication.
 */

import { API_CONFIG } from '../config/api.config.js';

class ApiService {
  constructor(baseURL = null) {
    const config = API_CONFIG || {};
    this.baseURL = baseURL || config.baseURL || '/api';
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = config.defaultHeaders || {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Get CSRF token from meta tag
   * @returns {string|null} CSRF token or null if not found
   */
  getCSRFToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.content : null;
  }

  /**
   * Get authentication headers
   * Note: Authentication is handled via httpOnly cookies (set by backend)
   * Cookies are sent automatically by the browser, no JavaScript access needed
   * @returns {Object} Headers with CSRF token if available
   */
  getAuthHeaders() {
    const headers = {};
    
    // Add CSRF token for mutating requests (POST, PUT, DELETE)
    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
    
    return headers;
  }

  /**
   * Build full URL from endpoint
   * @param {string} endpoint - API endpoint
   * @returns {string} Full URL
   */
  buildURL(endpoint) {
    // Remove leading slash if baseURL ends with slash
    const base = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  }

  /**
   * Make HTTP request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise} Response data
   */
  async request(endpoint, options = {}) {
    const url = this.buildURL(endpoint);
    
    // Include credentials (cookies) in all requests
    const config = {
      method: options.method || 'GET',
      credentials: 'include', // Send httpOnly cookies automatically
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeaders(),
        ...options.headers
      },
      ...options
    };

    // Stringify body if it's an object
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new ApiError(response.status, errorData.message || errorData.error?.message || 'Request failed', errorData);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout', null);
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, error.message || 'Network error', null);
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} Response data
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise} Response data
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise} Response data
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} Response data
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

/**
 * API Error Class
 */
class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ES Module exports
export { ApiService, ApiError };

