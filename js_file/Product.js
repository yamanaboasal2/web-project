function previewImage(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input || !preview) {
        console.error(`Element not found: inputId=${inputId}, previewId=${previewId}`);
        return;
    }
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
}

function renderTable(products) {
    const table = document.getElementById('productTable');
    if (!table) {
        console.error('Table with ID productTable not found');
        return;
    }
    table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Specific Type</th>
            <th>Price $</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Actions</th>
        </tr>
    `;
    const typeLabels = {
        'bodycare': 'Body Care',
        'facecare': 'Face Care',
        'haircare': 'Hair Care',
        'skincare': 'Skin Care'
    };
    const specificTypeLabels = {
        'bodysoap': 'Body Soap',
        'lotions': 'Lotions',
        'serums': 'Serums',
        'moisturizers': 'Moisturizers',
        'shampoo': 'Shampoo',
        'hairmask': 'Hair Mask'
    };
    products.forEach(product => {
        const row = table.insertRow();
        const imageCell = product.secondary_image
            ? `<img src="${product.primary_image}" class="image-preview" style="display:inline-block; max-width:50px; margin-right:5px;" alt="Primary Image">
               <img src="${product.secondary_image}" class="image-preview" style="display:inline-block; max-width:50px;" alt="Secondary Image">`
            : `<img src="${product.primary_image}" class="image-preview" style="display:block; max-width:50px;" alt="Primary Image">`;
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${imageCell}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${typeLabels[product.type] || product.type}</td>
            <td>${specificTypeLabels[product.specific_type] || product.specific_type}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>${product.created_at}</td>
            <td><button onclick="deleteProduct(${product.id})">Delete</button></td>
        `;
    });
}

function applyFilterLogic(products) {
    const filterType = document.getElementById('productType').value;
    return filterType === 'all' ? products : products.filter(p => p.type === filterType);
}

function applyFilter() {
    fetch('../php/get_products.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(products => {
            const filteredProducts = applyFilterLogic(products);
            renderTable(filteredProducts);
        })
        .catch(error => console.error('Error fetching products:', error));
}

function deleteProduct(id) {
    fetch('../php/delete_product.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Product deleted successfully!');
                applyFilter();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('An error occurred while deleting the product.');
        });
}

function loadProducts() {
    fetch('../php/get_products.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(products => {
            renderTable(products);
        })
        .catch(error => console.error('Error loading products:', error));
}

function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    if (!emailInput) {
        console.error('Email input not found');
        return;
    }
    const email = emailInput.value;
    if (!email) {
        alert('Please enter an email address');
        return;
    }

    fetch('../php/subscribe.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'email=' + encodeURIComponent(email)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Subscribed successfully!');
                emailInput.value = '';
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error subscribing:', error);
            alert('An error occurred while subscribing: ' + error.message);
        });
}

document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('../php/add_product.php', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Product added successfully!');
                this.reset();
                document.getElementById('primaryImagePreview').style.display = 'none';
                document.getElementById('secondaryImagePreview').style.display = 'none';
                loadProducts();
            } else {
                alert('خطأ: ' + data.message);
            }
        })
        .catch(error => {
            console.error('خطأ أثناء إضافة المنتج:', error);
            alert('حدث خطأ أثناء إضافة المنتج: ' + error.message);
        });
});

document.addEventListener('DOMContentLoaded', loadProducts);