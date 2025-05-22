<?php
header('Content-Type: application/json');
$host = "localhost";
$dbname = "soap";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

session_start();
$customer_id = 1;

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["product_id"])) {
    $product_id = intval($_POST["product_id"]);
    if ($product_id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid product_id']);
        exit();
    }

    $sql = "DELETE FROM Favorite WHERE Customer_Id = ? AND Product_Id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $customer_id, $product_id);
    if ($stmt->execute()) {
        echo json_encode(['success' => 'Product removed successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error removing product: ' . $conn->error]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No valid POST request received']);
}

$conn->close();
exit();
?>