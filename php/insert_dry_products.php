<?php
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// كل منتج: [Product_Name, Description, Price, Quantity, Image, Specific_Type, Type]
$products = [
    ["Dates Soap", "Soap with dates extract", 27.99, 30, "../image/Dry3.png", "Dry", "Skin"],
    ["Figs Soap", "Soap with fig extract", 32.99, 25, "../image/Dry2.png", "Dry", "Skin"],
    ["Goat Milk Soap", "Soap with goat milk", 47.99, 20, "../image/Dry4.png", "Dry", "Skin"],
];

foreach ($products as $p) {
    $stmt = $connection->prepare("INSERT INTO Product (Product_Name, Description, Price, Date, Quantity, Image, Specific_Type, Type)
                                  VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?)");
    $stmt->bind_param("ssdisss", $p[0], $p[1], $p[2], $p[3], $p[4], $p[5], $p[6]);
    $stmt->execute();
}

echo "✅ Products inserted successfully.";

$connection->close();
?>
