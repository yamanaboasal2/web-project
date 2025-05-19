document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded, initializing scroll animations');

    function isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight && rect.bottom >= 0; // Trigger when partially visible
    }

    function handleScroll() {
        const title = document.querySelector('.main-title');
        const items = document.querySelectorAll('.category-item');

        if (title && isInViewport(title)) {
            title.classList.add('visible');
            console.log('Title is visible');
        } else {
            console.log('Title not in viewport or not found');
        }

        if (items.length > 0) {
            items.forEach((item, index) => {
                if (isInViewport(item)) {
                    setTimeout(() => {
                        item.classList.add('visible');
                        console.log(`Item ${index + 1} is visible`);
                    }, index * 150); // Staggered animation
                }
            });
        } else {
            console.log('No category items found');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run on load
});


document.addEventListener('DOMContentLoaded', () => {
    // تحسينات عامة للأداء
    const animationConfig = {
        charDelay: 30,       // تأخير بين كل حرف (مللي ثانية)
        baseDelay: 300,      // تأخير أساسي للعناوين (مللي ثانية)
        fallbackTimeout: 2500, // وقت الانتظار قبل تفعيل Fallback (مللي ثانية)
        observerThreshold: 0.2 // نسبة الظهور لتفعيل الأنيميشن (20%)
    };

    // دالة لتفريق النص إلى أحرف مع معالجة الأخطاء
    const splitText = (element, delayBase = 0) => {
        try {
            if (!element || !element.textContent) {
                console.warn('العنصر أو النص غير موجود:', element);
                element?.classList.add('fallback-visible');
                return false;
            }

            const text = element.textContent.trim();
            element.innerHTML = '';

            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.setProperty('--delay', `${(index * animationConfig.charDelay) + delayBase}ms`);
                span.style.setProperty('--index', index);
                element.appendChild(span);
            });

            return true;
        } catch (error) {
            console.error('خطأ في تفريق النص:', error);
            element?.classList.add('fallback-visible');
            return false;
        }
    };

    // العناصر المستهدفة
    const elements = {

        content: document.querySelector('.content-text'),
        button: document.querySelector('.cta-button')
    };

    // Debug log to confirm subheading exists
    if (elements.subheading) {
        console.log('Subheading found:', elements.subheading.textContent);
    } else {
        console.warn('العنوان الفرعي غير موجود');
    }

    // تطبيق تأثير الأحرف مع معالجة الأخطاء
    const initAnimations = () => {
        // لا نفرق نص العنوان الفرعي، لأنه سيكون مرئيًا دائمًا
        if (!elements.subheading) {
            console.warn('العنوان الفرعي غير موجود');
        }

        // تفريق أحرف العنوان الرئيسي
        if (elements.heading) {
            splitText(elements.heading, animationConfig.baseDelay);
        } else {
            console.warn('العنوان الرئيسي غير موجود');
        }

        // Fallback بعد فترة زمنية (للعنوان الرئيسي فقط)
        setTimeout(() => {
            if (elements.heading && !elements.heading.classList.contains('visible')) {
                elements.heading.classList.add('fallback-visible');
            }
        }, animationConfig.fallbackTimeout);
    };

    // مراقبة ظهور العناصر
    const initIntersectionObserver = () => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    try {
                        // تفعيل الأنيميشن للعناصر الفرعية
                        animateChildElements(entry.target);
                        observer.unobserve(entry.target);
                    } catch (error) {
                        console.error('خطأ في المراقبة:', error);
                        activateFallback(entry.target);
                    }
                }
            });
        }, {
            threshold: animationConfig.observerThreshold,
            rootMargin: '0px 0px -50px 0px' // تحميل مبكر عند الاقتراب من العنصر
        });

        const targetElement = document.querySelector('.content-container') || document.body;
        observer.observe(targetElement);
    };

    // دالة لتفعيل الأنيميشن على العناصر الفرعية
    const animateChildElements = (container) => {
        // العنوان الرئيسي (أحرف)
        const headingChars = container.querySelectorAll('.main-heading h2 .char');
        if (headingChars.length > 0) {
            headingChars.forEach(char => char.classList.add('visible'));
        } else {
            const heading = container.querySelector('.main-heading h2');
            if (heading) heading.classList.add('fallback-visible');
        }

        // الفقرات النصية
        const paragraphs = container.querySelectorAll('.content-text p');
        paragraphs.forEach((p, index) => {
            setTimeout(() => {
                p.classList.add('visible');
            }, index * 200); // تأثير متدرج
        });

        // الأزرار (إذا وجدت)
        const buttons = container.querySelectorAll('.cta-button, .button');
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.classList.add('visible');
            }, paragraphs.length * 200 + (index * 100));
        });
    };

    // دالة Fallback للطوارئ
    const activateFallback = (element) => {
        element.querySelectorAll('.main-heading h2, .content-text p, .cta-button, .button')
            .forEach(el => el.classList.add('fallback-visible'));
    };

    // بدء التشغيل
    try {
        initAnimations();
        initIntersectionObserver();
    } catch (error) {
        console.error('خطأ في تهيئة الصفحة:', error);
        activateFallback(document.body);
    }

    // إضافة تأثيرات hover ديناميكية للأحرف (للعنوان الرئيسي فقط)
    document.querySelectorAll('.char').forEach(char => {
        char.addEventListener('mouseenter', () => {
            char.style.transform = 'translateY(-5px)';
            char.style.transition = 'transform 0.2s ease';
        });
        char.addEventListener('mouseleave', () => {
            char.style.transform = '';
        });
    });
});






// Initialize Splitting.js for character animations
Splitting();

// Animate characters on scroll
document.querySelectorAll('.charsplit-516d148').forEach(element => {
    gsap.to(element.querySelectorAll('.wdt-chars__item'), {
        scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.out'
    });
});

// Accordion functionality
const accordionHeaders = document.querySelectorAll('.wdt-accordion-toggle-title-holder');
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const isActive = header.classList.contains('active');
        const description = header.nextElementSibling;

        // Close all other accordions
        accordionHeaders.forEach(otherHeader => {
            if (otherHeader !== header) {
                otherHeader.classList.remove('active');
                const otherDesc = otherHeader.nextElementSibling;
                gsap.to(otherDesc, {
                    opacity: 0,
                    maxHeight: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        otherDesc.classList.remove('active');
                    }
                });
            }
        });

        // Toggle current accordion
        if (!isActive) {
            header.classList.add('active');
            description.classList.add('active');
            gsap.to(description, {
                opacity: 0.9,
                maxHeight: 500,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            header.classList.remove('active');
            gsap.to(description, {
                opacity: 0,
                maxHeight: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    description.classList.remove('active');
                }
            });
        }
    });
});

// Ensure active accordions are open on page load
document.querySelectorAll('.wdt-accordion-toggle-title-holder.active').forEach(header => {
    const description = header.nextElementSibling;
    description.classList.add('active');
    gsap.set(description, {
        opacity: 0.9,
        maxHeight: 500
    });
});





// Add this script for toggle functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');

        // Close other open items in the same column
        const column = item.closest('.faq-column');
        column.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
    });
});




// Initialize Swiper
let swiper;
function initializeSwiper() {
    swiper = new Swiper('.wdt-testimonial-container', {
        direction: 'horizontal',
        effect: 'slide',
        slidesPerView: 2,
        spaceBetween: 20, // Reduced for closer cards
        loop: false,
        speed: 300,
        pagination: {
            el: '.wdt-swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 1.5, spaceBetween: 15 },
            1025: { slidesPerView: 2, spaceBetween: 20 },
        },
    });
}

// Star Rating Interaction
const stars = document.querySelectorAll('#star-rating i');
let selectedRating = 0;
stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-value'));
        stars.forEach(s => {
            const value = parseInt(s.getAttribute('data-value'));
            s.className = value <= selectedRating ? 'fas fa-star active' : 'far fa-star';
        });
    });
});

// Load Comments from localStorage
function loadComments() {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const testimonialWrapper = document.querySelector('.wdt-testimonial-wrapper');
    testimonialWrapper.innerHTML = '';
    comments.forEach(comment => {
        const newSlide = createTestimonialSlide(comment);
        testimonialWrapper.appendChild(newSlide);
    });
    if (swiper) {
        swiper.update();
    }
}

// Create Testimonial Slide
function createTestimonialSlide(comment) {
    const newSlide = document.createElement('div');
    newSlide.className = 'swiper-slide';
    newSlide.innerHTML = `
        <div class="wdt-content-item">
          
          <div class="wdt-content-detail-group">
            <div class="wdt-content-elements-group wdt-content-group">
              <div class="wdt-content-button wdt-button-clone">
                <a href="#" target="_blank" rel="nofollow">
                  <div class="wdt-button-text"><span>Just now</span></div>
                </a>
              </div>
              <div class="wdt-content-secondary-image-wrapper">
                <div class="wdt-secondary-content-image">
                  <a href="#" target="_blank" rel="nofollow">
                    <img loading="lazy" decoding="async" width="100" height="100" src="${comment.image}" alt="${comment.name}">
                  </a>
                </div>
              </div>
              <div class="wdt-content-title-group below">
                <div class="wdt-content-title">
                  <h5><a href="#" target="_blank" rel="nofollow">${comment.name}</a></h5>
                </div>
                <div class="wdt-content-subtitle">Customer</div>
              </div>
            </div>
            <div class="wdt-rating-container">
              <ul class="wdt-rating">
                ${Array.from({ length: 5 }, (_, i) => `
                  <li><span class="${i < comment.rating ? 'fas' : 'far'} fa-star" data-value="${i + 1}"></span></li>
                `).join('')}
              </ul>
            </div>
            <div class="wdt-content-description">
              ${comment.comment}
            </div>
            <div class="wdt-content-separator"></div>
          </div>
        </div>
      `;
    return newSlide;
}

// Submit Comment
function submitComment() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const comment = document.getElementById('comment').value.trim();
    const imageInput = document.getElementById('profile-image');
    const imageFile = imageInput.files[0];

    if (!name || !email || !comment || selectedRating === 0) {
        alert('Please fill in all fields and select a rating.');
        return;
    }

    const defaultImage = 'https://placehold.co/100x100';
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveComment(name, email, comment, selectedRating, e.target.result);
            addTestimonial(name, comment, selectedRating, e.target.result);
            clearForm();
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveComment(name, email, comment, selectedRating, defaultImage);
        addTestimonial(name, comment, selectedRating, defaultImage);
        clearForm();
    }
}

// Save Comment to localStorage
function saveComment(name, email, comment, rating, image) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.push({ name, email, comment, rating, image });
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Add Testimonial to Carousel
function addTestimonial(name, comment, rating, image) {
    const testimonialWrapper = document.querySelector('.wdt-testimonial-wrapper');
    const newSlide = createTestimonialSlide({ name, comment, rating, image });
    testimonialWrapper.appendChild(newSlide);
    swiper.update();
    swiper.slideTo(swiper.slides.length - 1);
}

// Clear Form
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('comment').value = '';
    document.getElementById('profile-image').value = '';
    stars.forEach(s => s.className = 'far fa-star');
    selectedRating = 0;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeSwiper();
    loadComments();
});