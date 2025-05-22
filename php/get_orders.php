<?php
// اتصال بقاعدة البيانات
$conn = new mysqli("localhost", "root", "", "soap");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = $sql = "SELECT 
    o.Order_Id, 
    o.Order_Date, 
    o.Status, 
    o.Total_Amount, 
    o.Total_Quantity,
    c.Customer_Name,
    COALESCE(GROUP_CONCAT(CONCAT(p.Product_Name, ' (Qty: ', op.Quantity, ')') SEPARATOR ', '), '—') AS Products
FROM orders o
JOIN customer c ON o.Customer_Id = c.Customer_Id
LEFT JOIN order_products op ON o.Order_Id = op.Order_Id
LEFT JOIN product p ON op.Product_Id = p.Product_Id
GROUP BY o.Order_Id, o.Order_Date, o.Status, o.Total_Amount, o.Total_Quantity, c.Customer_Name
ORDER BY o.Order_Id;";
;
$result = $conn->query($sql);

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = [
        "Order_Id" => $row["Order_Id"],
        "Order_Date" => $row["Order_Date"],
        "Status" => $row["Status"],
        "Total_Amount" => $row["Total_Amount"],
        "Total_Quantity" => $row["Total_Quantity"],
        "Customer_Name" => $row["Customer_Name"],
        "Products" => $row["Products"]
    ];
}

header('Content-Type: application/json');
echo json_encode($orders);

$conn->close();
?>
