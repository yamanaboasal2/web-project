<?php
// منع أي إخراج غير متوقع
ob_start();
session_start();

// تعطيل عرض الأخطاء على الشاشة، تسجيلها في ملف
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

// ضمان إخراج JSON
header('Content-Type: application/json; charset=UTF-8');

// تسجيل الطلب للتصحيح
file_put_contents('debug.log', date('Y-m-d H:i:s') . " GET: " . print_r($_GET, true) . "\n", FILE_APPEND);

// التحقق من تسجيل الدخول
if (!isset($_SESSION['customer_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'غير مصرح بالوصول']);
    ob_end_flush();
    exit();
}

// الاتصال بقاعدة البيانات
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    file_put_contents('debug.log', date('Y-m-d H:i:s') . " فشل الاتصال: " . $connection->connect_error . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات']);
    ob_end_flush();
    exit();
}

// جلب معرف العميل
$customerId = isset($_GET['id']) ? (int)$_GET['id'] : null;
if (!$customerId) {
    file_put_contents('debug.log', date('Y-m-d H:i:s') . " معرف عميل غير صالح\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'معرف العميل غير صالح']);
    ob_end_flush();
    exit();
}

// جلب بيانات العميل
$sql = "SELECT Customer_Id, Name, Email FROM Customer WHERE Customer_Id = ?";
$stmt = $connection->prepare($sql);
if (!$stmt) {
    file_put_contents('debug.log', date('Y-m-d H:i:s') . " فشل التحضير: " . $connection->error . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'فشل تحضير الاستعلام']);
    ob_end_flush();
    exit();
}
$stmt->bind_param("i", $customerId);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    if ($result->num_rows === 1) {
        $customer = $result->fetch_assoc();
        file_put_contents('debug.log', date('Y-m-d H:i:s') . " تم جلب العميل: " . $customerId . "\n", FILE_APPEND);
        echo json_encode(['success' => true, 'customer' => $customer]);
    } else {
        file_put_contents('debug.log', date('Y-m-d H:i:s') . " العميل غير موجود: " . $customerId . "\n", FILE_APPEND);
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'العميل غير موجود']);
    }
} else {
    file_put_contents('debug.log', date('Y-m-d H:i:s') . " فشل تنفيذ الاستعلام: " . $stmt->error . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'فشل تنفيذ الاستعلام']);
}

$stmt->close();
$connection->close();
ob_end_flush();
?>