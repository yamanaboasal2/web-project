
document.addEventListener('DOMContentLoaded', function() {
    // Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Scroll animations
    const faqHeader = document.querySelector('.faq-header');
    const faqElements = document.querySelectorAll('.faq-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target === faqHeader) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.add('visible');
                }
            }
        });
    }, { threshold: 0.1 });

    observer.observe(faqHeader);
    faqElements.forEach(item => observer.observe(item));
});
document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.skincare-step');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    steps.forEach(step => {
        observer.observe(step);
    });
});
// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section-block');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
});
// Scroll Animation Trigger
document.addEventListener('DOMContentLoaded', function() {
    const routineSection = document.querySelector('.routine-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });

    observer.observe(routineSection);
});

// Scroll Animation Trigger
document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.item-box');

    // Set order for staggered animation
    items.forEach((item, index) => {
        item.style.setProperty('--order', index);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => {
        observer.observe(item);
    });
});




document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.product-showcase');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentSlide = 0;
    let isAnimating = false;

    // Initialize first slide
    updateActiveSlide(0);

    // Navigation dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isAnimating && index !== currentSlide) {
                goToSlide(index);
            }
        });
    });

    // Arrow navigation
    prevBtn.addEventListener('click', () => {
        if (!isAnimating) {
            const newSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
            goToSlide(newSlide);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (!isAnimating) {
            const newSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
            goToSlide(newSlide);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !isAnimating) {
            const newSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
            goToSlide(newSlide);
        } else if (e.key === 'ArrowRight' && !isAnimating) {
            const newSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
            goToSlide(newSlide);
        }
    });

    function goToSlide(index) {
        isAnimating = true;

        // Deactivate current slide
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Update current slide
        currentSlide = index;

        // Scroll to new slide
        slider.scrollTo({
            left: slider.clientWidth * currentSlide,
            behavior: 'smooth'
        });

        // Activate new slide with delay
        setTimeout(() => {
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            isAnimating = false;
        }, 300);
    }

    function updateActiveSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    // Show arrows with animation
    setTimeout(() => {
        prevBtn.classList.add('visible');
        nextBtn.classList.add('visible');
    }, 1000);
});


// Animation on scroll
document.addEventListener('DOMContentLoaded', () => {
    const productSection = document.querySelector('.product-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    observer.observe(productSection);
});
// Example intersection observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

document.querySelectorAll('.description').forEach(desc => {
    observer.observe(desc);
});





function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const countElement = document.getElementById('wishlist-count');
    countElement.textContent = wishlist.length;
    countElement.style.display = wishlist.length > 0 ? 'inline-block' : 'none';
}

document.querySelectorAll('.save-item').forEach(button => {
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





function updatecartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countElement = document.getElementById('cart-count');
    countElement.textContent = cart.length;
    countElement.style.display = cart.length > 0 ? 'inline-block' : 'none';
}

document.querySelectorAll('.purchase-btn').forEach(button => {
    button.addEventListener('click', function () {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        const image = button.getAttribute('data-image');
        const product = { name, price, image };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // 👉 السماح بالتكرار
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));

        // ✅ تحديث العداد دايماً
        updatecartCount();

        // ✈️ حركة الطيران
        const flyingImg = document.createElement('img');
        flyingImg.src = image;
        flyingImg.className = 'flying-img';

        const rect = button.getBoundingClientRect();
        flyingImg.style.top = `${rect.top + window.scrollY}px`;
        flyingImg.style.left = `${rect.left + window.scrollX}px`;

        document.body.appendChild(flyingImg);

        const target = document.getElementById('cart-icon').getBoundingClientRect();
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
document.addEventListener('DOMContentLoaded', updatecartCount);





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