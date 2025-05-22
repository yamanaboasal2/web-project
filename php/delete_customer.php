<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log request data
file_put_contents('debug.log', print_r($_POST, true) . "\n" . file_get_contents('php://input') . "\n", FILE_APPEND);

// Comment out session check for testing
// if (!isset($_SESSION['customer_id'])) {
//     http_response_code(403);
//     echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
//     exit();
// }

$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    file_put_contents('debug.log', "Connection failed: " . $connection->connect_error . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$customerId = isset($input['id']) ? (int)$input['id'] : null;

if (!$customerId) {
    file_put_contents('debug.log', "Invalid customer ID\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid customer ID']);
    exit();
}

$sql = "SELECT Customer_Id FROM Customer WHERE Customer_Id = ?";
$stmt = $connection->prepare($sql);
if (!$stmt) {
    file_put_contents('debug.log', "Prepare failed: " . $connection->error . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Prepare failed']);
    exit();
}
$stmt->bind_param("i", $customerId);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        file_put_contents('debug.log', "Customer not found: " . $customerId . "\n", FILE_APPEND);
        $stmt->close();
        $connection->close();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Customer not found']);
        exit();
    }
} else {
    file_put_contents('debug.log', "Query failed: " . $stmt->error . "\n", FILE_APPEND);
    $stmt->close();
    $connection->close();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Query execution failed']);
    exit();
}

$sql = "DELETE FROM Customer WHERE Customer_Id = ?";
$stmt = $connection->prepare($sql);
if (!$stmt) {
    file_put_contents('debug.log', "Delete prepare failed: " . $connection->error . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Prepare failed']);
    exit();
}
$stmt->bind_param("i", $customerId);

if ($stmt->execute()) {
    file_put_contents('debug.log', "Customer deleted: " . $customerId . "\n", FILE_APPEND);
    $stmt->close();
    $connection->close();
    echo json_encode(['success' => true, 'message' => 'Customer deleted successfully']);
} else {
    file_put_contents('debug.log', "Delete failed: " . $stmt->error . "\n", FILE_APPEND);
    $stmt->close();
    $connection->close();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete customer']);
}
?>