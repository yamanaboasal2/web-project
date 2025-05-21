document.addEventListener('DOMContentLoaded', function() {
    function initSlider(sliderId) {
        const container = document.getElementById(sliderId);
        const mainImages = container.querySelectorAll('.main-image');
        const thumbnails = container.querySelectorAll('.thumbnail');
        const prevBtn = container.querySelector('.prev-arrow');
        const nextBtn = container.querySelector('.next-arrow');
        let currentIndex = 0;

        function showImage(index) {
            mainImages.forEach(img => img.classList.remove('active'));
            thumbnails.forEach(thumb => thumb.classList.remove('active-thumbnail'));

            mainImages[index].classList.add('active');
            thumbnails[index].classList.add('active-thumbnail');
            currentIndex = index;
        }

        prevBtn.addEventListener('click', function() {
            const newIndex = currentIndex > 0 ? currentIndex - 1 : mainImages.length - 1;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', function() {
            const newIndex = currentIndex < mainImages.length - 1 ? currentIndex + 1 : 0;
            showImage(newIndex);
        });

        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => showImage(index));
        });

        // Auto-slide
        let autoSlide = setInterval(() => {
            const newIndex = currentIndex < mainImages.length - 1 ? currentIndex + 1 : 0;
            showImage(newIndex);
        }, 3000);

        container.querySelector('.slider-container').addEventListener('mouseenter', () => {
            clearInterval(autoSlide);
        });

        container.querySelector('.slider-container').addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                const newIndex = currentIndex < mainImages.length - 1 ? currentIndex + 1 : 0;
                showImage(newIndex);
            }, 3000);
        });
    }

    initSlider('slider1-container');

    initSlider('slider2-container');

    initSlider('slider3-container');
});

window.addEventListener('DOMContentLoaded', () => {
    const wrappers = document.querySelectorAll('.img-wrapper');

    wrappers.forEach((wrapper, index) => {
        setTimeout(() => {
            wrapper.classList.add('show');
        }, index * 500);
    });
});



function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const countElement = document.getElementById('wishlist-count');
    countElement.textContent = wishlist.length;
    countElement.style.display = wishlist.length > 0 ? 'inline-block' : 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    const wishlistButtons = document.querySelectorAll('.wishlist');

    if (wishlistButtons.length > 0) {
        wishlistButtons.forEach(button => {
            button.addEventListener('click', function () {
                const name = button.getAttribute('data-name');
                const price = button.getAttribute('data-price');
                const image = button.getAttribute('data-image');
                const id = button.getAttribute('data-id');
                const product = { id, name, price, image };

                // أرسل إلى السيرفر
                fetch('/web-project1/php/add_to_favorite.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `product_id=${id}`
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data.message);
                    });

                // localStorage
                let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                wishlist.push(product);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                updateWishlistCount();

                // ✈️ Animation
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
    }
});
document.addEventListener('DOMContentLoaded', updateWishlistCount);

document.querySelectorAll('.cart').forEach(button => {
    button.addEventListener('click', function () {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        const image = button.getAttribute('data-image');
        const productId = button.getAttribute('data-id');

        if (!productId) {
            console.error('خطأ: معرف المنتج غير موجود!');
            return;
        }

        const product = { name, price, image };
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updatecartCount();

        const url = '/web-project1/php/add_to_cart.php';
        console.log('إرسال طلب POST إلى:', url);

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                product_id: productId,
                quantity: 1
            })
        })
            .then(res => {
                console.log('حالة الاستجابة:', res.status);
                if (!res.ok) {
                    throw new Error(`خطأ HTTP! الحالة: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('رد الخادم:', data);
            })
            .catch(err => {
                console.error('خطأ في الطلب:', err);
            });

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

function updatecartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countElement = document.getElementById('cart-count');
    countElement.textContent = cart.length;
    countElement.style.display = cart.length > 0 ? 'inline-block' : 'none';
}
document.addEventListener('DOMContentLoaded', updatecartCount);
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


