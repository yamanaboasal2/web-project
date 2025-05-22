<?php
header('Content-Type: application/json');

$host = "localhost";
$username = "root"; // عدل حسب إعداداتك
$password = "";
$dbname = "soap";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed"]);
    exit;
}

$sql = "SELECT * FROM customers";
$result = $conn->query($sql);

$customers = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $customers[] = $row;
    }
}

echo json_encode($customers);

$conn->close();
?>
