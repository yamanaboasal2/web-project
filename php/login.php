<?php
// Start the session
session_start();

// Prevent output before headers
ob_start();

// Enable error logging
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/web-project1/php_error.log');
error_reporting(E_ALL);

// Database connection
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    error_log("Connection failed: " . $connection->connect_error);
    die("Connection failed. Check error log.");
}

// Handle POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize input
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    // Log received inputs for debugging
    error_log("Login attempt: email=$email, password=" . (empty($password) ? 'empty' : 'set'));

    // Validate required inputs
    if (empty($email) || empty($password)) {
        error_log("Empty email or password provided.");
        echo "<script>alert('البريد الإلكتروني وكلمة المرور مطلوبان / Email and password are required.'); window.history.back();</script>";
        $connection->close();
        ob_end_flush();
        exit();
    }

    // Check user credentials
    $sql = "SELECT Customer_Id, Email, Password FROM Customer WHERE Email = ?";
    $stmt = $connection->prepare($sql);
    if (!$stmt) {
        error_log("Prepare failed for login check: " . $connection->error);
        die("Prepare failed. Check error log.");
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        // Verify password
        if (password_verify($password, $row['Password'])) {
            // Set session
            $_SESSION['customer_id'] = $row['Customer_Id'];
            error_log("Login successful for email: $email");

            // Close statement and connection
            $stmt->close();
            $connection->close();

            // Redirect based on email
            $admin_email = "eleenbzoor32@gmail.com";
            if ($email === $admin_email) {
                error_log("Admin login detected, redirecting to admin.php");
                ob_end_clean();
                header("Location: /web-project1/html_file/admin.html");
            } else {
                error_log("Regular user login, redirecting to mainbage.php");
                ob_end_clean();
                header("Location: /web-project1/html_file/mainbage.php");
            }
            exit();
        } else {
            error_log("Invalid password for email: $email");
            echo "<script>alert('كلمة المرور غير صحيحة / Incorrect password.'); window.history.back();</script>";
        }
    } else {
        error_log("No user found with email: $email");
        echo "<script>alert('البريد الإلكتروني غير مسجل / Email not registered.'); window.history.back();</script>";
    }

    // Close statement and connection
    $stmt->close();
    $connection->close();
}

// End output buffering
ob_end_flush();
?>