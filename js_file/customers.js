function editCustomer(customerId) {
    console.log('جلب بيانات العميل للمعرف:', customerId); // تسجيل للتصحيح
    fetch(`../php/get_customer.php?id=${customerId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            console.log('حالة الاستجابة:', response.status); // تسجيل حالة الاستجابة
            console.log('نوع الاستجابة:', response.headers.get('content-type')); // تسجيل نوع المحتوى
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('استجابة الخادم:', text); // تسجيل النص الخام للخطأ
                    throw new Error(`خطأ HTTP! الحالة: ${response.status}`);
                });
            }
            // التحقق مما إذا كانت الاستجابة JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                return response.text().then(text => {
                    console.error('استجابة غير JSON:', text); // تسجيل النص الخام
                    throw new Error('الاستجابة ليست JSON صالحًا');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('بيانات العميل:', data); // تسجيل البيانات
            if (data.success) {
                showEditForm(data.customer);
            } else {
                alert(`فشل جلب بيانات العميل: ${data.message || 'خطأ غير معروف'}`);
            }
        })
        .catch(error => {
            console.error('خطأ في الجلب:', error); // تسجيل الخطأ
            alert('خطأ في جلب بيانات العميل. حاول مرة أخرى.');
        });
}

// باقي الدوال (showEditForm, closeEditForm, saveCustomer) كما هي
function showEditForm(customer) {
    let modal = document.getElementById('editCustomerModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editCustomerModal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 5px;">
                <h2>تعديل العميل</h2>
                <form id="editCustomerForm">
                    <label>معرف العميل: <input type="text" id="editCustomerId" readonly></label><br>
                    <label>الاسم: <input type="text" id="editCustomerName"></label><br>
                    <label>البريد الإلكتروني: <input type="email" id="editCustomerEmail"></label><br>
                    <button type="submit">حفظ</button>
                    <button type="button" onclick="closeEditForm()">إلغاء</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('editCustomerId').value = customer.Customer_Id;
    document.getElementById('editCustomerName').value = customer.Name || '';
    document.getElementById('editCustomerEmail').value = customer.Email || '';

    modal.style.display = 'flex';

    document.getElementById('editCustomerForm').onsubmit = function(e) {
        e.preventDefault();
        saveCustomer(customer.Customer_Id);
    };
}

function closeEditForm() {
    const modal = document.getElementById('editCustomerModal');
    if (modal) modal.style.display = 'none';
}

function saveCustomer(customerId) {
    const name = document.getElementById('editCustomerName').value;
    const email = document.getElementById('editCustomerEmail').value;

    console.log('حفظ العميل معرف:', customerId, { name, email });
    fetch('../php/update_customer.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: customerId, name, email })
    })
        .then(response => {
            console.log('حالة استجابة الحفظ:', response.status);
            if (!response.ok) throw new Error('فشل حفظ بيانات العميل');
            return response.json();
        })
        .then(data => {
            console.log('بيانات استجابة الحفظ:', data);
            if (data.success) {
                alert('تم تحديث العميل بنجاح');
                closeEditForm();
                loadCustomers();
            } else {
                alert(`فشل تحديث العميل: ${data.message || 'خطأ غير معروف'}`);
            }
        })
        .catch(error => {
            console.error('خطأ في الحفظ:', error);
            alert('خطأ في حفظ العميل. حاول مرة أخرى.');
        });
}
function deleteCustomer(customerId) {
    console.log('Attempting to delete customer ID:', customerId); // Debug
    if (confirm(`Are you sure you want to delete customer with ID: ${customerId}?`)) {
        fetch('../php/delete_customer.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: customerId })
        })
            .then(response => {
                console.log('Response status:', response.status); // Debug
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data); // Debug
                if (data.success) {
                    alert('Customer deleted successfully');
                    loadCustomers();
                } else {
                    alert(`Failed to delete customer: ${data.message || 'Unknown error'}`);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error); // Debug
                alert('Error deleting customer. Please try again.');
            });
    }
}
async function loadCustomers() {
    try {
        const response = await fetch('../php/customers.php'); // عدل المسار حسب مكان ملف PHP
        const customers = await response.json();

        const tbody = document.getElementById('customers-tbody');
        tbody.innerHTML = ''; // ننظف الجدول قبل الإضافة

        if (customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No customers found</td></tr>';
            return;
        }

        customers.forEach(customer => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${customer.Customer_Id}</td>
                <td>${escapeHtml(customer.Customer_Name)}</td>
                <td>${escapeHtml(customer.Phone_Number)}</td>
                <td>${escapeHtml(customer.Email)}</td>
                <td>${escapeHtml(customer.Address)}</td>
                <td class="actions">
                  <button class="edit-btn" onclick="editCustomer(${customer.Customer_Id})"><i class="fas fa-edit"></i></button>
                  <button class="delete-btn" onclick="deleteCustomer(${customer.Customer_Id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

// دالة بسيطة لحماية النص من HTML ضار
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
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

