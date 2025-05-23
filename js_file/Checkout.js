document.addEventListener('DOMContentLoaded', function () {
    function updateOrderSummary() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            console.log('Cart data:', cart);

            // Update order summary
            let subtotal = 0;
            cart.forEach(item => {
                const price = parseFloat(item.price.replace('$', '')) || 0;
                subtotal += price * (item.quantity || 1);
            });

            const shipping = 5.00;
            const total = subtotal + shipping;

            document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;

            // Update cart items list
            const cartItemsList = document.getElementById('cart-items-list');
            cartItemsList.innerHTML = ''; // Clear existing items

            if (cart.length === 0) {
                cartItemsList.innerHTML = '<p class="cart-items-empty">Your cart is empty.</p>';
                return;
            }

            cart.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'cart-item-card';
                itemCard.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name || 'Product'}">
                    </div>
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name || 'Unknown Product'}</span>
                        <span class="cart-item-price">${item.price || '$0.00'}</span>
                        <span class="cart-item-quantity">Quantity: ${item.quantity || 1}</span>
                    </div>
                `;
                cartItemsList.appendChild(itemCard);
            });
        } catch (error) {
            console.error('Error updating order summary or cart items:', error);
        }
    }

    // Consolidated submit button handler
    document.querySelector('.submit-btn').addEventListener('click', (e) => {
        e.preventDefault();

        // Clear the cart
        localStorage.setItem('cart', JSON.stringify([]));

        // Show success message
        alert('Thank you! Your order has been placed successfully.');

        // Redirect to cart page with success message
        window.location.href = 'shopping_cart.html?order=success';
    });

    // Initial update
    updateOrderSummary();
    window.addEventListener('storage', updateOrderSummary);

    // Dropdown menu functionality
    const dropdown = document.querySelector('.mega-dropdown');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    let timeout;

    dropdown.addEventListener('mouseenter', function () {
        clearTimeout(timeout);
        dropdownMenu.style.display = 'block';
        dropdownMenu.style.opacity = '1';
        dropdownMenu.style.visibility = 'visible';
    });

    dropdown.addEventListener('mouseleave', function () {
        timeout = setTimeout(function () {
            dropdownMenu.style.display = 'none';
        }, 1000);
    });

    document.getElementById('shopDropdown').addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = this.getAttribute('href');
    });
});





















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