
document.addEventListener('DOMContentLoaded', function() {
    const sliderTrack = document.querySelector('.slider-track');
    const sliderContainer = document.querySelector('.slider-container');

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let startX = 0;

    // Prevent default behaviors
    sliderTrack.addEventListener('dragstart', (e) => e.preventDefault());

    // Mouse events
    sliderTrack.addEventListener('mousedown', startDragging);
    sliderTrack.addEventListener('mousemove', drag);
    sliderTrack.addEventListener('mouseup', stopDragging);
    sliderTrack.addEventListener('mouseleave', stopDragging);

    // Touch events
    sliderTrack.addEventListener('touchstart', startDragging);
    sliderTrack.addEventListener('touchmove', drag);
    sliderTrack.addEventListener('touchend', stopDragging);

    function startDragging(e) {
        isDragging = true;
        startPos = getPositionX(e);
        currentTranslate = prevTranslate;
        animationID = requestAnimationFrame(animation);
        sliderContainer.classList.add('grabbing');
    }

    function drag(e) {
        if (isDragging) {
            const currentPosition = getPositionX(e);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);
        prevTranslate = currentTranslate;
        snapToSlide();
        sliderContainer.classList.remove('grabbing');
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        // Clamp translation to prevent dragging beyond bounds
        const maxTranslate = 0;
        const minTranslate = -(sliderTrack.scrollWidth - sliderContainer.offsetWidth);
        currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, currentTranslate));
        sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
    }

    function snapToSlide() {
        // Snap to nearest slide
        const slideWidth = sliderTrack.offsetWidth / 4; // Assuming 4 slides visible
        const slideIndex = Math.round(-currentTranslate / slideWidth);
        currentTranslate = -slideIndex * slideWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    // Adjust on resize
    window.addEventListener('resize', () => {
        currentTranslate = 0;
        prevTranslate = 0;
        setSliderPosition();
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



