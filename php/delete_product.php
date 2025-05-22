<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "soap";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(array('status' => 'error', 'message' => 'فشل الاتصال: ' . $conn->connect_error)));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = isset($data['id']) ? intval($data['id']) : 0;

    if ($id <= 0) {
        die(json_encode(array('status' => 'error', 'message' => 'معرف المنتج غير صالح')));
    }

    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(array('status' => 'success', 'message' => 'تم حذف المنتج بنجاح'));
    } else {
        error_log("فشل حذف المنتج: " . $stmt->error, 3, "errors.log");
        echo json_encode(array('status' => 'error', 'message' => 'فشل حذف المنتج: ' . $stmt->error));
    }

    $stmt->close();
}

$conn->close();
?>