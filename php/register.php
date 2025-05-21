<?php
session_start();
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $passwordInput = trim($_POST['password']);

    $sql = "SELECT Customer_Id, Password FROM Customer WHERE Email = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("s", $email);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows === 1) {
            $row = $result->fetch_assoc();
            if ($passwordInput === $row['Password']) {
                $_SESSION['customer_id'] = $row['Customer_Id'];
                header("Location: html_file/mainbage.html");  // تأكد الاسم صحيح
                exit();
            } else {
                echo "<script>alert('Incorrect password.'); window.history.back();</script>";
            }
        } else {
            echo "<script>alert('No account found with that email.'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('Query failed.'); window.history.back();</script>";
    }
}

$connection->close();
?>
