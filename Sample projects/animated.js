// ----------------- CUSTOM CURSOR -----------------
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.pageX + "px";
    cursor.style.top = e.pageY + "px";
});

// Scale cursor on hover for buttons & links
document.querySelectorAll("button, a").forEach((item) => {
    item.addEventListener("mouseenter", () => cursor.classList.add("active"));
    item.addEventListener("mouseleave", () => cursor.classList.remove("active"));
});


// ----------------- NAVBAR ON SCROLL -----------------
window.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar");
    nav.classList.toggle("scrolled", window.scrollY > 50);
});


// ----------------- SCROLL REVEAL ANIMATION -----------------
const revealItems = document.querySelectorAll(".animate-on-scroll");

function revealOnScroll() {
    revealItems.forEach((el) => {
        const pos = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight - 120;
        if (pos < windowHeight) el.classList.add("show");
    });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();


// ----------------- ADD TO CART INTERACTION -----------------
let cartCount = 0;

document.querySelectorAll(".card button").forEach(btn => {
    btn.addEventListener("click", () => {
        cartCount++;
        showPopup("Added to Cart! 🍗");
        updateCartUI();
    });
});

function updateCartUI() {
    let cart = document.querySelector(".cart-count");
    if (!cart) {
        cart = document.createElement("div");
        cart.className = "cart-count";
        document.body.appendChild(cart);
    }
    cart.innerText = cartCount;
}


// ---------- Notfication Popup ----------
function showPopup(text) {
    const popup = document.createElement("div");
    popup.classList.add("pop");
    popup.innerText = text;

    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 1500);
}


// ----------------- HERO BUTTON EFFECT -----------------
const heroBtn = document.querySelector(".hero-btn");
heroBtn.addEventListener("click", () => {
    showPopup("Enjoy Your Meal 😋");
    heroBtn.classList.add("pulse");
    setTimeout(() => heroBtn.classList.remove("pulse"), 800);
});
