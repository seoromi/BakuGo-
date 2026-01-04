// Admin Panel DOM Renderers
// All methods that render DOM elements (tables, lists, cards, grids)

/**
 * Mixin function to add rendering methods to AdminPanel
 */
export function mixinRendererMethods(AdminPanelClass) {
    
    // Tours rendering
    AdminPanelClass.prototype.loadTours = function() {
        this.renderToursTable();
    };

    AdminPanelClass.prototype.renderToursTable = function(toursData = null) {
        const tbody = document.getElementById('toursTableBody');
        if (!tbody) return;

        // Use provided data or fall back to main array
        const dataSource = toursData || this.tours;
        const startIndex = (this.currentPage.tours - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const toursToShow = dataSource.slice(startIndex, endIndex);

        tbody.innerHTML = '';
        toursToShow.forEach(tour => {
            const row = document.createElement('tr');
            
            // Title and description cell
            const titleCell = document.createElement('td');
            const titleWrapper = document.createElement('div');
            const titleDiv = document.createElement('div');
            titleDiv.style.fontWeight = '600';
            titleDiv.style.color = 'var(--text-primary)';
            titleDiv.textContent = tour.title || '';
            titleWrapper.appendChild(titleDiv);
            
            const descDiv = document.createElement('div');
            descDiv.style.fontSize = '0.9rem';
            descDiv.style.color = 'var(--text-secondary)';
            const description = tour.description || '';
            descDiv.textContent = description.length > 60 ? description.substring(0, 60) + '...' : description;
            titleWrapper.appendChild(descDiv);
            titleCell.appendChild(titleWrapper);
            row.appendChild(titleCell);
            
            // Type cell
            const typeCell = document.createElement('td');
            const typeBadge = document.createElement('span');
            const safeTourType = this.validateTourType(tour.type || '');
            typeBadge.className = `status-badge ${safeTourType}`;
            typeBadge.textContent = tour.type || '';
            typeCell.appendChild(typeBadge);
            row.appendChild(typeCell);
            
            // Price cell
            const priceCell = document.createElement('td');
            priceCell.textContent = `$${tour.price || 0}`;
            row.appendChild(priceCell);
            
            // Duration cell
            const durationCell = document.createElement('td');
            durationCell.textContent = tour.duration || '';
            row.appendChild(durationCell);
            
            // Status cell
            const statusCell = document.createElement('td');
            const statusBadge = document.createElement('span');
            const safeStatus = this.validateStatus(tour.status || '');
            statusBadge.className = `status-badge ${safeStatus}`;
            statusBadge.textContent = tour.status || '';
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);
            
            // Bookings cell
            const bookingsCell = document.createElement('td');
            bookingsCell.textContent = tour.bookings || 0;
            row.appendChild(bookingsCell);
            
            // Actions cell
            const actionsCell = document.createElement('td');
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'action-buttons';
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'action-btn view';
            viewBtn.setAttribute('data-action', 'view-tour');
            viewBtn.setAttribute('data-id', tour.id);
            viewBtn.title = 'View';
            const viewIcon = document.createElement('i');
            viewIcon.className = 'fas fa-eye';
            viewBtn.appendChild(viewIcon);
            actionsDiv.appendChild(viewBtn);
            
            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn edit';
            editBtn.setAttribute('data-action', 'edit-tour');
            editBtn.setAttribute('data-id', tour.id);
            editBtn.title = 'Edit';
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit';
            editBtn.appendChild(editIcon);
            actionsDiv.appendChild(editBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete';
            deleteBtn.setAttribute('data-action', 'delete-tour');
            deleteBtn.setAttribute('data-id', tour.id);
            deleteBtn.title = 'Delete';
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash';
            deleteBtn.appendChild(deleteIcon);
            actionsDiv.appendChild(deleteBtn);
            
            actionsCell.appendChild(actionsDiv);
            row.appendChild(actionsCell);
            
            tbody.appendChild(row);
        });

        this.updatePagination('tours');
    };

    // Bookings rendering
    AdminPanelClass.prototype.loadBookings = function() {
        this.renderBookingsTable();
    };

    AdminPanelClass.prototype.renderBookingsTable = function(bookingsData = null) {
        const tbody = document.getElementById('bookingsTableBody');
        if (!tbody) return;

        // Use provided data or fall back to main array
        const dataSource = bookingsData || this.bookings;
        const startIndex = (this.currentPage.bookings - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const bookingsToShow = dataSource.slice(startIndex, endIndex);

        tbody.innerHTML = '';
        bookingsToShow.forEach(booking => {
            const row = document.createElement('tr');
            
            // ID cell
            const idCell = document.createElement('td');
            idCell.textContent = `#${booking.id || ''}`;
            row.appendChild(idCell);
            
            // Customer cell
            const customerCell = document.createElement('td');
            const customerWrapper = document.createElement('div');
            const nameDiv = document.createElement('div');
            nameDiv.style.fontWeight = '600';
            nameDiv.style.color = 'var(--text-primary)';
            nameDiv.textContent = booking.customerName || '';
            customerWrapper.appendChild(nameDiv);
            
            const emailDiv = document.createElement('div');
            emailDiv.style.fontSize = '0.9rem';
            emailDiv.style.color = 'var(--text-secondary)';
            emailDiv.textContent = booking.customerEmail || '';
            customerWrapper.appendChild(emailDiv);
            customerCell.appendChild(customerWrapper);
            row.appendChild(customerCell);
            
            // Tour name cell
            const tourCell = document.createElement('td');
            tourCell.textContent = booking.tourName || '';
            row.appendChild(tourCell);
            
            // Date cell
            const dateCell = document.createElement('td');
            dateCell.textContent = this.formatDate(booking.date);
            row.appendChild(dateCell);
            
            // Guests cell
            const guestsCell = document.createElement('td');
            const totalGuests = (booking.adults || 0) + (booking.children || 0);
            guestsCell.textContent = `${totalGuests} guests`;
            row.appendChild(guestsCell);
            
            // Total cell
            const totalCell = document.createElement('td');
            totalCell.textContent = `$${booking.total || 0}`;
            row.appendChild(totalCell);
            
            // Status cell
            const statusCell = document.createElement('td');
            const statusBadge = document.createElement('span');
            const safeStatus = this.validateStatus(booking.status || '');
            statusBadge.className = `booking-status ${safeStatus}`;
            statusBadge.textContent = booking.status || '';
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);
            
            // Actions cell
            const actionsCell = document.createElement('td');
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'action-buttons';
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'action-btn view';
            viewBtn.setAttribute('data-action', 'view-booking');
            viewBtn.setAttribute('data-id', booking.id);
            viewBtn.title = 'View';
            const viewIcon = document.createElement('i');
            viewIcon.className = 'fas fa-eye';
            viewBtn.appendChild(viewIcon);
            actionsDiv.appendChild(viewBtn);
            
            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn edit';
            editBtn.setAttribute('data-action', 'edit-booking');
            editBtn.setAttribute('data-id', booking.id);
            editBtn.title = 'Edit';
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit';
            editBtn.appendChild(editIcon);
            actionsDiv.appendChild(editBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete';
            deleteBtn.setAttribute('data-action', 'delete-booking');
            deleteBtn.setAttribute('data-id', booking.id);
            deleteBtn.title = 'Delete';
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash';
            deleteBtn.appendChild(deleteIcon);
            actionsDiv.appendChild(deleteBtn);
            
            actionsCell.appendChild(actionsDiv);
            row.appendChild(actionsCell);
            
            tbody.appendChild(row);
        });

        this.updatePagination('bookings');
    };

    // Reviews rendering
    AdminPanelClass.prototype.loadReviews = function() {
        this.renderReviewsList();
    };

    AdminPanelClass.prototype.renderReviewsList = function(reviewsData = null) {
        const container = document.getElementById('reviewsList');
        if (!container) return;

        // Use provided data or fall back to main array
        const dataSource = reviewsData || this.reviews;
        const reviewsToShow = dataSource.slice(0, 10);

        container.innerHTML = '';
        reviewsToShow.forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-card';
            
            const header = document.createElement('div');
            header.className = 'review-card-header';
            
            const info = document.createElement('div');
            info.className = 'review-card-info';
            
            const avatar = document.createElement('div');
            avatar.className = 'reviewer-avatar';
            const customerName = review.customerName || '';
            avatar.textContent = customerName.charAt(0) || '?';
            info.appendChild(avatar);
            
            const details = document.createElement('div');
            details.className = 'reviewer-details';
            
            const h4 = document.createElement('h4');
            h4.textContent = customerName;
            details.appendChild(h4);
            
            const p = document.createElement('p');
            p.textContent = this.formatDate(review.date);
            details.appendChild(p);
            info.appendChild(details);
            header.appendChild(info);
            
            const rating = document.createElement('div');
            rating.className = 'review-rating';
            
            const stars = document.createElement('div');
            stars.className = 'review-stars';
            stars.textContent = '⭐'.repeat(review.rating || 0);
            rating.appendChild(stars);
            
            const ratingText = document.createElement('div');
            ratingText.className = 'review-rating-text';
            ratingText.textContent = `${review.rating || 0}/5`;
            rating.appendChild(ratingText);
            header.appendChild(rating);
            card.appendChild(header);
            
            const content = document.createElement('div');
            content.className = 'review-content';
            
            const textDiv = document.createElement('div');
            textDiv.className = 'review-text';
            textDiv.textContent = review.comment || '';
            content.appendChild(textDiv);
            
            const tourDiv = document.createElement('div');
            tourDiv.className = 'review-tour';
            tourDiv.textContent = review.tourName || '';
            content.appendChild(tourDiv);
            card.appendChild(content);
            
            const actions = document.createElement('div');
            actions.className = 'review-actions';
            
            const approveBtn = document.createElement('button');
            approveBtn.className = 'btn btn-success btn-sm';
            approveBtn.setAttribute('data-action', 'approve-review');
            approveBtn.setAttribute('data-id', review.id);
            const approveIcon = document.createElement('i');
            approveIcon.className = 'fas fa-check';
            approveBtn.appendChild(approveIcon);
            approveBtn.appendChild(document.createTextNode(' Approve'));
            actions.appendChild(approveBtn);
            
            const rejectBtn = document.createElement('button');
            rejectBtn.className = 'btn btn-danger btn-sm';
            rejectBtn.setAttribute('data-action', 'reject-review');
            rejectBtn.setAttribute('data-id', review.id);
            const rejectIcon = document.createElement('i');
            rejectIcon.className = 'fas fa-times';
            rejectBtn.appendChild(rejectIcon);
            rejectBtn.appendChild(document.createTextNode(' Reject'));
            actions.appendChild(rejectBtn);
            
            card.appendChild(actions);
            container.appendChild(card);
        });
    };

    // Promo codes rendering
    AdminPanelClass.prototype.loadPromoCodes = function() {
        this.renderPromoCodesGrid();
    };

    AdminPanelClass.prototype.renderPromoCodesGrid = function() {
        const container = document.getElementById('promoCodesGrid');
        if (!container) return;

        container.innerHTML = '';
        this.promoCodes.forEach(promo => {
            const card = document.createElement('div');
            card.className = 'promo-code-card';
            
            const header = document.createElement('div');
            header.className = 'promo-code-header';
            
            const codeDiv = document.createElement('div');
            codeDiv.className = 'promo-code';
            codeDiv.textContent = promo.code || '';
            header.appendChild(codeDiv);
            
            const statusDiv = document.createElement('div');
            const safeStatus = this.validateStatus(promo.status || '');
            statusDiv.className = `promo-status ${safeStatus}`;
            statusDiv.textContent = promo.status || '';
            header.appendChild(statusDiv);
            card.appendChild(header);
            
            const details = document.createElement('div');
            details.className = 'promo-details';
            
            const discountDiv = document.createElement('div');
            discountDiv.className = 'promo-discount';
            const discountText = promo.discountType === 'percentage' 
                ? `${promo.discountValue || 0}%` 
                : `$${promo.discountValue || 0}`;
            discountDiv.textContent = `${discountText} OFF`;
            details.appendChild(discountDiv);
            
            const descDiv = document.createElement('div');
            descDiv.className = 'promo-description';
            descDiv.textContent = promo.description || '';
            details.appendChild(descDiv);
            
            const usageDiv = document.createElement('div');
            usageDiv.className = 'promo-usage';
            usageDiv.textContent = `Used ${promo.usedCount || 0}/${promo.usageLimit || '∞'} times`;
            details.appendChild(usageDiv);
            card.appendChild(details);
            
            const actions = document.createElement('div');
            actions.className = 'promo-actions';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn edit';
            editBtn.setAttribute('data-action', 'edit-promo');
            editBtn.setAttribute('data-id', promo.id);
            editBtn.title = 'Edit';
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit';
            editBtn.appendChild(editIcon);
            actions.appendChild(editBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete';
            deleteBtn.setAttribute('data-action', 'delete-promo');
            deleteBtn.setAttribute('data-id', promo.id);
            deleteBtn.title = 'Delete';
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash';
            deleteBtn.appendChild(deleteIcon);
            actions.appendChild(deleteBtn);
            
            card.appendChild(actions);
            container.appendChild(card);
        });
    };

    // Destinations rendering
    AdminPanelClass.prototype.loadDestinations = function() {
        const grid = document.getElementById('destinationsGrid');
        if (!grid) return;

        const startIndex = (this.currentPage.destinations - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedDestinations = this.destinations.slice(startIndex, endIndex);

        grid.innerHTML = '';
        paginatedDestinations.forEach(destination => {
            const card = document.createElement('div');
            card.className = 'destination-card';
            
            const imageDiv = document.createElement('div');
            imageDiv.className = 'destination-image';
            
            const img = document.createElement('img');
            const imageUrl = destination.image || '';
            const urlValidation = this.validateImageUrl(imageUrl);
            img.src = urlValidation.valid ? urlValidation.url : 'img/gobustan.jpg';
            img.alt = destination.name || '';
            img.onerror = function() { this.src = 'img/gobustan.jpg'; };
            imageDiv.appendChild(img);
            
            const badge = document.createElement('div');
            badge.className = 'destination-badge';
            badge.textContent = destination.type || '';
            imageDiv.appendChild(badge);
            card.appendChild(imageDiv);
            
            const content = document.createElement('div');
            content.className = 'destination-content';
            
            const h3 = document.createElement('h3');
            h3.textContent = destination.name || '';
            content.appendChild(h3);
            
            const regionP = document.createElement('p');
            regionP.className = 'destination-region';
            regionP.textContent = destination.region || '';
            content.appendChild(regionP);
            
            const descP = document.createElement('p');
            descP.className = 'destination-description';
            descP.textContent = destination.description || '';
            content.appendChild(descP);
            
            const meta = document.createElement('div');
            meta.className = 'destination-meta';
            
            const distanceSpan = document.createElement('span');
            distanceSpan.className = 'destination-distance';
            distanceSpan.textContent = destination.distanceFromBaku || '';
            meta.appendChild(distanceSpan);
            
            const durationSpan = document.createElement('span');
            durationSpan.className = 'destination-duration';
            durationSpan.textContent = destination.visitDuration || '';
            meta.appendChild(durationSpan);
            content.appendChild(meta);
            
            const actions = document.createElement('div');
            actions.className = 'destination-actions';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-primary';
            editBtn.setAttribute('data-action', 'edit-destination');
            editBtn.setAttribute('data-destination-id', destination.id);
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit';
            editBtn.appendChild(editIcon);
            editBtn.appendChild(document.createTextNode(' Edit'));
            actions.appendChild(editBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-danger';
            deleteBtn.setAttribute('data-action', 'delete-destination');
            deleteBtn.setAttribute('data-destination-id', destination.id);
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash';
            deleteBtn.appendChild(deleteIcon);
            deleteBtn.appendChild(document.createTextNode(' Delete'));
            actions.appendChild(deleteBtn);
            
            content.appendChild(actions);
            card.appendChild(content);
            grid.appendChild(card);
        });

        this.updatePagination('destinations');
    };

    // Content rendering
    AdminPanelClass.prototype.loadContent = function() {
        this.renderContentTable();
    };

    AdminPanelClass.prototype.renderContentTable = function() {
        const tbody = document.getElementById('contentTableBody');
        if (!tbody) return;

        const startIndex = (this.currentPage.content - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedContent = this.content.slice(startIndex, endIndex);

        tbody.innerHTML = '';
        paginatedContent.forEach(item => {
            const row = document.createElement('tr');
            
            // Title cell
            const titleCell = document.createElement('td');
            const titleWrapper = document.createElement('div');
            titleWrapper.className = 'content-title';
            
            const strong = document.createElement('strong');
            strong.textContent = item.title || '';
            titleWrapper.appendChild(strong);
            
            const small = document.createElement('small');
            small.textContent = item.excerpt || '';
            titleWrapper.appendChild(small);
            titleCell.appendChild(titleWrapper);
            row.appendChild(titleCell);
            
            // Type cell
            const typeCell = document.createElement('td');
            const typeBadge = document.createElement('span');
            const safeContentType = this.validateContentType(item.type || '');
            typeBadge.className = `content-type-badge ${safeContentType}`;
            typeBadge.textContent = item.type || '';
            typeCell.appendChild(typeBadge);
            row.appendChild(typeCell);
            
            // Author cell
            const authorCell = document.createElement('td');
            authorCell.textContent = item.author || '';
            row.appendChild(authorCell);
            
            // Date cell
            const dateCell = document.createElement('td');
            dateCell.textContent = item.createdDate || '';
            row.appendChild(dateCell);
            
            // Status cell
            const statusCell = document.createElement('td');
            const statusBadge = document.createElement('span');
            const safeStatus = this.validateStatus(item.status || '');
            statusBadge.className = `status-badge ${safeStatus}`;
            statusBadge.textContent = item.status || '';
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);
            
            // Actions cell
            const actionsCell = document.createElement('td');
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'action-buttons';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-primary';
            editBtn.setAttribute('data-action', 'edit-content');
            editBtn.setAttribute('data-content-id', item.id);
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit';
            editBtn.appendChild(editIcon);
            actionsDiv.appendChild(editBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-danger';
            deleteBtn.setAttribute('data-action', 'delete-content');
            deleteBtn.setAttribute('data-content-id', item.id);
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash';
            deleteBtn.appendChild(deleteIcon);
            actionsDiv.appendChild(deleteBtn);
            
            actionsCell.appendChild(actionsDiv);
            row.appendChild(actionsCell);
            
            tbody.appendChild(row);
        });

        this.updatePagination('content');
    };

    // Customers rendering
    AdminPanelClass.prototype.loadCustomers = function() {
        const tableBody = document.getElementById('customersTableBody');
        if (!tableBody) return;

        const startIndex = (this.currentPage.customers - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const customersToShow = this.customers.slice(startIndex, endIndex);

        tableBody.innerHTML = '';
        customersToShow.forEach(customer => {
            const row = document.createElement('tr');
            
            // Name and country cell
            const nameCell = document.createElement('td');
            const nameWrapper = document.createElement('div');
            const nameDiv = document.createElement('div');
            nameDiv.style.fontWeight = '600';
            nameDiv.style.color = 'var(--text-primary)';
            nameDiv.textContent = customer.name || '';
            nameWrapper.appendChild(nameDiv);
            
            const countryDiv = document.createElement('div');
            countryDiv.style.fontSize = '0.9rem';
            countryDiv.style.color = 'var(--text-secondary)';
            countryDiv.textContent = customer.country || '';
            nameWrapper.appendChild(countryDiv);
            nameCell.appendChild(nameWrapper);
            row.appendChild(nameCell);
            
            // Email cell
            const emailCell = document.createElement('td');
            emailCell.textContent = customer.email || '';
            row.appendChild(emailCell);
            
            // Phone cell
            const phoneCell = document.createElement('td');
            phoneCell.textContent = customer.phone || '';
            row.appendChild(phoneCell);
            
            // Registration date cell
            const dateCell = document.createElement('td');
            dateCell.textContent = this.formatDate(customer.registrationDate || '2024-01-01');
            row.appendChild(dateCell);
            
            // Total bookings cell
            const bookingsCell = document.createElement('td');
            const bookingsBadge = document.createElement('span');
            bookingsBadge.className = 'badge badge-primary';
            bookingsBadge.textContent = customer.totalBookings || 0;
            bookingsCell.appendChild(bookingsBadge);
            row.appendChild(bookingsCell);
            
            // Status cell
            const statusCell = document.createElement('td');
            const statusBadge = document.createElement('span');
            const status = customer.status || 'active';
            const safeStatus = this.validateStatus(status);
            statusBadge.className = `status-badge ${safeStatus}`;
            statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);
            
            // Actions cell
            const actionsCell = document.createElement('td');
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'action-buttons';
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'action-btn view';
            viewBtn.setAttribute('data-action', 'view-customer');
            viewBtn.setAttribute('data-id', customer.id);
            viewBtn.title = 'View';
            const viewIcon = document.createElement('i');
            viewIcon.className = 'fas fa-eye';
            viewBtn.appendChild(viewIcon);
            actionsDiv.appendChild(viewBtn);
            
            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn edit';
            editBtn.setAttribute('data-action', 'edit-customer');
            editBtn.setAttribute('data-id', customer.id);
            editBtn.title = 'Edit';
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit';
            editBtn.appendChild(editIcon);
            actionsDiv.appendChild(editBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete';
            deleteBtn.setAttribute('data-action', 'delete-customer');
            deleteBtn.setAttribute('data-id', customer.id);
            deleteBtn.title = 'Delete';
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash';
            deleteBtn.appendChild(deleteIcon);
            actionsDiv.appendChild(deleteBtn);
            
            actionsCell.appendChild(actionsDiv);
            row.appendChild(actionsCell);
            
            tableBody.appendChild(row);
        });

        // Update pagination info
        const totalPages = Math.ceil(this.customers.length / this.itemsPerPage);
        const pageInfo = document.getElementById('customersPageInfo');
        if (pageInfo) {
            pageInfo.textContent = `Page ${this.currentPage.customers} of ${totalPages}`;
        }
    };
}

