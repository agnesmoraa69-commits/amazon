const productGallery = {
    "A01-brown": [
        "images/brown-1.jpg",
        "images/brown-2.jpg",
        "images/brown-3.jpg",
        "images/brown-4.jpg"
    ],
    "A02-army green": [
        "images/green-1.jpg"
    ],
    "A03-black": [
        "images/black-1.jpg"
    ],
    "A04-burgundy": [
        "images/burgundy-1.jpg"
    ]
};

let currentColor = "A01-brown";
let currentSlideIndex = 0;

function updateCarousel() {
    const images = productGallery[currentColor] || [];
    if (images.length === 0) return;

    const mainImg = document.getElementById('pdp-main-img');
    if (mainImg) mainImg.src = images[currentSlideIndex];

    const dotsContainer = document.getElementById('carousel-dots');
    if (dotsContainer) {
        // Hide indicator dots if there is only 1 image
        if (images.length <= 1) {
            dotsContainer.innerHTML = '';
            return;
        }

        dotsContainer.innerHTML = images.map((_, idx) => `
            <span onclick="goToSlide(${idx})" style="
                height: 8px; 
                width: 8px; 
                background-color: ${idx === currentSlideIndex ? '#007185' : '#ccc'}; 
                border-radius: 50%; 
                display: inline-block; 
                cursor: pointer;
                transition: background-color 0.2s;">
            </span>
        `).join('');
    }
}

function nextSlide() {
    const images = productGallery[currentColor] || [];
    // Only allow sliding if there are multiple images
    if (images.length <= 1) return;
    
    currentSlideIndex = (currentSlideIndex + 1) % images.length;
    updateCarousel();
}

function prevSlide() {
    const images = productGallery[currentColor] || [];
    // Only allow sliding if there are multiple images
    if (images.length <= 1) return;
    
    currentSlideIndex = (currentSlideIndex - 1 + images.length) % images.length;
    updateCarousel();
}

function selectColor(colorName, element) {
    currentColor = colorName;
    currentSlideIndex = 0; // Reset to first image on color change

    const colorLabel = document.getElementById('selected-color-label');
    if (colorLabel) colorLabel.innerText = colorName;

    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.style.border = '1px solid #ccc';
    });

    if (element) {
        element.style.border = '2px solid #007185';
    }

    updateCarousel();
}
