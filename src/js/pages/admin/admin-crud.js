// Admin Panel CRUD Operations
// Create, Read, Update, Delete operations for all entities

/**
 * Mixin function to add CRUD methods to AdminPanel
 * 
 * NOTE: This module contains all CRUD operations extracted from admin.js
 * Methods are from lines 2608-3322, 3060-3289, 1110-1195
 */
export function mixinCrudMethods(AdminPanelClass) {
    
    // Loading state management
    AdminPanelClass.prototype.setLoadingState = function(context, isLoading) {
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
    };

    // Tour CRUD
    AdminPanelClass.prototype.saveTour = function() {
        // Rate limiting
        if (!this.saveRateLimiter.attempt()) {
            this.showMessage('Please wait before submitting again', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState('tourModal', true);
        
        try {
            // Validation
            const title = document.getElementById('tourTitle')?.value?.trim();
            if (!this.validateRequired(title)) {
                this.setLoadingState('tourModal', false);
                this.showMessage('Tour title is required', 'error');
                return;
            }

            const price = document.getElementById('tourPrice')?.value;
            if (!this.validatePrice(price)) {
                this.setLoadingState('tourModal', false);
                this.showMessage('Please enter a valid price', 'error');
                return;
            }

            const email = document.getElementById('tourEmail')?.value?.trim();
            if (email && !this.validateEmail(email)) {
                this.setLoadingState('tourModal', false);
                this.showMessage('Please enter a valid email address', 'error');
                return;
            }

            const phone = document.getElementById('tourPhone')?.value?.trim();
            if (phone && !this.validatePhone(phone)) {
                this.setLoadingState('tourModal', false);
                this.showMessage('Please enter a valid phone number', 'error');
                return;
            }
        
            const tourData = {
                title: title,
                type: document.getElementById('tourType')?.value || '',
                price: parseFloat(price),
                activity: document.getElementById('tourActivity')?.value || 'easy',
                guide: document.getElementById('tourGuide')?.value || 'professional',
                accommodation: document.getElementById('tourAccommodation')?.value || '',
                duration: document.getElementById('tourDuration')?.value || '',
                status: document.getElementById('tourStatus')?.value || 'active',
                description: document.getElementById('tourDescription')?.value || '',
                highlights: (document.getElementById('tourHighlights')?.value || '').split(',').map(h => h.trim()).filter(h => h),
                destinations: Array.from(document.querySelectorAll('.destination-checkbox:checked')).map(cb => cb.value),
                image: document.getElementById('tourImage')?.files[0] ? URL.createObjectURL(document.getElementById('tourImage').files[0]) : null,
                gallery: this.getGalleryImages(),
                transport: document.getElementById('tourTransport')?.value || '',
                cancellationPolicy: document.getElementById('tourCancellation')?.value || '',
                phone: phone,
                email: email,
                workingHours: document.getElementById('tourWorkingHours')?.value || '',
                meetingPoint: document.getElementById('tourMeetingPoint')?.value || '',
                meetingTime: document.getElementById('tourMeetingTime')?.value || '',
                pickupContact: document.getElementById('tourPickupContact')?.value || '',
                pickupLocations: this.getPickupLocations(),
                languages: this.getSelectedLanguages(),
                included: this.getIncludedItems(),
                notIncluded: this.getNotIncludedItems(),
                startTimes: this.getStartTimes(),
                itinerary: this.getItinerarySteps()
            };

            // In a real app, this would make an API call
            // Simulate API delay
            setTimeout(() => {
                this.setLoadingState('tourModal', false);
                this.showMessage('Tour saved successfully!', 'success');
                this.closeModal('tourModal');
                this.loadTours();
            }, 500);
        } catch (error) {
            this.setLoadingState('tourModal', false);
            this.handleError('saveTour', error);
            this.showMessage('Failed to save tour. Please try again.', 'error');
        }
    };

    AdminPanelClass.prototype.viewTour = function(id) {
        const tour = this.tours.find(t => t.id === id);
        if (tour) {
            this.showMessage(`Viewing tour: ${tour.title}`, 'info');
        }
    };

    AdminPanelClass.prototype.editTour = function(id) {
        this.openTourModal(id);
    };

    AdminPanelClass.prototype.deleteTour = function(id) {
        this.showConfirmModal(
            'Delete Tour',
            'Are you sure you want to delete this tour? This action cannot be undone.',
            () => {
                this.tours = this.tours.filter(t => t.id !== id);
                this.showMessage('Tour deleted successfully!', 'success');
                this.loadTours();
            }
        );
    };

    // Booking CRUD
    AdminPanelClass.prototype.saveBooking = function() {
        // Rate limiting
        if (!this.saveRateLimiter.attempt()) {
            this.showMessage('Please wait before submitting again', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState('bookingModal', true);
        
        try {
            // Validation
            const customerName = document.getElementById('bookingCustomerName')?.value?.trim();
            const customerEmail = document.getElementById('bookingCustomerEmail')?.value?.trim();
            const customerPhone = document.getElementById('bookingCustomerPhone')?.value?.trim();

            if (!this.validateRequired(customerName)) {
                this.setLoadingState('bookingModal', false);
                this.showMessage('Customer name is required', 'error');
                return;
            }

            if (!this.validateRequired(customerEmail)) {
                this.setLoadingState('bookingModal', false);
                this.showMessage('Customer email is required', 'error');
                return;
            }

            if (!this.validateEmail(customerEmail)) {
                this.setLoadingState('bookingModal', false);
                this.showMessage('Please enter a valid email address', 'error');
                return;
            }

            if (customerPhone && !this.validatePhone(customerPhone)) {
                this.setLoadingState('bookingModal', false);
                this.showMessage('Please enter a valid phone number', 'error');
                return;
            }

            const adults = parseInt(document.getElementById('bookingAdults')?.value || '0');
            const children = parseInt(document.getElementById('bookingChildren')?.value || '0');
            
            if (isNaN(adults) || adults < 0) {
                this.setLoadingState('bookingModal', false);
                this.showMessage('Please enter a valid number of adults', 'error');
                return;
            }

            if (isNaN(children) || children < 0) {
                this.setLoadingState('bookingModal', false);
                this.showMessage('Please enter a valid number of children', 'error');
                return;
            }

            if (adults + children === 0) {
                this.setLoadingState('bookingModal', false);
                this.showMessage('At least one guest is required', 'error');
                return;
            }

            const bookingData = {
                customerName: customerName,
                customerEmail: customerEmail,
                customerPhone: customerPhone || '',
                tourId: document.getElementById('bookingTour')?.value || '',
                date: document.getElementById('bookingDate')?.value || '',
                time: document.getElementById('bookingTime')?.value || '',
                adults: adults,
                children: children,
                status: document.getElementById('bookingStatus')?.value || 'pending',
                notes: document.getElementById('bookingNotes')?.value || ''
            };

            setTimeout(() => {
                this.setLoadingState('bookingModal', false);
                this.showMessage('Booking saved successfully!', 'success');
                this.closeModal('bookingModal');
                this.loadBookings();
            }, 500);
        } catch (error) {
            this.setLoadingState('bookingModal', false);
            this.handleError('saveBooking', error);
            this.showMessage('Failed to save booking. Please try again.', 'error');
        }
    };

    AdminPanelClass.prototype.viewBooking = function(id) {
        const booking = this.bookings.find(b => b.id === id);
        if (booking) {
            this.showMessage(`Viewing booking #${booking.id}`, 'info');
        }
    };

    AdminPanelClass.prototype.editBooking = function(id) {
        this.openBookingModal(id);
    };

    AdminPanelClass.prototype.deleteBooking = function(id) {
        this.showConfirmModal(
            'Delete Booking',
            'Are you sure you want to delete this booking? This action cannot be undone.',
            () => {
                this.bookings = this.bookings.filter(b => b.id !== id);
                this.showMessage('Booking deleted successfully!', 'success');
                this.loadBookings();
            }
        );
    };

    // Review CRUD
    AdminPanelClass.prototype.approveReview = function(id) {
        const review = this.reviews.find(r => r.id === id);
        if (review) {
            review.status = 'approved';
            this.showMessage('Review approved!', 'success');
            this.loadReviews();
        }
    };

    AdminPanelClass.prototype.rejectReview = function(id) {
        const review = this.reviews.find(r => r.id === id);
        if (review) {
            review.status = 'rejected';
            this.showMessage('Review rejected!', 'warning');
            this.loadReviews();
        }
    };

    // Promo Code CRUD
    AdminPanelClass.prototype.savePromoCode = function() {
        const promoData = {
            code: document.getElementById('promoCode').value,
            discountType: document.getElementById('promoDiscountType').value,
            discountValue: parseFloat(document.getElementById('promoDiscountValue').value),
            usageLimit: document.getElementById('promoUsageLimit').value || null,
            startDate: document.getElementById('promoStartDate').value || null,
            endDate: document.getElementById('promoEndDate').value || null,
            description: document.getElementById('promoDescription').value
        };

        this.showMessage('Promo code saved successfully!', 'success');
        this.closeModal('promoCodeModal');
        this.loadPromoCodes();
    };

    AdminPanelClass.prototype.editPromoCode = function(id) {
        this.openPromoCodeModal(id);
    };

    AdminPanelClass.prototype.deletePromoCode = function(id) {
        this.showConfirmModal(
            'Delete Promo Code',
            'Are you sure you want to delete this promo code? This action cannot be undone.',
            () => {
                this.promoCodes = this.promoCodes.filter(p => p.id !== id);
                this.showMessage('Promo code deleted successfully!', 'success');
                this.loadPromoCodes();
            }
        );
    };

    // Destination CRUD
    AdminPanelClass.prototype.saveDestination = function() {
        // Rate limiting
        if (!this.saveRateLimiter.attempt()) {
            this.showMessage('Please wait before submitting again', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState('destinationModal', true);
        
        try {
            // Validation
            const name = document.getElementById('destinationName')?.value?.trim();
            if (!this.validateRequired(name)) {
                this.setLoadingState('destinationModal', false);
                this.showMessage('Destination name is required', 'error');
                return;
            }

            const image = document.getElementById('destinationImage')?.value?.trim();
            if (image) {
                const urlValidation = this.validateImageUrl(image);
                if (!urlValidation.valid) {
                    this.setLoadingState('destinationModal', false);
                    this.showMessage(urlValidation.error, 'error');
                    return;
                }
            }

            const destinationData = {
                id: document.getElementById('destinationId')?.value || this.generateId(),
                name: name,
                region: document.getElementById('destinationRegion')?.value || '',
                type: document.getElementById('destinationType')?.value || '',
                description: document.getElementById('destinationDescription')?.value || '',
                distanceFromBaku: document.getElementById('destinationDistance')?.value || '',
                visitDuration: document.getElementById('destinationDuration')?.value || '',
                bestTimeToVisit: document.getElementById('destinationBestTime')?.value || '',
                image: image,
                highlights: this.getDestinationHighlights(),
                activities: this.getDestinationActivities()
            };

            // In a real app, this would make an API call
            setTimeout(() => {
                this.setLoadingState('destinationModal', false);
                this.showMessage('Destination saved successfully!', 'success');
                this.closeModal('destinationModal');
                this.loadDestinations();
            }, 500);
        } catch (error) {
            this.setLoadingState('destinationModal', false);
            this.handleError('saveDestination', error);
            this.showMessage('Failed to save destination. Please try again.', 'error');
        }
    };

    AdminPanelClass.prototype.editDestination = function(destinationId) {
        this.openDestinationModal(destinationId);
    };

    AdminPanelClass.prototype.deleteDestination = function(destinationId) {
        this.showConfirmModal(
            'Delete Destination',
            'Are you sure you want to delete this destination? This action cannot be undone.',
            () => {
                this.destinations = this.destinations.filter(d => d.id !== destinationId);
                this.loadDestinations();
                this.showMessage('Destination deleted successfully!', 'success');
            }
        );
    };

    // Customer CRUD
    AdminPanelClass.prototype.openCustomerModal = function(customerId = null) {
        const modal = document.getElementById('customerModal');
        const title = document.getElementById('customerModalTitle');
        
        if (customerId) {
            const customer = this.customers.find(c => c.id === customerId);
            if (customer) {
                title.textContent = 'Edit Customer';
                this.populateCustomerForm(customer);
            }
        } else {
            title.textContent = 'Add New Customer';
            document.getElementById('customerForm').reset();
        }
        
        this.showModal('customerModal');
    };

    AdminPanelClass.prototype.saveCustomer = function() {
        // Rate limiting
        if (!this.saveRateLimiter.attempt()) {
            this.showMessage('Please wait before submitting again', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState('customerModal', true);
        
        try {
            // Validation
            const firstName = document.getElementById('customerFirstName')?.value?.trim();
            const lastName = document.getElementById('customerLastName')?.value?.trim();
            const email = document.getElementById('customerEmail')?.value?.trim();
            const phone = document.getElementById('customerPhone')?.value?.trim();

            if (!this.validateRequired(firstName)) {
                this.setLoadingState('customerModal', false);
                this.showMessage('First name is required', 'error');
                return;
            }

            if (!this.validateRequired(email)) {
                this.setLoadingState('customerModal', false);
                this.showMessage('Email is required', 'error');
                return;
            }

            if (!this.validateEmail(email)) {
                this.setLoadingState('customerModal', false);
                this.showMessage('Please enter a valid email address', 'error');
                return;
            }

            if (phone && !this.validatePhone(phone)) {
                this.setLoadingState('customerModal', false);
                this.showMessage('Please enter a valid phone number', 'error');
                return;
            }

            const customerData = {
                firstName: firstName,
                lastName: lastName || '',
                email: email,
                phone: phone || '',
                country: document.getElementById('customerCountry')?.value || '',
                status: document.getElementById('customerStatus')?.value || 'active',
                notes: document.getElementById('customerNotes')?.value || ''
            };

            const customerId = document.getElementById('customerId')?.value;
        
            if (customerId) {
                // Edit existing customer
                const index = this.customers.findIndex(c => c.id == customerId);
                if (index !== -1) {
                    this.customers[index] = {
                        ...this.customers[index],
                        ...customerData,
                        name: `${customerData.firstName} ${customerData.lastName}`,
                        id: parseInt(customerId)
                    };
                    this.showMessage('Customer updated successfully!', 'success');
                }
            } else {
                // Add new customer
                const maxId = this.customers.length > 0 
                    ? Math.max(...this.customers.map(c => c.id || 0))
                    : 0;
                const newCustomer = {
                    id: maxId + 1,
                    ...customerData,
                    name: `${customerData.firstName} ${customerData.lastName}`,
                    registrationDate: new Date().toISOString().split('T')[0],
                    totalBookings: 0,
                    totalSpent: 0,
                    lastBooking: null
                };
                this.customers.push(newCustomer);
                this.showMessage('Customer added successfully!', 'success');
            }

            setTimeout(() => {
                this.setLoadingState('customerModal', false);
                this.closeModal('customerModal');
                this.loadCustomers();
                this.updateNavigationCounts();
            }, 500);
        } catch (error) {
            this.setLoadingState('customerModal', false);
            this.handleError('saveCustomer', error);
            this.showMessage('Failed to save customer. Please try again.', 'error');
        }
    };

    AdminPanelClass.prototype.viewCustomer = function(id) {
        const customer = this.customers.find(c => c.id === id);
        if (customer) {
            this.showMessage(`Viewing customer: ${customer.name}`, 'info');
        }
    };

    AdminPanelClass.prototype.editCustomer = function(id) {
        this.openCustomerModal(id);
    };

    AdminPanelClass.prototype.deleteCustomer = function(id) {
        this.showConfirmModal(
            'Delete Customer',
            'Are you sure you want to delete this customer? This action cannot be undone.',
            () => {
                this.customers = this.customers.filter(c => c.id !== id);
                this.showMessage('Customer deleted successfully!', 'success');
                this.loadCustomers();
                this.updateNavigationCounts();
            }
        );
    };

    AdminPanelClass.prototype.exportCustomers = function() {
        try {
            // Security: Sanitize all CSV fields to prevent injection attacks
            const csvContent = [
                ['Name', 'Email', 'Phone', 'Country', 'Status', 'Total Bookings', 'Registration Date'],
                ...this.customers.map(customer => [
                    this.escapeCSVField(customer.name),
                    this.escapeCSVField(customer.email),
                    this.escapeCSVField(customer.phone),
                    this.escapeCSVField(customer.country || ''),
                    this.escapeCSVField(customer.status || 'active'),
                    this.escapeCSVField(customer.totalBookings || 0),
                    this.escapeCSVField(customer.registrationDate || '')
                ])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        
            this.showMessage('Customers exported successfully!', 'success');
        } catch (error) {
            this.handleError('exportCustomers', error);
            this.showMessage('Failed to export customers. Please try again.', 'error');
        }
    };

    // Content CRUD (placeholders)
    AdminPanelClass.prototype.editContent = function(contentId) {
        this.showMessage('Edit content not implemented yet', 'info');
    };

    AdminPanelClass.prototype.deleteContent = function(contentId) {
        this.showMessage('Delete content not implemented yet', 'info');
    };
}

