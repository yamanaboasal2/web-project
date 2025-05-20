
let products = [];
let idCounter = 1;

function previewImage() {
    const file = document.getElementById('image').files[0];
    const preview = document.getElementById('imagePreview');
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function addProduct() {
    const product = {
        id: idCounter++,
        name: document.getElementById('productName').value,
        description: document.getElementById('description').value,
        image: document.getElementById('imagePreview').src,
        type: document.getElementById('productTypeSelect').value,
        specificType: document.getElementById('specificType').value,
        price: document.getElementById('price').value,
        quantity: document.getElementById('quantity').value,
        date: new Date().toLocaleString()
    };
    products.push(product);
    renderTable();
    clearForm();
}

function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('description').value = '';
    document.getElementById('image').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('price').value = '';
    document.getElementById('productTypeSelect').value = '';
    document.getElementById('specificType').value = '';
    document.getElementById('quantity').value = '';
}

function renderTable() {
    const table = document.getElementById('productTable');
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
    const filteredProducts = applyFilterLogic();
    filteredProducts.forEach(product => {
        const row = table.insertRow();
        row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image}" class="image-preview" style="${product.image ? 'display:block' : 'display:none'}"></td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.type === 'bodycare' ? 'Body Care' : product.type === 'facecare' ? 'Face Care' : product.type === 'haircare' ? 'Hair Care' : 'Skin Care'}</td>
                <td>${product.specificType === 'bodysoap' ? 'Body Soap' : product.specificType === 'lotions' ? 'Lotions' : product.specificType === 'serums' ? 'Serums' : product.specificType === 'moisturizers' ? 'Moisturizers' : product.specificType === 'shampoo' ? 'Shampoo' : 'Hair Mask'}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td>
                <td>${product.date}</td>
                <td><button onclick="deleteProduct(${product.id})">Delete</button></td>
            `;
    });
}

function applyFilterLogic() {
    const filterType = document.getElementById('productType').value;
    return filterType === 'all' ? products : products.filter(p => p.type === filterType);
}

function applyFilter() {
    renderTable();
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    renderTable();
}

renderTable();