<?php
session_start();

// تفعيل تسجيل الأخطاء
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

// الاتصال بقاعدة البيانات
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    error_log("Connection failed: " . $connection->connect_error);
    die(json_encode(["success" => false, "message" => "Connection failed: " . $connection->connect_error]));
}

// تعيين Content-Type
header('Content-Type: application/json');

// جلب customer_id و product_id
$customer_id = isset($_POST['customer_id']) ? (int)$_POST['customer_id'] : (isset($_SESSION['customer_id']) ? (int)$_SESSION['customer_id'] : null);
$product_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : null;

if (!$customer_id || !$product_id) {
    error_log("Missing customer_id or product_id: customer_id=$customer_id, product_id=$product_id");
    echo json_encode(["success" => false, "message" => "Missing customer_id or product_id"]);
    exit;
}

// التحقق من وجود Customer_Id و Product_Id في الجداول المرتبطة
$check_customer = $connection->prepare("SELECT Customer_Id FROM Customer WHERE Customer_Id = ?");
$check_customer->bind_param("i", $customer_id);
$check_customer->execute();
if ($check_customer->get_result()->num_rows === 0) {
    error_log("Customer not found: customer_id=$customer_id");
    echo json_encode(["success" => false, "message" => "Customer not found"]);
    exit;
}

$check_product = $connection->prepare("SELECT Product_Id FROM Product WHERE Product_Id = ?");
$check_product->bind_param("i", $product_id);
$check_product->execute();
if ($check_product->get_result()->num_rows === 0) {
    error_log("Product not found: product_id=$product_id");
    echo json_encode(["success" => false, "message" => "Product not found"]);
    exit;
}

// حذف المنتج من السلة
$delete = $connection->prepare("DELETE FROM Cart WHERE Customer_Id = ? AND Product_Id = ?");
$delete->bind_param("ii", $customer_id, $product_id);

if ($delete->execute()) {
    if ($delete->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Product removed from cart"]);
    } else {
        error_log("No product found to remove: customer_id=$customer_id, product_id=$product_id");
        echo json_encode(["success" => false, "message" => "No product found to remove"]);
    }
} else {
    error_log("Delete failed: " . $delete->error);
    echo json_encode(["success" => false, "message" => "Delete failed: " . $delete->error]);
}

// إغلاق الاتصالات
$check_customer->close();
$check_product->close();
$delete->close();
$connection->close();
?>
