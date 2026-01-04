// =====================================================
// LANGUAGE SWITCHER FUNCTIONALITY
// =====================================================

class LanguageSwitcher {
    constructor() {
        this.currentLang = 'ru'; // Default language
        this.languageBtn = document.getElementById('languageBtn');
        this.languageDropdown = document.getElementById('languageDropdown');
        this.sideLanguageBtn = document.getElementById('sideLanguageBtn');
        this.sideLanguageDropdown = document.getElementById('sideLanguageDropdown');
        this.currentLangSpan = document.querySelector('.current-lang');
        this.langOptions = document.querySelectorAll('.lang-option');
        this.sideMenuLangOptions = document.querySelectorAll('.side-menu-lang-option');
        
        this.init();
    }

    init() {
        // Load saved language preference
        this.loadLanguagePreference();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initialize the UI
        this.updateUI();
    }

    addEventListeners() {
        // Toggle dropdown on main button click (if exists)
        if (this.languageBtn) {
            this.languageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        // Toggle dropdown on side menu button click
        if (this.sideLanguageBtn) {
            this.sideLanguageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSideDropdown();
            });
        }

        // Handle language option clicks
        this.langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedLang = option.getAttribute('data-lang');
                this.switchLanguage(selectedLang);
            });
        });

        // Handle side menu language option clicks
        this.sideMenuLangOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedLang = option.getAttribute('data-lang');
                this.switchLanguage(selectedLang);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.languageBtn && this.languageDropdown && 
                !this.languageBtn.contains(e.target) && !this.languageDropdown.contains(e.target)) {
                this.closeDropdown();
            }
            if (this.sideLanguageBtn && this.sideLanguageDropdown && 
                !this.sideLanguageBtn.contains(e.target) && !this.sideLanguageDropdown.contains(e.target)) {
                this.closeSideDropdown();
            }
        });

        // Handle keyboard navigation
        if (this.languageBtn) {
            this.languageBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDropdown();
                }
            });
        }

        if (this.sideLanguageBtn) {
            this.sideLanguageBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleSideDropdown();
                }
            });
        }

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown();
                this.closeSideDropdown();
            }
        });
    }

    toggleDropdown() {
        const isActive = this.languageDropdown.classList.contains('active');
        
        if (isActive) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        this.languageDropdown.classList.add('active');
        this.languageBtn.classList.add('active');
        this.languageBtn.setAttribute('aria-expanded', 'true');
        
        // Add focus to first option for accessibility
        const firstOption = this.languageDropdown.querySelector('.lang-option');
        if (firstOption) {
            firstOption.focus();
        }
    }

    closeDropdown() {
        if (this.languageDropdown && this.languageBtn) {
            this.languageDropdown.classList.remove('active');
            this.languageBtn.classList.remove('active');
            this.languageBtn.setAttribute('aria-expanded', 'false');
        }
    }

    toggleSideDropdown() {
        if (!this.sideLanguageDropdown) return;
        
        const isActive = this.sideLanguageDropdown.classList.contains('active');
        
        if (isActive) {
            this.closeSideDropdown();
        } else {
            this.openSideDropdown();
        }
    }

    openSideDropdown() {
        if (!this.sideLanguageDropdown || !this.sideLanguageBtn) return;
        
        this.sideLanguageDropdown.classList.add('active');
        this.sideLanguageBtn.classList.add('active');
        this.sideLanguageBtn.setAttribute('aria-expanded', 'true');
        
        // Add focus to first option for accessibility
        const firstOption = this.sideLanguageDropdown.querySelector('.lang-option');
        if (firstOption) {
            firstOption.focus();
        }
    }

    closeSideDropdown() {
        if (this.sideLanguageDropdown && this.sideLanguageBtn) {
            this.sideLanguageDropdown.classList.remove('active');
            this.sideLanguageBtn.classList.remove('active');
            this.sideLanguageBtn.setAttribute('aria-expanded', 'false');
        }
    }

    switchLanguage(lang) {
        if (lang === this.currentLang) {
            this.closeDropdown();
            this.closeSideDropdown();
            return;
        }

        // Update current language
        this.currentLang = lang;
        
        // Save preference to localStorage
        this.saveLanguagePreference();
        
        // Update UI
        this.updateUI();
        
        // Close both dropdowns
        this.closeDropdown();
        this.closeSideDropdown();
        
        // Trigger language change event
        this.triggerLanguageChange();
    }

    updateUI() {
        // Update current language display
        this.currentLangSpan.textContent = this.currentLang.toUpperCase();
        
        // Update active states
        this.langOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLang) {
                option.setAttribute('data-active', 'true');
            } else {
                option.setAttribute('data-active', 'false');
            }
        });

        // Update side menu active states
        this.sideMenuLangOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLang) {
                option.setAttribute('data-active', 'true');
            } else {
                option.setAttribute('data-active', 'false');
            }
        });
    }

    saveLanguagePreference() {
        try {
            localStorage.setItem('bakugotour_language', this.currentLang);
        } catch (e) {
            console.warn('Could not save language preference:', e);
        }
    }

    loadLanguagePreference() {
        try {
            const savedLang = localStorage.getItem('bakugotour_language');
            if (savedLang && (savedLang === 'ru' || savedLang === 'en' || savedLang === 'tr')) {
                this.currentLang = savedLang;
            }
        } catch (e) {
            console.warn('Could not load language preference:', e);
        }
    }

    triggerLanguageChange() {
        // Create and dispatch custom event
        const event = new CustomEvent('languageChanged', {
            detail: {
                language: this.currentLang,
                previousLanguage: this.getPreviousLanguage()
            }
        });
        
        document.dispatchEvent(event);
        
        // You can add translation logic here
        this.translatePage();
    }

    getPreviousLanguage() {
        // This would track the previous language for comparison
        return this.currentLang === 'ru' ? 'en' : 'ru';
    }

    translatePage() {
        // This is where you would implement the actual translation
        // For now, we'll just log the language change
        console.log(`Language switched to: ${this.currentLang}`);
        
        // Example translation implementation:
        if (this.currentLang === 'en') {
            this.translateToEnglish();
        } else if (this.currentLang === 'tr') {
            this.translateToTurkish();
        } else {
            this.translateToRussian();
        }
    }

    translateToEnglish() {
        // Example translations - you can expand this
        const translations = {
            'hero-title': 'Best Tours in Baku Azerbaijan',
            'hero-subtitle': 'Discover the beauty and culture of the ancient city with our professional guides',
            'search-title': 'Find Your Perfect Tour',
            'search-placeholder': 'Search destinations, tours, or activities...',
            'explore-btn': 'Explore✨',
            // Add more translations as needed
        };

        this.applyTranslations(translations);
    }

    translateToRussian() {
        // Example translations - you can expand this
        const translations = {
            'hero-title': 'Лучшие туры в Баку Азербайджан',
            'hero-subtitle': 'Откройте для себя красоту и культуру древнего города с нашими профессиональными гидами',
            'search-title': 'Найдите свой идеальный тур',
            'search-placeholder': 'Поиск направлений, туров или активностей...',
            'explore-btn': 'Исследовать✨',
            // Add more translations as needed
        };

        this.applyTranslations(translations);
    }

    translateToTurkish() {
        // Turkish translations
        const translations = {
            'hero-title': 'Bakü Azerbaycan\'ın En İyi Turları',
            'hero-subtitle': 'Profesyonel rehberlerimizle antik şehrin güzelliğini ve kültürünü keşfedin',
            'search-title': 'Mükemmel Turunuzu Bulun',
            'search-placeholder': 'Destinasyonlar, turlar veya aktiviteler arayın...',
            'explore-btn': 'Keşfet✨',
            // Add more translations as needed
        };

        this.applyTranslations(translations);
    }

    applyTranslations(translations) {
        // Apply translations to elements with data-translate attributes
        Object.keys(translations).forEach(key => {
            const elements = document.querySelectorAll(`[data-translate="${key}"]`);
            elements.forEach(element => {
                if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            });
        });
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSwitcher;
} 