var modal = document.getElementById("videoModal");

// Get the icon (the button that opens the modal)
var playIcon = document.getElementById("playIcon");

// Get the <span> element that closes the modal
var closeModal = document.getElementById("closeModal");

// When the user clicks the icon, open the modal
playIcon.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks the <span> (x), close the modal
closeModal.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
const faders = document.querySelectorAll('.fade_in');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

faders.forEach(fader => {
    observer.observe(fader);
});






document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submit_button');
    const privacyCheckbox = document.getElementById('privacy_checkbox');

    // تفعيل/تعطيل الزر حسب حالة الـ checkbox
    privacyCheckbox.addEventListener('change', function() {
        submitBtn.disabled = !this.checked;
    });

    // عند النقر على الزر
    submitBtn.addEventListener('click', function() {
        const name = document.getElementById('comment_name').value.trim();
        const email = document.getElementById('comment_email').value.trim();
        const comment = document.getElementById('comment_text').value.trim();

        // التحقق من الحقول المطلوبة
        if (!name || !email || !comment) {
            alert("الرجاء تعبئة جميع الحقول!");
            return;
        }

        // التحقق من صحة الإيميل
        if (!validateEmail(email)) {
            alert("البريد الإلكتروني غير صالح!");
            return;
        }

        // إنشاء التعليق وإضافته إلى السلايدر
        addNewComment(name, comment);

        // مسح الحقول بعد الإضافة
        clearForm();
    });

    // دالة لإضافة تعليق جديد داخل السلايدر
    function addNewComment(name, comment) {
        const commentHTML = `
            <div class="comment">
                <div class="comment_header">
                    <div class="comment_author">${name}</div>
                    <div class="comment_date">${new Date().toLocaleString()}</div>
                </div>
                <div class="comment_content">
                    ${comment}
                </div>
            </div>
        `;

        // إدراج التعليق داخل السلايدر
        document.querySelector('.comments_slider').insertAdjacentHTML('afterbegin', commentHTML);

        // إعادة تهيئة السلايدر بعد إضافة التعليق الجديد
        $('.comments_slider').slick('unslick');
        $('.comments_slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            arrows: true,
            speed: 300,
            autoplay: true,
            autoplaySpeed: 4000
        });
    }

    // دالة لمسح الحقول
    function clearForm() {
        document.getElementById('comment_name').value = '';
        document.getElementById('comment_email').value = '';
        document.getElementById('comment_text').value = '';
        privacyCheckbox.checked = false;
        submitBtn.disabled = true;
    }

    // دالة للتحقق من صحة الإيميل
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});

$(document).ready(function(){
    $('.comments_slider').slick({
        slidesToShow: 1,       // عرض تعليق واحد في كل مرة
        slidesToScroll: 1,     // التمرير بتعليق واحد في كل مرة
        infinite: true,        // التكرار اللانهائي
        dots: true,            // إضافة نقاط التصفح
        arrows: true,          // إضافة الأسهم للتنقل
        speed: 300,            // سرعة الانتقال بين التعليقات
        autoplay: true,        // التمرير التلقائي
        autoplaySpeed: 4000    // سرعة التمرير التلقائي
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