<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log for debugging
file_put_contents('debug.log', "POST: " . file_get_contents('php://input') . "\n", FILE_APPEND);

if (!isset($_SESSION['customer_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    file_put_contents('debug.log', "Connection failed: " . $connection->connect_error . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$customerId = isset($input['id']) ? (int)$input['id'] : null;
$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';

if (!$customerId || !$name || !$email) {
    file_put_contents('debug.log', "Invalid input data\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit();
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    file_put_contents('debug.log', "Invalid email: " . $email . "\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

$sql = "UPDATE Customer SET Name = ?, Email = ? WHERE Customer_Id = ?";
$stmt = $connection->prepare($sql);
if (!$stmt) {
    file_put_contents('debug.log', "Prepare failed: " . $connection->error . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Prepare failed']);
    exit();
}
$stmt->bind_param("ssi", $name, $email, $customerId);

if ($stmt->execute()) {
    file_put_contents('debug.log', "Customer updated: " . $customerId . "\n", FILE_APPEND);
    echo json_encode(['success' => true, 'message' => 'Customer updated successfully']);
} else {
    file_put_contents('debug.log', "Update failed: " . $stmt->error . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update customer']);
}

$stmt->close();
$connection->close();
?>