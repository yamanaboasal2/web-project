<?php
$host = "localhost";
$dbname = "soap";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

session_start();
$customer_id = 1; // نفس الملاحظة: عدّله حسب المستخدم

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["product_id"])) {
    $product_id = intval($_POST["product_id"]);

    $sql = "DELETE FROM Favorite WHERE Customer_Id = ? AND Product_Id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $customer_id, $product_id);
    $stmt->execute();
}

$conn->close();
header("Location: Wishlist.html"); // أو الصفحة المناسبة
exit();
?>
