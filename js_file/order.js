document.getElementById("filterBtn").addEventListener("click", function () {
    const selected = document.getElementById("statusFilter").value;
    const rows = document.querySelectorAll("table tr");

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const status = row.querySelector(".status");

        if (!status) continue; // تجاهل الصفوف اللي ما فيها حالة

        if (selected === "all") {
            row.style.display = ""; // إظهار الكل
        } else if (status.classList.contains(selected)) {
            row.style.display = ""; // إظهار المطابق
        } else {
            row.style.display = "none"; // إخفاء غير المطابق
        }
    }
});
// نحدد كل الأزرار ونضيف لها Event
document.querySelectorAll(".check-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const status = btn.closest("tr").querySelector(".status");
        status.textContent = "Completed";
        status.className = "status completed";
    });
});

document.querySelectorAll(".warning-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const status = btn.closest("tr").querySelector(".status");
        status.textContent = "Pending";
        status.className = "status pending";
    });
});

document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const status = btn.closest("tr").querySelector(".status");
        status.textContent = "Cancelled";
        status.className = "status cancelled";
    });
});