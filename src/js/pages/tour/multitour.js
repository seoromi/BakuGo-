// New Sliders functionality for three additional sliders
const newSliders = {
    packagesNewSlider: { currentSlide: 0, slidesToShow: 4, totalSlides: 7 }, // You have 8 slides
    privateNewSlider: { currentSlide: 0, slidesToShow: 4, totalSlides: 6 },   // You have 5 slides
    driverNewSlider: { currentSlide: 0, slidesToShow: 4, totalSlides: 4 }     // You have 5 slides
};

function initializeNewSliders() {
    Object.keys(newSliders).forEach(sliderId => {
        updateNewSlider(sliderId);
        createNewDots(sliderId);
    });
}

function moveNewSlider(sliderId, direction) {
    const slider = newSliders[sliderId];
    const maxSlide = Math.max(0, slider.totalSlides - slider.slidesToShow);

    slider.currentSlide += direction;

    if (slider.currentSlide < 0) {
        slider.currentSlide = maxSlide;
    } else if (slider.currentSlide > maxSlide) {
        slider.currentSlide = 0;
    }

    updateNewSlider(sliderId);
    updateNewDots(sliderId);
}

function updateNewSlider(sliderId) {
    const container = document.getElementById(sliderId);
    if (!container) return;

    const slider = newSliders[sliderId];
    const slideWidth = 285 + 24; // slide width + gap
    const translateX = -slider.currentSlide * slideWidth;

    container.style.transform = `translateX(${translateX}px)`;
}

function createNewDots(sliderId) {
    const slider = newSliders[sliderId];
    const dotsContainer = document.getElementById(sliderId.replace('Slider', 'Dots'));
    if (!dotsContainer) return;

    const maxSlide = Math.max(0, slider.totalSlides - slider.slidesToShow);

    dotsContainer.innerHTML = '';

    for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('div');
        dot.className = 'new-slider-dot';
        if (i === slider.currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => goToNewSlide(sliderId, i));
        dotsContainer.appendChild(dot);
    }
}

function updateNewDots(sliderId) {
    const dotsContainer = document.getElementById(sliderId.replace('Slider', 'Dots'));
    if (!dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.new-slider-dot');

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === newSliders[sliderId].currentSlide);
    });
}

function goToNewSlide(sliderId, slideIndex) {
    newSliders[sliderId].currentSlide = slideIndex;
    updateNewSlider(sliderId);
    updateNewDots(sliderId);
}

// Auto-play functionality for new sliders
// function startNewAutoPlay() {
//     Object.keys(newSliders).forEach((sliderId, index) => {
//         setInterval(() => {
//             moveNewSlider(sliderId, 1);
//         }, 6000 + (index * 1000)); // Different intervals: 6s, 7s, 8s
//     });
// }

// Responsive handling for new sliders
function handleNewResize() {
    const width = window.innerWidth;
    Object.keys(newSliders).forEach(sliderId => {
        if (width <= 480) {
            newSliders[sliderId].slidesToShow = 1;
        } else if (width <= 768) {
            newSliders[sliderId].slidesToShow = 2;
        } else if (width <= 1024) {
            newSliders[sliderId].slidesToShow = 3;
        } else {
            newSliders[sliderId].slidesToShow = 4;
        }

        // Reset to first slide and update
        newSliders[sliderId].currentSlide = 0;
        updateNewSlider(sliderId);
        createNewDots(sliderId);
    });
}

// Touch/swipe support for new sliders
let newStartX = 0;
let currentNewSliderId = '';

document.addEventListener('touchstart', (e) => {
    newStartX = e.touches[0].clientX;
    const slider = e.target.closest('.new-tours-slider-container');
    if (slider) {
        currentNewSliderId = slider.id;
    }
});

document.addEventListener('touchend', (e) => {
    if (!currentNewSliderId) return;

    const endX = e.changedTouches[0].clientX;
    const diff = newStartX - endX;

    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            moveNewSlider(currentNewSliderId, 1);
        } else {
            moveNewSlider(currentNewSliderId, -1);
        }
    }

    currentNewSliderId = '';
});

// Initialize new sliders on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure DOM is fully loaded
    setTimeout(() => {
        initializeNewSliders();
        handleNewResize();
        startNewAutoPlay();
    }, 100);
});

// Handle window resize for new sliders
window.addEventListener('resize', handleNewResize);

// Keyboard navigation for new sliders
document.addEventListener('keydown', (e) => {
    const focusedSlider = document.querySelector('.new-tours-slider-wrapper:hover .new-tours-slider-container');
    if (focusedSlider) {
        if (e.key === 'ArrowLeft') {
            moveNewSlider(focusedSlider.id, -1);
        } else if (e.key === 'ArrowRight') {
            moveNewSlider(focusedSlider.id, 1);
        }
    }
});

// Pause auto-play on hover for new sliders
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.new-tours-slider-wrapper').forEach(wrapper => {
            let autoPlayInterval;
            const sliderId = wrapper.querySelector('.new-tours-slider-container')?.id;

            if (sliderId) {
                wrapper.addEventListener('mouseenter', () => {
                    clearInterval(autoPlayInterval);
                });

                wrapper.addEventListener('mouseleave', () => {
                    autoPlayInterval = setInterval(() => {
                        moveNewSlider(sliderId, 1);
                    }, 6000);
                });
            }
        });
    }, 200);
});