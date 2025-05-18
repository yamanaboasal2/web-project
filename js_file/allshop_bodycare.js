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

document.addEventListener('DOMContentLoaded', function() {
    // Toggle dropdowns
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');

    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.classList.toggle('active');

            // Close other open dropdowns
            document.querySelectorAll('.control-dropdown').forEach(dropdown => {
                if (dropdown !== parent && dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                }
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.control-dropdown')) {
            document.querySelectorAll('.control-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Price range slider functionality
    const slider = document.querySelector('.slider');
    const priceValue = document.querySelector('.price-value');

    if (slider && priceValue) {
        slider.addEventListener('input', function() {
            priceValue.textContent = `Price: $0 – $${this.value}`;
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const viewBtns = document.querySelectorAll('.view-btn');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // إزالة النشاط من جميع الأزرار
            viewBtns.forEach(b => b.classList.remove('active'));

            // إضافة النشاط للزر المختار
            this.classList.add('active');

            // هنا يمكنك إضافة كود تغيير طريقة العرض الفعلية
            const isListView = this.classList.contains('list-view');
            console.log(isListView ? 'List View Activated' : 'Grid View Activated');

            // يمكنك استبدال console.log بكواد تغيير العرض حسب احتياجك
        });
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


// Price Filter
const slider = document.querySelector('.slider');
const priceValue = document.querySelector('.price-value');
const maxPriceSpan = document.querySelector('.max-price');
const applyBtn = document.querySelector('.apply-btn');
const clearBtn = document.querySelector('.clear-btn');
const resetBtn = document.querySelector('.reset-btn');
const productCards = document.querySelectorAll('.product-card');
const productsGrid = document.querySelector('.products-grid');

function updatePriceFilter() {
    const maxPrice = parseFloat(slider.value);
    maxPriceSpan.textContent = maxPrice.toFixed(2);
    priceValue.textContent = `Price: $0 – $${maxPrice.toFixed(2)}`;

    productCards.forEach(card => {
        const price = parseFloat(card.querySelector('.add-to-cart').dataset.price);
        card.style.display = price <= maxPrice ? 'flex' : 'none';
    });
}

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

slider.addEventListener('input', debounce(updatePriceFilter, 100));
applyBtn.addEventListener('click', updatePriceFilter);
clearBtn.addEventListener('click', () => {
    slider.value = 100;
    updatePriceFilter();
});
resetBtn.addEventListener('click', () => {
    slider.value = 100;
    updatePriceFilter();
});

// Sort Functionality
const sortOptions = document.querySelectorAll('.sort-options a');
let originalOrder = Array.from(productCards);

sortOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        sortOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const sortType = option.dataset.sort;
        let sortedCards = Array.from(productCards).filter(card => card.style.display !== 'none');

        if (sortType === 'featured') {
            sortedCards = originalOrder.filter(card => card.style.display !== 'none');
        } else {
            sortedCards.sort((a, b) => {
                const aPrice = parseFloat(a.querySelector('.add-to-cart').dataset.price);
                const bPrice = parseFloat(b.querySelector('.add-to-cart').dataset.price);
                const aName = a.querySelector('.add-to-cart').dataset.name.toLowerCase();
                const bName = b.querySelector('.add-to-cart').dataset.name.toLowerCase();

                if (sortType === 'price-asc') return aPrice - bPrice;
                if (sortType === 'price-desc') return bPrice - aPrice;
                if (sortType === 'alpha-asc') return aName.localeCompare(bName);
                if (sortType === 'alpha-desc') return bName.localeCompare(aName);
                // For best-selling, date-old, date-new, use original order
                return parseInt(a.dataset.index) - parseInt(b.dataset.index);
            });
        }

        // Rebuild grid with only visible cards
        productsGrid.innerHTML = '';
        sortedCards.forEach(card => productsGrid.appendChild(card));
    });
});

// Wishlist and Cart (Placeholder)
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        alert(`Added "${btn.dataset.name}" to wishlist!`);
    });
});

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        alert(`Added "${btn.dataset.name}" to cart!`);
    });
});