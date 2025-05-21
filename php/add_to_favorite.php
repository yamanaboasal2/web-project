<?php
session_start();

$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Connection failed: " . $connection->connect_error]));
}

// تعيين رقم العميل كقيمة تجريبية
$customer_id = 1; // رقم الكاستمر ثابت للتجربة

// $product_id من POST كما هو
$product_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : null;

error_log("Received POST: customer_id=$customer_id, product_id=$product_id");

if ($customer_id && $product_id) {
    $checkStmt = $connection->prepare("SELECT 1 FROM Product WHERE Product_Id = ?");
    $checkStmt->bind_param("i", $product_id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    if ($checkResult->num_rows === 0) {
        http_response_code(400);
        die(json_encode(["success" => false, "message" => "Invalid product ID"]));
    }
    $checkStmt->close();

    $updateStmt = $connection->prepare("UPDATE Favorite SET Times_Added = Times_Added + 1 WHERE Customer_Id = ? AND Product_Id = ?");
    $updateStmt->bind_param("ii", $customer_id, $product_id);
    $updateStmt->execute();

    if ($updateStmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Count increased"]);
    } else {
        $insertStmt = $connection->prepare("INSERT INTO Favorite (Customer_Id, Product_Id, Times_Added) VALUES (?, ?, 1)");
        $insertStmt->bind_param("ii", $customer_id, $product_id);
        $insertStmt->execute();

        if ($insertStmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Added new favorite"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Insert failed"]);
        }
        $insertStmt->close();
    }
    $updateStmt->close();
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing customer_id or product_id"]);
}

$connection->close();

?>