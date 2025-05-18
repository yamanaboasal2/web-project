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



document.addEventListener('DOMContentLoaded', function() {
    // تأثير العد التصاعدي
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;

        if(count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 1);
        } else {
            counter.innerText = target;
        }
    });

    // بدء جميع الحركات عند تحميل الصفحة
    const textElements = document.querySelectorAll('.text-content > *');
    textElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const marquee = document.querySelector('.marquee-content');
    const items = marquee.innerHTML;
    marquee.innerHTML = items + items; // مضاعفة العناصر للحركة السلسة
});



document.addEventListener('DOMContentLoaded', function () {
    const megaDropdown = document.querySelector('.mega-dropdown');
    const dropdownToggle = megaDropdown.querySelector('.dropdown-toggle');
    const dropdownMenu = megaDropdown.querySelector('.dropdown-menu');

    // Check if device is mobile
    function isMobile() {
        return window.innerWidth <= 991.98 || 'ontouchstart' in window;
    }

    if (!isMobile()) {
        // Show dropdown on hover over link or menu
        megaDropdown.addEventListener('mouseenter', function () {
            dropdownToggle.setAttribute('aria-expanded', 'true');
            dropdownMenu.classList.add('show');
        });

        // Hide dropdown when leaving both link and menu
        megaDropdown.addEventListener('mouseleave', function () {
            dropdownToggle.setAttribute('aria-expanded', 'false');
            dropdownMenu.classList.remove('show');
        });

        // Allow navigation on click
        dropdownToggle.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default to avoid Bootstrap toggle
            window.location.href = this.getAttribute('href');
        });
    } else {
        // Mobile: Toggle dropdown on first tap, navigate on second
        dropdownToggle.addEventListener('click', function (e) {
            if (!dropdownMenu.classList.contains('show')) {
                e.preventDefault();
                dropdownToggle.setAttribute('aria-expanded', 'true');
                dropdownMenu.classList.add('show');
            } else {
                window.location.href = this.getAttribute('href');
            }
        });

        // Close dropdown on outside tap
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.mega-dropdown')) {
                dropdownMenu.classList.remove('show');
                dropdownToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});