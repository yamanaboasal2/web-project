<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "soap";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    header('Content-Type: application/json');
    echo json_encode(array('status' => 'error', 'message' => 'فشل الاتصال: ' . $conn->connect_error));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $type = isset($_POST['type']) ? trim($_POST['type']) : '';
    $specific_type = isset($_POST['specific_type']) ? trim($_POST['specific_type']) : '';
    $price = isset($_POST['price']) ? floatval($_POST['price']) : 0;
    $quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 0;

    if (empty($name) || empty($description) || empty($type) || empty($specific_type) || $price <= 0 || $quantity < 0) {
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'error', 'message' => 'جميع الحقول مطلوبة ويجب أن تكون صحيحة'));
        exit;
    }

    $target_dir = "../image/";
    if (!is_dir($target_dir) || !is_writable($target_dir)) {
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'error', 'message' => 'مجلد الصور غير موجود أو غير قابل للكتابة'));
        exit;
    }

    $primary_image = '';
    $secondary_image = '';

    if (isset($_FILES['primary_image']) && $_FILES['primary_image']['error'] === UPLOAD_ERR_OK) {
        $primary_image = $target_dir . basename($_FILES['primary_image']['name']);
        if (!move_uploaded_file($_FILES['primary_image']['tmp_name'], $primary_image)) {
            header('Content-Type: application/json');
            echo json_encode(array('status' => 'error', 'message' => 'فشل رفع الصورة الأساسية'));
            exit;
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'error', 'message' => 'الصورة الأساسية مطلوبة'));
        exit;
    }

    if (isset($_FILES['secondary_image']) && $_FILES['secondary_image']['error'] === UPLOAD_ERR_OK) {
        $secondary_image = $target_dir . basename($_FILES['secondary_image']['name']);
        if (!move_uploaded_file($_FILES['secondary_image']['tmp_name'], $secondary_image)) {
            $secondary_image = ''; // الصورة الثانوية اختيارية، لذا نستمر حتى لو فشل رفعها
        }
    }

    $stmt = $conn->prepare("INSERT INTO products (name, description, type, specific_type, price, quantity, primary_image, secondary_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'error', 'message' => 'فشل تحضير الاستعلام: ' . $conn->error));
        exit;
    }

    $stmt->bind_param("ssssdiss", $name, $description, $type, $specific_type, $price, $quantity, $primary_image, $secondary_image);

    if ($stmt->execute()) {
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'success', 'message' => 'تم إضافة المنتج بنجاح'));
    } else {
        error_log("فشل إدراج المنتج: " . $stmt->error, 3, "errors.log");
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'error', 'message' => 'فشل إضافة المنتج: ' . $stmt->error));
    }

    $stmt->close();
}

$conn->close();
?>