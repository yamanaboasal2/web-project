document.addEventListener('DOMContentLoaded', function() {
    function initSlider(sliderId) {
        const container = document.getElementById(sliderId);
        const mainImages = container.querySelectorAll('.main-image');
        const thumbnails = container.querySelectorAll('.thumbnail');
        const prevBtn = container.querySelector('.prev-arrow');
        const nextBtn = container.querySelector('.next-arrow');
        let currentIndex = 0;

        function showImage(index) {
            mainImages.forEach(img => img.classList.remove('active'));
            thumbnails.forEach(thumb => thumb.classList.remove('active-thumbnail'));

            mainImages[index].classList.add('active');
            thumbnails[index].classList.add('active-thumbnail');
            currentIndex = index;
        }

        prevBtn.addEventListener('click', function() {
            const newIndex = currentIndex > 0 ? currentIndex - 1 : mainImages.length - 1;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', function() {
            const newIndex = currentIndex < mainImages.length - 1 ? currentIndex + 1 : 0;
            showImage(newIndex);
        });

        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => showImage(index));
        });

        // Auto-slide
        let autoSlide = setInterval(() => {
            const newIndex = currentIndex < mainImages.length - 1 ? currentIndex + 1 : 0;
            showImage(newIndex);
        }, 3000);

        container.querySelector('.slider-container').addEventListener('mouseenter', () => {
            clearInterval(autoSlide);
        });

        container.querySelector('.slider-container').addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                const newIndex = currentIndex < mainImages.length - 1 ? currentIndex + 1 : 0;
                showImage(newIndex);
            }, 3000);
        });
    }

    initSlider('slider1-container');

    initSlider('slider2-container');

    initSlider('slider3-container');

    initSlider('slider4-container');
});

document.addEventListener('DOMContentLoaded', function() {
    const productsSection = document.getElementById('productsSection');
    const productWrappers = Array.from(productsSection.querySelectorAll('.product-wrapper'));

    productWrappers.forEach(wrapper => {
        productsSection.appendChild(wrapper);
    });

    productWrappers.forEach((wrapper, index) => {
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateX(20px)';
        wrapper.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;

        setTimeout(() => {
            wrapper.style.opacity = '1';
            wrapper.style.transform = 'translateX(0)';
        }, 100);
    });
});




function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const countElement = document.getElementById('wishlist-count');
    countElement.textContent = wishlist.length;
    countElement.style.display = wishlist.length > 0 ? 'inline-block' : 'none';
}

document.querySelectorAll('.wishlist').forEach(button => {
    button.addEventListener('click', function () {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        const image = button.getAttribute('data-image');
        const product = { name, price, image };

        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        // 👉 السماح بالتكرار
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        // ✅ تحديث العداد دايماً
        updateWishlistCount();

        // ✈️ حركة الطيران
        const flyingImg = document.createElement('img');
        flyingImg.src = image;
        flyingImg.className = 'flying-img';

        const rect = button.getBoundingClientRect();
        flyingImg.style.top = `${rect.top + window.scrollY}px`;
        flyingImg.style.left = `${rect.left + window.scrollX}px`;

        document.body.appendChild(flyingImg);

        const target = document.getElementById('wishlist-icon').getBoundingClientRect();
        const deltaX = target.left - rect.left;
        const deltaY = target.top - rect.top;

        requestAnimationFrame(() => {
            flyingImg.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.3)`;
            flyingImg.style.opacity = '0';
        });

        setTimeout(() => flyingImg.remove(), 1000);
    });
});

// 📦 عند تحميل الصفحة، نحدث العداد
document.addEventListener('DOMContentLoaded', updateWishlistCount);



















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