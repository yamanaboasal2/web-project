<?php
session_start();
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed"]));
}

$customer_id = isset($_SESSION['customer_id']) ? $_SESSION['customer_id'] : 1; // مؤقتًا
$product_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : null;

if ($customer_id && $product_id) {
    $stmt = $connection->prepare("DELETE FROM Cart WHERE Customer_Id = ? AND Product_Id = ?");
    $stmt->bind_param("ii", $customer_id, $product_id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Item removed from cart"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to remove item"]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Missing data"]);
}

$connection->close();
?>
