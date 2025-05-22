function editCustomer(customerId) {
    alert('Editing customer with ID: ' + customerId);
    // هنا ممكن تفتح نموذج تعديل أو توجه لصفحة تعديل
}

function deleteCustomer(customerId) {
    if(confirm('Are you sure you want to delete customer with ID: ' + customerId + '?')) {
        // مثال على حذف بالـ AJAX (تحتاج عمل ملف PHP يعالج الحذف)
        fetch(`delete_customer.php?id=${customerId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Customer deleted successfully');
                    loadCustomers(); // تحديث الجدول بعد الحذف
                } else {
                    alert('Failed to delete customer');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deleting customer');
            });
    }
}
async function loadCustomers() {
    try {
        const response = await fetch('customers.php');
        const customers = await response.json();

        const tbody = document.getElementById('customers-tbody');
        const emailSelect = document.getElementById('emailSelect');

        tbody.innerHTML = '';
        emailSelect.innerHTML = '<option value="">-- Select customer email --</option>';

        if (customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No customers found</td></tr>';
            return;
        }

        customers.forEach(customer => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${customer.id}</td>
        <td>${escapeHtml(customer.first_name)}</td>
        <td>${escapeHtml(customer.last_name)}</td>
        <td>${escapeHtml(customer.phone)}</td>
        <td>${escapeHtml(customer.email)}</td>
        <td>${escapeHtml(customer.address)}</td>
        <td class="actions">
          <button class="edit-btn" onclick="editCustomer(${customer.id})"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" onclick="deleteCustomer(${customer.id})"><i class="fas fa-trash"></i></button>
        </td>
      `;
            tbody.appendChild(tr);

            // تعبئة قائمة الإيميلات
            const option = document.createElement('option');
            option.value = customer.email;
            option.textContent = customer.email;
            emailSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

window.addEventListener('DOMContentLoaded', () => {
    loadCustomers();

    // ربط تغيير الـ dropdown مع حقل الإيميل
    document.getElementById('emailSelect').addEventListener('change', function() {
        document.getElementById('emailInput').value = this.value;
    });

    emailjs.init('L7oZiq8j-97yjf2Tz');

    document.getElementById('messageForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('emailInput').value;
        const message = document.getElementById('messageText').value;

        if (!email.trim() || !message.trim()) {
            alert('Please fill out all fields');
            return;
        }

        const templateParams = {
            to_email: email,
            message: message,
            from_name: 'Nablus Soap',
        };

        emailjs.send('service_lhie2yg', 'template_ogmc7l8', templateParams)
            .then(() => {
                alert('Email sent successfully!');
                document.getElementById('messageForm').reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Failed to send email!');
            });
    });
});
// استخراج الإيميلات من الجدول وتعبئة القائمة
