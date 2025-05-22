<?php
header('Content-Type: application/json');

// 1. الاتصال بقاعدة البيانات
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "soap";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

// 2. جلب عدد الطلبات
$sqlOrders = "SELECT COUNT(*) AS total_orders FROM orders";
$resultOrders = $conn->query($sqlOrders);
$totalOrders = ($resultOrders && $row = $resultOrders->fetch_assoc()) ? (int)$row['total_orders'] : 0;

// 3. جلب عدد العملاء
$sqlCustomers = "SELECT COUNT(*) AS total_customers FROM customer";
$resultCustomers = $conn->query($sqlCustomers);
$totalCustomers = ($resultCustomers && $row = $resultCustomers->fetch_assoc()) ? (int)$row['total_customers'] : 0;

// 4. جلب عدد المنتجات
$sqlProducts = "SELECT COUNT(*) AS total_products FROM product";
$resultProducts = $conn->query($sqlProducts);
$totalProducts = ($resultProducts && $row = $resultProducts->fetch_assoc()) ? (int)$row['total_products'] : 0;

// 5. جلب بيانات الطلبات الشهرية (يناير إلى مايو 2024)
$monthlyOrders = array_fill(0, 5, 0); // مصفوفة للأشهر من يناير إلى مايو
$sqlMonthly = "
    SELECT MONTH(Order_Date) AS month, COUNT(*) AS count
    FROM orders
    WHERE YEAR(Order_Date) = 2024 AND MONTH(Order_Date) BETWEEN 1 AND 5
    GROUP BY MONTH(Order_Date)
    ORDER BY month
";
$resultMonthly = $conn->query($sqlMonthly);

if ($resultMonthly) {
    while ($row = $resultMonthly->fetch_assoc()) {
        $monthIndex = (int)$row['month'] - 1; // تحويل الشهر إلى فهرس (0-4)
        if ($monthIndex >= 0 && $monthIndex < 5) {
            $monthlyOrders[$monthIndex] = (int)$row['count'];
        }
    }
}

// 6. جلب بيانات فئات المنتجات
$productCategories = ['Soap' => 0, 'Creams' => 0, 'Serums' => 0];
$sqlCategories = "SELECT Specific_Type, COUNT(*) AS count FROM product GROUP BY Specific_Type";
$resultCategories = $conn->query($sqlCategories);

if ($resultCategories) {
    while ($row = $resultCategories->fetch_assoc()) {
        $cat = $row['Specific_Type'];
        if (array_key_exists($cat, $productCategories)) {
            $productCategories[$cat] = (int)$row['count'];
        }
    }
} else {
    echo json_encode(['error' => 'Query error: ' . $conn->error]);
    exit();
}

// 7. إعداد البيانات للإرسال
$response = [
    'orders' => $totalOrders,
    'customers' => $totalCustomers,
    'products' => $totalProducts,
    'monthlyOrders' => $monthlyOrders,
    'productCategories' => array_values($productCategories)
];

echo json_encode($response);

// 8. إغلاق الاتصال
$conn->close();
?>