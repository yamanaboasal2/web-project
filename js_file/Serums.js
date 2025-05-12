
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