// Retrieve cart data from localStorage, default to empty array if none exists
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add sample data for testing (remove in production if cart is populated elsewhere)
if (cart.length === 0) {
    cart.push(
        { image: 'product-image1.jpg', name: 'Product Name 1', price: '$29.99', quantity: 1 },
        { image: 'product-image2.jpg', name: 'Product Name 2', price: '$39.99', quantity: 1 }
    );
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Access the cart container
const cartContainer = document.querySelector('#cart-table');

// Function to display products in the cart and calculate subtotal
function displayCart() {
    // Clear existing content
    cartContainer.innerHTML = '';

    // Remove any existing subtotal
    const existingSubtotal = document.querySelector('#subtotal');
    if (existingSubtotal) existingSubtotal.remove();

    // Check if cart is empty
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #555;">Your cart is empty.</p>';
        // Add subtotal of $0.00
        const subtotalElement = document.createElement('p');
        subtotalElement.id = 'subtotal';
        subtotalElement.textContent = 'Subtotal: $0.00';
        cartContainer.insertAdjacentElement('afterend', subtotalElement);
        return;
    }

    // Loop through cart items and create product cards
    cart.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        const basePrice = parseFloat(product.price.replace('$', '')); // Base price without quantity
        const totalPrice = (basePrice * (product.quantity || 1)).toFixed(2); // Price * quantity
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200x150?text=Image+Not+Found'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                    <span>${product.quantity || 1}</span>
                    <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                </div>
                <p>$${totalPrice}</p>
            </div>
              <td><i class="fas fa-trash-alt remove" data-index="${index}"></i></td>  
        `;
        cartContainer.appendChild(productCard);
    });

    // Calculate subtotal
    const subtotal = cart.reduce((sum, product) => {
        const price = parseFloat(product.price.replace('$', '')); // Remove $ and convert to number
        return sum + price * (product.quantity || 1);
    }, 0);

    // Display subtotal
    const subtotalElement = document.createElement('p');
    subtotalElement.id = 'subtotal';
    subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    cartContainer.insertAdjacentElement('afterend', subtotalElement);
}

// Function to update quantity of a product
function updateQuantity(index, change) {
    const newQuantity = (cart[index].quantity || 1) + change;
    if (newQuantity < 1) {
        // Optionally remove item if quantity reaches 0
        if (confirm('Remove this item from the cart?')) {
            cart.splice(index, 1);
        }
    } else {
        cart[index].quantity = newQuantity;
    }

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Refresh cart display
    displayCart();
}

// Function to remove a product from the cart
function removeFromCart(index) {
    // Remove product at the specified index
    cart.splice(index, 1);

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Refresh cart display
    displayCart();
}

// Add event listener for remove and quantity buttons
cartContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove')) {
        const index = event.target.getAttribute('data-index');
        removeFromCart(Number(index)); // Convert to number for safety
    } else if (event.target.classList.contains('quantity-btn')) {
        const index = Number(event.target.getAttribute('data-index'));
        const action = event.target.getAttribute('data-action');
        const change = action === 'increase' ? 1 : -1;
        updateQuantity(index, change);
    }
});

// Display cart on page load
displayCart();






















const translations = {
    ar: {
        // القائمة الرئيسية
        "navbar.home": "الرئيسية",
        "navbar.about": "من نحن",
        "navbar.contact": "اتصل بنا",
        "navbar.skincare": "العناية بالبشرة",
        "navbar.products": "منتجاتنا",

        // قوائم العناية بالبشرة
        "dropdown.skin.acne": "حب الشباب",
        "dropdown.skin.dry": "البشرة الجافة",
        "dropdown.skin.wrinkles": "التجاعيد وعلامات التقدم في السن",
        "dropdown.skin.spots": "البقع السوداء والداكنة",

        // قوائم المنتجات
        "dropdown.products.all": "جميع المنتجات",
        "dropdown.products.traditional": "الصابون التقليدي",
        "dropdown.products.arabic": "صابون التصميم العربي",
        "dropdown.products.herbal": "الصابون العشبي",
        "dropdown.products.hotel": "صابون الفنادق والحمامات",
        "dropdown.products.liquid": "الصابون السائل",
        "dropdown.products.ghar": "صابون الغار",
        "dropdown.products.ball": "صابون الكرة",
        "dropdown.products.granules": "صابون الحبيبات الناعمة",
        "dropdown.products.embroidery": "علب التطريز",
        "dropdown.products.labeling": "العلامة الخاصة",
        "dropdown.products.gifts": "هدايا الصابون",

        // السلايدر
        "slide1.text1": "عودة إلى النقاء",
        "slide1.text2": "طبيعي ومتناسق",
        "slide2.text1": "زيت زيتون بكر ممتاز",
        "slide2.text2": "ينظف، ينعش ويرطب بشرتك",
        "slide3.text1": "منذ 2000 عام",
        "slide3.text2": "نابلس تعيش وتتنفس صابون زيت الزيتون",

        // البحث
        "search.placeholder": "ابحث هنا...",
        "search.button": "بحث",

        // ... الترجمات الأخرى
        "language.lang": "اللغة", // أضف هذا السطر
        "language.english": "الإنجليزية",
        "language.arabic": "العربية"
    },
    en: {
        // القائمة الرئيسية
        "navbar.home": "Home",
        "navbar.about": "About Us",
        "navbar.contact": "Contact Us",
        "navbar.skincare": "Skin Care",
        "navbar.products": "Our Products",

        // قوائم العناية بالبشرة
        "dropdown.skin.acne": "Acne",
        "dropdown.skin.dry": "Dry Skin",
        "dropdown.skin.wrinkles": "Wrinkles and Aging",
        "dropdown.skin.spots": "Blackheads & Dark Spots",

        // قوائم المنتجات
        "dropdown.products.all": "All Products",
        "dropdown.products.traditional": "Traditional Soap",
        "dropdown.products.arabic": "Arabisc Design Soap",
        "dropdown.products.herbal": "Herbal Soap",
        "dropdown.products.hotel": "Toilet & Hotel Soap",
        "dropdown.products.liquid": "Liquid Soap",
        "dropdown.products.ghar": "Ghar Soap",
        "dropdown.products.ball": "Ball Soap",
        "dropdown.products.granules": "Fine Granules Soap",
        "dropdown.products.embroidery": "Embroidery Boxes",
        "dropdown.products.labeling": "Private Labeling",
        "dropdown.products.gifts": "Soap Gifts",

        // السلايدر
        "slide1.text1": "A RETURN TO PURITY",
        "slide1.text2": "Natural & Shapely",
        "slide2.text1": "Pure Virgin Olive Oil",
        "slide2.text2": "Clear, refresh and moisturize your skin",
        "slide3.text1": "FOR 2000 YEARS",
        "slide3.text2": "Nablus Lives & Breathes Olive Oil Soap",

        // البحث
        "search.placeholder": "Search...",
        "search.button": "Search",

        // ... الترجمات الأخرى
        "language.lang": "Language", // أضف هذا السطر
        "language.english": "English",
        "language.arabic": "Arabic"
    }
};var swiper = new Swiper(".swiper", {
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    effect: 'fade',
    autoplay: {
        delay: 7000,
    }
});

// دالة تغيير اللغة
function changeLanguage(lang) {
    // تطبيق الترجمات على جميع العناصر
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // تحديث حقل البحث
    const searchInput = document.querySelector('.form-control');
    const searchButton = document.querySelector('.btn-outline-success');
    if (searchInput) searchInput.placeholder = translations[lang]['search.placeholder'] || 'Search';
    if (searchButton) searchButton.textContent = translations[lang]['search.button'] || 'Search';

    // حفظ التفضيل
    localStorage.setItem('preferredLanguage', lang);
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تعيين اللغة المبدئية
    const savedLang = localStorage.getItem('preferredLanguage') || 'ar';
    changeLanguage(savedLang);

    // إضافة مستمعي الأحداث لأزرار تغيير اللغة
    document.querySelectorAll('.language-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            changeLanguage(btn.dataset.lang);
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // تفعيل جميع القوائم المنسدلة
    var dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(function(dropdown) {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            var menu = this.nextElementSibling;
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });

    // إغلاق القوائم عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.dropdown-toggle') && !e.target.closest('.dropdown-menu')) {
            document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
                menu.style.display = 'none';
            });
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const body = document.body;

    navbarToggler.addEventListener('click', function() {
        body.classList.toggle('navbar-open');
    });
});