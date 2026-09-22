let totalItemsInCart = 0;
const AI_SEARCH_ENDPOINT = "https://api.yourdomain.com/v1/ai-search";

const productGallery = {
    "A01-brown": [
        "images/brown-1.jpg",
        "images/brown-2.jpg",
        "images/brown-3.jpg",
        "images/brown-4.jpg"
    ],
    "A02-army green": [
        "images/army-green-1.jpg",
        "images/army-green-2.jpg"
    ],
    "A03-black": [
        "images/black-1.jpg",
        "images/black-2.jpg"
    ],
    "A04-burgundy": [
        "images/burgundy-1.jpg",
        "images/burgundy-2.jpg"
    ]
};

let currentColor = "A01-brown";
let currentSlideIndex = 0;

const catalogDatabase = [
    {
        title: "RITERA Plus Size Women Corduroy Pants Waist Wide Leg Trouser",
        desc: "Loose Wide Leg Barrel Trousers, High Waisted, Side Pocket, Fall Winter, Elastic Waist Baggy, Lounge Soft Warm XL-5XL",
        color: "A01-brown",
        basePrice: 32.00,
        img: "images/brown-1.jpg"
    },
    {
        title: "Striped Y2K Crop Top",
        desc: "Crewneck Slim Fit Casual Everyday Top",
        color: "Olive Green",
        basePrice: 28.00,
        img: "images/army-green-1.jpg"
    },
    {
        title: "Bow Knit Crewneck Sweater",
        desc: "Cute Fall Soft Textured Knit Pullover",
        color: "Midnight Black",
        basePrice: 35.00,
        img: "images/black-1.jpg"
    },
    {
        title: "Relaxed Linen Blend Pants",
        desc: "Lightweight Summer Elastic Waist Trousers",
        color: "Cream White",
        basePrice: 30.00,
        img: "images/burgundy-1.jpg"
    }
];

function initStorefront() {
    renderFeed('storefront-feed', catalogDatabase);
    updateCarousel();
    initSwipe();
}

function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);
}

function selectColor(colorName, element) {
    if (!productGallery[colorName]) return;
    currentColor = colorName;
    currentSlideIndex = 0;

    const colorLabel = document.getElementById('selected-color-label');
    if (colorLabel) colorLabel.innerText = colorName;

    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.classList.remove('active');
        swatch.style.border = '1px solid #ccc';
    });

    if (element) {
        element.classList.add('active');
        element.style.border = '2px solid #007185';
    }

    updateCarousel();
}

function updateCarousel() {
    const images = productGallery[currentColor] || [];
    if (images.length === 0) return;

    if (currentSlideIndex >= images.length) {
        currentSlideIndex = 0;
    }

    const mainImg = document.getElementById('pdp-main-img');
    if (mainImg) mainImg.src = images[currentSlideIndex];

    const dotsContainer = document.getElementById('carousel-dots');
    if (dotsContainer) {
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
    if (images.length === 0) return;
    currentSlideIndex = (currentSlideIndex + 1) % images.length;
    updateCarousel();
}

function prevSlide() {
    const images = productGallery[currentColor] || [];
    if (images.length === 0) return;
    currentSlideIndex = (currentSlideIndex - 1 + images.length) % images.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlideIndex = index;
    updateCarousel();
}

let touchStartX = 0;
let touchEndX = 0;

function initSwipe() {
    const box = document.querySelector('.pdp-image-box');
    if (!box) return;

    box.addEventListener('touchstart', e => { 
        touchStartX = e.changedTouches[0].screenX; 
    }, { passive: true });

    box.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 40) nextSlide();
        if (touchEndX - touchStartX > 40) prevSlide();
    }, { passive: true });
}

function addToCart(btn) {
    totalItemsInCart++;
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = totalItemsInCart;
    
    if (btn) {
        const prevText = btn.innerText;
        btn.innerText = 'Added ✓';
        btn.style.backgroundColor = '#e3c01c';
        setTimeout(() => {
            btn.innerText = prevText;
            btn.style.backgroundColor = '#ffd814';
        }, 1500);
    }
}

function handleSearchKey(e) {
    if (e.key === 'Enter') executeSearch();
}

async function executeSearch() {
    const input = document.getElementById('main-search-input');
    if (!input) return;
    const query = input.value.trim();
    if (!query) return;

    const heading = document.getElementById('search-query-heading');
    const status = document.getElementById('search-status');
    const feed = document.getElementById('search-feed');

    if (heading) heading.innerText = `Results for "${query}"`;
    if (status) status.innerText = "Analyzing search query with AI...";
    if (feed) feed.innerHTML = "";
    
    switchView('search-view');

    try {
        const response = await fetch(AI_SEARCH_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });

        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        if (status) status.innerText = "";

        if (data.results && data.results.length > 0) {
            renderFeed('search-feed', data.results);
        } else {
            fallbackSearch(query);
        }
    } catch (error) {
        if (status) status.innerText = "Showing catalog results:";
        fallbackSearch(query);
    }
}

function fallbackSearch(query) {
    const searchResults = catalogDatabase.map(item => ({
        ...item,
        title: `${query} (${item.color})`
    }));
    renderFeed('search-feed', searchResults);
}

function renderFeed(targetId, items) {
    const container = document.getElementById(targetId);
    if (!container) return;

    container.innerHTML = items.map(item => {
        const discountedPrice = (item.basePrice * 0.60).toFixed(2);
        const originalPrice = item.basePrice.toFixed(2);

        return `
            <div class="product-card">
                <div class="product-info">
                    <div class="product-title">${item.title}</div>
                    <div class="product-desc">${item.desc} — Color: ${item.color}</div>
                    <div class="price-block">
                        <span class="discount-tag" style="font-size:11px; padding:2px 5px;">-40%</span>
                        <span style="font-weight:bold; font-size:18px; margin-left:4px;">$${discountedPrice}</span>
                        <span style="font-size:12px; color:#565959; text-decoration:line-through; margin-left:4px;">$${originalPrice}</span>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-main btn-cart" style="padding:6px 12px; font-size:12px; width:auto;" onclick="addToCart(this)">Add to cart</button>
                        <button class="btn-main btn-buy" style="padding:6px 12px; font-size:12px; width:auto;" onclick="openCheckout()">Buy Now</button>
                    </div>
                </div>
                <div class="product-img-box">
                    <img src="${item.img}" alt="${item.title}">
                </div>
            </div>
        `;
    }).join('');
}

function openCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'flex';
}

function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'none';
}

function processPayment(e) {
    e.preventDefault();
    alert('Payment processed successfully!');
    closeCheckout();
    totalItemsInCart = 0;
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = 0;
}

function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'amaz0n Storefront',
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
}

document.addEventListener('DOMContentLoaded', initStorefront);
