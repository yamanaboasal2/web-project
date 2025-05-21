<?php
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$customer_id = 1; // ثابت مؤقتًا

$product_id = isset($_POST['product_id']) ? $_POST['product_id'] : null;

if ($product_id) {
    $stmt = $connection->prepare("INSERT IGNORE INTO Favorite (Customer_Id, Product_Id) VALUES (?, ?)");
    $stmt->bind_param("ii", $customer_id, $product_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Added to favorites"]);
    } else {
        echo json_encode(["success" => false, "message" => "Already in favorites or failed"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "No product ID provided"]);
}

$connection->close();
?>
