document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById("hamburger");
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.getElementById("menuOverlay");
    const menuClose = document.getElementById("menuClose");

    // Check if all required elements exist
    if (!hamburger || !sideMenu || !menuOverlay || !menuClose) {
        console.error("Navigation elements not found");
        return;
    }

    // Function to close the menu
    function closeMenu() {
        sideMenu.classList.remove("open");
        menuOverlay.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        menuOverlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("menu-open");
        hamburger.focus();
        sideMenu.querySelectorAll(".side-menu-item").forEach(item => {
            item.setAttribute("tabindex", "-1");
        });
    }

    // Function to open the menu
    function openMenu() {
        sideMenu.classList.add("open");
        menuOverlay.classList.add("active");
        hamburger.classList.add("active");
        hamburger.setAttribute("aria-expanded", "true");
        menuOverlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("menu-open");
        menuClose.focus();
        sideMenu.querySelectorAll(".side-menu-item").forEach(item => {
            item.removeAttribute("tabindex");
        });
    }

    // Hamburger button click handler
    hamburger.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (sideMenu.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close button click handler
    menuClose.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
    });

    // Overlay click handler
    menuOverlay.addEventListener("click", function(e) {
        e.preventDefault();
        closeMenu();
    });

    // Handle side menu item clicks
    sideMenu.querySelectorAll(".side-menu-item").forEach(item => {
        item.addEventListener("click", function(e) {
            closeMenu();
            const href = this.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }, 300);
                }
            }
        });
    });

    // Keyboard navigation
    document.addEventListener("keydown", function(e) {
        // Close menu on Escape key
        if (e.key === "Escape" && sideMenu.classList.contains("open")) {
            closeMenu();
        }

        // Trap focus within menu when open
        if (sideMenu.classList.contains("open")) {
            const focusableElements = sideMenu.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.key === "Tab") {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }
    });

    // Close menu on window resize (if mobile menu is open on desktop)
    window.addEventListener("resize", function() {
        if (window.innerWidth > 768 && sideMenu.classList.contains("open")) {
            closeMenu();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // Debug function (optional, for development)
    window.debugNavigation = function() {
        console.log("Hamburger:", hamburger);
        console.log("Side Menu:", sideMenu);
        console.log("Menu Overlay:", menuOverlay);
        console.log("Menu Close:", menuClose);
        console.log("Menu is open:", sideMenu?.classList.contains("open"));
    };
});
