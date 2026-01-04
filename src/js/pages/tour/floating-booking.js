// Floating Booking Card Controller
class FloatingBookingController {
    constructor() {
        this.floatingCard = null;
        this.mainBookingCard = null;
        this.isVisible = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    init() {
        // Only initialize on mobile devices
        if (!this.isMobile) return;

        this.createFloatingCard();
        this.setupScrollListener();
        this.setupResizeListener();
    }

    createFloatingCard() {
        // Find the main booking card to get price and button text
        this.mainBookingCard = document.querySelector('.booking-card');
        if (!this.mainBookingCard) return;

        const priceElement = this.mainBookingCard.querySelector('.price');
        const bookButton = this.mainBookingCard.querySelector('.book-btn');
        
        if (!priceElement || !bookButton) return;

        const price = priceElement.textContent.trim();
        const buttonText = bookButton.textContent.trim();

        // Create floating card HTML
        const floatingCardHTML = `
            <div class="floating-booking-card" id="floatingBookingCard">
                <div class="floating-booking-content">
                    <div class="floating-price">${price}</div>
                    <button class="floating-book-btn" onclick="document.querySelector('.book-btn').click()">
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;

        // Insert floating card into body
        document.body.insertAdjacentHTML('beforeend', floatingCardHTML);
        this.floatingCard = document.getElementById('floatingBookingCard');

        // Initially hide the card
        this.hideFloatingCard();
    }

    setupScrollListener() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateFloatingCardVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    setupResizeListener() {
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;

            // If switching from desktop to mobile, initialize
            if (!wasMobile && this.isMobile) {
                this.init();
            }
            // If switching from mobile to desktop, remove floating card
            else if (wasMobile && !this.isMobile) {
                this.removeFloatingCard();
            }
        });
    }

    updateFloatingCardVisibility() {
        if (!this.floatingCard || !this.mainBookingCard) return;

        const mainCardRect = this.mainBookingCard.getBoundingClientRect();
        const isMainCardVisible = mainCardRect.top <= window.innerHeight && mainCardRect.bottom >= 0;

        if (isMainCardVisible && this.isVisible) {
            this.hideFloatingCard();
        } else if (!isMainCardVisible && !this.isVisible) {
            this.showFloatingCard();
        }
    }

    showFloatingCard() {
        if (!this.floatingCard) return;
        
        this.floatingCard.classList.remove('hide');
        this.floatingCard.classList.add('show');
        this.isVisible = true;
    }

    hideFloatingCard() {
        if (!this.floatingCard) return;
        
        this.floatingCard.classList.remove('show');
        this.floatingCard.classList.add('hide');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (this.floatingCard && this.floatingCard.classList.contains('hide')) {
                this.floatingCard.style.display = 'none';
                this.isVisible = false;
            }
        }, 300);
    }

    removeFloatingCard() {
        if (this.floatingCard) {
            this.floatingCard.remove();
            this.floatingCard = null;
            this.isVisible = false;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FloatingBookingController();
});

// Re-initialize if page content is dynamically loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FloatingBookingController();
    });
} else {
    new FloatingBookingController();
}
