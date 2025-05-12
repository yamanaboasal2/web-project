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