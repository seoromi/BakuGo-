// Admin Panel Form Methods
// Form handling, population, dynamic lists, image upload, gallery management

/**
 * Mixin function to add form methods to AdminPanel
 * 
 * NOTE: This is a large module containing all form-related methods.
 * Methods are extracted from admin.js lines 2106-2955, 959-1195
 */
export function mixinFormMethods(AdminPanelClass) {
    
    // Modal methods
    AdminPanelClass.prototype.openTourModal = function(tourId = null) {
        const modal = document.getElementById('tourModal');
        const title = document.getElementById('tourModalTitle');
        
        if (tourId) {
            const tour = this.tours.find(t => t.id === tourId);
            if (tour) {
                title.textContent = 'Edit Tour';
                this.populateTourForm(tour);
            }
        } else {
            title.textContent = 'Add New Tour';
            document.getElementById('tourForm').reset();
        }
        
        this.showModal('tourModal');
    };

    AdminPanelClass.prototype.openBookingModal = function(bookingId = null) {
        const modal = document.getElementById('bookingModal');
        
        if (bookingId) {
            const booking = this.bookings.find(b => b.id === bookingId);
            if (booking) {
                this.populateBookingForm(booking);
            }
        } else {
            document.getElementById('bookingForm').reset();
        }
        
        this.showModal('bookingModal');
    };

    AdminPanelClass.prototype.openPromoCodeModal = function(promoId = null) {
        const modal = document.getElementById('promoCodeModal');
        
        if (promoId) {
            const promo = this.promoCodes.find(p => p.id === promoId);
            if (promo) {
                this.populatePromoCodeForm(promo);
            }
        } else {
            document.getElementById('promoCodeForm').reset();
        }
        
        this.showModal('promoCodeModal');
    };

    AdminPanelClass.prototype.openDestinationModal = function(destinationId = null) {
        if (window.ENV?.DEBUG === true) {
            console.log('AdminPanel.openDestinationModal called with:', destinationId);
        }
        const modal = document.getElementById('destinationModal');
        const title = document.getElementById('destinationModalTitle');
        
        if (!modal) {
            if (window.ENV?.DEBUG === true) {
                console.error('Destination modal not found!');
            }
            return;
        }
        
        if (window.ENV?.DEBUG === true) {
            console.log('Modal found:', modal);
        }
        
        if (destinationId) {
            title.textContent = 'Edit Destination';
            this.populateDestinationForm(destinationId);
        } else {
            title.textContent = 'Add New Destination';
            this.clearDestinationForm();
        }
        
        if (window.ENV?.DEBUG === true) {
            console.log('Calling showModal');
        }
        this.showModal('destinationModal');
    };

    // Form population methods
    AdminPanelClass.prototype.populateTourForm = function(tour) {
        document.getElementById('tourTitle').value = tour.title;
        document.getElementById('tourType').value = tour.type;
        document.getElementById('tourPrice').value = tour.price;
        document.getElementById('tourActivity').value = tour.activity || 'easy';
        document.getElementById('tourGuide').value = tour.guide || 'professional';
        document.getElementById('tourAccommodation').value = tour.accommodation || '';
        document.getElementById('tourDuration').value = tour.duration;
        document.getElementById('tourStatus').value = tour.status;
        document.getElementById('tourDescription').value = tour.description;
        document.getElementById('tourHighlights').value = tour.highlights?.join(', ') || '';
        document.getElementById('tourImage').value = '';
        if (tour.image) {
            this.displayImagePreview(tour.image);
        }
        document.getElementById('tourGallery').value = '';
        if (tour.gallery && tour.gallery.length > 0) {
            this.displayGalleryPreview(tour.gallery);
        }
        document.getElementById('tourTransport').value = tour.transport || '';
        document.getElementById('tourCancellation').value = tour.cancellationPolicy || '';
        document.getElementById('tourPhone').value = tour.phone || '';
        document.getElementById('tourEmail').value = tour.email || '';
        document.getElementById('tourWorkingHours').value = tour.workingHours || '';
        document.getElementById('tourMeetingPoint').value = tour.meetingPoint || '';
        document.getElementById('tourMeetingTime').value = tour.meetingTime || '';
        document.getElementById('tourPickupContact').value = tour.pickupContact || '';
        
        // Populate languages
        this.populateLanguages(tour.languages || []);
        
        // Populate included items
        this.populateIncludedItems(tour.included || []);
        
        // Populate not included items
        this.populateNotIncludedItems(tour.notIncluded || []);
        
        // Populate start times
        this.populateStartTimes(tour.startTimes || []);
        
        // Populate itinerary (transport details)
        this.populateItinerary(tour.itinerary || []);
        
        // Populate pickup locations
        this.populatePickupLocations(tour.pickupLocations || []);
        
        // Populate destinations
        this.populateDestinations(tour.destinations || []);
        
        // Show/hide accommodation section based on tour type and duration
        this.toggleAccommodationSection();
    };

    AdminPanelClass.prototype.populateBookingForm = function(booking) {
        document.getElementById('bookingCustomerName').value = booking.customerName;
        document.getElementById('bookingCustomerEmail').value = booking.customerEmail;
        document.getElementById('bookingCustomerPhone').value = booking.customerPhone;
        document.getElementById('bookingTour').value = booking.tourId;
        document.getElementById('bookingDate').value = booking.date;
        document.getElementById('bookingTime').value = booking.time;
        document.getElementById('bookingAdults').value = booking.adults;
        document.getElementById('bookingChildren').value = booking.children;
        document.getElementById('bookingStatus').value = booking.status;
        document.getElementById('bookingNotes').value = booking.notes || '';
    };

    AdminPanelClass.prototype.populatePromoCodeForm = function(promo) {
        document.getElementById('promoCode').value = promo.code;
        document.getElementById('promoDiscountType').value = promo.discountType;
        document.getElementById('promoDiscountValue').value = promo.discountValue;
        document.getElementById('promoUsageLimit').value = promo.usageLimit || '';
        document.getElementById('promoStartDate').value = promo.startDate || '';
        document.getElementById('promoEndDate').value = promo.endDate || '';
        document.getElementById('promoDescription').value = promo.description || '';
    };

    AdminPanelClass.prototype.populateDestinationForm = function(destinationId) {
        const destination = this.destinations.find(d => d.id === destinationId);
        if (!destination) return;

        document.getElementById('destinationId').value = destination.id;
        document.getElementById('destinationName').value = destination.name || '';
        document.getElementById('destinationRegion').value = destination.region || '';
        document.getElementById('destinationType').value = destination.type || '';
        document.getElementById('destinationDescription').value = destination.description || '';
        document.getElementById('destinationDistance').value = destination.distanceFromBaku || '';
        document.getElementById('destinationDuration').value = destination.visitDuration || '';
        document.getElementById('destinationBestTime').value = destination.bestTimeToVisit || '';
        document.getElementById('destinationImage').value = destination.image || '';
        
        // Populate highlights
        this.populateDestinationHighlights(destination.highlights || []);
        this.populateDestinationActivities(destination.activities || []);
    };

    AdminPanelClass.prototype.clearDestinationForm = function() {
        try {
            const form = document.getElementById('destinationForm');
            if (form) form.reset();
            
            const highlightsContainer = document.getElementById('destinationHighlights');
            if (highlightsContainer) {
                highlightsContainer.innerHTML = '';
                this.addDestinationHighlight();
            }
            
            const activitiesContainer = document.getElementById('destinationActivities');
            if (activitiesContainer) {
                activitiesContainer.innerHTML = '';
                this.addDestinationActivity();
            }
        } catch (error) {
            if (window.ENV?.DEBUG === true) {
                console.error('Error clearing destination form:', error);
            }
            this.showMessage('Error clearing form', 'error');
        }
    };

    AdminPanelClass.prototype.populateCustomerForm = function(customer) {
        document.getElementById('customerId').value = customer.id;
        document.getElementById('customerFirstName').value = customer.firstName || customer.name.split(' ')[0];
        document.getElementById('customerLastName').value = customer.lastName || customer.name.split(' ')[1] || '';
        document.getElementById('customerEmail').value = customer.email;
        document.getElementById('customerPhone').value = customer.phone;
        document.getElementById('customerCountry').value = customer.country || '';
        document.getElementById('customerStatus').value = customer.status || 'active';
        document.getElementById('customerNotes').value = customer.notes || '';
    };

    // Dynamic list population methods
    AdminPanelClass.prototype.populateIncludedItems = function(items) {
        const container = document.getElementById('includedItems');
        if (!container) return;
        container.innerHTML = '';
        
        items.forEach(item => {
            this.addIncludedItem(item);
        });
        
        if (items.length === 0) {
            this.addIncludedItem();
        }
    };

    AdminPanelClass.prototype.populateNotIncludedItems = function(items) {
        const container = document.getElementById('notIncludedItems');
        if (!container) return;
        container.innerHTML = '';
        
        items.forEach(item => {
            this.addNotIncludedItem(item);
        });
        
        if (items.length === 0) {
            this.addNotIncludedItem();
        }
    };

    AdminPanelClass.prototype.populateStartTimes = function(times) {
        const container = document.getElementById('startTimes');
        if (!container) return;
        container.innerHTML = '';
        
        times.forEach(time => {
            this.addStartTime(time);
        });
        
        if (times.length === 0) {
            this.addStartTime();
        }
    };

    AdminPanelClass.prototype.populateLanguages = function(languages) {
        const checkboxes = document.querySelectorAll('.language-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = languages.includes(checkbox.value);
        });
    };

    AdminPanelClass.prototype.populateDestinations = function(destinations) {
        const checkboxes = document.querySelectorAll('.destination-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = destinations.includes(checkbox.value);
        });
    };

    AdminPanelClass.prototype.populateItinerary = function(itinerary) {
        const container = document.getElementById('itinerarySteps');
        if (!container) return;
        container.innerHTML = '';
        
        itinerary.forEach((step, index) => {
            this.addItineraryStep(step.title, step.description, step.details);
        });
        
        if (itinerary.length === 0) {
            this.addItineraryStep();
        }
    };

    AdminPanelClass.prototype.populatePickupLocations = function(locations) {
        const container = document.getElementById('pickupLocations');
        if (!container) return;
        container.innerHTML = '';
        
        locations.forEach(location => {
            this.addPickupLocation(location);
        });
        
        if (locations.length === 0) {
            this.addPickupLocation();
        }
    };

    AdminPanelClass.prototype.populateDestinationHighlights = function(highlights) {
        const container = document.getElementById('destinationHighlights');
        if (!container) return;
        container.innerHTML = '';
        
        highlights.forEach(highlight => {
            this.addDestinationHighlight(highlight);
        });
        
        if (highlights.length === 0) {
            this.addDestinationHighlight();
        }
    };

    AdminPanelClass.prototype.populateDestinationActivities = function(activities) {
        const container = document.getElementById('destinationActivities');
        if (!container) return;
        container.innerHTML = '';
        
        activities.forEach(activity => {
            this.addDestinationActivity(activity);
        });
        
        if (activities.length === 0) {
            this.addDestinationActivity();
        }
    };

    // Image and gallery management
    AdminPanelClass.prototype.displayImagePreview = function(imageUrl) {
        const preview = document.getElementById('imagePreview');
        if (!preview) return;
        
        preview.innerHTML = '';
        const img = document.createElement('img');
        const urlValidation = this.validateImageUrl(imageUrl || '');
        img.src = urlValidation.valid ? urlValidation.url : 'img/gobustan.jpg';
        img.alt = 'Tour image';
        preview.appendChild(img);
        preview.classList.add('has-image');
    };

    AdminPanelClass.prototype.setupImageUpload = function() {
        const imageInput = document.getElementById('tourImage');
        const preview = document.getElementById('imagePreview');
        
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Enhanced file validation
                const validation = this.validateImageFile(file);
                if (!validation.valid) {
                    this.showMessage(validation.error, 'error');
                    return;
                }
                
                // Performance: Use URL.createObjectURL instead of FileReader for large files
                // This avoids loading entire file into memory as base64
                // Clean up previous object URL if exists
                if (this.currentImagePreviewUrl) {
                    URL.revokeObjectURL(this.currentImagePreviewUrl);
                }
                
                // Show file size warning for large files (>2MB)
                if (file.size > 2 * 1024 * 1024) {
                    this.showMessage(`Large file detected (${(file.size / 1024 / 1024).toFixed(1)}MB). Preview may take a moment.`, 'info');
                }
                
                // Use object URL for better memory management
                this.currentImagePreviewUrl = URL.createObjectURL(file);
                
                preview.innerHTML = '';
                const img = document.createElement('img');
                img.src = this.currentImagePreviewUrl;
                img.alt = 'Tour image';
                img.onload = () => {
                    preview.classList.add('has-image');
                };
                img.onerror = () => {
                    this.showMessage('Error loading image preview.', 'error');
                    if (this.currentImagePreviewUrl) {
                        URL.revokeObjectURL(this.currentImagePreviewUrl);
                        this.currentImagePreviewUrl = null;
                    }
                };
                preview.appendChild(img);
            }
        });
        
        preview.addEventListener('click', () => {
            imageInput.click();
        });
        
        // Gallery upload setup
        this.setupGalleryUpload();
    };

    AdminPanelClass.prototype.setupGalleryUpload = function() {
        const galleryInput = document.getElementById('tourGallery');
        const preview = document.getElementById('galleryPreview');
        
        galleryInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                this.addGalleryImages(files);
            }
        });
        
        preview.addEventListener('click', (e) => {
            if (e.target === preview || e.target.closest('.gallery-placeholder')) {
                galleryInput.click();
            }
        });
    };

    AdminPanelClass.prototype.addGalleryImages = function(files) {
        const preview = document.getElementById('galleryPreview');
        if (!preview) return;
        
        // Initialize array if needed
        if (!this.galleryImageUrls) {
            this.galleryImageUrls = [];
        }
        
        files.forEach(file => {
            // Validate file before processing
            const validation = this.validateImageFile(file);
            if (!validation.valid) {
                this.showMessage(validation.error, 'error');
                return;
            }
            
            // Use URL.createObjectURL instead of FileReader for better memory management
            const objectUrl = URL.createObjectURL(file);
            this.galleryImageUrls.push(objectUrl);
            
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.objectUrl = objectUrl; // Store for cleanup
            
            const img = document.createElement('img');
            img.src = objectUrl;
            img.alt = 'Gallery image';
            img.onerror = () => {
                this.showMessage('Error loading gallery image.', 'error');
                // Cleanup on error
                URL.revokeObjectURL(objectUrl);
                const index = this.galleryImageUrls.indexOf(objectUrl);
                if (index > -1) {
                    this.galleryImageUrls.splice(index, 1);
                }
                galleryItem.remove();
            };
            galleryItem.appendChild(img);
            
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-gallery-image';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => this.removeGalleryImage(removeBtn));
            galleryItem.appendChild(removeBtn);
            
            preview.appendChild(galleryItem);
            
            // Update preview state
            preview.classList.add('has-images');
            const placeholder = preview.querySelector('.gallery-placeholder');
            if (placeholder) placeholder.style.display = 'none';
            this.updateGalleryActions();
        });
    };

    AdminPanelClass.prototype.removeGalleryImage = function(button) {
        const galleryItem = button.closest('.gallery-item');
        if (!galleryItem) return;
        
        // Cleanup object URL to prevent memory leaks
        const objectUrl = galleryItem.dataset.objectUrl;
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
            const index = this.galleryImageUrls.indexOf(objectUrl);
            if (index > -1) {
                this.galleryImageUrls.splice(index, 1);
            }
        }
        
        galleryItem.remove();
        
        const preview = document.getElementById('galleryPreview');
        if (!preview) return;
        
        const remainingItems = preview.querySelectorAll('.gallery-item');
        
        if (remainingItems.length === 0) {
            preview.classList.remove('has-images');
            const placeholder = preview.querySelector('.gallery-placeholder');
            if (placeholder) placeholder.style.display = 'flex';
        }
        
        this.updateGalleryActions();
    };

    AdminPanelClass.prototype.displayGalleryPreview = function(galleryUrls) {
        const preview = document.getElementById('galleryPreview');
        if (!preview) return;
        
        preview.innerHTML = '';
        
        galleryUrls.forEach(url => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            const urlValidation = this.validateImageUrl(url || '');
            img.src = urlValidation.valid ? urlValidation.url : '';
            img.alt = 'Gallery image';
            galleryItem.appendChild(img);
            
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-gallery-image';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => this.removeGalleryImage(removeBtn));
            galleryItem.appendChild(removeBtn);
            
            preview.appendChild(galleryItem);
        });
        
        preview.classList.add('has-images');
        this.updateGalleryActions();
    };

    AdminPanelClass.prototype.updateGalleryActions = function() {
        const preview = document.getElementById('galleryPreview');
        const clearBtn = document.getElementById('clearGalleryBtn');
        const hasImages = preview.classList.contains('has-images');
        
        clearBtn.style.display = hasImages ? 'block' : 'none';
    };

    AdminPanelClass.prototype.getGalleryImages = function() {
        const preview = document.getElementById('galleryPreview');
        const images = preview.querySelectorAll('.gallery-item img');
        return Array.from(images).map(img => img.src);
    };

    AdminPanelClass.prototype.toggleAccommodationSection = function() {
        const tourType = document.getElementById('tourType').value;
        const duration = document.getElementById('tourDuration').value;
        const accommodationSection = document.getElementById('accommodationSection');
        
        // Show accommodation section for package tours or multi-day tours
        const shouldShow = tourType === 'package' || 
                          (duration && (duration.includes('day') || duration.includes('night') || parseInt(duration) > 1));
        
        if (shouldShow) {
            accommodationSection.style.display = 'block';
            accommodationSection.classList.add('visible');
            accommodationSection.classList.remove('hidden');
        } else {
            accommodationSection.style.display = 'none';
            accommodationSection.classList.add('hidden');
            accommodationSection.classList.remove('visible');
        }
    };

    // Dynamic list management functions
    AdminPanelClass.prototype.addIncludedItem = function(value = '') {
        const container = document.getElementById('includedItems');
        if (!container) return;
        
        const item = document.createElement('div');
        item.className = 'included-item';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'e.g., Professional guide';
        input.className = 'included-input';
        input.value = value || ''; // input.value is safe - browser handles escaping
        item.appendChild(input);
        
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'remove-included';
        button.textContent = '×';
        button.addEventListener('click', () => this.removeIncludedItem(button));
        item.appendChild(button);
        
        container.appendChild(item);
    };

    AdminPanelClass.prototype.removeIncludedItem = function(button) {
        const container = document.getElementById('includedItems');
        if (container.children.length > 1) {
            button.parentElement.remove();
        }
    };

    AdminPanelClass.prototype.addNotIncludedItem = function(value = '') {
        const container = document.getElementById('notIncludedItems');
        if (!container) return;
        
        const item = document.createElement('div');
        item.className = 'not-included-item';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'e.g., Lunch (15-20$)';
        input.className = 'not-included-input';
        input.value = value || ''; // input.value is safe - browser handles escaping
        item.appendChild(input);
        
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'remove-not-included';
        button.textContent = '×';
        button.addEventListener('click', () => this.removeNotIncludedItem(button));
        item.appendChild(button);
        
        container.appendChild(item);
    };

    AdminPanelClass.prototype.removeNotIncludedItem = function(button) {
        const container = document.getElementById('notIncludedItems');
        if (container.children.length > 1) {
            button.parentElement.remove();
        }
    };

    AdminPanelClass.prototype.addStartTime = function(value = '') {
        const container = document.getElementById('startTimes');
        if (!container) return;
        
        const item = document.createElement('div');
        item.className = 'start-time-item';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'e.g., 09:00 (morning group)';
        input.className = 'start-time-input';
        input.value = value || ''; // input.value is safe - browser handles escaping
        item.appendChild(input);
        
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'remove-start-time';
        button.textContent = '×';
        button.addEventListener('click', () => this.removeStartTime(button));
        item.appendChild(button);
        
        container.appendChild(item);
    };

    AdminPanelClass.prototype.removeStartTime = function(button) {
        const container = document.getElementById('startTimes');
        if (container.children.length > 1) {
            button.parentElement.remove();
        }
    };

    AdminPanelClass.prototype.addItineraryStep = function(title = '', description = '', details = '') {
        const container = document.getElementById('itinerarySteps');
        if (!container) return;
        
        const stepNumber = container.children.length + 1;
        
        const step = document.createElement('div');
        step.className = 'itinerary-step';
        
        const numberDiv = document.createElement('div');
        numberDiv.className = 'step-number';
        numberDiv.textContent = stepNumber;
        step.appendChild(numberDiv);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'step-content';
        
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.placeholder = 'Step title (e.g., Departure from Baku)';
        titleInput.className = 'step-title';
        titleInput.value = title || ''; // input.value is safe - browser handles escaping
        contentDiv.appendChild(titleInput);
        
        const descTextarea = document.createElement('textarea');
        descTextarea.placeholder = 'Step description';
        descTextarea.className = 'step-description';
        descTextarea.rows = 2;
        descTextarea.textContent = description;
        contentDiv.appendChild(descTextarea);
        
        const detailsInput = document.createElement('input');
        detailsInput.type = 'text';
        detailsInput.placeholder = 'Duration & details (e.g., 30 minutes • Transfer included)';
        detailsInput.className = 'step-details';
        detailsInput.value = details || ''; // input.value is safe - browser handles escaping
        contentDiv.appendChild(detailsInput);
        
        step.appendChild(contentDiv);
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-step';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => this.removeItineraryStep(removeBtn));
        step.appendChild(removeBtn);
        
        container.appendChild(step);
        this.updateItineraryStepNumbers();
    };

    AdminPanelClass.prototype.removeItineraryStep = function(button) {
        const container = document.getElementById('itinerarySteps');
        if (container.children.length > 1) {
            button.parentElement.remove();
            this.updateItineraryStepNumbers();
        }
    };

    AdminPanelClass.prototype.updateItineraryStepNumbers = function() {
        const steps = document.querySelectorAll('.itinerary-step');
        steps.forEach((step, index) => {
            const numberElement = step.querySelector('.step-number');
            numberElement.textContent = index + 1;
        });
    };

    AdminPanelClass.prototype.addPickupLocation = function(value = '') {
        const container = document.getElementById('pickupLocations');
        if (!container) return;
        
        const item = document.createElement('div');
        item.className = 'pickup-location-item';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'e.g., Hotel pickup (city center)';
        input.className = 'pickup-location-input';
        input.value = value || ''; // input.value is safe - browser handles escaping
        item.appendChild(input);
        
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'remove-pickup-location';
        button.textContent = '×';
        button.addEventListener('click', () => this.removePickupLocation(button));
        item.appendChild(button);
        
        container.appendChild(item);
    };

    AdminPanelClass.prototype.removePickupLocation = function(button) {
        const container = document.getElementById('pickupLocations');
        if (container.children.length > 1) {
            button.parentElement.remove();
        }
    };

    AdminPanelClass.prototype.addDestinationHighlight = function(value = '') {
        const container = document.getElementById('destinationHighlights');
        if (!container) return;
        
        const item = document.createElement('div');
        item.className = 'highlight-item';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'e.g., Rock Art';
        input.className = 'highlight-input';
        input.value = value || ''; // input.value is safe - browser handles escaping
        item.appendChild(input);
        
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'remove-highlight';
        button.setAttribute('data-action', 'remove-destination-highlight');
        button.textContent = '×';
        button.addEventListener('click', () => {
            if (container.children.length > 1) {
                item.remove();
            }
        });
        item.appendChild(button);
        
        container.appendChild(item);
    };

    AdminPanelClass.prototype.addDestinationActivity = function(value = '') {
        const container = document.getElementById('destinationActivities');
        if (!container) return;
        
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'e.g., Museum Visit';
        input.className = 'activity-input';
        input.value = value || ''; // input.value is safe - browser handles escaping
        item.appendChild(input);
        
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'remove-activity';
        button.setAttribute('data-action', 'remove-destination-activity');
        button.textContent = '×';
        button.addEventListener('click', () => {
            if (container.children.length > 1) {
                item.remove();
            }
        });
        item.appendChild(button);
        
        container.appendChild(item);
    };

    // Get values from dynamic lists
    AdminPanelClass.prototype.getIncludedItems = function() {
        const inputs = document.querySelectorAll('.included-input');
        return Array.from(inputs).map(input => input.value.trim()).filter(value => value);
    };

    AdminPanelClass.prototype.getNotIncludedItems = function() {
        const inputs = document.querySelectorAll('.not-included-input');
        return Array.from(inputs).map(input => input.value.trim()).filter(value => value);
    };

    AdminPanelClass.prototype.getStartTimes = function() {
        const inputs = document.querySelectorAll('.start-time-input');
        return Array.from(inputs).map(input => input.value.trim()).filter(value => value);
    };

    AdminPanelClass.prototype.getSelectedLanguages = function() {
        const checkboxes = document.querySelectorAll('.language-checkbox:checked');
        return Array.from(checkboxes).map(checkbox => checkbox.value);
    };

    AdminPanelClass.prototype.getItinerarySteps = function() {
        const steps = document.querySelectorAll('.itinerary-step');
        return Array.from(steps).map(step => {
            const title = step.querySelector('.step-title').value.trim();
            const description = step.querySelector('.step-description').value.trim();
            const details = step.querySelector('.step-details').value.trim();
            
            if (title || description || details) {
                return { title, description, details };
            }
            return null;
        }).filter(step => step !== null);
    };

    AdminPanelClass.prototype.getPickupLocations = function() {
        const inputs = document.querySelectorAll('.pickup-location-input');
        return Array.from(inputs).map(input => input.value.trim()).filter(value => value);
    };

    AdminPanelClass.prototype.getDestinationHighlights = function() {
        const inputs = document.querySelectorAll('.highlight-input');
        return Array.from(inputs).map(input => input.value.trim()).filter(value => value);
    };

    AdminPanelClass.prototype.getDestinationActivities = function() {
        const inputs = document.querySelectorAll('.activity-input');
        return Array.from(inputs).map(input => input.value.trim()).filter(value => value);
    };
}

