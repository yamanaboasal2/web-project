document.addEventListener('DOMContentLoaded', () => {
    const productSlider = new Swiper('.products-grid', {
        slidesPerView: 'auto', // Uses natural card width (90px)
        spaceBetween: 4, // Matches CSS gap
        freeMode: true, // Smooth scrolling
        scrollbar: {
            el: '.products-grid::-webkit-scrollbar',
            draggable: true,
            dragSize: 30 // Small drag handle
        },
        breakpoints: {
            320: { slidesPerView: 'auto', spaceBetween: 4 },
            768: { slidesPerView: 'auto', spaceBetween: 4 }
        }
    });
});if (window.innerWidth <= 768) {
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.width = '90px';
        card.style.maxWidth = '90px';
    });
}