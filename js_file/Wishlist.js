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

// Retrieve wishlist and cart data from localStorage, default to empty arrays if none exists
const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Access the table body
const tableBody = document.querySelector('#wishlist-table tbody');

// Function to update cart counter
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Function to display products in the wishlist
function displayWishlist() {
    // Clear existing content
    tableBody.innerHTML = '';

    // Check if wishlist is empty
    if (wishlist.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #555; font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; font-size: 16px;">Your wishlist is empty.</td></tr>';
        return;
    }

    // Loop through wishlist items and create table rows
    wishlist.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image}" width="70" height="70" alt="${product.name}" onerror="this.src='https://via.placeholder.com/70x70?text=Image+Not+Found'"></td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>
                
                    <button class="move-to-cart" data-index="${index}" aria-label="Add to cart">Add to Cart</button>
                    <td>
                   <i class="fas fa-trash-alt remove"
   data-index="${index}"
   data-id="${product.id}"
   aria-label="Remove item"></i>
               
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update cart counter
    updateCartCount();
}
// Function to create flying animation
function createFlyingAnimation(imageSrc, startElement, callback) {
    // Create a clone of the image
    const flyingImage = document.createElement('img');
    flyingImage.src = imageSrc;
    flyingImage.className = 'flying-image';
    document.body.appendChild(flyingImage);

    // Get starting position (from the button)
    const startRect = startElement.getBoundingClientRect();
    flyingImage.style.position = 'fixed';
    flyingImage.style.left = `${startRect.left + startRect.width / 2 - 35}px`; // Center of button
    flyingImage.style.top = `${startRect.top + startRect.height / 2 - 35}px`; // Center of button
    flyingImage.style.width = '70px';
    flyingImage.style.height = '70px';
    flyingImage.style.zIndex = '1000';
    flyingImage.style.transition = 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out';

    // Target position (element with ID 'cart_icon' or fallback to top-right)
    const cartIcon = document.getElementById('cart-icon');
    const targetRect = cartIcon ? cartIcon.getBoundingClientRect() : { left: window.innerWidth - 100, top: 50 };
    const targetX = targetRect.left + (targetRect.width / 2) - 35; // Center of target
    const targetY = targetRect.top + (targetRect.height / 2) - 35; // Center of target

    // Trigger animation
    setTimeout(() => {
        flyingImage.style.transform = `translate(${targetX - startRect.left - 35}px, ${targetY - startRect.top - 35}px) scale(0.3)`;
        flyingImage.style.opacity = '0';
    }, 50);

    // Remove image and call callback after animation
    setTimeout(() => {
        flyingImage.remove();
        if (callback) callback();
    }, 800);
}

// Function to move a product to the cart
function moveToCart(index, buttonElement) {
    // Get the product from wishlist
    const product = wishlist[index];

    // Add to cart with quantity: 1
    cart.push({ ...product, quantity: 1 });

    // Remove from wishlist
    wishlist.splice(index, 1);

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Create flying animation
    createFlyingAnimation(product.image, buttonElement, () => {
        // Visual indication (pulse cart icon if exists)
        const cartIcon = document.getElementById('cart_icon');
        if (cartIcon) {
            cartIcon.classList.add('pulse');
            setTimeout(() => cartIcon.classList.remove('pulse'), 500);
        }
        // Update cart counter
        updateCartCount();
    });

    // Refresh wishlist display
    displayWishlist();
}

// Function to remove a product from the wishlist
function removeFromWishlist(index, productId) {
    // 1. احذف من localStorage
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    displayWishlist();

    // 2. أرسل حذف إلى السيرفر
    fetch('/web-project1/php/remove_favorite.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `product_id=${productId}`
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log('Deleted from DB');
            } else {
                console.log('Failed to delete from DB');
            }
        });
}

// Add event listener for remove and move-to-cart buttons
tableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove')) {
        const index = event.target.getAttribute('data-index');
        const productId = event.target.getAttribute('data-id');
        removeFromWishlist(Number(index), Number(productId));
    } else if (event.target.classList.contains('move-to-cart')) {
        const index = event.target.getAttribute('data-index');
        moveToCart(Number(index), event.target);
    }
});

// Display wishlist on page load
displayWishlist();

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




