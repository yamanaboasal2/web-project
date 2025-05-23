<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Ensure PHPMailer is installed via Composer

$host = 'localhost';
$db = 'your_database_name'; // Replace with your database name
$user = 'root'; // Replace with your database username
$pass = ''; // Replace with your database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $product_id = filter_var($_POST['product_id'], FILTER_SANITIZE_NUMBER_INT);
        $product_name = filter_var($_POST['product_name'], FILTER_SANITIZE_STRING);
        $product_image = filter_var($_POST['product_image'], FILTER_SANITIZE_URL);

        // Fetch all subscriber emails
        $stmt = $pdo->query('SELECT email FROM subscribers');
        $subscribers = $stmt->fetchAll(PDO::FETCH_COLUMN);

        // Set up PHPMailer
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'localhost'; // Use MailHog or your local SMTP server
        $mail->Port = 1025; // Default MailHog port
        $mail->SMTPAuth = false;

        $mail->setFrom('no-reply@nablussoap.com', 'Nablus Soap');
        $mail->Subject = 'Discover Our Exciting New Product!';
        $mail->isHTML(true);
        $mail->Body = '
            <h2>Exciting News from Nablus Soap!</h2>
            <p>We just added a fantastic new product: <strong>' . htmlspecialchars($product_name) . '</strong>!</p>
            <p>Don’t miss out! <a href="http://localhost/your_project/product.php?id=' . $product_id . '">Check it out now!</a></p>
            <img src="' . htmlspecialchars($product_image) . '" alt="' . htmlspecialchars($product_name) . '" style="max-width: 200px;">
            <p>Stay tuned for more updates!</p>
        ';

        // Send email to each subscriber
        foreach ($subscribers as $email) {
            $mail->addAddress($email);
            $mail->send();
            $mail->clearAddresses();
        }

        echo json_encode(['status' => 'success', 'message' => 'Emails sent successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Email error: ' . $e->getMessage()]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>