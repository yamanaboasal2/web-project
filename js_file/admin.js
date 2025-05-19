
    // مخطط الأعمدة
    const ordersCtx = document.getElementById('ordersChart').getContext('2d');
    new Chart(ordersCtx, {
    type: 'bar',
    data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
    label: 'Orders',
    data: [30, 45, 20, 60, 40],
    backgroundColor: '#6F4E37',
    borderRadius: 5
}]
},
    options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
    title: {
    display: true,
    text: 'Monthly Orders'
}
},
    scales: {
    y: {
    beginAtZero: true
}
}
}
});

    // مخطط دائري
    const productsCtx = document.getElementById('productsChart').getContext('2d');
    new Chart(productsCtx, {
    type: 'pie',
    data: {
    labels: ['Soap', 'Creams', 'serums'],
    datasets: [{
    label: 'Product Categories',
    data: [40, 25, 35],
    backgroundColor: ['#8B4513', '#D2B48C', '#DEB887']
}]
},
    options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
    title: {
    display: true,
    text: 'Product Category Breakdown'
}
}
}
});
    document.addEventListener('DOMContentLoaded', () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
    });

    window.addEventListener('resize', function() {
        ordersChart.resize();
        productsChart.resize();
    });
