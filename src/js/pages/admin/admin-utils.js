// Admin Panel Utility Methods
// This module extends AdminPanel with utility functionality via mixin pattern

/**
 * Mixin function to add utility methods to AdminPanel
 * @param {Function} AdminPanelClass - The AdminPanel class to extend
 */
export function mixinUtilityMethods(AdminPanelClass) {
    // Performance: Debounce utility for input events
    AdminPanelClass.prototype.debounce = function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Error handling: Centralized error handler
    AdminPanelClass.prototype.handleError = function(context, error) {
        const errorInfo = {
            context: context,
            message: error.message || 'Unknown error',
            stack: error.stack,
            timestamp: new Date().toISOString()
        };
        
        // Log to console in development
        if (window.ENV?.DEBUG === true) {
            console.error(`[${context}] Error:`, errorInfo);
        }
        
        // In production, send to error tracking service (e.g., Sentry)
        // if (window.errorTracker) {
        //     window.errorTracker.captureException(error, { extra: errorInfo });
        // }
    };

    // Utility: Format date for display
    AdminPanelClass.prototype.formatDate = function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Utility: Show message to user
    AdminPanelClass.prototype.showMessage = function(text, type = 'info') {
        const container = document.getElementById('messageContainer');
        if (!container) return;
        
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        container.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (container.contains(message)) {
                    container.removeChild(message);
                }
            }, 300);
        }, 3000);
    };

    // Utility: Hide loading overlay
    AdminPanelClass.prototype.hideLoading = function() {
        setTimeout(() => {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.remove('active');
            }
        }, 1000);
    };

    // Utility: Update navigation counts
    AdminPanelClass.prototype.updateNavigationCounts = function() {
        const elements = {
            toursCount: this.tours.length,
            destinationsCount: this.destinations.length,
            bookingsCount: this.bookings.length,
            reviewsCount: this.reviews.length,
            customersCount: this.customers.length,
            promoCodesCount: this.promoCodes.length
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
    };

    // Utility: Toggle sidebar
    AdminPanelClass.prototype.toggleSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile, use the 'active' class
            sidebar.classList.toggle('active');
        } else {
            // On desktop, use the 'collapsed' class
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }
    };

    // Utility: Handle window resize
    AdminPanelClass.prototype.handleWindowResize = function() {
        const sidebar = document.getElementById('sidebar');
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile, ensure sidebar starts hidden
            sidebar.classList.remove('collapsed');
            if (!sidebar.classList.contains('active')) {
                sidebar.classList.add('active');
                sidebar.classList.remove('active'); // This ensures it's hidden
            }
        } else {
            // On desktop, remove active class and ensure sidebar is visible
            sidebar.classList.remove('active');
            if (sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('collapsed');
            }
        }
    };

    // Utility: Toggle user menu
    AdminPanelClass.prototype.toggleUserMenu = function() {
        const dropdown = document.getElementById('userMenuDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    };

    // Utility: Toggle notifications
    AdminPanelClass.prototype.toggleNotifications = function() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    };

    // Utility: Close dropdowns
    AdminPanelClass.prototype.closeDropdowns = function() {
        const userMenu = document.getElementById('userMenuDropdown');
        const notifications = document.getElementById('notificationDropdown');
        
        if (userMenu) userMenu.classList.remove('active');
        if (notifications) notifications.classList.remove('active');
    };

    // Utility: Previous page
    AdminPanelClass.prototype.previousPage = function(section) {
        if (this.currentPage[section] > 1) {
            this.currentPage[section]--;
            this.loadSectionData(section);
        }
    };

    // Utility: Next page
    AdminPanelClass.prototype.nextPage = function(section) {
        const totalItems = this[section].length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        
        if (this.currentPage[section] < totalPages) {
            this.currentPage[section]++;
            this.loadSectionData(section);
        }
    };

    // Utility: Update pagination info
    AdminPanelClass.prototype.updatePagination = function(section) {
        const pageInfo = document.getElementById(`${section}PageInfo`);
        if (pageInfo) {
            const totalItems = this[section].length;
            const totalPages = Math.ceil(totalItems / this.itemsPerPage);
            pageInfo.textContent = `Page ${this.currentPage[section]} of ${totalPages}`;
        }
    };

    // Utility: Generate ID
    AdminPanelClass.prototype.generateId = function() {
        return 'dest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    // Performance: Cache frequently accessed DOM elements
    AdminPanelClass.prototype.cacheDOMReferences = function() {
        try {
            this.dom = {
                sidebar: document.getElementById('sidebar'),
                mainContent: document.querySelector('.main-content'),
                toursTableBody: document.getElementById('toursTableBody'),
                bookingsTableBody: document.getElementById('bookingsTableBody'),
                customersTableBody: document.getElementById('customersTableBody'),
                contentTableBody: document.getElementById('contentTableBody'),
                reviewsList: document.getElementById('reviewsList'),
                promoCodesGrid: document.getElementById('promoCodesGrid'),
                destinationsGrid: document.getElementById('destinationsGrid'),
                globalSearch: document.getElementById('globalSearch'),
                tourSearch: document.getElementById('tourSearch'),
                bookingSearch: document.getElementById('bookingSearch'),
                reviewSearch: document.getElementById('reviewSearch')
            };
        } catch (error) {
            // DOM elements may not exist yet, that's okay
            if (window.ENV?.DEBUG === true) {
                console.warn('Some DOM elements not available for caching:', error);
            }
        }
    };
}

