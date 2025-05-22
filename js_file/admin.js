document.addEventListener('DOMContentLoaded', () => {
    fetch('../php/dashboard_data.php')
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Error from server:', data.error);
                return;
            }

            // تحديث قيم الكروت
            document.querySelectorAll('.card-value')[0].textContent = data.orders;
            document.querySelectorAll('.card-value')[1].textContent = data.customers;
            document.querySelectorAll('.card-value')[2].textContent = data.products;

            // المخطط الشريطي للطلبات الشهرية
            const ordersCtx = document.getElementById('ordersChart').getContext('2d');
            new Chart(ordersCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [{
                        label: 'Orders',
                        data: data.monthlyOrders,
                        backgroundColor: '#6F4E37',
                        borderColor: '#4A3728',
                        borderWidth: 1,
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Monthly Orders (2024)',
                            font: { size: 18 }
                        },
                        legend: { display: true }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Number of Orders' }
                        },
                        x: {
                            title: { display: true, text: 'Month' }
                        }
                    }
                }
            });

            // المخطط الدائري لفئات المنتجات
            const productsCtx = document.getElementById('productsChart').getContext('2d');
            new Chart(productsCtx, {
                type: 'pie',
                data: {
                    labels: ['Soap', 'Creams', 'Serums'],
                    datasets: [{
                        label: 'Product Categories',
                        data: data.productCategories,
                        backgroundColor: ['#8B4513', '#D2B48C', '#DEB887'],
                        borderColor: ['#5C2F0D', '#A68A64', '#B89B6F'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Product Category Breakdown',
                            font: { size: 18 }
                        },
                        legend: {
                            display: true,
                            position: 'right' // وضع الوسم على اليمين ليكون جنب المخطط الشريطي
                        }
                    }
                }
            });
        })
        .catch(err => console.error('Error fetching data:', err));
});