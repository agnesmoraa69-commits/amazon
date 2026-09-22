let totalItemsInCart = 0;

// Set your custom AI backend endpoint URL here
const AI_SEARCH_ENDPOINT = "https://api.yourdomain.com/v1/ai-search";

// Structured clothing inventory
const catalogDatabase = [
    {
        title: "RITERA Plus Size Women Corduroy Pants Waist Wide Leg Trouser",
        desc: "Loose Wide Leg Barrel Trousers, High Waisted, Side Pocket, Fall Winter, Elastic Waist Baggy, Lounge Soft Warm XL-5XL",
        color: "A01-brown",
        basePrice: 32.00,
        img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop"
    },
    {
        title: "Striped Y2K Crop Top",
        desc: "Crewneck Slim Fit Casual Everyday Top",
        color: "Olive Green",
        basePrice: 28.00,
        img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop"
    },
    {
        title: "Bow Knit Crewneck Sweater",
        desc: "Cute Fall Soft Textured Knit Pullover",
        color: "Midnight Black",
        basePrice: 35.00,
        img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    },
    {
        title: "Relaxed Linen Blend Pants",
        desc: "Lightweight Summer Elastic Waist Trousers",
        color: "Cream White",
        basePrice: 30.00,
        img: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&auto=format&fit=crop"
    },
    {
        title: "Tailored Wide Leg Trousers",
        desc: "Pleated High Rise Formal Casual Slacks",
        color: "Rustic Wine",
        basePrice: 38.00,
        img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop"
    }
];

function initStorefront() {
    renderFeed('storefront-feed', catalogDatabase);
}

function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    window.scrollTo(0, 0);
}

function selectColor(colorName, imgSrc, element) {
    const colorLabel = document.getElementById('selected-color-label');
    const mainImg = document.getElementById('pdp-main-img');

    if (colorLabel) colorLabel.innerText = colorName;
    if (mainImg) mainImg.src = imgSrc;

    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.style.border = '1px solid #ccc';
    });

    if (element) {
        element.style.border = '2px solid #007185';
    } else if (window.event && window.event.currentTarget) {
        window.event.currentTarget.style.border = '2px solid #007185';
    }
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
            if (status) status.innerText = "No direct AI recommendations found. Showing related store items.";
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

// Initialize feed
initStorefront();
