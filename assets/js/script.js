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

// ---------------------------------------- search

function showHint(str) {
    const resultsContainer = document.getElementById("txtHint");
    const search = document.getElementById("search");
    const rows = resultsContainer.getElementsByClassName('result-row');
    
    if (str.length == 0) {
        resultsContainer.style.display = "none";
        search.style.borderBottomLeftRadius = "10px";
        search.style.borderBottomRightRadius = "10px";
        search.style.borderBottom="1px solid var(--first-color)";
        return;
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            resultsContainer.innerHTML = "";
            
            if (this.responseText === "no suggestion") {
                const noResult = document.createElement("div");
                noResult.className = "no-suggestion";
                noResult.textContent = "No suggestions found";
                noResult.style.paddingLeft = "30px";
                resultsContainer.appendChild(noResult);
            } else {
                const names = this.responseText.split(", ");
                names.forEach(name => {
                    const row = document.createElement("div");
                    row.className = "result-row";
                    row.textContent = name;
                    row.onclick = function() {
                        document.getElementById("search").value = name;
                        resultsContainer.style.display = "none";
                        search.style.borderBottomLeftRadius = "10px";
                        search.style.borderBottomRightRadius = "10px";
                        search.style.borderBottom="1px solid var(--first-color)";
                    };
                    resultsContainer.appendChild(row);
                });
            }
            search.style.borderBottomLeftRadius="0";
            search.style.borderBottomRightRadius="0";
            search.style.borderBottom="none";
            resultsContainer.style.paddingBottom = "10px";
            resultsContainer.style.display = "flex";
            resultsContainer.style.flexDirection="column";
            resultsContainer.style.textAlign="left";
            resultsContainer.style.border="1px solid var(--first-color)";
            resultsContainer.style.backgroundColor="var(--third-color)";
            resultsContainer.style.borderBottomLeftRadius="10px";
            resultsContainer.style.borderBottomRightRadius="10px";
            resultsContainer.style.position="absolute";
            resultsContainer.style.top="40px";  
            resultsContainer.style.left="0";     
            resultsContainer.style.borderTop="none";
            resultsContainer.style.width="400px";
            Array.from(rows).forEach(row => {
                row.style.paddingLeft = "30px";
                row.addEventListener("mouseenter", () => {
                    row.style.backgroundColor = "gray";
                    
                    
                });
                row.addEventListener("mouseleave", () => {
                    row.style.backgroundColor = "";
                    
                });
            });
        }
    };
    xmlhttp.open("GET", "./assets/php/php.php?q=" + encodeURIComponent(str), true);
    xmlhttp.send();
}







// function search(event) {
//     event.preventDefault(); // Prevent form submission or link default behavior
//     alert('Search triggered!'); // Test the function
//     window.location.href = "pages/list-Page.html"; // Redirect to the page



//     // let content = document.getElementById("search").value.trim();
//     // let lowerContent = content.toLowerCase();

//     // let categories = document.getElementsByClassName("booktype");
//     // for (let i = 0; i < categories.length; i++) {
//     //     let ele = categories[i].textContent.toLowerCase();

//     //     if (lowerContent === ele) {
//     //         window.location.href = "results.html";


//     //         return;
//     //     }
//     // }
// }



// function search(event) {
//     event.preventDefault(); // Stop the page from going directly
//     alert('Search triggered!'); // Show the alert
//     window.location.href = './pages/List-Page.html'; // Now manually go to the page
// }