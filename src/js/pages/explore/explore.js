// =============================================
// BACK BUTTON FUNCTIONALITY
// =============================================
/**
 * Navigate back to tours page with loading animation
 */
function goBackToTours() {
    // Show loading indicator
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }

    // Add click animation to back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.style.transform = 'translateY(-2px) scale(0.95)';
        
        setTimeout(() => {
            backBtn.style.transform = 'translateY(-2px) scale(1)';
            
            // Try to go back in browser history
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // If no history, redirect to main tours page
                window.location.href = 'index.html'; // Change to your main page
            }
            
            // Hide loading after navigation
            setTimeout(() => {
                if (loadingOverlay) {
                    loadingOverlay.classList.remove('active');
                }
            }, 500);
        }, 150);
    }
}

/**
 * Alternative navigation functions for specific pages
 */
function goToMainPage() {
    showLoadingAndNavigate('index.html');
}

function goToAllTours() {
    showLoadingAndNavigate('all-tours.html');
}

function goToExplorePage() {
    showLoadingAndNavigate('explore.html');
}

/**
 * Helper function to show loading and navigate
 */
function showLoadingAndNavigate(url) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    window.location.href = url;
}

// =============================================
// SCROLL INDICATOR FUNCTIONALITY
// =============================================

/**
 * Update scroll indicator based on page scroll position
 */
function updateScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollIndicator.style.transform = `scaleX(${Math.max(0, Math.min(100, scrolled)) / 100})`;
    }
}

// =============================================
// HEADER BACKGROUND CHANGE
// =============================================

/**
 * Change header background on scroll
 */
function updateHeaderBackground() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    }
}

// =============================================
// SMOOTH SCROLLING FOR NAVIGATION
// =============================================

/**
 * Initialize smooth scrolling for all anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =============================================
// PLACE NAVIGATION FUNCTIONALITY (SIMPLIFIED)
// =============================================

/**
 * Handle place card navigation - now mainly for analytics/tracking
 * Since navigation is handled by href links in HTML
 * @param {string} place - Place identifier
 */
function navigateToPlace(place) {
    const placeNames = {
        'ateshgah': 'Ateshgah Fire Temple',
        'heydar-aliyev': 'Heydar Aliyev Center',
        'mud-volcanoes': 'Mud Volcanoes',
        'gobustan': 'Gobustan Rock Art',
        'yanardag': 'Yanardag - Burning Mountain',
        'tufandag': 'Tufandag Cable Car',
        'nohur-lake': 'Lake Nohur',
        'sheki-palace': 'Sheki Khan\'s Palace',
        'shirvanshah-palace': 'Shirvanshah\'s Palace',
        'maiden-tower': 'Maiden Tower',
        'candymountains': 'Candy Mountains',
        'lahic': 'Lahic',
        'lankaran': 'Lankaran',
        'oldcity': 'Icherisheher',
        'qabala': 'Qabala',
        'quba': 'Quba',
        'shahdag': 'Shahdag',
        'shamahi': 'Shamahi',
        'xinalig': 'Xinalig'
    };

    const placeName = placeNames[place] || 'Unknown Place';
    console.log(`🎯 User clicked: ${placeName}`);
    
    // Add analytics tracking here if needed
    // gtag('event', 'place_click', { place_name: placeName });
    
    // Add visual feedback for the click
    const clickedCard = event?.target?.closest('.place-card');
    if (clickedCard) {
        clickedCard.style.transform = 'translateY(-5px) scale(0.98)';
        setTimeout(() => {
            clickedCard.style.transform = 'translateY(-5px) scale(1)';
        }, 200);
    }
}

// =============================================
// ENHANCED HREF LINK HANDLING
// =============================================

/**
 * Enhance href links with loading states and analytics
 */
function initEnhancedLinkHandling() {
    // Handle all destination links
    document.querySelectorAll('a[href^="destinations/"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const loadingOverlay = document.getElementById('loadingOverlay');
            const href = this.getAttribute('href');
            
            // Show loading for destination links
            if (loadingOverlay) {
                loadingOverlay.classList.add('active');
            }
            
            // Extract destination name for analytics
            const destinationName = href.replace('destinations/', '').replace('.html', '');
            console.log(`🚀 Navigating to destination: ${destinationName}`);
            
            // Add visual feedback
            const card = this.querySelector('.place-card');
            if (card) {
                card.style.transform = 'translateY(-5px) scale(0.98)';
            }
        });
    });

    // Handle social links
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const title = this.getAttribute('title');
            console.log(`📱 Social link clicked: ${title}`);
        });
    });

    // Handle footer links
    document.querySelectorAll('footer a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                const loadingOverlay = document.getElementById('loadingOverlay');
                if (loadingOverlay) {
                    loadingOverlay.classList.add('active');
                }
            }
        });
    });
}

// =============================================
// ENTRANCE ANIMATIONS
// =============================================

/**
 * Initialize entrance animations for cards
 */
function initEntranceAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add a subtle bounce effect
                setTimeout(() => {
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, 100);
            }
        });
    }, observerOptions);

    // Observe place cards and tip cards for animation
    document.querySelectorAll('.place-card, .tip-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// =============================================
// KEYBOARD SUPPORT
// =============================================

/**
 * Handle keyboard shortcuts and navigation
 */
function initKeyboardSupport() {
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'Escape':
                goBackToTours();
                break;
            case 'Home':
                if (event.ctrlKey) {
                    event.preventDefault();
                    scrollToElement('#home');
                }
                break;
            case 'End':
                if (event.ctrlKey) {
                    event.preventDefault();
                    scrollToElement('#contact');
                }
                break;
            case '1':
                if (event.ctrlKey) {
                    event.preventDefault();
                    scrollToElement('#places');
                }
                break;
            case '2':
                if (event.ctrlKey) {
                    event.preventDefault();
                    scrollToElement('#tips');
                }
                break;
            case '3':
                if (event.ctrlKey) {
                    event.preventDefault();
                    scrollToElement('#about');
                }
                break;
        }
    });

    // Add keyboard support for place cards
    document.querySelectorAll('.place-card').forEach(card => {
        const parentLink = card.closest('a');
        if (parentLink) {
            parentLink.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    });
}

// =============================================
// LOADING STATES
// =============================================

/**
 * Manage loading overlay states
 */
function initLoadingStates() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Remove loading overlay on page load
    window.addEventListener('load', function() {
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.remove('active');
            }, 300);
        }
    });

    // Add loading overlay when navigating away
    window.addEventListener('beforeunload', function() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    });

    // Handle page visibility for better UX
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden' && loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    });
}

// =============================================
// SCROLL EVENT HANDLERS
// =============================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle all scroll events efficiently
 */
function handleScrollEvents() {
    updateScrollIndicator();
    updateHeaderBackground();
    
    // Add scroll progress to console for debugging (remove in production)
    // console.log(`📊 Scroll: ${Math.round(getScrollPercentage())}%`);
}

/**
 * Initialize scroll event listeners with debouncing
 */
function initScrollEvents() {
    const debouncedScrollHandler = debounce(handleScrollEvents, 10);
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
    
    // Handle resize for responsiveness
    window.addEventListener('resize', debounce(() => {
        updateScrollIndicator();
    }, 100));
}

// =============================================
// ENHANCED INTERACTIVE EFFECTS
// =============================================

/**
 * Add enhanced interactive effects aligned with href navigation
 */
function initInteractiveEffects() {
    // Enhanced click effects for place cards with href
    document.querySelectorAll('a[href^="destinations/"]').forEach(link => {
        const card = link.querySelector('.place-card');
        if (card) {
            // Mouse interactions
            link.addEventListener('mouseenter', function() {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.25)';
                
                const overlay = card.querySelector('.place-overlay');
                const image = card.querySelector('.place-image');
                
                if (overlay) {
                    overlay.style.transform = 'translate(-50%, -50%) scale(1.1)';
                    overlay.style.opacity = '1';
                }
                if (image) {
                    image.style.transform = 'scale(1.05)';
                }
            });
            
            link.addEventListener('mouseleave', function() {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                
                const overlay = card.querySelector('.place-overlay');
                const image = card.querySelector('.place-image');
                
                if (overlay) {
                    overlay.style.transform = 'translate(-50%, -50%) scale(1)';
                    overlay.style.opacity = '0';
                }
                if (image) {
                    image.style.transform = 'scale(1)';
                }
            });
            
            // Click feedback
            link.addEventListener('mousedown', function() {
                card.style.transform = 'translateY(-5px) scale(0.98)';
            });
            
            link.addEventListener('mouseup', function() {
                card.style.transform = 'translateY(-8px) scale(1)';
            });
        }
    });

    // Interactive effects for other elements
    document.querySelectorAll('.tip-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotate(1deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) rotate(0deg)';
        });
    });

    // CTA Button enhanced effects
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 10px 30px rgba(240, 135, 10, 0.5)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
            this.style.boxShadow = '0 8px 25px rgba(240, 135, 10, 0.4)';
        });
    });

    // Back button enhanced effects
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
        });
        
        backBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
    }
}

// =============================================
// ACCESSIBILITY IMPROVEMENTS
// =============================================

/**
 * Improve accessibility features
 */
function initAccessibility() {
    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Enhance place card accessibility
    document.querySelectorAll('a[href^="destinations/"]').forEach((link, index) => {
        const card = link.querySelector('.place-card');
        const title = card?.querySelector('.place-title')?.textContent || `Destination ${index + 1}`;
        
        link.setAttribute('aria-label', `Visit ${title} destination page`);
        link.setAttribute('tabindex', '0');
        
        // Add focus styles
        link.addEventListener('focus', function() {
            if (card) {
                card.style.outline = '3px solid #f0870a';
                card.style.outlineOffset = '2px';
            }
        });
        
        link.addEventListener('blur', function() {
            if (card) {
                card.style.outline = 'none';
            }
        });
    });

    // Add skip link for better navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#places';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #f0870a;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// =============================================
// PERFORMANCE MONITORING
// =============================================

/**
 * Log performance metrics and user interactions
 */
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                try {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('🚀 Page Performance:', {
                        loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                        totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                        scrollPosition: window.scrollY
                    });
                } catch (error) {
                    console.log('📊 Performance API not fully supported');
                }
            }, 0);
        });
    }

    // Track user interactions
    let interactionCount = 0;
    document.addEventListener('click', function(e) {
        interactionCount++;
        if (e.target.closest('.place-card')) {
            console.log(`🎯 Place card interaction #${interactionCount}`);
        }
    });
}

// =============================================
// MAIN INITIALIZATION
// =============================================

/**
 * Initialize all functionality when DOM is ready
 */
function initializeApp() {
    console.log('🔥 Initializing Explore Azerbaijan...');
    
    try {
        // Set initial header background to white
        updateHeaderBackground();
        
        // Core functionality
        initScrollEvents();
        initSmoothScrolling();
        initKeyboardSupport();
        initLoadingStates();
        
        // Enhanced href link handling
        initEnhancedLinkHandling();
        
        // Visual effects
        initEntranceAnimations();
        initInteractiveEffects();
        
        // Accessibility and monitoring
        initAccessibility();
        initPerformanceMonitoring();
        
        console.log('✅ Explore Azerbaijan initialized successfully');
        console.log('🚀 Available functions:', {
            goBackToTours: typeof goBackToTours,
            goToMainPage: typeof goToMainPage,
            goToAllTours: typeof goToAllTours,
            navigateToPlace: typeof navigateToPlace,
            updateScrollIndicator: typeof updateScrollIndicator,
            updateHeaderBackground: typeof updateHeaderBackground,
            scrollToElement: typeof scrollToElement
        });
        
        // Log current page state
        console.log('📄 Page ready:', {
            placeCards: document.querySelectorAll('.place-card').length,
            tipCards: document.querySelectorAll('.tip-card').length,
            destinationLinks: document.querySelectorAll('a[href^="destinations/"]').length
        });
        
    } catch (error) {
        console.error('❌ Error initializing app:', error);
    }
}

// =============================================
// EVENT LISTENERS
// =============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        updateScrollIndicator();
        console.log('👁️ Page became visible');
    }
});

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Utility function to check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Utility function to get scroll percentage
 */
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return Math.round((scrollTop / scrollHeight) * 100);
}

/**
 * Utility function for smooth scroll to element
 */
function scrollToElement(selector, offset = 80) {
    const element = document.querySelector(selector);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Get destination info from href
 */
function getDestinationInfo(href) {
    const destinations = {
        'destinations/ateshgah.html': 'Ateshgah Fire Temple',
        'destinations/heydaraliev.html': 'Heydar Aliyev Center',
        'destinations/mud-volcanoes.html': 'Mud Volcanoes',
        'destinations/gobustan.html': 'Gobustan Rock Art',
        'destinations/yanardag.html': 'Yanardag - Burning Mountain',
        'destinations/tufandag.html': 'Tufandag Cable Car',
        'destinations/nohur-lake.html': 'Lake Nohur',
        'destinations/shekiXan.html': 'Sheki Khan\'s Palace',
        'destinations/shirvanshah-palace.html': 'Shirvanshah\'s Palace',
        'destinations/maidentower.html': 'Maiden Tower'
    };
    
    return destinations[href] || 'Unknown Destination';
}

// =============================================
// ERROR HANDLING
// =============================================

/**
 * Global error handler
 */
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 Unhandled Promise Rejection:', e.reason);
});


