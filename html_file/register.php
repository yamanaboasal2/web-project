<?php
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password']; // بدون تشفير

    // تحقق أولًا من وجود الإيميل مسبقًا
    $check = $connection->prepare("SELECT * FROM Customer WHERE Email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        echo "<script>alert('This email is already registered.'); window.history.back();</script>";
        exit();
    } else {
        // تابع إنشاء الحساب إذا لم يكن موجود
        $sql = "INSERT INTO Customer (Customer_Name, Email, Password, Registration_Date)
                VALUES (?, ?, ?, CURDATE())";

        $stmt = $connection->prepare($sql);
        $stmt->bind_param("sss", $name, $email, $password);

        if ($stmt->execute()) {
            echo "<script>alert('Account created successfully!'); window.location.href = 'login.html';</script>";
            exit();
        } else {
            echo "<script>alert('Error: " . $stmt->error . "'); window.history.back();</script>";
            exit();
        }
    }
}
$connection->close();
?>
