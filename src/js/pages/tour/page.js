let slides, totalSlides, currentSlideIndex = 0;

function initializeSlideshow() {
    slides = document.querySelectorAll(".slide");
    totalSlides = slides.length;
    document.getElementById("total-slides").textContent = totalSlides;
    generateThumbnails();
}

function generateThumbnails() {
    const e = document.getElementById("thumbnail-strip");
    if (e) {
        e.innerHTML = "";
        slides.forEach((t, n) => {
            const o = document.createElement("div");
            o.className = "thumbnail";
            o.style.backgroundImage = `url(${t.src})`;
            o.onclick = () => goToSlide(n);
            if (0 === n) o.classList.add("active");
            e.appendChild(o);
        });
    }
}

function openSlideshow(e = 0) {
    currentSlideIndex = e;
    const t = document.getElementById("slideshow-modal");
    if (t) {
        t.classList.add("active");
        document.body.style.overflow = "hidden";
        showSlide(currentSlideIndex);
        updateCounter();
    }
}

function closeSlideshow() {
    const e = document.getElementById("slideshow-modal");
    if (e) {
        e.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

function changeSlide(e) {
    currentSlideIndex += e;
    if (currentSlideIndex >= totalSlides) currentSlideIndex = 0;
    if (currentSlideIndex < 0) currentSlideIndex = totalSlides - 1;
    showSlide(currentSlideIndex);
    updateCounter();
}

function goToSlide(e) {
    currentSlideIndex = e;
    showSlide(currentSlideIndex);
    updateCounter();
}

function showSlide(e) {
    if (!slides || 0 === slides.length) return;
    slides.forEach((t, n) => {
        t.classList.toggle("active", n === e);
    });
    document.querySelectorAll(".thumbnail").forEach((t, n) => {
        t.classList.toggle("active", n === e);
    });
    scrollThumbnailSlider(e);
}

function scrollThumbnailSlider(e) {
    const t = document.getElementById("thumbnail-strip");
    const n = document.querySelectorAll(".thumbnail");
    if (!t || !n[e]) return;
    const o = n[e];
    const l = t.clientWidth;
    const i = o.offsetWidth;
    const d = n.length * (i + 10);
    if (d > l) {
        const n = e * (i + 10) - l / 2 + i / 2;
        const o = d - l;
        const s = Math.max(0, Math.min(n, o));
        t.scrollTo({ left: s, behavior: "smooth" });
    }
}

function initializeThumbnailDrag() {
    const e = document.getElementById("thumbnail-strip");
    if (!e) return;
    let t, n, o = !1;
    e.addEventListener("mousedown", l => {
        o = !0;
        e.style.cursor = "grabbing";
        t = l.pageX - e.offsetLeft;
        n = e.scrollLeft;
    });
    e.addEventListener("mouseleave", () => {
        o = !1;
        e.style.cursor = "grab";
    });
    e.addEventListener("mouseup", () => {
        o = !1;
        e.style.cursor = "grab";
    });
    e.addEventListener("mousemove", l => {
        if (!o) return;
        l.preventDefault();
        const i = 2 * (l.pageX - e.offsetLeft - t);
        e.scrollLeft = n - i;
    });
    e.addEventListener("touchstart", o => {
        t = o.touches[0].pageX - e.offsetLeft;
        n = e.scrollLeft;
    });
    e.addEventListener("touchmove", o => {
        o.preventDefault();
        const l = 2 * (o.touches[0].pageX - e.offsetLeft - t);
        e.scrollLeft = n - l;
    });
}

function updateCounter() {
    const e = document.getElementById("current-slide");
    const t = document.getElementById("total-slides");
    if (e) e.textContent = currentSlideIndex + 1;
    if (t) t.textContent = totalSlides;
}

document.addEventListener("keydown", e => {
    const t = document.getElementById("slideshow-modal");
    if (t && t.classList.contains("active")) {
        if ("ArrowLeft" === e.key) {
            e.preventDefault();
            changeSlide(-1);
        } else if ("ArrowRight" === e.key) {
            e.preventDefault();
            changeSlide(1);
        } else if ("Escape" === e.key) {
            e.preventDefault();
            closeSlideshow();
        }
    }
});

document.addEventListener("click", e => {
    const t = document.getElementById("slideshow-modal");
    if (e.target === t) closeSlideshow();
});

let touchStartX = 0, touchEndX = 0;

function handleSwipe() {
    const e = touchEndX - touchStartX;
    if (Math.abs(e) > 50) changeSlide(e > 0 ? -1 : 1);
}

document.addEventListener("touchstart", e => {
    const t = document.getElementById("slideshow-modal");
    if (t && t.classList.contains("active")) {
        touchStartX = e.changedTouches[0].screenX;
    }
});

document.addEventListener("touchend", e => {
    const t = document.getElementById("slideshow-modal");
    if (t && t.classList.contains("active")) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    initializeSlideshow();
    initializeThumbnailDrag();
});

window.addEventListener("load", function () {
    if (!slides || 0 === slides.length) {
        initializeSlideshow();
        initializeThumbnailDrag();
    }
});

document.addEventListener("DOMContentLoaded", function () {});
