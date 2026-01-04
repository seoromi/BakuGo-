// =====================================================
// CLEAN UNIFIED SLIDER - Built from Scratch
// =====================================================

class CleanSlider {
    constructor(containerId) {
        // Core elements
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.wrapper = this.container?.parentElement;
        this.section = this.wrapper?.parentElement?.parentElement;
        
        if (!this.container) {
            console.warn(`Slider ${containerId} not found`);
            return;
        }

        // Slides
        this.slides = this.container.querySelectorAll('.unified-slide');
        this.totalSlides = this.slides.length;
        
        if (this.totalSlides === 0) {
            console.warn(`No slides found in ${containerId}`);
            return;
        }

        // State
        this.currentIndex = 0;
        this.slidesPerView = 1;
        this.maxIndex = 0;
        this.isAnimating = false;
        
        // Dimensions
        this.slideWidth = 285;
        this.slideGap = 24;
        this.currentTranslate = 0;
        
        // Touch/Drag state
        this.isDragging = false;
        this.startX = 0;
        this.startTranslate = 0;
        this.hasMoved = false;
        this.minMoveDistance = 10;
        
        // Navigation elements
        this.prevBtn = null;
        this.nextBtn = null;
        this.dotsContainer = null;
        
        // Initialize
        this.init();
    }

    init() {
        console.log(`Initializing slider: ${this.containerId}`);
        
        this.calculateDimensions();
        this.checkIfShouldCenter();
        
        if (this.shouldCenter) {
            this.centerSlides();
        } else {
            this.setupSlider();
        }
        
        this.setupResizeHandler();
    }

    // ===========================================
    // DIMENSION CALCULATIONS
    // ===========================================
    
    calculateDimensions() {
        const viewport = window.innerWidth;
        
        // Calculate slides per view based on viewport
        if (viewport <= 768) {
            this.slidesPerView = 1;
            this.slideWidth = Math.min(280, viewport - 40);
            this.slideGap = 16;
        } else if (viewport <= 1024) {
            this.slidesPerView = 2;
            this.slideWidth = 260;
            this.slideGap = 20;
        } else if (viewport <= 1200) {
            this.slidesPerView = 3;
            this.slideWidth = 285;
            this.slideGap = 24;
        } else {
            this.slidesPerView = 4;
            this.slideWidth = 285;
            this.slideGap = 24;
        }
        
        // Calculate max index (how far we can slide)
        this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        
        // Ensure current index is valid
        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
        
        console.log(`${this.containerId} dimensions:`, {
            viewport,
            slidesPerView: this.slidesPerView,
            maxIndex: this.maxIndex,
            totalSlides: this.totalSlides
        });
    }

    checkIfShouldCenter() {
        this.shouldCenter = this.totalSlides <= this.slidesPerView;
        console.log(`${this.containerId} shouldCenter:`, this.shouldCenter);
    }

    // ===========================================
    // CENTERING MODE (when all slides fit)
    // ===========================================
    
    centerSlides() {
        console.log(`Centering slides for ${this.containerId}`);
        
        // Add centering styles
        this.wrapper.style.display = 'flex';
        this.wrapper.style.justifyContent = 'center';
        this.wrapper.style.overflow = 'visible';
        
        this.container.style.display = 'flex';
        this.container.style.justifyContent = 'center';
        this.container.style.flexWrap = 'wrap';
        this.container.style.gap = '1.5rem';
        this.container.style.width = 'auto';
        this.container.style.transform = 'none';
        this.container.style.cursor = 'default';
        
        // Hide any existing navigation
        this.hideNavigation();
    }

    // ===========================================
    // SLIDER MODE (when slides need navigation)
    // ===========================================
    
    setupSlider() {
        console.log(`Setting up slider mode for ${this.containerId}`);
        
        // Reset container styles
        this.wrapper.style.display = '';
        this.wrapper.style.justifyContent = '';
        this.wrapper.style.overflow = 'hidden';
        
        this.container.style.display = 'flex';
        this.container.style.justifyContent = '';
        this.container.style.flexWrap = '';
        this.container.style.gap = `${this.slideGap}px`;
        this.container.style.width = 'max-content';
        this.container.style.cursor = 'grab';
        this.container.style.transition = 'transform 0.3s ease';
        
        // Create navigation
        this.createArrows();
        this.createDots();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Position slider
        this.updateSliderPosition();
    }

    // ===========================================
    // NAVIGATION CREATION
    // ===========================================
    
    createArrows() {
        // Remove existing arrows
        this.wrapper.querySelectorAll('.unified-slider-btn').forEach(btn => btn.remove());
        
        // Previous button
        this.prevBtn = document.createElement('button');
        this.prevBtn.className = 'unified-slider-btn prev';
        this.prevBtn.textContent = '‹';
        this.prevBtn.setAttribute('aria-label', 'Previous slide');
        
        // Next button
        this.nextBtn = document.createElement('button');
        this.nextBtn.className = 'unified-slider-btn next';
        this.nextBtn.textContent = '›';
        this.nextBtn.setAttribute('aria-label', 'Next slide');
        
        // Add to wrapper
        this.wrapper.appendChild(this.prevBtn);
        this.wrapper.appendChild(this.nextBtn);
        
        console.log(`Created arrows for ${this.containerId}`);
    }

    createDots() {
        // Remove existing dots
        const existingDots = this.section?.querySelector('.unified-slider-dots');
        if (existingDots) {
            existingDots.remove();
        }
        
        // Create dots container
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'unified-slider-dots';
        
        // Create dots (one for each possible position)
        const totalPositions = this.maxIndex + 1;
        for (let i = 0; i < totalPositions; i++) {
            const dot = document.createElement('button');
            dot.className = `unified-slider-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to position ${i + 1}`);
            dot.dataset.index = i;
            this.dotsContainer.appendChild(dot);
        }
        
        // Add to section
        if (this.section) {
            this.section.appendChild(this.dotsContainer);
        }
        
        console.log(`Created ${totalPositions} dots for ${this.containerId}`);
    }

    // ===========================================
    // EVENT LISTENERS
    // ===========================================
    
    setupEventListeners() {
        // Arrow clicks
        this.prevBtn?.addEventListener('click', () => this.goToPrevious());
        this.nextBtn?.addEventListener('click', () => this.goToNext());
        
        // Dot clicks
        this.dotsContainer?.addEventListener('click', (e) => {
            if (e.target.classList.contains('unified-slider-dot')) {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index);
            }
        });
        
        // Touch/Mouse events
        this.setupTouchEvents();
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.goToPrevious();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.goToNext();
            }
        });
    }

    setupTouchEvents() {
        // Prevent default dragging behavior
        this.container.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Mouse events
        this.container.addEventListener('mousedown', (e) => this.handleTouchStart(e));
        document.addEventListener('mousemove', (e) => this.handleTouchMove(e));
        document.addEventListener('mouseup', (e) => this.handleTouchEnd(e));
        
        // Touch events
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Click prevention during drag
        this.container.addEventListener('click', (e) => {
            if (this.hasMoved) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);
    }

    // ===========================================
    // TOUCH/DRAG HANDLING
    // ===========================================
    
    handleTouchStart(e) {
        if (this.shouldCenter || this.isAnimating) return;
        
        // FIXED: Check if click/touch is on actual slide content
        const targetElement = e.target.closest('.unified-slide');
        if (!targetElement) {
            console.log(`${this.containerId} - Touch start on empty space, ignoring`);
            return; // Don't start drag if not touching a slide
        }
        
        this.isDragging = true;
        this.hasMoved = false;
        this.startX = this.getEventX(e);
        this.startTranslate = this.currentTranslate;
        
        // Disable transition during drag
        this.container.style.transition = 'none';
        this.container.style.cursor = 'grabbing';
        
        // Disable link clicking during potential drag
        this.disableLinks();
        
        console.log(`${this.containerId} - Touch start:`, { startX: this.startX, startTranslate: this.startTranslate });
    }

    handleTouchMove(e) {
        if (!this.isDragging || this.shouldCenter) return;
        
        const currentX = this.getEventX(e);
        const deltaX = currentX - this.startX;
        
        // Check if user has moved enough to consider this a drag
        if (!this.hasMoved && Math.abs(deltaX) > this.minMoveDistance) {
            this.hasMoved = true;
            e.preventDefault(); // Prevent scrolling only after confirming drag
        }
        
        if (this.hasMoved) {
            e.preventDefault();
            
            // Calculate new position
            let newTranslate = this.startTranslate + deltaX;
            
            // FIXED: Stricter boundaries - prevent any movement beyond content
            const maxTranslate = 0; // Can't slide right beyond first slide
            const minTranslate = -(this.maxIndex * (this.slideWidth + this.slideGap)); // Can't slide left beyond last slide
            
            // FIXED: Add extra boundary check for end of content
            if (this.currentIndex >= this.maxIndex && deltaX < 0) {
                // At end of slides, don't allow further left movement
                newTranslate = Math.max(newTranslate, minTranslate);
                // Add resistance when trying to drag beyond
                newTranslate = minTranslate + (newTranslate - minTranslate) * 0.1;
            } else if (this.currentIndex <= 0 && deltaX > 0) {
                // At beginning of slides, don't allow further right movement
                newTranslate = Math.min(newTranslate, maxTranslate);
                // Add resistance when trying to drag beyond
                newTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.1;
            } else {
                // Normal boundary enforcement
                newTranslate = Math.max(minTranslate, Math.min(maxTranslate, newTranslate));
            }
            
            // Update position
            this.currentTranslate = newTranslate;
            this.container.style.transform = `translateX(${newTranslate}px)`;
        }
    }

    handleTouchEnd(e) {
        if (!this.isDragging || this.shouldCenter) return;
        
        this.isDragging = false;
        this.container.style.cursor = 'grab';
        this.container.style.transition = 'transform 0.3s ease';
        
        // Re-enable links after a delay
        setTimeout(() => {
            this.enableLinks();
            this.hasMoved = false;
        }, 100);
        
        if (this.hasMoved) {
            // Snap to nearest slide
            const slideStep = this.slideWidth + this.slideGap;
            const nearestIndex = Math.round(-this.currentTranslate / slideStep);
            const targetIndex = Math.max(0, Math.min(nearestIndex, this.maxIndex));
            
            console.log(`${this.containerId} - Touch end snap:`, {
                currentTranslate: this.currentTranslate,
                nearestIndex,
                targetIndex
            });
            
            this.goToSlide(targetIndex);
        }
    }

    getEventX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }

    // ===========================================
    // LINK MANAGEMENT
    // ===========================================
    
    disableLinks() {
        this.slides.forEach(slide => {
            const links = slide.querySelectorAll('a, button, [onclick]');
            links.forEach(link => {
                link.style.pointerEvents = 'none';
                link.dataset.wasDisabled = 'true';
            });
        });
    }

    enableLinks() {
        this.slides.forEach(slide => {
            const links = slide.querySelectorAll('a, button, [onclick]');
            links.forEach(link => {
                if (link.dataset.wasDisabled) {
                    link.style.pointerEvents = '';
                    delete link.dataset.wasDisabled;
                }
            });
        });
    }

    // ===========================================
    // NAVIGATION METHODS
    // ===========================================
    
    goToNext() {
        if (this.currentIndex >= this.maxIndex) return;
        this.goToSlide(this.currentIndex + 1);
    }

    goToPrevious() {
        if (this.currentIndex <= 0) return;
        this.goToSlide(this.currentIndex - 1);
    }

    goToSlide(index) {
        if (this.shouldCenter || this.isAnimating) return;
        
        const targetIndex = Math.max(0, Math.min(index, this.maxIndex));
        if (targetIndex === this.currentIndex) return;
        
        console.log(`${this.containerId} - Going to slide ${targetIndex} (was ${this.currentIndex})`);
        
        this.currentIndex = targetIndex;
        this.updateSliderPosition();
        this.updateNavigation();
        
        // Brief animation lock
        this.isAnimating = true;
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }

    updateSliderPosition() {
        const slideStep = this.slideWidth + this.slideGap;
        this.currentTranslate = -(this.currentIndex * slideStep);
        this.container.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    // ===========================================
    // NAVIGATION UPDATES
    // ===========================================
    
    updateNavigation() {
        this.updateArrows();
        this.updateDots();
    }

    updateArrows() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        // FIXED: Smart arrow behavior for ALL screen sizes (desktop + responsive)
        
        // Previous button - hide at start position
        if (this.currentIndex <= 0) {
            this.prevBtn.style.opacity = '0';
            this.prevBtn.style.pointerEvents = 'none';
            this.prevBtn.disabled = true;
            this.prevBtn.setAttribute('data-hidden', 'true');
            
            // Smooth hide animation
            this.prevBtn.style.transform = 'translateY(-50%) scale(0.8)';
        } else {
            this.prevBtn.style.opacity = '0.9';
            this.prevBtn.style.pointerEvents = 'auto';
            this.prevBtn.disabled = false;
            this.prevBtn.setAttribute('data-hidden', 'false');
            
            // Smooth show animation
            this.prevBtn.style.transform = 'translateY(-50%) scale(1)';
        }
        
        // Next button - hide at end position
        if (this.currentIndex >= this.maxIndex) {
            this.nextBtn.style.opacity = '0';
            this.nextBtn.style.pointerEvents = 'none';
            this.nextBtn.disabled = true;
            this.nextBtn.setAttribute('data-hidden', 'true');
            
            // Smooth hide animation
            this.nextBtn.style.transform = 'translateY(-50%) scale(0.8)';
        } else {
            this.nextBtn.style.opacity = '0.9';
            this.nextBtn.style.pointerEvents = 'auto';
            this.nextBtn.disabled = false;
            this.nextBtn.setAttribute('data-hidden', 'false');
            
            // Smooth show animation
            this.nextBtn.style.transform = 'translateY(-50%) scale(1)';
        }
        
        console.log(`${this.containerId} - Arrow states:`, {
            currentIndex: this.currentIndex,
            maxIndex: this.maxIndex,
            prevHidden: this.currentIndex <= 0,
            nextHidden: this.currentIndex >= this.maxIndex
        });
    }

    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.unified-slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    hideNavigation() {
        // Hide arrows
        this.wrapper.querySelectorAll('.unified-slider-btn').forEach(btn => {
            btn.style.display = 'none';
        });
        
        // Hide dots
        const dots = this.section?.querySelector('.unified-slider-dots');
        if (dots) {
            dots.style.display = 'none';
        }
    }

    showNavigation() {
        // Show arrows
        this.wrapper.querySelectorAll('.unified-slider-btn').forEach(btn => {
            btn.style.display = 'flex';
        });
        
        // Show dots
        const dots = this.section?.querySelector('.unified-slider-dots');
        if (dots) {
            dots.style.display = 'flex';
        }
    }

    // ===========================================
    // RESIZE HANDLING
    // ===========================================
    
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        console.log(`${this.containerId} - Handling resize`);
        
        const oldShouldCenter = this.shouldCenter;
        
        // Recalculate dimensions
        this.calculateDimensions();
        this.checkIfShouldCenter();
        
        // Check if centering mode changed
        if (this.shouldCenter !== oldShouldCenter) {
            if (this.shouldCenter) {
                this.centerSlides();
            } else {
                this.setupSlider();
            }
        } else if (!this.shouldCenter) {
            // Update existing slider
            this.container.style.gap = `${this.slideGap}px`;
            this.createArrows(); // Recreate to ensure proper event binding
            this.createDots();
            this.setupEventListeners();
            this.updateSliderPosition();
            this.updateNavigation();
        }
    }

    // ===========================================
    // PUBLIC API
    // ===========================================
    
    next() {
        this.goToNext();
    }

    previous() {
        this.goToPrevious();
    }

    goTo(index) {
        this.goToSlide(index);
    }

    destroy() {
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        
        // Remove navigation elements
        this.wrapper.querySelectorAll('.unified-slider-btn').forEach(btn => btn.remove());
        this.section?.querySelector('.unified-slider-dots')?.remove();
        
        // Reset styles
        this.container.style.transform = '';
        this.container.style.transition = '';
        this.container.style.cursor = '';
        
        // Re-enable links
        this.enableLinks();
        
        console.log(`Destroyed slider: ${this.containerId}`);
    }
}

// ===========================================
// SLIDER MANAGER
// ===========================================

class SliderManager {
    constructor() {
        this.sliders = new Map();
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeSliders());
        } else {
            this.initializeSliders();
        }

        this.initialized = true;
    }

    initializeSliders() {
        const sliderIds = [
            'toursSlider',
            'packagesNewSlider', 
            'privateNewSlider',
            'driverNewSlider'
        ];

        sliderIds.forEach(id => {
            const slider = new CleanSlider(id);
            if (slider.container) {
                this.sliders.set(id, slider);
            }
        });

        console.log(`Initialized ${this.sliders.size} clean sliders`);
    }

    getSlider(id) {
        return this.sliders.get(id);
    }

    destroyAll() {
        this.sliders.forEach(slider => slider.destroy());
        this.sliders.clear();
    }
}

// ===========================================
// INITIALIZE
// ===========================================

// Create global manager
const cleanSliderManager = new SliderManager();
cleanSliderManager.init();

// Export for global access
window.CleanSlider = CleanSlider;
window.cleanSliderManager = cleanSliderManager;

// Legacy compatibility
window.sliderManager = cleanSliderManager;