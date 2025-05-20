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
// Check if EmailJS is loaded, use fallback if needed
if (typeof emailjs === 'undefined') {
    console.error('EmailJS SDK not loaded from primary CDN. Attempting fallback CDN.');
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@emailjs/browser@3/dist/email.min.js';
    script.onload = initializeEmailJS;
    script.onerror = () => console.error('EmailJS fallback CDN failed to load. Email functionality will be unavailable.');
    document.head.appendChild(script);
} else {
    initializeEmailJS();
}

function initializeEmailJS() {
    // Initialize EmailJS with your User ID
    // **CRITICAL**: Replace 'YOUR_EMAILJS_USER_ID' with your EmailJS User ID from the EmailJS dashboard
    // Example: emailjs.init("user_1234567890abcdef");
    emailjs.init("5UQDS_zOAqijaNXKQ");
    console.log('EmailJS initialized successfully');
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing quiz');

    // Start quiz button functionality
    const startQuizBtns = document.querySelectorAll('[id^="startQuizBtn"]');
    const quizContainer = document.getElementById('quizContainer');
    const heroSlider = document.getElementById('heroSlider');

    // Check if critical elements exist
    if (!quizContainer || !heroSlider) {
        console.error('Critical elements missing. Check IDs: #quizContainer, #heroSlider');
        return;
    }

    // Explicitly hide quiz container on load
    quizContainer.classList.remove('active');
    quizContainer.style.display = 'none';
    heroSlider.style.display = 'block';
    console.log('Initial state: Hero slider visible, quiz container hidden');

    console.log('Found quiz buttons:', startQuizBtns.length);
    startQuizBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Quiz button clicked:', btn.id);
            heroSlider.style.display = 'none';
            quizContainer.classList.add('active');
            quizContainer.style.display = 'block';
            quizContainer.scrollIntoView({ behavior: 'smooth' });
            console.log('Toggled visibility: Hero slider hidden, quiz container shown');
        });
    });

    // Slider functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const slider = document.querySelector('.quiz-hero');
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));

    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            clearInterval(slideInterval);
            showSlide(parseInt(this.getAttribute('data-slide')));
            slideInterval = setInterval(nextSlide, 5000);
        });
    });

    // Quiz navigation variables
    const steps = document.querySelectorAll('.quiz-step');
    const resultContainer = document.getElementById('result');
    const progressBar = document.getElementById('progressBar');
    const nextButtons = document.querySelectorAll('[id^="next"]');
    const prevButtons = document.querySelectorAll('[id^="prev"]');
    const submitEmail = document.getElementById('submitEmail');
    const restartQuiz = document.getElementById('restartQuiz');
    let currentStep = 0;
    const totalSteps = 5; // Number of quiz steps (excluding email and result)

    // User answers object
    const userAnswers = {
        skinType: '',
        sensitivity: '',
        ageGroup: '',
        preference: '',
        goals: []
    };

    // Initialize the quiz
    function initQuiz() {
        showStep(0);
        setupOptionSelection();
        console.log('Quiz initialized, showing step 1');
    }

    // Show current step and hide others
    function showStep(stepIndex) {
        // Hide all steps and result
        steps.forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none';
        });
        resultContainer.classList.remove('active');
        resultContainer.style.display = 'none';

        // Show the requested step
        if (stepIndex >= 0 && stepIndex < steps.length) {
            steps[stepIndex].classList.add('active');
            steps[stepIndex].style.display = 'block';
        } else if (stepIndex === steps.length) {
            // Show result
            resultContainer.classList.add('active');
            resultContainer.style.display = 'block';
        }

        // Update progress bar (exclude result step)
        if (stepIndex < totalSteps) {
            const progress = ((stepIndex) / totalSteps) * 100;
            progressBar.style.width = `${progress}%`;
        } else {
            progressBar.style.width = '100%';
        }

        currentStep = stepIndex;
    }

    // Setup option selection for each step
    function setupOptionSelection() {
        const options = document.querySelectorAll('.quiz-option');

        options.forEach(option => {
            option.addEventListener('click', function() {
                // For steps with single selection (not goals)
                if (!this.closest('#step5')) {
                    // Remove selected class from siblings
                    const parent = this.parentElement;
                    const siblings = parent.querySelectorAll('.quiz-option');
                    siblings.forEach(sib => sib.classList.remove('selected'));

                    // Add selected class to clicked option
                    this.classList.add('selected');

                    // Store the selected value
                    const stepId = this.closest('.quiz-step').id;
                    const value = this.getAttribute('data-value');

                    if (stepId === 'step1') {
                        userAnswers.skinType = value;
                    } else if (stepId === 'step2') {
                        userAnswers.sensitivity = value;
                    } else if (stepId === 'step3') {
                        userAnswers.ageGroup = value;
                    } else if (stepId === 'step4') {
                        userAnswers.preference = value;
                    }

                    // Enable next button
                    const nextButton = document.querySelector(`#${stepId} .btn-next`);
                    if (nextButton) {
                        nextButton.disabled = false;
                    }
                } else {
                    // For goals step (multiple selection)
                    const value = this.getAttribute('data-value');
                    const index = userAnswers.goals.indexOf(value);
                    if (index === -1) {
                        if (userAnswers.goals.length < 3) {
                            userAnswers.goals.push(value);
                            this.classList.add('selected');
                        }
                    } else {
                        userAnswers.goals.splice(index, 1);
                        this.classList.remove('selected');
                    }

                    // Enable next button if at least one goal is selected
                    const nextButton = document.querySelector('#step5 .btn-next');
                    if (nextButton) {
                        nextButton.disabled = userAnswers.goals.length === 0;
                    }
                }
            });
        });
    }

    // Next button click handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStepId = this.closest('.quiz-step').id;
            const nextStepIndex = parseInt(currentStepId.replace('step', ''));

            // Special case for goals step
            if (currentStepId === 'step5' && userAnswers.goals.length === 0) {
                alert('Please select at least one goal');
                return;
            }

            showStep(nextStepIndex);
        });
    });

    // Previous button click handlers
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStepId = this.closest('.quiz-step').id;
            const prevStepIndex = parseInt(currentStepId.replace('step', '')) - 1;
            showStep(prevStepIndex);
        });
    });

    // Submit email handler
    submitEmail.addEventListener('click', function() {
        const email = document.getElementById('userEmail').value;
        if (!email || !email.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }

        // Prepare email content to match results page
        const emailContent = {
            to_email: email,
            product_title: "Marine Algae Face Moisturizer",
            product_tags: "Natural, Vegan, Made in Quebec, Recyclable packaging",
            product_description: "Made from aloe vera, this lightweight face moisturizer will soothe, moisturize and brighten your skin. It also contains algae (seaweed), Chlorella and Melissa flower water, with powerful anti-inflammatory and anti-aging properties to revitalise the skin and boost suppleness. Its light gel texture absorbs quickly to quench the skin!",
            offer: "Get a FREE face scrub of your choice with the purchase of a moisturizer*",
            user_answers: JSON.stringify(userAnswers, null, 2)
        };

        // Log email content for debugging
        console.log('Attempting to send email with content:', emailContent);

        // Send email using EmailJS
        // **CRITICAL**: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your EmailJS Service ID and Template ID
        // Example: emailjs.send('service_xxxxxxx', 'template_xxxxxxx', emailContent)
        emailjs.send('service_4mhwk0b', 'template_xjbsrh5', emailContent)
            .then(function(response) {
                console.log('Email sent successfully:', response.status, response.text);
                console.log('User answers:', userAnswers);
                console.log('User email:', email);
                alert('Email sent successfully! Please check your inbox and spam/junk folder.');
                // Show results
                showStep(steps.length);
            }, function(error) {
                console.error('Email sending failed:', error);
                let errorMessage = 'Failed to send email. ';
                if (error.status === 401) {
                    errorMessage += 'Invalid User ID. Please check YOUR_EMAILJS_USER_ID in the EmailJS dashboard.';
                } else if (error.status === 400) {
                    errorMessage += 'Invalid Service ID, Template ID, or template parameters. Please check YOUR_SERVICE_ID and YOUR_TEMPLATE_ID, and ensure template placeholders match the email content.';
                } else if (error.status === 429) {
                    errorMessage += 'EmailJS quota exceeded (200 emails/month). Please check your EmailJS dashboard or upgrade your plan.';
                } else if (error.status === 0) {
                    errorMessage += 'Network error or EmailJS SDK not loaded. Please check your internet connection and ensure the EmailJS script is loaded.';
                } else {
                    errorMessage += error.text || 'Unknown error. Please check your EmailJS configuration and try again.';
                }
                alert(errorMessage + ' You can still view your results below. Contact support if the issue persists.');
                // Show results even if email fails
                showStep(steps.length);
            });
    });

    // Restart quiz handler
    restartQuiz.addEventListener('click', function() {
        // Reset user answers
        for (let key in userAnswers) {
            if (Array.isArray(userAnswers[key])) {
                userAnswers[key] = [];
            } else {
                userAnswers[key] = '';
            }
        }

        // Reset UI
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });

        document.querySelectorAll('.btn-next').forEach(btn => {
            btn.disabled = true;
        });

        document.getElementById('userEmail').value = '';

        // Show hero slider and hide quiz
        heroSlider.style.display = 'block';
        quizContainer.classList.remove('active');
        quizContainer.style.display = 'none';
        console.log('Quiz reset: Hero slider visible, quiz container hidden');

        // Reset to first slide
        showSlide(0);
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);

        // Show first step
        showStep(0);
    });

    // Initialize the quiz
    initQuiz();
});

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    let currentIndex = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');

            if (i === index) {
                slide.classList.add('active');
            } else if (i < index) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
        resetTimer();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
        resetTimer();
    }

    function resetTimer() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
    }

    // Event listeners
    nextArrow.addEventListener('click', nextSlide);
    prevArrow.addEventListener('click', prevSlide);

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentIndex = i;
            showSlide(currentIndex);
            resetTimer();
        });
    });

    // Auto-play with pause on hover
    slideInterval = setInterval(nextSlide, 6000);

    const slider = document.querySelector('.quiz-hero');
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    slider.addEventListener('mouseleave', resetTimer);

    // Initialize first slide
    showSlide(0);
});
