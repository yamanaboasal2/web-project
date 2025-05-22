let currentImage = 1;

setInterval(() => {
    const img = document.getElementById('image');

    if (currentImage === 1) {
        img.src = "../image/rtt.png";
        currentImage = 2;
    } else {
        img.src = "../image/rtt1.png";
        currentImage = 1;
    }
}, 2000); // كل 2 ثانية

window.onload = function() {
    const heading = document.querySelector('h2');
    // إضافة فئة "active" لتحفيز الحركة
    heading.classList.add('active');

    const imageWrapper = document.querySelector('.image-wrapper');

    // Add animation for image appearance (fade in and scale up)
    imageWrapper.style.transition = 'opacity 1s ease-in-out, transform 1.5s ease-in-out';
    imageWrapper.style.opacity = '1';
    imageWrapper.style.transform = 'scale(1)';
};
document.addEventListener('DOMContentLoaded', function () {
    // تحديد عناصر DOM بعد التأكد من تحميل الصفحة بالكامل
    const tableBody = document.querySelector('#wishlist-table tbody');
    const cartCount = document.getElementById('cart-count');
    const cartIcon = document.getElementById('cart-icon');

    // جلب wishlist و cart من localStorage أو تعيينهم فارغين إذا غير موجودين
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // تحديث عداد العربة
    function updateCartCount() {
        if (!cartCount) return;
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }

    // عرض wishlist في الجدول
    function displayWishlist() {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        if (wishlist.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #555; font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; font-size: 16px;">Your wishlist is empty.</td></tr>';
            return;
        }

        wishlist.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.image}" width="70" height="70" alt="${product.name}" onerror="this.src='https://via.placeholder.com/70x70?text=Image+Not+Found'"></td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>
                    <button class="move-to-cart" data-index="${index}" aria-label="Add to cart">Add to Cart</button>
                    
                </td>
                <td><i class="fas fa-trash-alt remove"
                       data-index="${index}"
                       data-id="${product.id}"
                       aria-label="Remove item" style="cursor:pointer; margin-left:10px;"></i></td>
            `;
            tableBody.appendChild(row);
        });

        updateCartCount();
    }

    // تحريك صورة المنتج نحو العربة (Animation)
    function createFlyingAnimation(imageSrc, startElement, callback) {
        const flyingImage = document.createElement('img');
        flyingImage.src = imageSrc;
        flyingImage.className = 'flying-image';
        document.body.appendChild(flyingImage);

        const startRect = startElement.getBoundingClientRect();
        flyingImage.style.position = 'fixed';
        flyingImage.style.left = `${startRect.left + startRect.width / 2 - 35}px`;
        flyingImage.style.top = `${startRect.top + startRect.height / 2 - 35}px`;
        flyingImage.style.width = '70px';
        flyingImage.style.height = '70px';
        flyingImage.style.zIndex = '1000';
        flyingImage.style.transition = 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out';

        const targetRect = cartIcon ? cartIcon.getBoundingClientRect() : { left: window.innerWidth - 100, top: 50 };
        const targetX = targetRect.left + (targetRect.width / 2) - 35;
        const targetY = targetRect.top + (targetRect.height / 2) - 35;

        setTimeout(() => {
            flyingImage.style.transform = `translate(${targetX - startRect.left - 35}px, ${targetY - startRect.top - 35}px) scale(0.3)`;
            flyingImage.style.opacity = '0';
        }, 50);

        setTimeout(() => {
            flyingImage.remove();
            if (callback) callback();
        }, 800);
    }

    // نقل المنتج من الـ wishlist إلى الـ cart
    function moveToCart(index, buttonElement) {
        const product = wishlist[index];
        if (!product) return;

        cart.push({ ...product, quantity: 1 });
        wishlist.splice(index, 1);

        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        createFlyingAnimation(product.image, buttonElement, () => {
            if (cartIcon) {
                cartIcon.classList.add('pulse');
                setTimeout(() => cartIcon.classList.remove('pulse'), 500);
            }
            updateCartCount();
        });

        displayWishlist();
    }

    // حذف منتج من الـ wishlist وإرسال طلب للحذف من قاعدة البيانات
    function removeFromWishlist(index, productId) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        displayWishlist();

        fetch('../php/remove_favorite.php',{
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `product_id=${encodeURIComponent(productId)}`
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log('Deleted from DB');
                } else {
                    console.error('Failed to delete from DB:', data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }

    // إضافة مستمع لأحداث الأزرار في الجدول
    if (tableBody) {
        tableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove')) {
                const index = Number(event.target.getAttribute('data-index'));
                const productId = Number(event.target.getAttribute('data-id'));
                removeFromWishlist(index, productId);
            } else if (event.target.classList.contains('move-to-cart')) {
                const index = Number(event.target.getAttribute('data-index'));
                moveToCart(index, event.target);
            }
        });
    }

    // عرض القائمة وحساب العربة عند تحميل الصفحة
    displayWishlist();
    updateCartCount();

    // ... (يمكن إضافة باقي الأحداث مثل dropdown بنفس أسلوب DOMContentLoaded)
});













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




