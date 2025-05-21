<?php
session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    error_log("Connection failed: " . $connection->connect_error);
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Connection failed: " . $connection->connect_error]));
}

$customer_id = 1; // يمكن تحسينه ليأخذ القيمة من الجلسة
$product_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : null;
$quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 1;

if (!$product_id) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Missing product_id"]));
}

// التحقق من وجود المنتج
$checkStmt = $connection->prepare("SELECT 1 FROM Product WHERE Product_Id = ?");
if (!$checkStmt) {
    error_log("Prepare failed (check product): " . $connection->error);
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Prepare failed: " . $connection->error]));
}
$checkStmt->bind_param("i", $product_id);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows === 0) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Invalid product ID"]));
}
$checkStmt->close();

// التحقق من وجود المنتج في السلة
$cartCheckStmt = $connection->prepare("SELECT Quantity FROM Cart WHERE Customer_Id = ? AND Product_Id = ?");
if (!$cartCheckStmt) {
    error_log("Prepare failed (check cart): " . $connection->error);
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Prepare failed: " . $connection->error]));
}
$cartCheckStmt->bind_param("ii", $customer_id, $product_id);
$cartCheckStmt->execute();
$cartResult = $cartCheckStmt->get_result();

if ($cartResult->num_rows > 0) {
    // تحديث الكمية
    $row = $cartResult->fetch_assoc();
    $newQuantity = $row['Quantity'] + $quantity;

    $updateStmt = $connection->prepare("UPDATE Cart SET Quantity = ? WHERE Customer_Id = ? AND Product_Id = ?");
    if (!$updateStmt) {
        error_log("Prepare failed (update cart): " . $connection->error);
        http_response_code(500);
        die(json_encode(["success" => false, "message" => "Prepare failed: " . $connection->error]));
    }
    $updateStmt->bind_param("iii", $newQuantity, $customer_id, $product_id);
    $updateStmt->execute();

    if ($updateStmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Quantity updated in cart"]);
    } else {
        error_log("Update failed: " . $connection->error);
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to update cart: " . $connection->error]);
    }
    $updateStmt->close();
} else {
    // إدراج سجل جديد
    $insertStmt = $connection->prepare("INSERT INTO Cart (Customer_Id, Product_Id, Quantity) VALUES (?, ?, ?)");
    if (!$insertStmt) {
        error_log("Prepare failed (insert cart): " . $connection->error);
        http_response_code(500);
        die(json_encode(["success" => false, "message" => "Prepare failed: " . $connection->error]));
    }
    $insertStmt->bind_param("iii", $customer_id, $product_id, $quantity);
    $insertStmt->execute();

    if ($insertStmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Product added to cart"]);
    } else {
        error_log("Insert failed: " . $connection->error);
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to add product to cart: " . $connection->error]);
    }
    $insertStmt->close();
}

$cartCheckStmt->close();
$connection->close();
?>