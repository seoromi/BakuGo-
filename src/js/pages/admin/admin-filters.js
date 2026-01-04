// Admin Panel Filter Methods
// Filtering logic for tours, bookings, and reviews

/**
 * Mixin function to add filter methods to AdminPanel
 */
export function mixinFilterMethods(AdminPanelClass) {
    
    // Filter methods - Performance: Pass filtered data instead of manipulating main array
    AdminPanelClass.prototype.filterTours = function() {
        try {
            const typeFilter = document.getElementById('tourTypeFilter')?.value;
            const statusFilter = document.getElementById('tourStatusFilter')?.value;
            const searchTerm = document.getElementById('tourSearch')?.value.toLowerCase();

            let filteredTours = [...this.tours]; // Create copy, don't mutate original

            if (typeFilter) {
                filteredTours = filteredTours.filter(tour => tour.type === typeFilter);
            }

            if (statusFilter) {
                filteredTours = filteredTours.filter(tour => tour.status === statusFilter);
            }

            if (searchTerm) {
                filteredTours = filteredTours.filter(tour => 
                    tour.title.toLowerCase().includes(searchTerm) ||
                    tour.description.toLowerCase().includes(searchTerm)
                );
            }

            // Pass filtered data to render function
            this.renderToursTable(filteredTours);
        } catch (error) {
            this.handleError('filterTours', error);
        }
    };

    AdminPanelClass.prototype.filterBookings = function() {
        try {
            const statusFilter = document.getElementById('bookingStatusFilter')?.value;
            const searchTerm = document.getElementById('bookingSearch')?.value.toLowerCase();

            let filteredBookings = [...this.bookings]; // Create copy, don't mutate original

            if (statusFilter) {
                filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
            }

            if (searchTerm) {
                filteredBookings = filteredBookings.filter(booking => 
                    booking.customerName.toLowerCase().includes(searchTerm) ||
                    booking.tourName.toLowerCase().includes(searchTerm) ||
                    booking.customerEmail.toLowerCase().includes(searchTerm)
                );
            }

            // Pass filtered data to render function
            this.renderBookingsTable(filteredBookings);
        } catch (error) {
            this.handleError('filterBookings', error);
        }
    };

    AdminPanelClass.prototype.filterReviews = function() {
        try {
            const statusFilter = document.getElementById('reviewStatusFilter')?.value;
            const ratingFilter = document.getElementById('reviewRatingFilter')?.value;
            const searchTerm = document.getElementById('reviewSearch')?.value.toLowerCase();

            let filteredReviews = [...this.reviews]; // Create copy, don't mutate original

            if (statusFilter) {
                filteredReviews = filteredReviews.filter(review => review.status === statusFilter);
            }

            if (ratingFilter) {
                filteredReviews = filteredReviews.filter(review => review.rating == ratingFilter);
            }

            if (searchTerm) {
                filteredReviews = filteredReviews.filter(review => 
                    review.customerName.toLowerCase().includes(searchTerm) ||
                    review.comment.toLowerCase().includes(searchTerm) ||
                    review.tourName.toLowerCase().includes(searchTerm)
                );
            }

            // Pass filtered data to render function
            this.renderReviewsList(filteredReviews);
        } catch (error) {
            this.handleError('filterReviews', error);
        }
    };
}

