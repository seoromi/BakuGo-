// Optimized Search functionality with smart navigation
const destinations = [
    // {
    //     name: 'Шеки',
    //     keyword: 'sheki',
    //     description: 'Дворец ханов, шелковый путь, горные пейзажи',
    //     icon: '🏰',
    //     page: 'destinations/sheki.html'
    // },
    {
        name: 'Габала',
        keyword: 'gabala',
        description: 'Горы, озера, канатная дорога, активный отдых',
        icon: '🏔️',
        page: 'destinations/html-pages/qabala.html'
    },
    {
        name: 'Гобустан',
        keyword: 'gobustan',
        description: 'Наскальные рисунки, грязевые вулканы',
        icon: '🗿',
        page: 'destinations/html-pages/gobustan.html'
    },
    {
        name: 'Атешгях',
        keyword: 'ateshgah',
        description: 'Храм огня, зороастрийские традиции',
        icon: '🔥',
        page: 'destinations/html-pages/ateshgah.html'
    },
    {
        name: 'Шемахи',
        keyword: 'shamakhi',
        description: 'Винодельни, мечети, танцевальные традиции',
        icon: '🕌',
        page: 'destinations/html-pages/shamahi.html'
    },
    {
        name: 'Баку - Старый город',
        keyword: 'baku',
        description: 'Ичери шехер, Девичья башня, история',
        icon: '🏛️',
        page: 'destinations/html-pages/oldcity.html'
    },
    {
        name: 'Куба',
        keyword: 'quba',
        description: 'Горные пейзажи, яблочные сады, природа',
        icon: '🍎',
        page: 'destinations/html-pages/quba.html'
    },
    {
        name: 'Лянкяран',
        keyword: 'lankaran',
        description: 'Чайные плантации, субтропики, Каспий',
        icon: '🌿',
        page: 'destinations/html-pages/lankaran.html'
    },
   
    
    {
        name: 'Групповые туры',
        keyword: 'group',
        description: 'Ежедневные экскурсии с гидом',
        icon: '👥',
        page: 'all-tours.html?type=group'
    },
    {
        name: 'Частные туры',
        keyword: 'private',
        description: 'Индивидуальные экскурсии',
        icon: '🚗',
        page: 'all-tours.html?type=private'
    },
    {
        name: 'Туры с водителем',
        keyword: 'driver',
        description: 'Комфортные поездки без гида',
        icon: '🚙',
        page: 'all-tours.html?type=driver'
    },
    {
        name: 'Турпакеты',
        keyword: 'packages',
        description: 'Многодневные туры по Азербайджану',
        icon: '🎒',
        page: 'all-tours.html?type=package'
    }
];

// Get DOM elements
const searchInput = document.getElementById('searchInput');
const suggestionsDiv = document.getElementById('suggestions');
const searchContainer = document.getElementById('searchContainer');

// Check if elements exist before proceeding
if (!searchInput || !suggestionsDiv || !searchContainer) {
    console.warn('Search elements not found on this page');
} else {
    initializeSearch();
}

function initializeSearch() {
    // Show suggestions with improved UX
    function showSuggestions(filteredDestinations) {
        if (filteredDestinations.length === 0) {
            suggestionsDiv.innerHTML = `
                <div class="no-results">
                    <div style="padding: 20px; text-align: center; color: #666;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">🔍</div>
                        <div>Направление не найдено</div>
                        <div style="font-size: 0.9rem; margin-top: 5px; opacity: 0.7;">
                            Попробуйте другой запрос
                        </div>
                    </div>
                </div>
            `;
        } else {
            suggestionsDiv.innerHTML = filteredDestinations.map(dest => `
                <div class="suggestion-item" onclick="selectDestination('${dest.page}', '${dest.name}')" data-keyword="${dest.keyword}">
                    <span class="suggestion-icon">${dest.icon}</span>
                    <div class="suggestion-text">
                        <div class="suggestion-name">${dest.name}</div>
                        <div class="suggestion-description">${dest.description}</div>
                    </div>
                </div>
            `).join('');
            
            // Add keyboard navigation
            addKeyboardNavigation();
        }
        
        suggestionsDiv.classList.add('show');
    }

    function hideSuggestions() {
        setTimeout(() => {
            suggestionsDiv.classList.remove('show');
        }, 200);
    }

    // Smart search with multiple criteria
    function smartSearch(query) {
        if (!query) return destinations;
        
        const lowerQuery = query.toLowerCase().trim();
        
        return destinations.filter(dest => {
            // Priority matching
            const nameMatch = dest.name.toLowerCase().includes(lowerQuery);
            const keywordMatch = dest.keyword.toLowerCase().includes(lowerQuery);
            const descriptionMatch = dest.description.toLowerCase().includes(lowerQuery);
            
            // Fuzzy matching for common typos
            const similarKeyword = calculateSimilarity(lowerQuery, dest.keyword.toLowerCase()) > 0.6;
            const similarName = calculateSimilarity(lowerQuery, dest.name.toLowerCase()) > 0.6;
            
            return nameMatch || keywordMatch || descriptionMatch || similarKeyword || similarName;
        }).sort((a, b) => {
            // Sort by relevance - exact matches first
            const aExact = a.name.toLowerCase().startsWith(lowerQuery) || a.keyword.toLowerCase().startsWith(lowerQuery);
            const bExact = b.name.toLowerCase().startsWith(lowerQuery) || b.keyword.toLowerCase().startsWith(lowerQuery);
            
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return 0;
        });
    }

    // Simple similarity calculator for fuzzy matching
    function calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        return (longer.length - editDistance(longer, shorter)) / longer.length;
    }

    function editDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    // Keyboard navigation for suggestions
    let selectedIndex = -1; // Move selectedIndex to function scope
    
    function addKeyboardNavigation() {
        const items = suggestionsDiv.querySelectorAll('.suggestion-item');
        
        searchInput.addEventListener('keydown', function(e) {
            if (!suggestionsDiv.classList.contains('show')) return;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                    updateSelection(items);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    updateSelection(items);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && items[selectedIndex]) {
                        items[selectedIndex].click();
                    } else if (searchInput.value.trim()) {
                        // Generic search if no suggestion selected
                        window.location.href = `all-tours.html?search=${encodeURIComponent(searchInput.value.trim())}`;
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    hideSuggestions();
                    searchInput.blur();
                    selectedIndex = -1;
                    break;
            }
        });
    }
    
    function updateSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });
        
        // Scroll selected item into view
        if (selectedIndex >= 0 && items[selectedIndex]) {
            items[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    // Event Listeners
    searchInput.addEventListener('focus', function() {
        const query = this.value.trim();
        const filteredDestinations = smartSearch(query);
        showSuggestions(filteredDestinations);
        selectedIndex = -1; // Reset selection
    });

    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        const filteredDestinations = smartSearch(query);
        showSuggestions(filteredDestinations);
        selectedIndex = -1; // Reset selection
    });

    searchInput.addEventListener('blur', function() {
        // Small delay to allow click events to fire
        setTimeout(() => {
            hideSuggestions();
            selectedIndex = -1;
        }, 200);
    });

    // Search icon click
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                // Perform search or navigate to first result
                const filteredDestinations = smartSearch(query);
                if (filteredDestinations.length > 0) {
                    selectDestination(filteredDestinations[0].page, filteredDestinations[0].name);
                } else {
                    // Generic search
                    window.location.href = `all-tours.html?search=${encodeURIComponent(query)}`;
                }
            } else {
                // Show all suggestions if empty
                searchInput.focus();
                showSuggestions(destinations);
            }
        });
    }

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            hideSuggestions();
            selectedIndex = -1;
        }
    });

    // Mobile scroll behavior
    let lastScrollTop = 0;
    let scrollTimeout;

    if (window.innerWidth <= 768) {
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                
                if (currentScroll > lastScrollTop && currentScroll > 200) {
                    // Scrolling down - hide search
                    searchContainer.classList.add('hidden');
                    hideSuggestions();
                } else {
                    // Scrolling up - show search
                    searchContainer.classList.remove('hidden');
                }
                
                lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            }, 100);
        });
    }

    // Quick action buttons integration
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find matching destination
            const btnText = this.textContent.trim();
            const destination = destinations.find(dest => 
                dest.name.toLowerCase().includes(btnText.toLowerCase()) ||
                dest.keyword.toLowerCase() === btnText.toLowerCase()
            );
            
            if (destination) {
                selectDestination(destination.page, destination.name);
            } else {
                // Fallback to original onclick behavior
                const onclick = this.getAttribute('onclick');
                if (onclick) {
                    eval(onclick);
                }
            }
        });
    });
}

// Navigation function with analytics tracking
function selectDestination(page, name) {
    // Hide suggestions
    if (suggestionsDiv) {
        suggestionsDiv.classList.remove('show');
    }
    
    // Optional: Track search analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'search', {
            'search_term': name,
            'event_category': 'destination_search'
        });
    }
    
    // Navigate to destination
    try {
        window.location.href = page;
    } catch (error) {
        console.error('Navigation error:', error);
        // Fallback navigation
        window.location.href = 'all-tours.html';
    }
}

// CSS for keyboard navigation (add this to your CSS file)
const keyboardNavCSS = `
.suggestion-item.selected {
    background: linear-gradient(135deg, var(--secondary-color) 0%, #ff9f1a 100%) !important;
    color: white !important;
    transform: translateX(8px);
}

.suggestion-item.selected .suggestion-name,
.suggestion-item.selected .suggestion-description {
    color: white !important;
}

.suggestion-item.selected .suggestion-icon {
    background: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
}
`;

// Inject CSS if not already present
if (!document.getElementById('keyboard-nav-styles')) {
    const style = document.createElement('style');
    style.id = 'keyboard-nav-styles';
    style.textContent = keyboardNavCSS;
    document.head.appendChild(style);
}