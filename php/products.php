<?php
$connection = new mysqli("localhost", "root", "", "soap");
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$query = "SELECT * FROM Product";
$result = $connection->query($query);

if ($result->num_rows > 0) {
    echo '<div class="row">'; // Bootstrap grid
    while ($row = $result->fetch_assoc()) {
        echo '
        <div class="col-md-4">
            <div class="card mb-4">
                <img src="' . $row['Image'] . '" class="card-img-top" alt="' . $row['Product_Name'] . '">
                <div class="card-body">
                    <h5 class="card-title">' . $row['Product_Name'] . '</h5>
                    <p class="card-text">$' . $row['Price'] . '</p>
                    <button class="btn btn-outline-danger wishlist"
                            data-id="' . $row['Product_Id'] . '"
                            data-name="' . htmlspecialchars($row['Product_Name']) . '"
                            data-price="' . $row['Price'] . '"
                            data-image="' . $row['Image'] . '">
                        <i class="fa fa-heart"></i> Add to Wishlist
                    </button>
                </div>
            </div>
        </div>';
    }
    echo '</div>';
} else {
    echo '<p>No products found.</p>';
}

$connection->close();
?>
