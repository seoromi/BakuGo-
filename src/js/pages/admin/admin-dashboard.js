// Admin Panel Dashboard Methods
// Dashboard loading, stats calculation, and widget updates

/**
 * Mixin function to add dashboard methods to AdminPanel
 */
export function mixinDashboardMethods(AdminPanelClass) {
    
    AdminPanelClass.prototype.loadDashboard = function() {
        this.updateStatsCards();
        this.updateRecentBookings();
        this.updatePopularTours();
        this.updateRecentReviews();
    };

    AdminPanelClass.prototype.updateStatsCards = function() {
        const stats = this.calculateStats();
        
        // Update stat numbers (these would be animated in a real app)
        document.querySelectorAll('.stat-number').forEach((el, index) => {
            const values = [stats.totalBookings, `$${stats.revenue.toLocaleString()}`, stats.activeCustomers, stats.averageRating];
            if (values[index]) {
                el.textContent = values[index];
            }
        });
    };

    AdminPanelClass.prototype.calculateStats = function() {
        const totalBookings = this.bookings.length;
        const revenue = this.bookings.reduce((sum, booking) => sum + (booking.total || 0), 0);
        const activeCustomers = this.customers.length;
        const reviewsCount = this.reviews.length;
        const averageRating = reviewsCount > 0 
            ? (this.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewsCount).toFixed(1)
            : '0.0';
        
        return {
            totalBookings,
            revenue,
            activeCustomers,
            averageRating
        };
    };

    AdminPanelClass.prototype.updateRecentBookings = function() {
        const recentBookings = this.bookings.slice(0, 3);
        const container = document.querySelector('.recent-bookings');
        
        if (container) {
            container.innerHTML = '';
            recentBookings.forEach(booking => {
                const item = document.createElement('div');
                item.className = 'booking-item';
                
                const info = document.createElement('div');
                info.className = 'booking-info';
                
                const tourDiv = document.createElement('div');
                tourDiv.className = 'booking-tour';
                tourDiv.textContent = booking.tourName || '';
                info.appendChild(tourDiv);
                
                const customerDiv = document.createElement('div');
                customerDiv.className = 'booking-customer';
                customerDiv.textContent = booking.customerName || '';
                info.appendChild(customerDiv);
                
                const meta = document.createElement('div');
                meta.className = 'booking-meta';
                
                const dateDiv = document.createElement('div');
                dateDiv.className = 'booking-date';
                dateDiv.textContent = this.formatDate(booking.date);
                meta.appendChild(dateDiv);
                
                const statusDiv = document.createElement('div');
                const safeStatus = this.validateStatus(booking.status || '');
                statusDiv.className = `booking-status ${safeStatus}`;
                statusDiv.textContent = booking.status || '';
                meta.appendChild(statusDiv);
                
                item.appendChild(info);
                item.appendChild(meta);
                container.appendChild(item);
            });
        }
    };

    AdminPanelClass.prototype.updatePopularTours = function() {
        const tourStats = this.calculateTourStats();
        const container = document.querySelector('.popular-tours');
        
        if (container) {
            container.innerHTML = '';
            tourStats.slice(0, 4).forEach(tour => {
                const item = document.createElement('div');
                item.className = 'tour-item';
                
                const nameDiv = document.createElement('div');
                nameDiv.className = 'tour-name';
                nameDiv.textContent = tour.name || '';
                item.appendChild(nameDiv);
                
                const bookingsDiv = document.createElement('div');
                bookingsDiv.className = 'tour-bookings';
                bookingsDiv.textContent = `${tour.bookings || 0} bookings`;
                item.appendChild(bookingsDiv);
                
                container.appendChild(item);
            });
        }
    };

    AdminPanelClass.prototype.calculateTourStats = function() {
        const stats = {};
        
        this.bookings.forEach(booking => {
            if (!stats[booking.tourName]) {
                stats[booking.tourName] = { name: booking.tourName, bookings: 0 };
            }
            stats[booking.tourName].bookings++;
        });
        
        return Object.values(stats).sort((a, b) => b.bookings - a.bookings);
    };

    AdminPanelClass.prototype.updateRecentReviews = function() {
        const recentReviews = this.reviews.slice(0, 2);
        const container = document.querySelector('.recent-reviews');
        
        if (container) {
            container.innerHTML = '';
            recentReviews.forEach(review => {
                const item = document.createElement('div');
                item.className = 'review-item';
                
                const header = document.createElement('div');
                header.className = 'review-header';
                
                const nameDiv = document.createElement('div');
                nameDiv.className = 'reviewer-name';
                nameDiv.textContent = review.customerName || '';
                header.appendChild(nameDiv);
                
                const starsDiv = document.createElement('div');
                starsDiv.className = 'review-stars';
                starsDiv.textContent = '⭐'.repeat(review.rating || 0);
                header.appendChild(starsDiv);
                
                const textDiv = document.createElement('div');
                textDiv.className = 'review-text';
                textDiv.textContent = `"${review.comment || ''}"`;
                item.appendChild(header);
                item.appendChild(textDiv);
                
                const tourDiv = document.createElement('div');
                tourDiv.className = 'review-tour';
                tourDiv.textContent = review.tourName || '';
                item.appendChild(tourDiv);
                
                container.appendChild(item);
            });
        }
    };
}

