<?php
session_start();
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $passwordInput = $_POST['password'];

    $sql = "SELECT Customer_Id, Password FROM Customer WHERE Email = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("s", $email);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows === 1) {
            $row = $result->fetch_assoc();
            if ($passwordInput === $row['Password']) {
                $_SESSION['customer_id'] = $row['Customer_Id'];
                echo "Login successful";
                header("Location: mainbage.html");
                exit();
            } else {
                echo "Incorrect password.";
            }
        } else {
            echo "No account found with that email.";
        }
    }
}
$connection->close();
?>
