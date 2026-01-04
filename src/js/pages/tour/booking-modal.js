// Enhanced Booking Modal JavaScript

import { BookingsService } from '../../services/bookings.service.js';

class BookingModal {
    constructor() {
        this.modal = document.getElementById('bookingModal');
        this.form = document.getElementById('bookingForm');
        this.currentTour = null;
        this.pricing = {
            adult: 49,
            child: 25
        };
        this.promoDiscount = 0;
        this.appliedPromo = null;
        this.bookingsService = new BookingsService();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setMinDate();
        this.updateSummary();
    }

    setupEventListeners() {
        // Modal controls
        document.getElementById('modalClose').addEventListener('click', () => this.close());
        document.getElementById('cancelBooking').addEventListener('click', () => this.close());
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Direct submit button click (backup)
        document.getElementById('submitBooking').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSubmit(e);
        });
        
        // Ticket controls
        document.querySelectorAll('.ticket-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTicketChange(e));
        });
        
        // Promo code
        document.getElementById('applyPromo').addEventListener('click', () => this.applyPromoCode());
        document.getElementById('promoCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.applyPromoCode();
            }
        });
        
        // Real-time validation
        document.getElementById('customerName').addEventListener('blur', () => this.validateName());
        document.getElementById('customerEmail').addEventListener('blur', () => this.validateEmail());
        document.getElementById('customerPhone').addEventListener('blur', () => this.validatePhone());
        document.getElementById('tourDate').addEventListener('change', () => this.validateDate());
        document.getElementById('tourTime').addEventListener('change', () => this.validateTime());
        
        // Update submit button state on field changes
        document.getElementById('customerName').addEventListener('input', () => this.updatePricing());
        document.getElementById('customerEmail').addEventListener('input', () => this.updatePricing());
        document.getElementById('customerPhone').addEventListener('input', () => this.updatePricing());
        document.getElementById('tourDate').addEventListener('change', () => this.updatePricing());
        document.getElementById('tourTime').addEventListener('change', () => this.updatePricing());
        
        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(tourData) {
        this.currentTour = tourData;
        this.populateTourInfo();
        this.resetForm();
        this.showModal();
    }

    close() {
        this.hideModal();
        this.resetForm();
    }

    showModal() {
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            document.getElementById('customerName').focus();
        }, 300);
    }

    hideModal() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    populateTourInfo() {
        if (!this.currentTour) return;
        
        document.getElementById('selectedTour').textContent = this.currentTour.title || 'Выбранный тур';
        document.getElementById('selectedPrice').textContent = this.currentTour.price || 'от $49';
        
        // Extract price from tour data
        const priceMatch = (this.currentTour.price || '49').match(/\d+/);
        if (priceMatch) {
            this.pricing.adult = parseInt(priceMatch[0]);
            this.pricing.child = Math.round(this.pricing.adult * 0.5); // Children are 50% of adult price
        }
        
        // Update price displays
        document.getElementById('adultPrice').textContent = this.pricing.adult;
        document.getElementById('childPrice').textContent = this.pricing.child;
        
        this.updateSummary();
    }

    resetForm() {
        this.form.reset();
        this.promoDiscount = 0;
        this.appliedPromo = null;
        
        // Reset ticket counts
        document.getElementById('adultCount').textContent = '1';
        document.getElementById('childCount').textContent = '0';
        
        // Reset promo message
        const promoMessage = document.getElementById('promoMessage');
        promoMessage.style.display = 'none';
        promoMessage.className = 'promo-message';
        
        // Clear error states
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        
        // Reset summary
        document.getElementById('childSummaryItem').style.display = 'none';
        document.getElementById('promoSummaryItem').style.display = 'none';
        
        this.updateSummary();
    }

    handleTicketChange(e) {
        const type = e.target.dataset.type;
        const isPlus = e.target.classList.contains('plus');
        const countElement = document.getElementById(`${type}Count`);
        let currentCount = parseInt(countElement.textContent);
        
        if (isPlus) {
            currentCount++;
        } else {
            if (currentCount > (type === 'adult' ? 1 : 0)) {
                currentCount--;
            }
        }
        
        // Add animation
        countElement.classList.add('updating');
        setTimeout(() => {
            countElement.classList.remove('updating');
        }, 300);
        
        countElement.textContent = currentCount;
        
        // Update button states
        const minusBtn = e.target.parentElement.querySelector('.minus');
        minusBtn.disabled = currentCount <= (type === 'adult' ? 1 : 0);
        
        this.updateSummary();
    }

    updateSummary() {
        const adultCount = parseInt(document.getElementById('adultCount').textContent);
        const childCount = parseInt(document.getElementById('childCount').textContent);
        
        const adultTotal = adultCount * this.pricing.adult;
        const childTotal = childCount * this.pricing.child;
        const subtotal = adultTotal + childTotal;
        const total = subtotal - this.promoDiscount;
        
        // Update summary display
        document.getElementById('summaryAdultCount').textContent = adultCount;
        document.getElementById('summaryAdultTotal').textContent = adultTotal;
        
        if (childCount > 0) {
            document.getElementById('childSummaryItem').style.display = 'flex';
            document.getElementById('summaryChildCount').textContent = childCount;
            document.getElementById('summaryChildTotal').textContent = childTotal;
        } else {
            document.getElementById('childSummaryItem').style.display = 'none';
        }
        
        if (this.promoDiscount > 0) {
            document.getElementById('promoSummaryItem').style.display = 'flex';
            document.getElementById('promoDiscount').textContent = this.promoDiscount;
        } else {
            document.getElementById('promoSummaryItem').style.display = 'none';
        }
        
        document.getElementById('totalPrice').textContent = total;
        
        // Update submit button state
        const submitBtn = document.getElementById('submitBooking');
        const hasRequiredFields = this.checkRequiredFields();
        submitBtn.disabled = total <= 0 || !hasRequiredFields;
    }

    checkRequiredFields() {
        const name = document.getElementById('customerName').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const date = document.getElementById('tourDate').value;
        const time = document.getElementById('tourTime').value;
        
        return name && email && phone && date && time;
    }

    applyPromoCode() {
        const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
        const messageElement = document.getElementById('promoMessage');
        
        if (!promoCode) {
            this.showPromoMessage('Введите промокод', 'error');
            return;
        }
        
        // Valid promo codes
        const validPromos = {
            'WELCOME10': { discount: 10, type: 'percentage' },
            'SAVE20': { discount: 20, type: 'percentage' },
            'FIRST5': { discount: 5, type: 'fixed' },
            'FAMILY15': { discount: 15, type: 'percentage' }
        };
        
        if (validPromos[promoCode]) {
            const promo = validPromos[promoCode];
            const adultCount = parseInt(document.getElementById('adultCount').textContent);
            const childCount = parseInt(document.getElementById('childCount').textContent);
            const subtotal = (adultCount * this.pricing.adult) + (childCount * this.pricing.child);
            
            if (promo.type === 'percentage') {
                this.promoDiscount = Math.round(subtotal * promo.discount / 100);
            } else {
                this.promoDiscount = Math.min(promo.discount, subtotal);
            }
            
            this.appliedPromo = promoCode;
            this.showPromoMessage(`Промокод "${promoCode}" применен! Скидка $${this.promoDiscount}`, 'success');
            this.updateSummary();
        } else {
            this.showPromoMessage('Неверный промокод', 'error');
        }
    }

    showPromoMessage(message, type) {
        const messageElement = document.getElementById('promoMessage');
        messageElement.textContent = message;
        messageElement.className = `promo-message ${type}`;
        messageElement.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }

    setMinDate() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dateInput = document.getElementById('tourDate');
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    validateName() {
        const name = document.getElementById('customerName').value.trim();
        const group = document.getElementById('customerName').closest('.form-group');
        
        if (name.length < 2) {
            this.showError(group, 'Имя должно содержать минимум 2 символа');
            return false;
        }
        
        this.clearError(group);
        return true;
    }

    validateEmail() {
        const email = document.getElementById('customerEmail').value.trim();
        const group = document.getElementById('customerEmail').closest('.form-group');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.showError(group, 'Введите корректный email адрес');
            return false;
        }
        
        this.clearError(group);
        return true;
    }

    validatePhone() {
        const phone = document.getElementById('customerPhone').value.trim();
        const group = document.getElementById('customerPhone').closest('.form-group');
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        
        if (!phoneRegex.test(phone)) {
            this.showError(group, 'Введите корректный номер телефона');
            return false;
        }
        
        this.clearError(group);
        return true;
    }

    validateDate() {
        const dateInput = document.getElementById('tourDate');
        const group = dateInput.closest('.form-group');
        
        if (!dateInput.value) {
            this.showError(group, 'Пожалуйста, выберите дату тура');
            return false;
        }
        
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate <= today) {
            this.showError(group, 'Выберите дату в будущем');
            return false;
        }
        
        this.clearError(group);
        return true;
    }

    validateTime() {
        const timeSelect = document.getElementById('tourTime');
        const group = timeSelect.closest('.form-group');
        
        if (!timeSelect.value) {
            this.showError(group, 'Пожалуйста, выберите время тура');
            return false;
        }
        
        this.clearError(group);
        return true;
    }

    showError(group, message) {
        group.classList.add('error');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError(group) {
        group.classList.remove('error');
    }

    validateForm() {
        let isValid = true;
        
        if (!this.validateName()) isValid = false;
        if (!this.validateEmail()) isValid = false;
        if (!this.validatePhone()) isValid = false;
        if (!this.validateDate()) isValid = false;
        if (!this.validateTime()) isValid = false;
        if (!this.validateTicketSelection()) isValid = false;
        
        return isValid;
    }

    validateTicketSelection() {
        const adultCount = parseInt(document.getElementById('adultCount').textContent);
        const childCount = parseInt(document.getElementById('childCount').textContent);
        
        if (adultCount < 1) {
            // Show a subtle hint that they need to confirm ticket selection
            const ticketSelector = document.querySelector('.ticket-selector');
            if (ticketSelector) {
                ticketSelector.style.border = '2px solid #ef8609';
                ticketSelector.style.boxShadow = '0 0 0 4px rgba(239, 134, 9, 0.1)';
                
                setTimeout(() => {
                    ticketSelector.style.border = '';
                    ticketSelector.style.boxShadow = '';
                }, 2000);
            }
            return false;
        }
        
        return true;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.scrollToFirstError();
            return;
        }
        
        const submitBtn = document.getElementById('submitBooking');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await this.submitBooking();
            
            // Show success message
            this.showSuccessMessage();
            
        } catch (error) {
            if (window.ENV?.DEBUG === true) {
                console.error('Booking submission error:', error);
            }
            alert('Произошла ошибка при отправке заявки. Попробуйте еще раз.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    async submitBooking() {
        const formData = new FormData(this.form);
        
        // Prepare booking data for service
        const bookingData = {
            tourId: this.currentTour?.id || null,
            tourName: this.currentTour?.title || 'Выбранный тур',
            date: formData.get('tourDate'),
            time: formData.get('tourTime'),
            participants: parseInt(document.getElementById('adultCount').textContent) + 
                         parseInt(document.getElementById('childCount').textContent),
            customerName: formData.get('customerName'),
            customerEmail: formData.get('customerEmail'),
            customerPhone: formData.get('customerPhone'),
            specialRequests: formData.get('specialRequests'),
            promoCode: this.appliedPromo || null
        };
        
        // Call service to create booking
        const savedBooking = await this.bookingsService.createBooking(bookingData);
        
        // Store the booking data in the instance for use in success popup
        this.lastBookingData = {
            tour: this.currentTour,
            customer: {
                name: savedBooking.customerName || bookingData.customerName,
                email: savedBooking.customerEmail || bookingData.customerEmail,
                phone: savedBooking.customerPhone || bookingData.customerPhone
            },
            tourDetails: {
                date: savedBooking.date || bookingData.date,
                time: savedBooking.time || bookingData.time
            },
            tickets: {
                adults: parseInt(document.getElementById('adultCount').textContent),
                children: parseInt(document.getElementById('childCount').textContent)
            },
            pricing: {
                adultPrice: this.pricing.adult,
                childPrice: this.pricing.child,
                subtotal: (parseInt(document.getElementById('adultCount').textContent) * this.pricing.adult) + 
                          (parseInt(document.getElementById('childCount').textContent) * this.pricing.child),
                discount: this.promoDiscount,
                total: parseInt(document.getElementById('totalPrice').textContent)
            },
            promoCode: this.appliedPromo,
            specialRequests: formData.get('specialRequests')
        };
        
        if (window.ENV?.DEBUG === true) {
            console.log('Booking submitted:', savedBooking);
        }
    }

    showSuccessMessage() {
        if (window.ENV?.DEBUG === true) {
            console.log('showSuccessMessage called');
        }
        
        // Close booking modal
        this.close();
        
        // Show loading state first
        const loadingState = document.getElementById('loadingState');
        
        if (loadingState) {
            loadingState.classList.add('active');
        }
        
        // Hide loading state after a short delay
        setTimeout(() => {
            if (loadingState) {
                loadingState.classList.remove('active');
            }
            
            // Show success popup
            const successPopup = document.getElementById('successPopup');
            const bookingDetails = document.getElementById('bookingDetailsContent');
            
             if (successPopup && bookingDetails && this.lastBookingData) {
                 
                 // Use stored booking data instead of DOM elements
                 const bookingData = this.lastBookingData;
                 const adultCount = bookingData.tickets.adults;
                 const childCount = bookingData.tickets.children;
                 const total = bookingData.pricing.total;
                 
                 const totalParticipants = adultCount + childCount;
                 const participantText = totalParticipants === 1 ? '1 участник' : `${totalParticipants} участников`;
                 
                 // Use safe DOM manipulation to prevent XSS
                 bookingDetails.innerHTML = ''; // Clear first
                 
                 // Create elements safely using createElement
                 const createDetailItem = (label, value) => {
                     const item = document.createElement('div');
                     item.className = 'booking-detail-item';
                     const strong = document.createElement('strong');
                     strong.textContent = label;
                     item.appendChild(strong);
                     const text = document.createTextNode(' ' + (value || ''));
                     item.appendChild(text);
                     return item;
                 };
                 
                 // Tour name
                 bookingDetails.appendChild(createDetailItem('Тур:', bookingData.tour?.title || 'Выбранный тур'));
                 
                 // Date
                 bookingDetails.appendChild(createDetailItem('Дата:', bookingData.tourDetails.date));
                 
                 // Time
                 bookingDetails.appendChild(createDetailItem('Время:', bookingData.tourDetails.time));
                 
                 // Participants (with special styling)
                 const participantsItem = document.createElement('div');
                 participantsItem.className = 'booking-detail-item';
                 participantsItem.style.cssText = 'background: rgba(239, 134, 9, 0.1); padding: 12px; border-radius: 8px; margin: 8px 0;';
                 const participantsStrong = document.createElement('strong');
                 participantsStrong.style.cssText = 'color: #ef8609;';
                 participantsStrong.textContent = '👥 Количество участников: ';
                 const participantsSpan = document.createElement('span');
                 participantsSpan.style.cssText = 'color: #ef8609; font-weight: 700;';
                 participantsSpan.textContent = participantText;
                 participantsItem.appendChild(participantsStrong);
                 participantsItem.appendChild(participantsSpan);
                 const br = document.createElement('br');
                 participantsItem.appendChild(br);
                 const small = document.createElement('small');
                 small.style.cssText = 'color: #666; margin-top: 4px; display: block;';
                 small.textContent = `${adultCount} взрослых${childCount > 0 ? ` + ${childCount} детей` : ''}`;
                 participantsItem.appendChild(small);
                 bookingDetails.appendChild(participantsItem);
                 
                 // Total
                 bookingDetails.appendChild(createDetailItem('Сумма:', `$${total}`));
                 
                 // Promo code (if exists)
                 if (bookingData.promoCode) {
                     bookingDetails.appendChild(createDetailItem('Промокод:', bookingData.promoCode));
                 }
                
                // Show success popup with animation
                successPopup.style.display = 'flex';
                successPopup.classList.add('active');
                successPopup.setAttribute('aria-hidden', 'false');
                
                // Add event listener for close button
                const closeBtn = document.getElementById('closeSuccessPopup');
                if (closeBtn) {
                    closeBtn.onclick = () => {
                        successPopup.style.display = 'none';
                        successPopup.classList.remove('active');
                        successPopup.setAttribute('aria-hidden', 'true');
                    };
                }
                
                // Close success popup after 15 seconds
                setTimeout(() => {
                    if (successPopup.classList.contains('active')) {
                        successPopup.style.display = 'none';
                        successPopup.classList.remove('active');
                        successPopup.setAttribute('aria-hidden', 'true');
                    }
                }, 15000);
            } else {
                if (window.ENV?.DEBUG === true) {
                    console.error('Success popup elements not found');
                    console.error('successPopup:', successPopup);
                    console.error('bookingDetails:', bookingDetails);
                }
                alert('Бронирование успешно отправлено! Мы свяжемся с вами в ближайшее время.');
            }
        }, 2000);
    }

    scrollToFirstError() {
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Global booking modal instance
let bookingModal;

// Initialize booking modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    bookingModal = new BookingModal();
    
     // Add click handlers to all book buttons - FIXED: Use closest() to handle clicks on text inside button
     document.addEventListener('click', function(e) {
         // Use closest() to find the button even if clicking on text inside
         const bookBtn = e.target.closest('.book-btn');
         
         if (bookBtn) {
             e.preventDefault();
             
             // Extract tour data from the button's context
             const tourCard = bookBtn.closest('.booking-card') || bookBtn.closest('.unified-slide') || bookBtn.closest('.tour-card');
             
             // Try multiple selectors to find tour title
             let tourTitle = 'Выбранный тур';
             if (tourCard) {
                 tourTitle = tourCard.querySelector('h1')?.textContent?.trim() ||
                            tourCard.querySelector('h2')?.textContent?.trim() ||
                            tourCard.querySelector('h3')?.textContent?.trim() ||
                            document.querySelector('h1')?.textContent?.trim() ||
                            'Выбранный тур';
             } else {
                 // Fallback to page title
                 tourTitle = document.querySelector('h1')?.textContent?.trim() || 'Выбранный тур';
             }
             
             // Try multiple selectors to find price
             let tourPrice = 'от $49';
             if (tourCard) {
                 tourPrice = tourCard.querySelector('.price')?.textContent?.trim() ||
                            tourCard.querySelector('.unified-slide-price')?.textContent?.trim() ||
                            tourCard.querySelector('.tour-price')?.textContent?.trim() ||
                            tourCard.querySelector('.hero-price')?.textContent?.trim() ||
                            'от $49';
             }
             
             // Extract numeric price for calculations
             const priceMatch = tourPrice.match(/\$?(\d+)/);
             const numericPrice = priceMatch ? parseInt(priceMatch[1]) : 49;
             
             const tourData = {
                 title: tourTitle,
                 price: tourPrice,
                 adultPrice: numericPrice,
                 childPrice: Math.round(numericPrice * 0.5)
             };
             
             if (window.ENV?.DEBUG === true) {
                 console.log('Opening booking modal with data:', tourData);
             }
             bookingModal.open(tourData);
         }
     });
});

// Close success popup
document.addEventListener('click', function(e) {
    if (e.target.id === 'closeSuccessPopup') {
        const successPopup = document.getElementById('successPopup');
        successPopup.style.display = 'none';
        successPopup.setAttribute('aria-hidden', 'true');
    }
});

// Make booking modal globally available
window.BookingModal = BookingModal;
window.openBookingModal = function(tourData) {
    if (bookingModal) {
        bookingModal.open(tourData);
    }
};
