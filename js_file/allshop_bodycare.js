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
//
// document.addEventListener('DOMContentLoaded', function() {
//     // Toggle dropdowns
//     const dropdownBtns = document.querySelectorAll('.dropdown-btn');
//
//     dropdownBtns.forEach(btn => {
//         btn.addEventListener('click', function() {
//             const parent = this.parentElement;
//             parent.classList.toggle('active');
//
//             // Close other open dropdowns
//             document.querySelectorAll('.control-dropdown').forEach(dropdown => {
//                 if (dropdown !== parent && dropdown.classList.contains('active')) {
//                     dropdown.classList.remove('active');
//                 }
//             });
//         });
//     });
//
//     // Close dropdowns when clicking outside
//     document.addEventListener('click', function(e) {
//         if (!e.target.closest('.control-dropdown')) {
//             document.querySelectorAll('.control-dropdown').forEach(dropdown => {
//                 dropdown.classList.remove('active');
//             });
//         }
//     });
//
//     // Price range slider functionality
//     const slider = document.querySelector('.slider');
//     const priceValue = document.querySelector('.price-value');
//
//     if (slider && priceValue) {
//         slider.addEventListener('input', function() {
//             priceValue.textContent = `Price: $0 – $${this.value}`;
//         });
//     }
// });
//
// document.addEventListener('DOMContentLoaded', function() {
//     const viewBtns = document.querySelectorAll('.view-btn');
//
//     viewBtns.forEach(btn => {
//         btn.addEventListener('click', function(e) {
//             e.preventDefault();
//
//             // إزالة النشاط من جميع الأزرار
//             viewBtns.forEach(b => b.classList.remove('active'));
//
//             // إضافة النشاط للزر المختار
//             this.classList.add('active');
//
//             // هنا يمكنك إضافة كود تغيير طريقة العرض الفعلية
//             const isListView = this.classList.contains('list-view');
//             console.log(isListView ? 'List View Activated' : 'Grid View Activated');
//
//             // يمكنك استبدال console.log بكواد تغيير العرض حسب احتياجك
//         });
//     });
// });
//
// document.addEventListener('DOMContentLoaded', function () {
//     const megaDropdown = document.querySelector('.mega-dropdown');
//     const dropdownToggle = megaDropdown.querySelector('.dropdown-toggle');
//     const dropdownMenu = megaDropdown.querySelector('.dropdown-menu');
//
//     // Check if device is mobile
//     function isMobile() {
//         return window.innerWidth <= 991.98 || 'ontouchstart' in window;
//     }
//
//     if (!isMobile()) {
//         // Show dropdown on hover over link or menu
//         megaDropdown.addEventListener('mouseenter', function () {
//             dropdownToggle.setAttribute('aria-expanded', 'true');
//             dropdownMenu.classList.add('show');
//         });
//
//         // Hide dropdown when leaving both link and menu
//         megaDropdown.addEventListener('mouseleave', function () {
//             dropdownToggle.setAttribute('aria-expanded', 'false');
//             dropdownMenu.classList.remove('show');
//         });
//
//         // Allow navigation on click
//         dropdownToggle.addEventListener('click', function (e) {
//             e.preventDefault(); // Prevent default to avoid Bootstrap toggle
//             window.location.href = this.getAttribute('href');
//         });
//     } else {
//         // Mobile: Toggle dropdown on first tap, navigate on second
//         dropdownToggle.addEventListener('click', function (e) {
//             if (!dropdownMenu.classList.contains('show')) {
//                 e.preventDefault();
//                 dropdownToggle.setAttribute('aria-expanded', 'true');
//                 dropdownMenu.classList.add('show');
//             } else {
//                 window.location.href = this.getAttribute('href');
//             }
//         });
//
//         // Close dropdown on outside tap
//         document.addEventListener('click', function (e) {
//             if (!e.target.closest('.mega-dropdown')) {
//                 dropdownMenu.classList.remove('show');
//                 dropdownToggle.setAttribute('aria-expanded', 'false');
//             }
//         });
//     }
// });
//
//
// // Price Filter
// const slider = document.querySelector('.slider');
// const priceValue = document.querySelector('.price-value');
// const maxPriceSpan = document.querySelector('.max-price');
// const applyBtn = document.querySelector('.apply-btn');
// const clearBtn = document.querySelector('.clear-btn');
// const resetBtn = document.querySelector('.reset-btn');
// const productCards = document.querySelectorAll('.product-card');
// const productsGrid = document.querySelector('.products-grid');
//
// function updatePriceFilter() {
//     const maxPrice = parseFloat(slider.value);
//     maxPriceSpan.textContent = maxPrice.toFixed(2);
//     priceValue.textContent = `Price: $0 – $${maxPrice.toFixed(2)}`;
//
//     productCards.forEach(card => {
//         const price = parseFloat(card.querySelector('.add-to-cart').dataset.price);
//         card.style.display = price <= maxPrice ? 'flex' : 'none';
//     });
// }
//
// // Debounce function to limit frequent updates
// function debounce(func, wait) {
//     let timeout;
//     return function executedFunction(...args) {
//         const later = () => {
//             clearTimeout(timeout);
//             func(...args);
//         };
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//     };
// }
//
// slider.addEventListener('input', debounce(updatePriceFilter, 100));
// applyBtn.addEventListener('click', updatePriceFilter);
// clearBtn.addEventListener('click', () => {
//     slider.value = 100;
//     updatePriceFilter();
// });
// resetBtn.addEventListener('click', () => {
//     slider.value = 100;
//     updatePriceFilter();
// });
//
// // Sort Functionality
// const sortOptions = document.querySelectorAll('.sort-options a');
// let originalOrder = Array.from(productCards);
//
// sortOptions.forEach(option => {
//     option.addEventListener('click', (e) => {
//         e.preventDefault();
//         sortOptions.forEach(opt => opt.classList.remove('active'));
//         option.classList.add('active');
//
//         const sortType = option.dataset.sort;
//         let sortedCards = Array.from(productCards).filter(card => card.style.display !== 'none');
//
//         if (sortType === 'featured') {
//             sortedCards = originalOrder.filter(card => card.style.display !== 'none');
//         } else {
//             sortedCards.sort((a, b) => {
//                 const aPrice = parseFloat(a.querySelector('.add-to-cart').dataset.price);
//                 const bPrice = parseFloat(b.querySelector('.add-to-cart').dataset.price);
//                 const aName = a.querySelector('.add-to-cart').dataset.name.toLowerCase();
//                 const bName = b.querySelector('.add-to-cart').dataset.name.toLowerCase();
//
//                 if (sortType === 'price-asc') return aPrice - bPrice;
//                 if (sortType === 'price-desc') return bPrice - aPrice;
//                 if (sortType === 'alpha-asc') return aName.localeCompare(bName);
//                 if (sortType === 'alpha-desc') return bName.localeCompare(aName);
//                 // For best-selling, date-old, date-new, use original order
//                 return parseInt(a.dataset.index) - parseInt(b.dataset.index);
//             });
//         }
//
//         // Rebuild grid with only visible cards
//         productsGrid.innerHTML = '';
//         sortedCards.forEach(card => productsGrid.appendChild(card));
//     });
// });
//
//
// function updateWishlistCount() {
//     const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
//     const countElement = document.getElementById('wishlist-count');
//     countElement.textContent = wishlist.length;
//     countElement.style.display = wishlist.length > 0 ? 'inline-block' : 'none';
// }
//
// document.querySelectorAll('.wishlist-btn').forEach(button => {
//     button.addEventListener('click', function () {
//         const name = button.getAttribute('data-name');
//         const price = button.getAttribute('data-price');
//         const image = button.getAttribute('data-image');
//         const product = { name, price, image };
//
//         let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
//
//         // 👉 السماح بالتكرار
//         wishlist.push(product);
//         localStorage.setItem('wishlist', JSON.stringify(wishlist));
//
//         // ✅ تحديث العداد دايماً
//         updateWishlistCount();
//
//         // ✈️ حركة الطيران
//         const flyingImg = document.createElement('img');
//         flyingImg.src = image;
//         flyingImg.className = 'flying-img';
//
//         const rect = button.getBoundingClientRect();
//         flyingImg.style.top = `${rect.top + window.scrollY}px`;
//         flyingImg.style.left = `${rect.left + window.scrollX}px`;
//
//         document.body.appendChild(flyingImg);
//
//         const target = document.getElementById('wishlist-icon').getBoundingClientRect();
//         const deltaX = target.left - rect.left;
//         const deltaY = target.top - rect.top;
//
//         requestAnimationFrame(() => {
//             flyingImg.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.3)`;
//             flyingImg.style.opacity = '0';
//         });
//
//         setTimeout(() => flyingImg.remove(), 1000);
//     });
// });
//
// // 📦 عند تحميل الصفحة، نحدث العداد
// document.addEventListener('DOMContentLoaded', updateWishlistCount);
//
//
//
//
//
// function updatecartCount() {
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const countElement = document.getElementById('cart-count');
//     countElement.textContent = cart.length;
//     countElement.style.display = cart.length > 0 ? 'inline-block' : 'none';
// }
//
// document.querySelectorAll('.add-to-cart').forEach(button => {
//     button.addEventListener('click', function () {
//         const name = button.getAttribute('data-name');
//         const price = button.getAttribute('data-price');
//         const image = button.getAttribute('data-image');
//         const product = { name, price, image };
//
//         let cart = JSON.parse(localStorage.getItem('cart')) || [];
//
//         // 👉 السماح بالتكرار
//         cart.push(product);
//         localStorage.setItem('cart', JSON.stringify(cart));
//
//         // ✅ تحديث العداد دايماً
//         updatecartCount();
//
//         // ✈️ حركة الطيران
//         const flyingImg = document.createElement('img');
//         flyingImg.src = image;
//         flyingImg.className = 'flying-img';
//
//         const rect = button.getBoundingClientRect();
//         flyingImg.style.top = `${rect.top + window.scrollY}px`;
//         flyingImg.style.left = `${rect.left + window.scrollX}px`;
//
//         document.body.appendChild(flyingImg);
//
//         const target = document.getElementById('cart-icon').getBoundingClientRect();
//         const deltaX = target.left - rect.left;
//         const deltaY = target.top - rect.top;
//
//         requestAnimationFrame(() => {
//             flyingImg.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.3)`;
//             flyingImg.style.opacity = '0';
//         });
//
//         setTimeout(() => flyingImg.remove(), 1000);
//     });
// });
//
// // 📦 عند تحميل الصفحة، نحدث العداد
// document.addEventListener('DOMContentLoaded', updatecartCount);
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
                <div class="product-card ${currentView}-view" data-index="${index + 1}">
                    <div class="card-media">
                        <img src="${product.primary_image}" alt="${product.name}" class="product-image primary-image">
                        ${product.secondary_image ? `<img src="${product.secondary_image}" alt="${product.name} Alternate" class="product-image secondary-image">` : ''}
                        <div class="card-badges">
                            <button class="wishlist-btn" aria-label="Add to wishlist" data-name="${product.name}" data-price="$${price.toFixed(2)}" data-image="${product.primary_image}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </button>
                            <button class="quick-view" aria-label="Quick view">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
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
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
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

    // تحديث عدد المفضلة
    function updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const countElement = document.getElementById('wishlist-count');
        countElement.textContent = wishlist.length;
        countElement.style.display = wishlist.length > 0 ? 'inline-block' : 'none';
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('.wishlist-btn')) {
            const button = e.target.closest('.wishlist-btn');
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            const image = button.getAttribute('data-image');
            if (!image) {
                console.error('No image provided for wishlist item');
                return;
            }
            const product = { name, price, image };

            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            wishlist.push(product); // السماح بالتكرار
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();

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
        }
    });

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