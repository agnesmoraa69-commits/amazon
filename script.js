// State variables
let currentSlideIndex = 0;
let cartCount = 0;

// Product gallery configuration matching folder casing
const productGallery = {
    "A01-brown": [
        "Images/brown-1.jpg",
        "Images/brown-2.jpg",
        "Images/brown-3.jpg",
        "Images/brown-4.jpg"
    ]
};

// Initialize app when DOM loads
document.addEventListener("DOMContentLoaded", () => {
    initCarousel();
    renderStorefrontFeed();
});

// View switching logic
function switchView(viewId) {
    document.querySelectorAll(".view-section").forEach(view => {
        view.classList.remove("active");
    });
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add("active");
        window.scrollTo(0, 0);
    }
}

// Initialize dots and main image
function initCarousel() {
    const images = productGallery["A01-brown"];
    const dotsContainer = document.getElementById("carousel-dots");
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";
    images.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.style.cssText = `
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: ${index === 0 ? "#007185" : "#ccc"};
            display: inline-block;
            cursor: pointer;
        `;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

    updateCarouselDisplay();
}

// Navigate to specific slide
function goToSlide(index) {
    const images = productGallery["A01-brown"];
    if (index >= 0 && index < images.length) {
        currentSlideIndex = index;
        updateCarouselDisplay();
    }
}

// Previous slide
function prevSlide() {
    const images = productGallery["A01-brown"];
    currentSlideIndex = (currentSlideIndex - 1 + images.length) % images.length;
    updateCarouselDisplay();
}

// Next slide
function nextSlide() {
    const images = productGallery["A01-brown"];
    currentSlideIndex = (currentSlideIndex + 1) % images.length;
    updateCarouselDisplay();
}

// Update main image and dot indicators
function updateCarouselDisplay() {
    const images = productGallery["A01-brown"];
    const mainImg = document.getElementById("pdp-main-img");
    if (mainImg) {
        mainImg.src = images[currentSlideIndex];
    }

    const dots = document.getElementById("carousel-dots")?.children;
    if (dots) {
        Array.from(dots).forEach((dot, idx) => {
            dot.style.backgroundColor = idx === currentSlideIndex ? "#007185" : "#ccc";
        });
    }

    // Highlight active swatch border
    const swatches = document.querySelectorAll(".color-swatch");
    swatches.forEach((swatch, idx) => {
        if (idx === currentSlideIndex) {
            swatch.classList.add("active");
            swatch.style.border = "2px solid #007185";
        } else {
            swatch.classList.remove("active");
            swatch.style.border = "1px solid #ccc";
        }
    });
}

// Color select handler
function selectColor(colorName, element) {
    const label = document.getElementById("selected-color-label");
    if (label) {
        label.innerText = colorName;
    }
}

// Cart functionality
function addToCart(button) {
    cartCount++;
    const badge = document.getElementById("cart-count");
    if (badge) badge.innerText = cartCount;

    if (button) {
        const originalText = button.innerText;
        button.innerText = "Added!";
        button.style.background = "#2e7d32";
        button.style.color = "#fff";
        setTimeout(() => {
            button.innerText = originalText;
            button.style.background = "";
            button.style.color = "";
        }, 1500);
    }
}

// Modal management
function openCheckout() {
    const modal = document.getElementById("checkout-modal");
    if (modal) modal.style.display = "flex";
}

function closeCheckout() {
    const modal = document.getElementById("checkout-modal");
    if (modal) modal.style.display = "none";
}

function processPayment(event) {
    event.preventDefault();
    alert("Payment successful! Thank you for your order.");
    closeCheckout();
    cartCount = 0;
    const badge = document.getElementById("cart-count");
    if (badge) badge.innerText = cartCount;
}

// Search functionality
function handleSearchKey(event) {
    if (event.key === "Enter") executeSearch();
}

function executeSearch() {
    const input = document.getElementById("main-search-input");
    const query = input ? input.value.trim() : "";
    if (!query) return;

    const heading = document.getElementById("search-query-heading");
    const status = document.getElementById("search-status");
    if (heading) heading.innerText = `Results for "${query}"`;
    if (status) status.innerText = "Showing 4 matching items";

    renderSearchFeed();
    switchView("search-view");
}

// Feed rendering helpers
function renderStorefrontFeed() {
    const feed = document.getElementById("storefront-feed");
    if (!feed) return;
    feed.innerHTML = generateMockProducts();
}

function renderSearchFeed() {
    const feed = document.getElementById("search-feed");
    if (!feed) return;
    feed.innerHTML = generateMockProducts();
}

function generateMockProducts() {
    const mockItems = [
        { name: "Oversized Knit Sweater", price: "$28.00", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&auto=format&fit=crop" },
        { name: "High Waisted Cargo Trousers", price: "$34.50", img: "Images/brown-1.jpg" },
        { name: "Casual Linen Blazer", price: "$42.00", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop" },
        { name: "Ribbed Bodycon Dress", price: "$22.90", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop" }
    ];

    return mockItems.map(item => `
        <div style="background: #fff; border: 1px solid #e7e7e7; border-radius: 8px; overflow: hidden; font-size: 13px;">
            <img src="${item.img}" style="width: 100%; height: 180px; object-fit: cover;">
            <div style="padding: 10px;">
                <div style="font-weight: bold; margin-bottom: 4px;">${item.name}</div>
                <div style="color: #B12704; font-weight: bold; margin-bottom: 8px;">${item.price}</div>
                <button onclick="addToCart(this)" style="width: 100%; padding: 6px; background: #ffd814; border: 1px solid #fcd200; border-radius: 15px; cursor: pointer; font-size: 12px;">Add to cart</button>
            </div>
        </div>
    `).join("");
}

function shareWebsite() {
    if (navigator.share) {
        navigator.share({ title: 'amaz0n Store', url: window.location.href });
    } else {
        alert("Link copied to clipboard!");
    }
}
