// ---------------------------------------- feed-back

const slides = document.querySelectorAll(".feed-slides div");
let slideIndex = 0;
document.addEventListener("DOMContentLoaded", initializeSlider);

function initializeSlider() {
    if (slides.length > 0) {
        showSlides(slideIndex);
        setInterval(nextSlide, 3000); 
    }
}

function showSlides(index) {
    slideIndex = index % slides.length;
    slides.forEach(slide => {
        slide.classList.remove("display-slide");
    });

    for (let i = 0; i < 1; i++) {
        const slideToShow = (slideIndex + i) % slides.length;
        slides[slideToShow].classList.add("display-slide");
    }
}

function nextSlide() {
    slideIndex ++;
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    showSlides(slideIndex);
}
