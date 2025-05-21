<?php
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$customer_id = 1;
$product_id = isset($_POST['product_id']) ? $_POST['product_id'] : null;

if ($product_id) {
    $stmt = $connection->prepare("DELETE FROM Favorite WHERE Customer_Id = ? AND Product_Id = ?");
    $stmt->bind_param("ii", $customer_id, $product_id);
    $stmt->execute();
    echo json_encode(["success" => true]);
    $stmt->close();
} else {
    echo json_encode(["success" => false]);
}

$connection->close();
?>
