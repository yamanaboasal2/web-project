<?php
session_start();

ini_set('display_errors', 0); // Prevent HTML error output
ini_set('log_errors', 1);
ini_set('error_log', '/path/to/php_errors.log'); // Specify log file path
error_reporting(E_ALL);

$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Connection failed: " . $connection->connect_error]));
}

$customer_id = isset($_POST['customer_id']) ? (int)$_POST['customer_id'] : null;
$product_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : null;

if (!$customer_id || !$product_id) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Missing customer_id or product_id"]));
}

// Check if product exists
$checkStmt = $connection->prepare("SELECT 1 FROM Product WHERE Product_Id = ?");
if (!$checkStmt) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Prepare failed: " . $connection->error]));
}

$checkStmt->bind_param("i", $product_id);
if (!$checkStmt->execute()) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Execute failed: " . $checkStmt->error]));
}

$checkResult = $checkStmt->get_result();
if ($checkResult->num_rows === 0) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Invalid product ID"]));
}
$checkStmt->close();

// Update or insert
$updateStmt = $connection->prepare("UPDATE Favorite SET Add_Count = Add_Count + 1 WHERE Customer_Id = ? AND Product_Id = ?");
if (!$updateStmt) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Prepare update failed: " . $connection->error]));
}

$updateStmt->bind_param("ii", $customer_id, $product_id);
if (!$updateStmt->execute()) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Execute update failed: " . $updateStmt->error]));
}

if ($updateStmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Count increased"]);
} else {
    $insertStmt = $connection->prepare("INSERT INTO Favorite (Customer_Id, Product_Id, Add_Count) VALUES (?, ?, 1)");
    if (!$insertStmt) {
        http_response_code(500);
        die(json_encode(["success" => false, "message" => "Prepare insert failed: " . $connection->error]));
    }
    $insertStmt->bind_param("ii", $customer_id, $product_id);
    if (!$insertStmt->execute()) {
        http_response_code(500);
        die(json_encode(["success" => false, "message" => "Execute insert failed: " . $insertStmt->error]));
    }
    if ($insertStmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Added new favorite"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Insert failed"]);
    }
    $insertStmt->close();
}
$updateStmt->close();
$connection->close();
?>