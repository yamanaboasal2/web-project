document.addEventListener('DOMContentLoaded', function() {
    const introContent = document.querySelector('.skincare-intro-content');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.3 });

    observer.observe(introContent);
});

document.addEventListener('DOMContentLoaded', function () {
    let allProducts = [];
    let currentSort = 'featured';
    let currentMaxPrice = 100;
    let currentView = 'grid'; // Track current view (grid or list)

    // Debounce function to limit frequent updates
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // جمع المنتج اليدوي من HTML
    function collectStaticProducts() {
        const staticProducts = [];
        const productCards = document.querySelectorAll('#products-grid .product-card');
        productCards.forEach((card, index) => {
            const name = card.querySelector('.product-title').textContent;
            const price = card.querySelector('.product-price').textContent.replace('$', '');
            const primaryImage = card.querySelector('.primary-image').src;
            const secondaryImage = card.querySelector('.secondary-image') ? card.querySelector('.secondary-image').src : '';
            staticProducts.push({
                id: `static-${index + 1}`,
                name,
                price: parseFloat(price) || 0, // تحويل إلى عدد مع قيمة افتراضية
                primary_image: primaryImage,
                secondary_image: secondaryImage,
                created_at: new Date().toISOString(), // للترتيب حسب التاريخ
                isStatic: true
            });
        });
        return staticProducts;
    }

    // جلب المنتجات الديناميكية
    function loadDynamicProducts() {
        fetch('../php/get_products.php?type=bodycare')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Dynamic Data received:', data); // لتصحيح الأخطاء
                // تحويل price إلى عدد للمنتجات الديناميكية
                const dynamicProducts = data.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price) || 0, // تحويل إلى عدد
                    primary_image: product.primary_image,
                    secondary_image: product.secondary_image || '',
                    created_at: product.created_at,
                    isStatic: false
                }));
                // دمج المنتج اليدوي والمنتجات الديناميكية
                const staticProducts = collectStaticProducts();
                allProducts = [...staticProducts, ...dynamicProducts];
                applyFiltersAndSort();
            })
            .catch(error => {
                console.error('Error fetching dynamic products:', error);
                alert('حدث خطأ أثناء جلب المنتجات الديناميكية: ' + error.message);
                // عرض المنتج اليدوي فقط في حالة الخطأ
                allProducts = collectStaticProducts();
                applyFiltersAndSort();
            });
    }

    // عرض المنتجات
    function renderProducts(products) {
        const grid = document.getElementById('products-grid');
        grid.innerHTML = ''; // إفراغ الشبكة

        products.forEach((product, index) => {
            // التأكد من أن price عدد صالح
            const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
            const productCard = `
                <div class="product-card ${currentView}-view" data-index="${index + 1}" style="background-color: transparent;">
                    <div class="card-media">
                        <img src="${product.primary_image}" alt="${product.name}" class="product-image primary-image">
                        ${product.secondary_image ? `<img src="${product.secondary_image}" alt="${product.name} Alternate" class="product-image secondary-image">` : ''}
                        <div class="card-badges">
                            <button class="wishlist-btn" aria-label="Add to wishlist" data-name="${product.name}" data-price="$${price.toFixed(2)}" data-image="${product.primary_image}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="card-info">
                        <a href="#" class="product-title">${product.name}</a>
                        <div class="product-price">$${price.toFixed(2)}</div>
                        <button class="add-to-cart" data-name="${product.name}" data-price="${price}" data-image="${product.primary_image}">
                            <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            grid.innerHTML += productCard;
        });
    }

    // تطبيق التصفية والترتيب
    function applyFiltersAndSort() {
        let filteredProducts = allProducts.filter(product => {
            const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
            return price <= currentMaxPrice;
        });

        switch (currentSort) {
            case 'alpha-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'alpha-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(b.name));
                break;
            case 'price-asc':
                filteredProducts.sort((a, b) => {
                    const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price) || 0;
                    const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => {
                    const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price) || 0;
                    const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;
                    return priceB - priceA;
                });
                break;
            case 'date-old':
                filteredProducts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'date-new':
                filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            default:
                // featured (افتراضي): المنتج اليدوي أولاً
                filteredProducts = [...filteredProducts.filter(p => p.isStatic), ...filteredProducts.filter(p => !p.isStatic)];
                break;
        }

        renderProducts(filteredProducts);
    }

    // تحديث التصفية بالسعر
    function updatePriceFilter() {
        currentMaxPrice = parseFloat(slider.value);
        maxPriceSpan.textContent = currentMaxPrice.toFixed(2);
        priceValue.textContent = `Price: $0 – $${currentMaxPrice.toFixed(2)}`;
        applyFiltersAndSort();
    }

    // إعداد التصفية
    const slider = document.querySelector('.slider');
    const maxPriceSpan = document.querySelector('.max-price');
    const priceValue = document.querySelector('.price-value');
    const applyBtn = document.querySelector('.apply-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const resetBtn = document.querySelector('.reset-btn');

    if (slider && priceValue && maxPriceSpan) {
        slider.addEventListener('input', debounce(updatePriceFilter, 100));
        applyBtn.addEventListener('click', updatePriceFilter);
        clearBtn.addEventListener('click', () => {
            slider.value = 100;
            currentMaxPrice = 100;
            updatePriceFilter();
        });
        resetBtn.addEventListener('click', () => {
            slider.value = 100;
            currentMaxPrice = 100;
            updatePriceFilter();
        });
    }

    // إعداد الترتيب
    document.querySelectorAll('.sort-options a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector('.sort-options .active').classList.remove('active');
            this.classList.add('active');
            currentSort = this.dataset.sort;
            applyFiltersAndSort();
        });
    });

    // إعداد القائمة المنسدلة
    document.querySelectorAll('.dropdown-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const parent = this.parentElement;
            parent.classList.toggle('active');
            document.querySelectorAll('.control-dropdown').forEach(dropdown => {
                if (dropdown !== parent && dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                }
            });
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.control-dropdown')) {
            document.querySelectorAll('.control-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // تأثير الظهور لـ skincare-intro-content
    const introContent = document.querySelector('.skincare-intro-content');
    if (introContent) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.3 });
        observer.observe(introContent);
    }

    // إعداد أزرار العرض (Grid/List View)
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.classList.contains('list-view') ? 'list' : 'grid';
            console.log(currentView === 'list' ? 'List View Activated' : 'Grid View Activated');
            applyFiltersAndSort(); // إعادة عرض المنتجات مع العرض الجديد
        });
    });

    // إعداد القائمة الضخمة (Mega Dropdown)
    const megaDropdown = document.querySelector('.mega-dropdown');
    if (megaDropdown) {
        const dropdownToggle = megaDropdown.querySelector('.dropdown-toggle');
        const dropdownMenu = megaDropdown.querySelector('.dropdown-menu');

        function isMobile() {
            return window.innerWidth <= 991.98 || 'ontouchstart' in window;
        }

        if (!isMobile()) {
            megaDropdown.addEventListener('mouseenter', function () {
                dropdownToggle.setAttribute('aria-expanded', 'true');
                dropdownMenu.classList.add('show');
            });

            megaDropdown.addEventListener('mouseleave', function () {
                dropdownToggle.setAttribute('aria-expanded', 'false');
                dropdownMenu.classList.remove('show');
            });

            dropdownToggle.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = this.getAttribute('href');
            });
        } else {
            dropdownToggle.addEventListener('click', function (e) {
                if (!dropdownMenu.classList.contains('show')) {
                    e.preventDefault();
                    dropdownToggle.setAttribute('aria-expanded', 'true');
                    dropdownMenu.classList.add('show');
                } else {
                    window.location.href = this.getAttribute('href');
                }
            });

            document.addEventListener('click', function (e) {
                if (!e.target.closest('.mega-dropdown')) {
                    dropdownMenu.classList.remove('show');
                    dropdownToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
    document.addEventListener('click', function (e) {
        if (e.target.closest('.wishlist-btn')) {
            const button = e.target.closest('.wishlist-btn');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price').replace('$', '')) || 0;
            const image = button.getAttribute('data-image');

            // افترض أن لديك user_id (يتم الحصول عليه من جلسة المستخدم)
            const user_id = 1; // استبدل هذا بمعرف المستخدم الفعلي من جلسة تسجيل الدخول

            if (!image) {
                console.error('No image provided for wishlist item');
                return;
            }

            const product = { name, price: `$${price.toFixed(2)}`, image }; // تنسيق السعر كما في الكود الثاني

            // إرسال طلب AJAX إلى قاعدة البيانات
            fetch('../php/add_to_wishlist.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `user_id=${user_id}&product_name=${encodeURIComponent(name)}&product_price=${price}&product_image=${encodeURIComponent(image)}`
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // إضافة المنتج إلى localStorage
                        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                        wishlist.push(product); // السماح بالتكرار كما في الكود الثاني
                        localStorage.setItem('wishlist', JSON.stringify(wishlist));

                        // تحديث عدد المفضلة
                        updateWishlistCount();

                        // تأثير الصورة الطائرة
                        const flyingImg = document.createElement('img');
                        flyingImg.src = image;
                        flyingImg.className = 'flying-img';
                        const rect = button.getBoundingClientRect();
                        flyingImg.style.top = `${rect.top + window.scrollY}px`;
                        flyingImg.style.left = `${rect.left + window.scrollX}px`;
                        document.body.appendChild(flyingImg);

                        const wishlistIcon = document.getElementById('wishlist-icon');
                        if (!wishlistIcon) {
                            console.error('wishlist-icon not found in DOM');
                            flyingImg.remove();
                            return;
                        }
                        const target = wishlistIcon.getBoundingClientRect();
                        const deltaX = target.left - rect.left;
                        const deltaY = target.top - rect.top;

                        requestAnimationFrame(() => {
                            flyingImg.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.3)`;
                            flyingImg.style.opacity = '0';
                        });

                        setTimeout(() => flyingImg.remove(), 1000);
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error adding to wishlist:', error);
                    alert('حدث خطأ أثناء إضافة المنتج إلى المفضلة');
                });
        }
    });

// تحديث عدد المفضلة بناءً على localStorage
    function updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const countElement = document.getElementById('wishlist-count');
        countElement.textContent = wishlist.length;
        countElement.style.display = wishlist.length > 0 ? 'inline-block' : 'none';
    }

// استدعاء تحديث العدد عند تحميل الصفحة
    updateWishlistCount();

    // تحديث عدد عربة التسوق
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const countElement = document.getElementById('cart-count');
        countElement.textContent = cart.length;
        countElement.style.display = cart.length > 0 ? 'inline-block' : 'none';
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            const image = button.getAttribute('data-image');
            if (!image) {
                console.error('No image provided for cart item');
                return;
            }
            const product = { name, price, image };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(product); // السماح بالتكرار
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            const flyingImg = document.createElement('img');
            flyingImg.src = image;
            flyingImg.className = 'flying-img';
            const rect = button.getBoundingClientRect();
            flyingImg.style.top = `${rect.top + window.scrollY}px`;
            flyingImg.style.left = `${rect.left + window.scrollX}px`;
            document.body.appendChild(flyingImg);

            const cartIcon = document.getElementById('cart-icon');
            if (!cartIcon) {
                console.error('cart-icon not found in DOM');
                flyingImg.remove();
                return;
            }
            const target = cartIcon.getBoundingClientRect();
            const deltaX = target.left - rect.left;
            const deltaY = target.top - rect.top;

            requestAnimationFrame(() => {
                flyingImg.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.3)`;
                flyingImg.style.opacity = '0';
            });

            setTimeout(() => flyingImg.remove(), 1000);
        }
    });

    updateCartCount();

    // تحميل المنتجات عند تحميل الصفحة
    loadDynamicProducts();
});