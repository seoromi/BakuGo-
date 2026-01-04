// Admin Panel Global Functions
// Global functions for HTML onclick handlers (backward compatibility)

/**
 * Global functions for HTML onclick handlers
 * These functions provide backward compatibility with existing HTML
 * that uses onclick attributes. They delegate to window.adminPanel.
 */

// Modal functions
export function openTourModal() {
    if (window.adminPanel) {
        window.adminPanel.openTourModal();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function openBookingModal() {
    if (window.adminPanel) {
        window.adminPanel.openBookingModal();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function openPromoCodeModal() {
    if (window.adminPanel) {
        window.adminPanel.openPromoCodeModal();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function closeModal(modalId) {
    window.adminPanel && window.adminPanel.closeModal(modalId);
}

// Save functions
export function saveTour() {
    if (window.adminPanel) {
        window.adminPanel.saveTour();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function saveBooking() {
    if (window.adminPanel) {
        window.adminPanel.saveBooking();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function savePromoCode() {
    if (window.adminPanel) {
        window.adminPanel.savePromoCode();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

// Customer functions
export function openCustomerModal() {
    if (window.adminPanel) {
        window.adminPanel.openCustomerModal();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function saveCustomer() {
    if (window.adminPanel) {
        window.adminPanel.saveCustomer();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function exportCustomers() {
    if (window.adminPanel) {
        window.adminPanel.exportCustomers();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

// Confirmation modal functions
export function closeConfirmModal() {
    if (window.adminPanel) {
        window.adminPanel.closeConfirmModal();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function executeConfirmAction() {
    if (window.adminPanel) {
        window.adminPanel.executeConfirmAction();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

// Pagination functions
export function previousPage(section) {
    window.adminPanel && window.adminPanel.previousPage(section);
}

export function nextPage(section) {
    window.adminPanel && window.adminPanel.nextPage(section);
}

// Dashboard functions
export function refreshDashboard() {
    if (window.adminPanel) {
        window.adminPanel.loadDashboard();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

// Export functions
export function exportTours() {
    if (window.adminPanel) {
        window.adminPanel.showMessage('Exporting tours...', 'info');
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function exportBookings() {
    if (window.adminPanel) {
        window.adminPanel.showMessage('Exporting bookings...', 'info');
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function exportReviews() {
    if (window.adminPanel) {
        window.adminPanel.showMessage('Exporting reviews...', 'info');
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function generateReport() {
    if (window.adminPanel) {
        window.adminPanel.showMessage('Generating report...', 'info');
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function markAllAsRead() {
    if (window.adminPanel) {
        window.adminPanel.showMessage('All notifications marked as read', 'success');
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function logout() {
    if (window.adminPanel) {
        window.adminPanel.showConfirmModal(
            'Logout',
            'Are you sure you want to logout? You will be redirected to the login page.',
            () => {
                window.adminPanel.showMessage('Logging out...', 'info');
                // In a real app, this would redirect to login page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            },
            'Logout',
            'btn-danger'
        );
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

// Booking Card Management Functions
export function addIncludedItem() {
    if (window.adminPanel) {
        window.adminPanel.addIncludedItem();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function removeIncludedItem(button) {
    window.adminPanel && window.adminPanel.removeIncludedItem(button);
}

export function addNotIncludedItem() {
    if (window.adminPanel) {
        window.adminPanel.addNotIncludedItem();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function removeNotIncludedItem(button) {
    window.adminPanel && window.adminPanel.removeNotIncludedItem(button);
}

export function addStartTime() {
    if (window.adminPanel) {
        window.adminPanel.addStartTime();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function removeStartTime(button) {
    window.adminPanel && window.adminPanel.removeStartTime(button);
}

export function addItineraryStep() {
    if (window.adminPanel) {
        window.adminPanel.addItineraryStep();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function removeItineraryStep(button) {
    window.adminPanel && window.adminPanel.removeItineraryStep(button);
}

export function clearGallery() {
    const preview = document.getElementById('galleryPreview');
    if (!preview) return;
    
    preview.innerHTML = '';
    const placeholder = document.createElement('div');
    placeholder.className = 'gallery-placeholder';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-images';
    placeholder.appendChild(icon);
    
    const p = document.createElement('p');
    p.textContent = 'Click to select multiple images';
    placeholder.appendChild(p);
    
    const small = document.createElement('small');
    small.textContent = 'For Фотогалерея section';
    placeholder.appendChild(small);
    
    preview.appendChild(placeholder);
    preview.classList.remove('has-images');
    window.adminPanel && window.adminPanel.updateGalleryActions();
}

export function addPickupLocation() {
    if (window.adminPanel) {
        window.adminPanel.addPickupLocation();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function removePickupLocation(button) {
    if (window.adminPanel) {
        window.adminPanel.removePickupLocation(button);
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

// Destination functions
export function openDestinationModal() {
    console.log('openDestinationModal called');
    if (window.adminPanel) {
        console.log('adminPanel exists, calling openDestinationModal');
        window.adminPanel.openDestinationModal();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function editDestination(destinationId) {
    if (window.adminPanel) {
        window.adminPanel.editDestination(destinationId);
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function deleteDestination(destinationId) {
    if (window.adminPanel) {
        window.adminPanel.deleteDestination(destinationId);
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function exportDestinations() {
    if (window.adminPanel) {
        window.adminPanel.showMessage('Exporting destinations...', 'info');
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function saveDestination() {
    if (window.adminPanel) {
        window.adminPanel.saveDestination();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function addDestinationHighlight() {
    if (window.adminPanel) {
        window.adminPanel.addDestinationHighlight();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function removeDestinationHighlight(button) {
    const container = document.getElementById('destinationHighlights');
    if (container && container.children.length > 1) {
        button.parentElement.remove();
    }
}

export function addDestinationActivity() {
    if (window.adminPanel) {
        window.adminPanel.addDestinationActivity();
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function removeDestinationActivity(button) {
    const container = document.getElementById('destinationActivities');
    if (container && container.children.length > 1) {
        button.parentElement.remove();
    }
}

// Content functions
export function openContentModal() {
    if (window.adminPanel) {
        window.adminPanel.showMessage('Content modal not implemented yet', 'info');
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

export function editContent(contentId) {
    window.adminPanel && window.adminPanel.showMessage('Edit content not implemented yet', 'info');
}

export function deleteContent(contentId) {
    window.adminPanel && window.adminPanel.showMessage('Delete content not implemented yet', 'info');
}

export function exportContent() {
    if (window.adminPanel) {
        window.adminPanel.showMessage('Exporting content...', 'info');
    } else {
        console.error('AdminPanel not initialized yet');
    }
}

// Make functions available globally for HTML onclick handlers
// This maintains backward compatibility
if (typeof window !== 'undefined') {
    window.openTourModal = openTourModal;
    window.openBookingModal = openBookingModal;
    window.openPromoCodeModal = openPromoCodeModal;
    window.closeModal = closeModal;
    window.saveTour = saveTour;
    window.saveBooking = saveBooking;
    window.savePromoCode = savePromoCode;
    window.openCustomerModal = openCustomerModal;
    window.saveCustomer = saveCustomer;
    window.exportCustomers = exportCustomers;
    window.closeConfirmModal = closeConfirmModal;
    window.executeConfirmAction = executeConfirmAction;
    window.previousPage = previousPage;
    window.nextPage = nextPage;
    window.refreshDashboard = refreshDashboard;
    window.exportTours = exportTours;
    window.exportBookings = exportBookings;
    window.exportReviews = exportReviews;
    window.generateReport = generateReport;
    window.markAllAsRead = markAllAsRead;
    window.logout = logout;
    window.addIncludedItem = addIncludedItem;
    window.removeIncludedItem = removeIncludedItem;
    window.addNotIncludedItem = addNotIncludedItem;
    window.removeNotIncludedItem = removeNotIncludedItem;
    window.addStartTime = addStartTime;
    window.removeStartTime = removeStartTime;
    window.addItineraryStep = addItineraryStep;
    window.removeItineraryStep = removeItineraryStep;
    window.clearGallery = clearGallery;
    window.addPickupLocation = addPickupLocation;
    window.removePickupLocation = removePickupLocation;
    window.openDestinationModal = openDestinationModal;
    window.editDestination = editDestination;
    window.deleteDestination = deleteDestination;
    window.exportDestinations = exportDestinations;
    window.saveDestination = saveDestination;
    window.addDestinationHighlight = addDestinationHighlight;
    window.removeDestinationHighlight = removeDestinationHighlight;
    window.addDestinationActivity = addDestinationActivity;
    window.removeDestinationActivity = removeDestinationActivity;
    window.openContentModal = openContentModal;
    window.editContent = editContent;
    window.deleteContent = deleteContent;
    window.exportContent = exportContent;
}

