<?php
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // فحص إذا الإيميل مسجل مسبقًا
    $checkSql = "SELECT * FROM Customer WHERE Email = ?";
    $stmt = $connection->prepare($checkSql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "<script>alert('Email is already registered.'); window.history.back();</script>";
    } else {
        // إدخال الحساب الجديد
        $insertSql = "INSERT INTO Customer (Email, Password) VALUES (?, ?)";
        $stmt = $connection->prepare($insertSql);
        $stmt->bind_param("ss", $email, $password);

        if ($stmt->execute()) {
            echo "<script>alert('Account created successfully! Now login.'); window.location.href='mainbage.php';</script>";
        } else {
            echo "<script>alert('Registration failed.'); window.history.back();</script>";
        }
    }
}

$connection->close();
?>
