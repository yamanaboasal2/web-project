<?php
// الاتصال بقاعدة البيانات
$servername = "localhost";
$username = "root"; // استبدل باسم مستخدم قاعدة البيانات
$password = ""; // استبدل بكلمة مرور قاعدة البيانات
$dbname = "soap"; // استبدل باسم قاعدة البيانات

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // تحديد ترميز UTF-8
    $conn->exec("SET NAMES utf8");
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// التحقق من وجود طلب POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = isset($_POST['user_id']) ? (int)$_POST['user_id'] : 0; // معرف المستخدم
    $product_name = isset($_POST['product_name']) ? trim($_POST['product_name']) : '';
    $product_price = isset($_POST['product_price']) ? (float)$_POST['product_price'] : 0;
    $product_image = isset($_POST['product_image']) ? trim($_POST['product_image']) : '';

    // التحقق من صحة البيانات
    if ($user_id > 0 && !empty($product_name) && $product_price > 0 && !empty($product_image)) {
        try {
            // إدراج البيانات في جدول المفضلة
            $stmt = $conn->prepare("INSERT INTO wishlist (user_id, product_name, product_price, product_image) VALUES (:user_id, :product_name, :product_price, :product_image)");
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->bindParam(':product_name', $product_name, PDO::PARAM_STR);
            $stmt->bindParam(':product_price', $product_price, PDO::PARAM_STR);
            $stmt->bindParam(':product_image', $product_image, PDO::PARAM_STR);
            $stmt->execute();

            // إرجاع استجابة JSON
            echo json_encode(['status' => 'success', 'message' => 'تم إضافة المنتج إلى المفضلة']);
        } catch(PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'خطأ أثناء إضافة المنتج: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'بيانات غير صالحة']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'طلب غير صالح']);
}
?>