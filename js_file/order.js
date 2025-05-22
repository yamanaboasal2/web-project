function loadOrders() {
    fetch('../php/get_orders.php')
        .then(response => response.json())
        .then(data => {
            const table = document.querySelector('table');
            table.querySelectorAll('tr:not(:first-child)').forEach(tr => tr.remove());

            data.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${order.Order_Id}</td>
                    <td>${order.Customer_Name}</td>
                    <td>${order.Products}</td>
                    <td><span class="status ${order.Status.toLowerCase()}">${order.Status}</span></td>
                    <td>$${parseFloat(order.Total_Amount).toFixed(2)}</td>
                    <td>${order.Order_Date}</td>
                  <td class="actions">
                  <button class="check-btn"><i class="fas fa-check"></i></button>
                  <button class="warning-btn"><i class="fas fa-exclamation-triangle"></i></button>
                  <button class="delete-btn"><i class="fas fa-times"></i></button>
                   </td>
                `;
                table.appendChild(tr);
            });

            attachButtonEvents();
        })
        .catch(err => console.error("Error loading orders:", err));
}

function attachButtonEvents() {
    document.querySelectorAll(".check-btn").forEach(btn => {
        btn.onclick = () => {
            const status = btn.closest("tr").querySelector(".status");
            status.textContent = "Completed";
            status.className = "status completed";
        };
    });

    document.querySelectorAll(".warning-btn").forEach(btn => {
        btn.onclick = () => {
            const status = btn.closest("tr").querySelector(".status");
            status.textContent = "Pending";
            status.className = "status pending";
        };
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = () => {
            const status = btn.closest("tr").querySelector(".status");
            status.textContent = "Cancelled";
            status.className = "status cancelled";
        };
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();

    document.getElementById("filterBtn").addEventListener("click", () => {
        const selected = document.getElementById("statusFilter").value;
        const rows = document.querySelectorAll("table tr:not(:first-child)");

        rows.forEach(row => {
            const status = row.querySelector(".status");
            if (selected === "all" || status.classList.contains(selected)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
});
