


(() => {
    // تحقق من تحميل DOM قبل تنفيذ الكود
    document.addEventListener('DOMContentLoaded', () => {
        // تحقق من وجود GSAP و ScrollTrigger و Splitting
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Splitting === 'undefined') {
            console.error('GSAP, ScrollTrigger, or Splitting.js is not loaded.');
            // إظهار الصورة الرئيسية كبديل
            const mainImage = document.querySelector('.skn-img-main img');
            if (mainImage) {
                mainImage.style.opacity = '1';
                mainImage.style.transform = 'scale(1)';
                console.log('Main image forced visible due to missing libraries.');
            }
            return;
        }

        // تهيئة Splitting.js لتقسيم النصوص
        Splitting();

        // تحريك النصوص المقسمة (Character-Split Animation)
        document.querySelectorAll('.skn-charsplit').forEach((element) => {
            gsap.from(element.querySelectorAll('.wdt-chars__item'), {
                opacity: 0,
                y: 20,
                stagger: 0.03,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });
        });

        // تحريك سطور الوصف (Fade-In Animation)
        gsap.from('.skn-text-line', {
            opacity: 0,
            x: 50, // عكس الاتجاه لـ RTL (من اليمين إلى اليسار)
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.skn-heading-content',
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });

        // تحريك الأيقونات والزر (FadeInUp Animation)
        gsap.from('.skn-animate', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.1, // إضافة تأخير بسيط بين العناصر
            scrollTrigger: {
                trigger: '.skn-animate',
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });

        // تحريك الصورة الرئيسية (Inview Animation)
        gsap.to('.skn-img-main', {
            scrollTrigger: {
                trigger: '.skn-img-main',
                start: 'top 80%',
                toggleClass: 'inview',
                onEnter: () => {
                    console.log('Main image entered viewport');
                },
            },
        });

        // تأثير Parallax للصور الصغيرة
        gsap.utils.toArray('.skn-parallax-wrapper').forEach((wrapper) => {
            const parallaxData = JSON.parse(wrapper.getAttribute('data-parallax'));
            gsap.to(wrapper, {
                x: parallaxData.x,
                y: parallaxData.y,
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top 80%',
                    end: 'bottom top',
                    scrub: 1, // تحسين التمرير ليكون أكثر سلاسة
                },
            });
        });

        // إظهار الصورة الرئيسية كبديل في حال فشل GSAP
        window.addEventListener('load', () => {
            const mainImage = document.querySelector('.skn-img-main img');
            if (mainImage) {
                mainImage.style.opacity = '1';
                mainImage.style.transform = 'scale(1)';
                console.log('Main image forced visible on window load.');
            }
        });
    });
})();


document.addEventListener('DOMContentLoaded', function () {
    // Image Slider
    const imageSlider = new Swiper('.image-slider-container', {
        slidesPerView: 1,
        loop: false,
        direction: 'horizontal',
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
        },
    });

    // Product Card Slider
    const productSlider = new Swiper('.product-slider-container', {
        slidesPerView: 3,
        spaceBetween: 15, // Adjusted for wider cards
        loop: false,
        direction: 'horizontal',
        watchSlidesVisibility: true,
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const productSection = document.querySelector('.product-section');

    function checkScroll() {
        const sectionTop = productSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // عندما يكون القسم في منتصف الشاشة
        if (sectionTop < windowHeight * 0.75) {
            productSection.classList.add('animate');
            window.removeEventListener('scroll', checkScroll);
        }
    }

    // التحقق عند التحميل أولاً
    checkScroll();

    // ثم عند السكرول
    window.addEventListener('scroll', checkScroll);

    // إعادة التحقق عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        if (!productSection.classList.contains('animate')) {
            checkScroll();
        }
    });
});