// DOM Content Loaded initialization
document.addEventListener('DOMContentLoaded', function () {
    // Hide loading overlay if it exists
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 1000);
    }
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
            .then(function (registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function (registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance monitoring
window.addEventListener('load', function () {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');

        // Send analytics (in a real app, you'd send this to your analytics service)
        if (loadTime > 3000) {
            console.warn('Page load time is slow:', loadTime + 'ms');
        }
    }
});

// Error handling
window.addEventListener('error', function (e) {
    console.error('JavaScript error:', e.error);
    // In a real app, you'd send error reports to your error tracking service
});

window.addEventListener('unhandledrejection', function (e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In a real app, you'd send error reports to your error tracking service
});

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Back to top button functionality
const backToTopBtn = document.querySelector('.back-to-top-btn');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
        // Show scrolling feedback
        this.innerHTML = '<span class="icon">⏫</span><span>Возвращаемся...</span>';
        
        scrollToTop();
        
        setTimeout(() => {
            this.innerHTML = '<span class="icon">🏠</span><span>Вернуться к началу</span>';
        }, 1000);
    });
}

// Keyboard accessibility for scroll to top
document.addEventListener('keydown', function(e) {
    if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        scrollToTop();
    }
});

