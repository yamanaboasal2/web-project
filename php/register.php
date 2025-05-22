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
    $customer_name = trim($_POST['customer_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    // Log received inputs for debugging
    error_log("Received inputs: customer_name=$customer_name, email=$email, password=" . (empty($password) ? 'empty' : 'set'));

    // Validate required inputs
    if (empty($customer_name) || empty($email) || empty($password)) {
        error_log("Empty customer_name, email, or password provided.");
        echo "<script>alert('Name, email, and password are required.'); window.history.back();</script>";
        $connection->close();
        ob_end_flush();
        exit();
    }

    // Check if email is already registered
    $checkSql = "SELECT Customer_Id FROM Customer WHERE Email = ?";
    $stmt = $connection->prepare($checkSql);
    if (!$stmt) {
        error_log("Prepare failed for email check: " . $connection->error);
        die("Prepare failed. Check error log.");
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        error_log("Email already registered: $email");
        echo "<script>alert('Email is already registered.'); window.history.back();</script>";
        $stmt->close();
        $connection->close();
        ob_end_flush();
        exit();
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new account
    $insertSql = "INSERT INTO Customer (Customer_Name, Email, Password, Registration_Date) VALUES (?, ?, ?, CURDATE())";
    $stmt = $connection->prepare($insertSql);
    if (!$stmt) {
        error_log("Prepare failed for insert: " . $connection->error);
        die("Prepare failed. Check error log.");
    }
    // Bind parameters
    $stmt->bind_param("sss", $customer_name, $email, $hashedPassword);

    if ($stmt->execute()) {
        // Get the newly created customer ID
        $customerId = $connection->insert_id;
        $_SESSION['customer_id'] = $customerId;
        error_log("Registration successful for email: $email, showing success alert");
        // Close statement and connection
        $stmt->close();
        $connection->close();
        // Ensure no output before redirect
        ob_end_clean();
        // Show success alert and redirect
        echo "<script>alert('Registration successful! You will be redirected to the main page.'); window.location.href='/web-project1/html_file/mainbage.php';</script>";
        exit();
    } else {
        error_log("Registration failed: " . $stmt->error);
        echo "<script>alert('Registration failed.'); window.history.back();</script>";
    }

    // Close statement and connection
    $stmt->close();
    $connection->close();
}

// End output buffering
ob_end_flush();
?>