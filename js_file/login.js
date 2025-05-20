const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});





document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.mega-dropdown');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    let timeout;

    // Show dropdown on hover
    dropdown.addEventListener('mouseenter', function () {
        clearTimeout(timeout);
        dropdownMenu.style.display = 'block';
        dropdownMenu.style.opacity = '1';
        dropdownMenu.style.visibility = 'visible';
    });

    // Delay hiding dropdown on mouse leave
    dropdown.addEventListener('mouseleave', function () {
        timeout = setTimeout(function () {
            dropdownMenu.style.display = 'none';
        }, 1000); // 1-second delay
    });

    // Navigate to Shop.html on click
    document.getElementById('shopDropdown').addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = this.getAttribute('href');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.nav-item.dropdown');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    let timeout;

    // Show dropdown on hover
    dropdown.addEventListener('mouseenter', function () {
        clearTimeout(timeout); // Clear any hide timeout
        dropdownMenu.style.display = 'block';
    });

    // Delay hiding dropdown on mouse leave
    dropdown.addEventListener('mouseleave', function () {
        timeout = setTimeout(function () {
            dropdownMenu.style.display = 'none';
        }, 1000); // 1000ms = 1 second delay
    });

    // Ensure clicking the link navigates
    document.getElementById('skinCareDropdown').addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = this.getAttribute('href');
    });
});




document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.mega-dropdown');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    let timeout;

    // Show dropdown on hover
    dropdown.addEventListener('mouseenter', function () {
        clearTimeout(timeout);
        dropdownMenu.style.display = 'block';
        dropdownMenu.style.opacity = '1';
        dropdownMenu.style.visibility = 'visible';
    });

    // Delay hiding dropdown on mouse leave
    dropdown.addEventListener('mouseleave', function () {
        timeout = setTimeout(function () {
            dropdownMenu.style.display = 'none';
        }, 1000); // 1-second delay
    });

    // Navigate to Shop.html on click
    document.getElementById('shopDropdown').addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = this.getAttribute('href');
    });
});
function openModal() {
    document.getElementById("passwordModal").style.display = "block";
}

function closeModal() {
    document.getElementById("passwordModal").style.display = "none";
}

// كمان بنخلي المستخدم يقدر يسكرها بالضغط على أي مكان خارجها
window.onclick = function(event) {
    const modal = document.getElementById("passwordModal");
    if (event.target === modal) {
        closeModal();
    }
};














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