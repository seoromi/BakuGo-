// destination.js - JavaScript for individual destination pages

document.addEventListener('DOMContentLoaded', function() {
    
    // NEW: Handle URL parameters for destination routing
    const destination = getUrlParameter('destination');
    if (destination) {
        loadDestinationContent(destination);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Plan visit button functionality
    const visitBtn = document.querySelector('.visit-btn');
    if (visitBtn) {
        visitBtn.addEventListener('click', function() {
            alert('Visit planning feature coming soon!\n\nWe will help you:\n• Book guided tours\n• Arrange transportation\n• Find nearby accommodations\n• Create custom itineraries');
        });
    }

    // Gallery image click to view larger (optional enhancement)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const bgImage = this.querySelector('.gallery-img').style.backgroundImage;
            const imageUrl = bgImage.slice(5, -2); // Remove 'url("' and '")'
            
            // Simple image viewer (you can enhance this)
            const viewer = document.createElement('div');
            viewer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                cursor: pointer;
            `;
            
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 10px;';
            
            viewer.appendChild(img);
            document.body.appendChild(viewer);
            
            viewer.addEventListener('click', () => {
                document.body.removeChild(viewer);
            });
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('.gallery-img, .hero');
    images.forEach(img => {
        img.style.opacity = '0.7';
        img.style.transition = 'opacity 0.3s ease';
        
        // Simulate image load (you can enhance this with actual image load detection)
        setTimeout(() => {
            img.style.opacity = '1';
        }, 100);
    });

});

// NEW: Function to load destination content based on URL parameter
function loadDestinationContent(destination) {
    console.log('Loading destination:', destination);
    
    // Define destination data
    const destinations = {
        'sheki': {
            url: 'destinations/sheki.html',
            name: 'Sheki'
        },
        'quba': {
            url: 'destinations/quba.html', 
            name: 'Quba'
        },
        'qabala': {
            url: 'destinations/qabala.html',
            name: 'Qabala'
        },
        'qobustan': {
            url: 'destinations/qobustan.html',
            name: 'Qobustan'
        },
        'shamahi': {
            url: 'destinations/shamahi.html',
            name: 'Shamahi'
        }
    };
    
    // Check if destination exists
    if (destinations[destination.toLowerCase()]) {
        const destData = destinations[destination.toLowerCase()];
        
        // Redirect to the actual destination page
        window.location.href = destData.url;
    } else {
        console.error('Destination not found:', destination);
        // Fallback - could redirect to a "not found" page or show error
        alert(`Destination "${destination}" not found. Available destinations: ${Object.keys(destinations).join(', ')}`);
    }
}

// Utility function to get URL parameter (useful for dynamic content)
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

