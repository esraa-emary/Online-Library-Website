// ---------------------------------------- slider-books

const slides1 = document.querySelectorAll(".cards .card");
const prevBtn = document.querySelector(".prev1");
const nextBtn = document.querySelector(".next1");
let slideIndex1 = 1; 

document.addEventListener("DOMContentLoaded", initializeSlider1);

function initializeSlider1() {
    if (slides1.length > 0) {
        slides1[1].classList.add("center-slide");
        showSlides1(slideIndex1);
        updateButtonStates();
    }
}

function showSlides1(index) {
    slides1.forEach(slide => {
        slide.style.display = "none";
        slide.classList.remove("center-slide", "side-slide");
    });

    const middleIndex = index;
    const leftIndex = middleIndex - 1 >= 0 ? middleIndex - 1 : slides1.length - 1;
    const rightIndex = middleIndex + 1 < slides1.length ? middleIndex + 1 : 0;

    slides1[leftIndex].style.display = "block";
    slides1[leftIndex].classList.add("side-slide");
    
    slides1[middleIndex].style.display = "block";
    slides1[middleIndex].classList.add("center-slide");
    
    slides1[rightIndex].style.display = "block";
    slides1[rightIndex].classList.add("side-slide");

    updateButtonStates();
}

function nextSlide1() {
    if (slideIndex1 < slides1.length - 1) {
        slideIndex1++;
    } else {
        slideIndex1 = 0;
    }
    showSlides1(slideIndex1);
}

function prevSlide1() {
    if (slideIndex1 > 0) {
        slideIndex1--;
    } else {
        slideIndex1 = slides1.length - 1;
    }
    showSlides1(slideIndex1);
}

function updateButtonStates() {
    if (slideIndex1 == 1) {
        prevBtn.classList.add("disabled");
    } else {
        prevBtn.classList.remove("disabled");
    }
    
    if (slideIndex1 >= slides1.length - 3) {
        nextBtn.classList.add("disabled");
    } else {
        nextBtn.classList.remove("disabled");
    }
}

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
