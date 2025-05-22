<?php
session_start();

// Redirect if already logged in
if (isset($_SESSION['customer_id'])) {
    header("Location: /html_file/mainbage.php"); // تأكد من أن اسم الملف صحيح
    exit();
}

// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// Handle POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email'] ?? '');
    $passwordInput = $_POST['password'] ?? '';

    // Validate inputs
    if (empty($email) || empty($passwordInput)) {
        echo "<script>alert('Email and password are required.'); window.history.back();</script>";
        exit();
    }

    // Prepare and execute query
    $sql = "SELECT Customer_Id, Password FROM Customer WHERE Email = ?";
    $stmt = $connection->prepare($sql);
    if (!$stmt) {
        die("Prepare failed: " . $connection->error);
    }
    $stmt->bind_param("s", $email);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows === 1) {
            $row = $result->fetch_assoc();
            if (password_verify($passwordInput, $row['Password'])) {
                $_SESSION['customer_id'] = $row['Customer_Id'];
                header("Location: /html_file/mainbage.php"); // تأكد من أن المسار صحيح
                exit();
            } else {
                echo "<script>alert('Incorrect password.'); window.history.back();</script>";
            }
        } else {
            echo "<script>alert('No account found with that email.'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('Query execution failed.'); window.history.back();</script>";
    }

    // Close statement and connection
    $stmt->close();
    $connection->close();
}
?>