<?php
// الاتصال بقاعدة البيانات
$servername = "localhost";
$username = "root"; // استبدل باسم مستخدم قاعدة البيانات
$password = ""; // استبدل بكلمة مرور قاعدة البيانات
$dbname = "soap"; // اسم قاعدة البيانات

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8");
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// جلب عناصر المفضلة
$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
if ($user_id > 0) {
    $stmt = $conn->prepare("SELECT id, product_name, product_price, product_image FROM wishlist WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $wishlist_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $wishlist_items]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'معرف مستخدم غير صالح']);
}
?>