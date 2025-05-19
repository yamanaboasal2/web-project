function editCustomer(customerId) {
    // كود التعديل هنا
    alert('Editing customer with ID: ' + customerId);
    // يمكنك فتح نموذج تعديل أو إعادة التوجيه إلى صفحة التعديل
}

function deleteCustomer(customerId) {
    // كود الحذف هنا
    if(confirm('Are you sure you want to delete customer with ID: ' + customerId + '?')) {
        alert('Customer with ID: ' + customerId + ' deleted successfully');
        // يمكنك إضافة كود AJAX لحذف العميل من قاعدة البيانات
    }
}
// استخراج الإيميلات من الجدول وتعبئة القائمة
function populateEmailDropdown() {
    const emailSelect = document.getElementById('emailSelect');
    const rows = document.querySelectorAll('.customers-table tbody tr');

    rows.forEach(row => {
        const email = row.cells[4].textContent.trim();
        const option = document.createElement('option');
        option.value = email;
        option.textContent = email;
        emailSelect.appendChild(option);
    });
}

// تنفيذ بعد تحميل الصفحة
window.addEventListener('DOMContentLoaded', populateEmailDropdown);



document.addEventListener('DOMContentLoaded', function () {
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
