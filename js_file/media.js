const productSlider = new Swiper('.product-slider-container', {
    slidesPerView: 'auto', // Allows slides to take their natural width (140px)
    spaceBetween: 8, // Matches CSS gap
    freeMode: true, // Enables smooth scrolling
    scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true
    },
    breakpoints: {
        320: {
            slidesPerView: 'auto',
            spaceBetween: 8
        },
        768: {
            slidesPerView: 'auto',
            spaceBetween: 8
        }
    }
});