<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "soap";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $type = isset($_GET['type']) ? $_GET['type'] : '';

    $sql = "SELECT id, name, description, type, specific_type, price, quantity, primary_image, secondary_image, created_at 
            FROM products 
            WHERE type = :type";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':type', $type);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
$conn = null;
?>