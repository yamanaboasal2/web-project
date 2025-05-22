// Retrieve cart data from localStorage, default to empty array if none exists
const cart = JSON.parse(localStorage.getItem('cart')) || [];



// Access the cart container
const cartContainer = document.querySelector('#cart-table');

// Function to display products in the cart and calculate subtotal
function displayCart() {
    // Clear existing content
    cartContainer.innerHTML = '';

    // Remove any existing subtotal
    const existingSubtotal = document.querySelector('#subtotal');
    if (existingSubtotal) existingSubtotal.remove();

    // Check if cart is empty
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #555;">Your cart is empty.</p>';
        // Add subtotal of $0.00
        const subtotalElement = document.createElement('p');
        subtotalElement.id = 'subtotal';
        subtotalElement.textContent = 'Subtotal: $0.00';
        cartContainer.insertAdjacentElement('afterend', subtotalElement);
        return;
    }

    cart.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        const basePrice = parseFloat(product.price.replace('$', ''));
        const totalPrice = (basePrice * (product.quantity || 1)).toFixed(2);
        productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200x150?text=Image+Not+Found'">
        <div class="product-info">
            <h3>${product.name}</h3>
            <div class="quantity-controls">
                <button class="quantity-btn" data-index="${index}" data-action="decrease">−</button>
                <span class="quantity">${product.quantity || 1}</span>
                <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
            </div>
            <p>$${totalPrice}</p>
        </div>
         <div><i class="fas fa-trash-alt remove" data-index="${index}" data-productid="${product.product_id}"></i></div>
    `;
        cartContainer.appendChild(productCard);
    });

    // Calculate subtotal
    const subtotal = cart.reduce((sum, product) => {
        const price = parseFloat(product.price.replace('$', '')); // Remove $ and convert to number
        return sum + price * (product.quantity || 1);
    }, 0);

    // Display subtotal
    const subtotalElement = document.createElement('p');
    subtotalElement.id = 'subtotal';
    subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    cartContainer.insertAdjacentElement('afterend', subtotalElement);
}

// Function to update quantity of a product
function updateQuantity(index, change) {
    const newQuantity = (cart[index].quantity || 1) + change;
    if (newQuantity < 1) {
        // Optionally remove item if quantity reaches 0
        if (confirm('Remove this item from the cart?')) {
            cart.splice(index, 1);
        }
    } else {
        cart[index].quantity = newQuantity;
    }

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Refresh cart display
    displayCart();
}



// Add event listener for remove and quantity buttons
cartContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove')) {
        const index = Number(event.target.getAttribute('data-index'));
        const productId = Number(event.target.getAttribute('data-productid'));
        removeFromCart(index, productId);
    } else if (event.target.classList.contains('quantity-btn')) {
        const index = Number(event.target.getAttribute('data-index'));
        const action = event.target.getAttribute('data-action');
        const change = action === 'increase' ? 1 : -1;
        updateQuantity(index, change);
    }
});

// Display cart on page load
displayCart();
document.querySelectorAll('.remove').forEach(button => {
    button.addEventListener('click', function() {
        let productId = parseInt(this.dataset.productid);
        if (isNaN(productId) || productId <= 0) {
            console.error('Invalid product_id:', this.dataset.productid);
            return;
        }
        removeFromCart(productId);
    });
});
function removeFromCart(index) {
    // حذف المنتج من المصفوفة حسب الايندكس
    cart.splice(index, 1);

    // تحديث localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // تحديث العرض
    displayCart();
}
tableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove')) {
        const index = Number(event.target.getAttribute('data-index'));
        const productId = Number(event.target.getAttribute('data-product_id')); // لاحظ الاسم

        console.log('Deleting product:', productId, 'at index:', index);

        removeFromCart(index, productId);
    }
});
document.addEventListener('DOMContentLoaded', function () {
    // Dropdown 1
    const dropdown1 = document.querySelector('.nav-item.dropdown');
    if (dropdown1) {
        const menu1 = dropdown1.querySelector('.dropdown-menu');
        let timeout1;
        dropdown1.addEventListener('mouseenter', () => {
            clearTimeout(timeout1);
            menu1.style.display = 'block';
        });
        dropdown1.addEventListener('mouseleave', () => {
            timeout1 = setTimeout(() => {
                menu1.style.display = 'none';
            }, 1000);
        });
        const link1 = document.getElementById('skinCareDropdown');
        if (link1) {
            link1.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = this.getAttribute('href');
            });
        }
    }

    // Dropdown 2
    const dropdown2 = document.querySelector('.mega-dropdown');
    if (dropdown2) {
        const menu2 = dropdown2.querySelector('.dropdown-menu');
        let timeout2;
        dropdown2.addEventListener('mouseenter', () => {
            clearTimeout(timeout2);
            menu2.style.display = 'block';
            menu2.style.opacity = '1';
            menu2.style.visibility = 'visible';
        });
        dropdown2.addEventListener('mouseleave', () => {
            timeout2 = setTimeout(() => {
                menu2.style.display = 'none';
            }, 1000);
        });
        const link2 = document.getElementById('shopDropdown');
        if (link2) {
            link2.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = this.getAttribute('href');
            });
        }
    }
});
