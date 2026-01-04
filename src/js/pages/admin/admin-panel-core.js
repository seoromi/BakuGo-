// Admin Panel Core Class
// This file contains the main AdminPanel class structure
// Other modules extend this class with additional functionality

/**
 * SECURITY NOTES FOR PRODUCTION:
 * 
 * 1. Content Security Policy (CSP) - Add to HTML <head>:
 *    <meta http-equiv="Content-Security-Policy" 
 *          content="default-src 'self'; 
 *                   script-src 'self' 'unsafe-inline'; 
 *                   style-src 'self' 'unsafe-inline'; 
 *                   img-src 'self' data: https: blob:;
 *                   connect-src 'self' https:;
 *                   font-src 'self' data:;">
 * 
 * 2. Authentication - Use httpOnly cookies instead of localStorage:
 *    - localStorage.getItem('authToken') is vulnerable to XSS
 *    - Backend should set httpOnly cookies that cannot be accessed via JavaScript
 * 
 * 3. CSV Export - All fields are sanitized to prevent formula injection attacks
 * 
 * 4. File Uploads - Validated for type and size, using object URLs for memory efficiency
 */

import { RateLimiter } from './rate-limiter.js';

export class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentPage = {
            tours: 1,
            destinations: 1,
            content: 1,
            bookings: 1,
            reviews: 1,
            customers: 1
        };
        this.itemsPerPage = 10;
        
        // Sample data (will be moved to admin-data.js)
        this.tours = this.getSampleTours();
        this.destinations = this.getSampleDestinations();
        this.content = this.getSampleContent();
        this.bookings = this.getSampleBookings();
        this.reviews = this.getSampleReviews();
        this.promoCodes = this.getSamplePromoCodes();
        this.customers = this.getSampleCustomers();
        
        // Security: Rate limiters for form submissions
        this.saveRateLimiter = new RateLimiter(5, 60000); // 5 calls per minute
        this.searchRateLimiter = new RateLimiter(10, 1000); // 10 calls per second
        
        // Memory management: Track object URLs for cleanup
        this.currentImagePreviewUrl = null;
        this.galleryImageUrls = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupImageUpload();
        this.setupEventDelegation();
        this.loadDashboard();
        this.updateNavigationCounts();
        this.setupCharts();
        this.hideLoading();
        
        // Ensure DOM cache is initialized
        this.cacheDOMReferences();
    }

    // Navigation and section management
    showSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

        // Update breadcrumb
        const currentSectionEl = document.getElementById('currentSection');
        if (currentSectionEl) {
            currentSectionEl.textContent = this.getSectionTitle(section);
        }

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const sectionEl = document.getElementById(`${section}-section`);
        if (sectionEl) {
            sectionEl.classList.add('active');
        }

        this.currentSection = section;

        // Load section-specific data
        this.loadSectionData(section);
    }

    getSectionTitle(section) {
        const titles = {
            dashboard: 'Dashboard',
            tours: 'Tours Management',
            destinations: 'Destinations',
            content: 'Content Management',
            bookings: 'Bookings Management',
            customers: 'Customers',
            reviews: 'Reviews Management',
            'promo-codes': 'Promo Codes',
            analytics: 'Analytics & Reports',
            languages: 'Languages',
            users: 'Admin Users',
            settings: 'Settings'
        };
        return titles[section] || section;
    }

    loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'tours':
                this.loadTours();
                break;
            case 'destinations':
                this.loadDestinations();
                break;
            case 'content':
                this.loadContent();
                break;
            case 'bookings':
                this.loadBookings();
                break;
            case 'customers':
                this.loadCustomers();
                break;
            case 'reviews':
                this.loadReviews();
                break;
            case 'promo-codes':
                this.loadPromoCodes();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'languages':
                this.loadLanguages();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    // Event setup methods (will be moved to admin-events.js)
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        document.getElementById('mobileMenuToggle')?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // User menu
        document.getElementById('userMenuBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleUserMenu();
        });

        // Notifications
        document.getElementById('notificationBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNotifications();
        });

        // Global search with debouncing
        const debouncedSearch = this.debounce((value) => {
            this.handleGlobalSearch(value);
        }, 300);
        
        document.getElementById('globalSearch')?.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Accommodation section toggle
        document.getElementById('tourType')?.addEventListener('change', () => {
            this.toggleAccommodationSection();
        });
        
        document.getElementById('tourDuration')?.addEventListener('input', () => {
            this.toggleAccommodationSection();
        });

        // Filter events
        this.setupFilterEvents();

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeDropdowns();
        });

        // Modal events
        this.setupModalEvents();
    }

    setupEventDelegation() {
        // Delegate clicks on action buttons
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;

            const action = target.dataset.action;
            const id = target.dataset.id ? parseInt(target.dataset.id) : null;
            const section = target.dataset.section;

            try {
                switch (action) {
                    case 'view-tour':
                        if (id) this.viewTour(id);
                        break;
                    case 'edit-tour':
                        if (id) this.editTour(id);
                        break;
                    case 'delete-tour':
                        if (id) this.deleteTour(id);
                        break;
                    case 'view-booking':
                        if (id) this.viewBooking(id);
                        break;
                    case 'edit-booking':
                        if (id) this.editBooking(id);
                        break;
                    case 'delete-booking':
                        if (id) this.deleteBooking(id);
                        break;
                    case 'view-customer':
                        if (id) this.viewCustomer(id);
                        break;
                    case 'edit-customer':
                        if (id) this.editCustomer(id);
                        break;
                    case 'delete-customer':
                        if (id) this.deleteCustomer(id);
                        break;
                    case 'approve-review':
                        if (id) this.approveReview(id);
                        break;
                    case 'reject-review':
                        if (id) this.rejectReview(id);
                        break;
                    case 'edit-promo':
                        if (id) this.editPromoCode(id);
                        break;
                    case 'delete-promo':
                        if (id) this.deletePromoCode(id);
                        break;
                    case 'edit-destination':
                        if (target.dataset.destinationId) this.editDestination(target.dataset.destinationId);
                        break;
                    case 'delete-destination':
                        if (target.dataset.destinationId) this.deleteDestination(target.dataset.destinationId);
                        break;
                    case 'edit-content':
                        if (target.dataset.contentId) this.editContent(target.dataset.contentId);
                        break;
                    case 'delete-content':
                        if (target.dataset.contentId) this.deleteContent(target.dataset.contentId);
                        break;
                    case 'previous-page':
                        if (section) this.previousPage(section);
                        break;
                    case 'next-page':
                        if (section) this.nextPage(section);
                        break;
                }
            } catch (error) {
                if (window.ENV?.DEBUG === true) {
                    console.error('Error handling delegated action:', error);
                }
                this.showMessage('An error occurred. Please try again.', 'error');
            }
        });
    }

    setupFilterEvents() {
        // Tour filters
        document.getElementById('tourTypeFilter')?.addEventListener('change', () => {
            this.filterTours();
        });

        document.getElementById('tourStatusFilter')?.addEventListener('change', () => {
            this.filterTours();
        });

        // Debounced search inputs
        const debouncedTourSearch = this.debounce(() => this.filterTours(), 300);
        document.getElementById('tourSearch')?.addEventListener('input', debouncedTourSearch);

        // Booking filters
        document.getElementById('bookingStatusFilter')?.addEventListener('change', () => {
            this.filterBookings();
        });

        const debouncedBookingSearch = this.debounce(() => this.filterBookings(), 300);
        document.getElementById('bookingSearch')?.addEventListener('input', debouncedBookingSearch);

        // Review filters
        document.getElementById('reviewStatusFilter')?.addEventListener('change', () => {
            this.filterReviews();
        });

        document.getElementById('reviewRatingFilter')?.addEventListener('change', () => {
            this.filterReviews();
        });

        const debouncedReviewSearch = this.debounce(() => this.filterReviews(), 300);
        document.getElementById('reviewSearch')?.addEventListener('input', debouncedReviewSearch);
    }

    setupModalEvents() {
        // Close modal buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    // Global search handler
    handleGlobalSearch(query) {
        if (query.length < 2) return;
        
        // Rate limiting for search
        if (!this.searchRateLimiter.attempt()) {
            return; // Silently ignore if rate limited
        }
        
        // Simple search implementation
        const results = [];
        
        this.tours.forEach(tour => {
            if (tour.title.toLowerCase().includes(query.toLowerCase())) {
                results.push({ type: 'tour', item: tour });
            }
        });
        
        this.bookings.forEach(booking => {
            if (booking.customerName.toLowerCase().includes(query.toLowerCase())) {
                results.push({ type: 'booking', item: booking });
            }
        });
        
        if (window.ENV?.DEBUG === true) {
            console.log('Search results:', results);
        }
    }

    // Modal management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Cleanup: Revoke main image object URL to prevent memory leaks
            if (this.currentImagePreviewUrl) {
                URL.revokeObjectURL(this.currentImagePreviewUrl);
                this.currentImagePreviewUrl = null;
            }
            
            // Cleanup: Revoke all gallery object URLs to prevent memory leaks
            if (this.galleryImageUrls && this.galleryImageUrls.length > 0) {
                this.galleryImageUrls.forEach(url => {
                    try {
                        URL.revokeObjectURL(url);
                    } catch (e) {
                        // URL already revoked, ignore
                    }
                });
                this.galleryImageUrls = [];
            }
        }
    }

    // Loading state management
    setLoadingState(context, isLoading) {
        const modal = document.getElementById(context);
        if (!modal) return;
        
        const submitBtn = modal.querySelector('button[type="submit"]');
        const allButtons = modal.querySelectorAll('button');
        
        if (isLoading) {
            modal.classList.add('loading');
            allButtons.forEach(btn => {
                btn.disabled = true;
                if (btn === submitBtn) {
                    btn.dataset.originalText = btn.textContent;
                    btn.textContent = '';
                    const spinner = document.createElement('i');
                    spinner.className = 'fas fa-spinner fa-spin';
                    btn.appendChild(spinner);
                    btn.appendChild(document.createTextNode(' Saving...'));
                }
            });
        } else {
            modal.classList.remove('loading');
            allButtons.forEach(btn => {
                btn.disabled = false;
                if (btn === submitBtn && btn.dataset.originalText) {
                    btn.textContent = btn.dataset.originalText;
                    delete btn.dataset.originalText;
                }
            });
        }
    }

    // Confirmation modal
    showConfirmModal(title, message, confirmCallback, confirmButtonText = 'Confirm', confirmButtonClass = 'btn-danger') {
        const confirmTitle = document.getElementById('confirmTitle');
        const confirmMessage = document.getElementById('confirmMessage');
        
        if (confirmTitle) confirmTitle.textContent = title;
        if (confirmMessage) confirmMessage.textContent = message;
        
        const confirmButton = document.getElementById('confirmButton');
        if (confirmButton) {
            confirmButton.textContent = confirmButtonText;
            confirmButton.className = `btn ${confirmButtonClass}`;
        }
        
        // Store the callback function
        this.pendingConfirmCallback = confirmCallback;
        
        // Show the modal
        this.showModal('confirmModal');
    }

    closeConfirmModal() {
        this.closeModal('confirmModal');
        this.pendingConfirmCallback = null;
    }

    executeConfirmAction() {
        if (this.pendingConfirmCallback) {
            this.pendingConfirmCallback();
        }
        this.closeConfirmModal();
    }

    // Placeholder methods - will be implemented in other modules
    // These are here to prevent errors during migration
    
    // Dashboard methods (will be in admin-dashboard.js)
    loadDashboard() {
        // Placeholder - will be implemented in admin-dashboard.js
    }

    // Section loaders (will be in admin-sections.js)
    loadTours() {}
    loadDestinations() {}
    loadContent() {}
    loadBookings() {}
    loadCustomers() {}
    loadReviews() {}
    loadPromoCodes() {}
    loadAnalytics() {}
    loadLanguages() {}
    loadUsers() {}
    loadSettings() {}

    // Sample data methods (will be in admin-data.js)
    getSampleTours() { return []; }
    getSampleDestinations() { return []; }
    getSampleContent() { return []; }
    getSampleBookings() { return []; }
    getSampleReviews() { return []; }
    getSamplePromoCodes() { return []; }
    getSampleCustomers() { return []; }

    // Image upload methods (will be in admin-modals.js)
    setupImageUpload() {}
    setupGalleryUpload() {}
    toggleAccommodationSection() {}

    // Chart methods (will be in admin-charts.js)
    setupCharts() {}
    setupBookingChart() {}
    setupAnalyticsCharts() {}

    // CRUD methods (will be in admin-crud.js)
    viewTour() {}
    editTour() {}
    deleteTour() {}
    viewBooking() {}
    editBooking() {}
    deleteBooking() {}
    viewCustomer() {}
    editCustomer() {}
    deleteCustomer() {}
    approveReview() {}
    rejectReview() {}
    editPromoCode() {}
    deletePromoCode() {}
    editDestination() {}
    deleteDestination() {}
    editContent() {}
    deleteContent() {}
}

