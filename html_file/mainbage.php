<?php
// Connect to the database
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "soap";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8");
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Get the search query
$query = isset($_GET['query']) ? trim($_GET['query']) : '';
$results = [];

if (!empty($query)) {
    $stmt = $conn->prepare("SELECT * FROM pages WHERE content LIKE :query OR title LIKE :query");
    $search_term = "%" . $query . "%";
    $stmt->bindParam(':query', $search_term);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Function to highlight search term
function highlight($text, $query) {
    if (empty($query)) return $text;
    return preg_replace("/($query)/i", '<span class="highlight">$1</span>', $text);
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Open+Sans:wght@300&family=Tajawal:wght@400;500;700&family=Playfair+Display:wght@700&family=Raleway:wght@400;500;600&display=swap" rel="stylesheet">
    <title>Nablus Soap</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="../css/mainbage.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=Cormorant+Garamond:wght@400;500&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Open+Sans:wght@300&family=Tajawal:wght@400;500;700&family=Playfair+Display:wght@700&family=Raleway:wght@400;500;600&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@500;700&display=swap" rel="stylesheet">

    <style>

        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7); /* Dark overlay to dim background */
            z-index: 1000;
        }
        .results-container {
            max-width: 800px;
            width: 90%;
            position: fixed;
            top: 80%; /* Position near the bottom */
            left: 50%;
            transform: translate(-50%, 0); /* Center horizontally, no vertical offset */
            padding: 20px;
            background: rgba(101, 67, 33, 0.2); /* Brown with transparency */
            backdrop-filter: blur(10px);
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            max-height: 400px; /* Fixed height for scrolling */
            overflow-y: auto; /* Enable vertical scroll */
            z-index: 1001; /* Above overlay */
            display: none; /* Hidden by default */
        }
        .results-container.show {
            display: block; /* Show when results are present */
        }
        .results-container h4 {
            color: #FFF8DC; /* Cornsilk for header */
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        }
        .result-card {
            background: rgba(139, 69, 19, 0.9); /* SaddleBrown with slight transparency */
            border: none;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .result-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .result-card h5 {
            font-size: 1.1rem;
            margin-bottom: 8px;
            color: #FFF8DC; /* Cornsilk for card title */
        }
        .result-card p {
            font-size: 0.9rem;
            color: #F5DEB3; /* Wheat for card content */
            margin: 0;
        }
        .highlight {
            background-color: #6B4E31; /* DarkBrown for highlight */
            padding: 2px 4px;
            border-radius: 3px;
            color: #FFF8DC;
        }
        .no-results {
            background: rgba(139, 69, 19, 0.9); /* SaddleBrown for no-results */
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            color: #FFF8DC; /* Cornsilk for text */
            font-size: 1rem;
            margin-bottom: 10px;
        }
        /* Close button */
        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #6B4E31; /* DarkBrown for close button */
            color: #FFF8DC; /* Cornsilk for X */
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 14px;
            line-height: 24px;
            text-align: center;
            cursor: pointer;
            transition: background 0.2s;
        }
        .close-btn:hover {
            background: #5C4033; /* Darker brown on hover */
        }
        /* Custom scrollbar */
        .results-container::-webkit-scrollbar {
            width: 8px;
        }
        .results-container::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        }
        .results-container::-webkit-scrollbar-thumb {
            background: #8B4513; /* SaddleBrown for scrollbar */
            border-radius: 10px;
        }
        .results-container::-webkit-scrollbar-thumb:hover {
            background: #5C4033; /* Darker brown on hover */
        }
    </style>



</head>
<body>


<section class="background">
    <div class = "main_nav">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" >Nablus Soap</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" aria-current="page" href="mainbage.html" data-translate="navbar.home">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="about_us.html" data-translate="navbar.about">About Us</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="contactus.html" data-translate="navbar.contact">Contact Us</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="skincare.html" id="skinCareDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Skin Care
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="skinCareDropdown">
                                <li><a class="dropdown-item" href="acne.html" data-translate="dropdown.skin.acne">Acne</a></li>
                                <li><a class="dropdown-item" href="Dry.html" data-translate="dropdown.skin.dry">Dry Skin</a></li>
                                <li><a class="dropdown-item" href="Wrinkles.html" data-translate="dropdown.skin.wrinkles">Wrinkles and Aging</a></li>
                                <li><a class="dropdown-item" href="DarkSpots.html" data-translate="dropdown.skin.spots">Blackheads & Dark Spots</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown mega-dropdown">
                            <a class="nav-link dropdown-toggle" href="Shop.html" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-translate="navbar.products">
                                Shop
                            </a>
                            <div class="dropdown-menu mega-dropdown-menu">
                                <div class="container-fluid">
                                    <div class="row">
                                        <!-- العمود الأول: Face Care -->
                                        <div class="col-md-4 dropdown-column">
                                            <h6>Face Care</h6>
                                            <ul class="list-unstyled">
                                                <li><a class="dropdown-item" href="clean.html">Cleansers</a></li>
                                                <li><a class="dropdown-item" href="Serums.html">Serums</a></li>
                                                <li><a class="dropdown-item" href="Moisturizers.html">Moisturizers</a></li>
                                                <li><a class="dropdown-item" href="allshop_facecare.html" style="font-weight: 600; color: #5a3921;">Shop all <i class="fas fa-arrow-right ms-2"></i></a></li>
                                            </ul>
                                        </div>

                                        <!-- العمود الثاني: Hair Care -->
                                        <div class="col-md-4 dropdown-column">
                                            <h6>Hair Care</h6>
                                            <ul class="list-unstyled">
                                                <li><a class="dropdown-item" href="shampooo.html">Shampoos</a></li>
                                                <li><a class="dropdown-item" href="Conditioner.html">Conditioners</a></li>
                                                <li><a class="dropdown-item" href="Hairmasks.html">Hair masks</a></li>
                                                <li><a class="dropdown-item" href="allshop_haircare.html" style="font-weight: 600; color: #5a3921;">Shop all <i class="fas fa-arrow-right ms-2"></i></a></li>
                                            </ul>
                                        </div>

                                        <!-- العمود الثالث: Body Care -->
                                        <div class="col-md-4 dropdown-column">
                                            <h6>Body Care</h6>
                                            <ul class="list-unstyled">
                                                <li><a class="dropdown-item" href="Bodycare.html">Body soaps</a></li>
                                                <li><a class="dropdown-item" href="BodyScrub.html">Scrubs</a></li>
                                                <li><a class="dropdown-item" href="Bodylotions.html">Lotions</a></li>
                                                <li><a class="dropdown-item" href="allshop_bodycare.html" style="font-weight: 600; color: #5a3921;">Shop all <i class="fas fa-arrow-right ms-2"></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarLanguage" role="button" data-bs-toggle="dropdown">
                                <span id="current-language" data-translate="language.lang">Language</span>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item language-option" href="#" data-lang="en">English</a></li>
                                <li><a class="dropdown-item language-option" href="#" data-lang="ar">العربية</a></li>
                            </ul>
                        </li>
                    </ul>


                    <!-- Search Form -->
                    <div class="search-container">
                        <form class="d-flex my-4" role="search" method="GET" action="mainbage.php">
                            <input class="form-control me-2" type="search" name="query" placeholder="Search products..." aria-label="Search" value="<?php echo htmlspecialchars($query); ?>" required>
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>

                    <!-- Overlay and Search Results -->
                    <?php if (!empty($query)): ?>
                        <div class="overlay show"></div>
                        <div class="results-container show">
                            <button class="close-btn" onclick="closeResults()">X</button>
                            <h4>Search Results for: <?php echo htmlspecialchars($query); ?></h4>
                            <?php if (empty($results)): ?>
                                <div class="no-results">
                                    No results found for your search. Try different keywords.
                                </div>
                            <?php else: ?>
                                <?php foreach ($results as $result): ?>
                                    <div class="result-card">
                                        <h5><?php echo highlight(htmlspecialchars($result['title']), $query); ?></h5>
                                        <p><?php echo highlight(htmlspecialchars($result['content']), $query); ?></p>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>


                    <form class="style_iqon" role="iqon" style="display: flex; align-items: center; gap: 10px;">
                        <div class="profile-icons" style="display: flex; gap: 8px;">
                            <a href="shopping_cart.html" class="icon-link cart-icon">
                                <img src="../image/shopping-cart-xxl.png" id="cart-icon" alt="سلة المشتريات" width="24" height="24">
                                <span id="cart-count" style="
                                    position: absolute;
                                     top: -5px;
                                    right: -5px;
                                      background:#a58070;
                                       color:#e8d9c5;
                                        font-size: 10px;
                                        padding: 2px 6px;
                                          border-radius: 50%;
                                      display: none;
                                       font-weight: bold;
                                       ">0</span>
                            </a>
                            </a>
                            <a href="Wishlist.html" class="icon-link favorite-icon">
                                <img src="../image/hearts-xxl.png" id="wishlist-icon" alt="المفضلات" width="24" height="24">
                                <span id="wishlist-count" style="
                                      position: absolute;
                                         top: -5px;
                                        right: -5px;
                                          background:#a58070;
                                           color:#e8d9c5;
                                            font-size: 10px;
                                            padding: 2px 6px;
                                              border-radius: 50%;
                                          display: none;
                                           font-weight: bold;
                                           ">0</span>
                            </a>
                            <a href="login.html" class="icon-link profile-icon">
                                <img src="../image/user-xxl.png" alt="البروفايل" width="24" height="24">
                            </a>

                        </div>
                    </form>
                </div>
            </div>
        </nav>
    </div>
</section>

<div class="elementor-section wdt-soap-banner">
    <div class="elementor-background-video-container">
        <video autoplay muted loop playsinline class="elementor-background-video" src="https://jabon.wpengine.com/wp-content/uploads/2024/08/Soap-vid.webm"></video>
        <div class="video-content">
            <h1 class="video-main-title">Experience the Craftsmanship of Artisanal Soap at Our Premier Roastery</h1>
        </div>
        <!-- نقل حاوية الأيقونات داخل حاوية الفيديو -->
        <div class="icon-container">
            <a href="https://www.facebook.com/nablussoapco" target="_blank" class="icon facebook">
                <i class="fa-brands fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/nablussoapco/" target="_blank" class="icon instagram">
                <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com/in/nablus-soap-b0218929/" target="_blank" class="icon linkedin">
                <i class="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://www.youtube.com/channel/UClqnBDVfVlkA7TYiM7-xGrw" target="_blank" class="icon youtube">
                <i class="fa-brands fa-youtube"></i>
            </a>
        </div>
    </div>
</div>

<div class="container">
    <h1 class="main-title">Shop By Category</h1>
    <div class="category-grid">
        <div class="category-item">
            <img src="../image/y4.jpg" alt="Eco-Friendly Soaps" class="category-image" onerror="this.src='https://via.placeholder.com/300x200?text=Eco-Friendly+Soap'">
            <div class="category-title">Eco-Friendly Soaps</div>
        </div>
        <div class="category-item">
            <img src="../image/y3.jpg" alt="Scrub Soap" class="category-image" onerror="this.src='https://via.placeholder.com/300x200?text=Scrub+Soap'">
            <div class="category-title">Scrub Soap</div>
        </div>
        <div class="category-item">
            <img src="../image/y5.jpg" alt="Anti-Aging Soaps" class="category-image" onerror="this.src='https://via.placeholder.com/300x200?text=Anti-Aging+Soap'">
            <div class="category-title">Anti-Aging Soaps</div>
        </div>
        <div class="category-item">
            <img src="../image/y2.jpg" alt="Liquid Organic Soap" class="category-image" onerror="this.src='https://via.placeholder.com/300x200?text=Liquid+Organic+Soap'">
            <div class="category-title">Liquid Organic Soap</div>
        </div>
        <div class="category-item">
            <img src="../image/www.jpg" alt="Moisturizing Soaps" class="category-image" onerror="this.src='https://via.placeholder.com/300x200?text=Moisturizing+Soap'">
            <div class="category-title">Moisturizing Soaps</div>
        </div>
        <div class="category-item">
            <img src="../image/y1.jpg" alt="Organic Baby Soaps" class="category-image" onerror="this.src='https://via.placeholder.com/300x200?text=Organic+Baby+Soap'">
            <div class="category-title">Organic Baby Soaps</div>
        </div>
    </div>
</div>

<div class="luxury-marquee">
    <div class="marquee-inner">
        <div class="marquee-item">
            <a href="#"><i class="icon-gift"></i> #20% Off On All Natural Soaps!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-shipping"></i> #Free International Shipping Over $80!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-friends"></i> #Refer A Friend For 20% Off!</a>
        </div>
        <!-- تكرار العناصر للحركة السلسة -->
        <div class="marquee-item">
            <a href="#"><i class="icon-gift"></i> #20% Off On All Natural Soaps!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-shipping"></i> #Free International Shipping Over $80!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-friends"></i> #Refer A Friend For 20% Off!</a>
        </div>
    </div>
</div>

<div class="container-inner">
    <!-- Image Section -->
    <div class="image-container">
        <div class="image-wrapper">
            <img src="https://jabon.wpengine.com/wp-content/uploads/2024/08/Home-3-Filler-bg-img-1.jpg" alt="Filler Image" class="filler-image">
        </div>
    </div>
    <!-- Content Section -->
    <div class="content-container">
        <!-- Heading -->
        <div class="heading-wrapper">
            <div class="main-heading">
                <h1>
                        <span class="subheading-text">
                            Fight Germs For Less – Up To 20% Off
                        </span>
                </h1>
            </div>

            <div class="content-text">
                <p>Gravida fermentum molestie aliquam tempus ad habitasse nam massa mus.</p>
                <p>Semper phasellus nascetur natoque, tempor placerat aliquet.</p>
                <p>Cras mattis malesuada euismod suspendisse integer tempus ac condimentum nisl.</p>
            </div>
        </div>
        <!-- Button -->
        <div class="button-wrapper">
            <a href="about_us.html" class="button"><span>Explore Now</span></a>
        </div>
    </div>
</div>

<div class="luxury-marquee">
    <div class="marquee-inner">
        <div class="marquee-item">
            <a href="#"><i class="icon-gift"></i> #20% Off On All Natural Soaps!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-shipping"></i> #Free International Shipping Over $80!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-friends"></i> #Refer A Friend For 20% Off!</a>
        </div>
        <!-- تكرار العناصر للحركة السلسة -->
        <div class="marquee-item">
            <a href="#"><i class="icon-gift"></i> #20% Off On All Natural Soaps!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-shipping"></i> #Free International Shipping Over $80!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-friends"></i> #Refer A Friend For 20% Off!</a>
        </div>
    </div>
</div>

<section class="product-section">
    <!-- Left Column: Image Slider and Text -->
    <div class="text-column">
        <div class="text-content">
            <div class="subheading">All-Time Favorites</div>
            <h2>Hair Care Products</h2>
            <p>Leo montes vivamus neque, interdum condimentum dolor eros. Rhoncus bibendum litora sed interdum.</p>
            <a href="Shop.html" class="view-all-btn">View All Products</a>
        </div>
    </div>
    <!-- Right Column: Product Card Slider -->
    <div class="slider-column">
        <div class="product-slider">
            <div class="swiper-container product-slider-container">
                <div class="swiper-wrapper">
                    <!-- Product Card 1 -->
                    <div class="swiper-slide product-card" data-index="1">
                        <div class="card-media">
                            <img src="../image/sgh.jpg" alt="Shampoo bar - Normal and/or oily hair" class="product-image primary-image">
                            <img src="../image/sham.jpg" alt="Shampoo bar - Normal and/or oily hair Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Shampoo bar - Normal and/or oily hair" data-price="22.00">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Shampoo bar - Normal </a>
                            <div class="product-price">$22.00</div>
                            <button class="add-to-cart" data-name="Shampoo bar - Normal and/or oily hair" data-price="22.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <!-- Product Card 2 -->
                    <div class="swiper-slide product-card" data-index="2">
                        <div class="card-media">
                            <img src="../image/shampooo.jpg" alt="Shampoo bar - Dry and thin hair" class="product-image primary-image">
                            <img src="../image/shop3.jpg" alt="Shampoo bar - Dry and thin hair Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Shampoo bar - Dry and thin hair" data-price="40.00">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Shampoo bar - Dry and thin hair</a>
                            <div class="product-price">$40.00</div>
                            <button class="add-to-cart" data-name="Shampoo bar - Dry and thin hair" data-price="40.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <!-- Product Card 3 -->
                    <div class="swiper-slide product-card" data-index="3">
                        <div class="card-media">
                            <img src="../image/ssssshhh.jpg" alt="Shampoo bar - Coily and curly hair" class="product-image primary-image">
                            <img src="../image/hhg.jpg" alt="Shampoo bar - Coily and curly hair Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Shampoo bar - Coily and curly hair" data-price="12.00">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Shampoo bar -  curly hair</a>
                            <div class="product-price">$12.00</div>
                            <button class="add-to-cart" data-name="Shampoo bar - Coily and curly hair" data-price="12.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <!-- Product Card 4 -->
                    <div class="swiper-slide product-card" data-index="4">
                        <div class="card-media">
                            <img src="../image/sh.jpg" alt="Shampoo bar - Colored and/or white hair" class="product-image primary-image">
                            <img src="../image/h.jpg" alt="Shampoo bar - Colored and/or white hair Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Shampoo bar - Colored and/or white hair" data-price="33.00">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Shampoo bar - Colored </a>
                            <div class="product-price">$33.00</div>
                            <button class="add-to-cart" data-name="Shampoo bar - Colored and/or white hair" data-price="33.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <!-- Product Card 5 -->
                    <div class="swiper-slide product-card" data-index="5">
                        <div class="card-media">
                            <img src="../image/yt.jpg" alt="Conditioner bar - Normal and/or oily hair" class="product-image primary-image">
                            <img src="../image/sham.jpg" alt="Conditioner bar - Normal and/or oily hair Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Conditioner bar - Normal and/or oily hair" data-price="22.00">
                                    <svg viewBox="0 0 24  ONLINE24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Conditioner bar - Normal </a>
                            <div class="product-price">$22.00</div>
                            <button class="add-to-cart" data-name="Conditioner bar - Normal and/or oily hair" data-price="22.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <!-- Product Card 6 -->
                    <div class="swiper-slide product-card" data-index="6">
                        <div class="card-media">
                            <img src="../image/uy.jpg" alt="Conditioner bar - Dry and thin hair" class="product-image primary-image">
                            <img src="../image/shop3.jpg" alt="Conditioner bar - Dry and thin hair Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Conditioner bar - Dry and thin hair" data-price="40.00">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Conditioner bar - Dry </a>
                            <div class="product-price">$40.00</div>
                            <button class="add-to-cart" data-name="Conditioner bar - Dry and thin hair" data-price="40.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <!-- Product Card 7 -->
                    <div class="swiper-slide product-card" data-index="7">
                        <div class="card-media">
                            <img src="../image/ytr.jpg" alt="Conditioner Bar - Coily and curly hair" class="product-image primary-image">
                            <img src="../image/hhg.jpg" alt="Conditioner Bar - Coily and curly hair Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Conditioner Bar - Coily and curly hair" data-price="12.00">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Conditioner Bar - Coily </a>
                            <div class="product-price">$12.00</div>
                            <button class="add-to-cart" data-name="Conditioner Bar - Coily and curly hair" data-price="12.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <!-- Product Card 8 -->
                    <div class="swiper-slide product-card" data-index="8">
                        <div class="card-media">
                            <img src="../image/ffffff.jpg" alt="Conditioner bar - Colored and/or white hair" class="product-image primary-image">
                            <img src="../image/h.jpg" alt="Conditioner bar - Colored and/or white hair Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Conditioner bar - Colored and/or white hair" data-price="33.00">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Conditioner Bar - Coily</a>
                            <div class="product-price">$33.00</div>
                            <button class="add-to-cart" data-name="Conditioner bar - Colored and/or white hair" data-price="33.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <!-- Product Card 9 -->
                    <div class="swiper-slide product-card" data-index="9">
                        <div class="card-media">
                            <img src="../image/mmmaa.jpg" alt="Moisture & Nourish Hair Mask" class="product-image primary-image">
                            <img src="../image/hairmask.jpg" alt="Moisture & Nourish Hair Mask Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Moisture & Nourish Hair Mask" data-price="22.00">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Moisture & Nourish Hair </a>
                            <div class="product-price">$22.00</div>
                            <button class="add-to-cart" data-name="Moisture & Nourish Hair Mask" data-price="22.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <!-- Product Card 10 -->
                    <div class="swiper-slide product-card" data-index="10">
                        <div class="card-media">
                            <img src="../image/mn.jpg" alt="Hair Care Repair Mask" class="product-image primary-image">
                            <img src="../image/hairmask1.jpg" alt="Hair Care Repair Mask Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Hair Care Repair Mask" data-price="40.00">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Hair Care Repair-white hair </a>
                            <div class="product-price">$40.00</div>
                            <button class="add-to-cart" data-name="Hair Care Repair Mask" data-price="40.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <!-- Product Card 11 -->
                    <div class="swiper-slide product-card" data-index="11">
                        <div class="card-media">
                            <img src="../image/maskkkk.jpg" alt="Scalp Revival Exfoliating Mask with AHAs" class="product-image primary-image">
                            <img src="../image/hairmask2.jpg" alt="Scalp Revival Exfoliating Mask with AHAs Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Scalp Revival Exfoliating Mask with AHAs" data-price="12.00">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Scalp Revival Exfoliating Mask </a>
                            <div class="product-price">$12.00</div>
                            <button class="add-to-cart" data-name="Scalp Revival Exfoliating Mask with AHAs" data-price="12.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <!-- Product Card 12 -->
                    <div class="swiper-slide product-card" data-index="12">
                        <div class="card-media">
                            <img src="../image/ms.jpg" alt="Hair Care Repair Mask - Colored and/or white hair" class="product-image primary-image">
                            <img src="../image/mask.jpg" alt="Hair Care Repair Mask - Colored and/or white hair Alternate" class="product-image secondary-image">
                            <div class="card-badges">
                                <button class="wishlist-btn" aria-label="Add to wishlist" data-name="Hair Care Repair Mask - Colored and/or white hair" data-price="33.00">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </button>
                                <button class="quick-view" aria-label="Quick view">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-info">
                            <a href="#" class="product-title">Hair Care Repair Mask - Colored</a>
                            <div class="product-price">$33.00</div>
                            <button class="add-to-cart" data-name="Hair Care Repair Mask - Colored and/or white hair" data-price="33.00">
                                <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
                <div class="swiper-scrollbar"></div>
            </div>
        </div>
    </div>
</section>

<div class="luxury-marquee">
    <div class="marquee-inner">
        <div class="marquee-item">
            <a href="#"><i class="icon-gift"></i> #20% Off On All Natural Soaps!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-shipping"></i> #Free International Shipping Over $80!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-friends"></i> #Refer A Friend For 20% Off!</a>
        </div>
        <!-- تكرار العناصر للحركة السلسة -->
        <div class="marquee-item">
            <a href="#"><i class="icon-gift"></i> #20% Off On All Natural Soaps!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-shipping"></i> #Free International Shipping Over $80!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-friends"></i> #Refer A Friend For 20% Off!</a>
        </div>
    </div>
</div>

<div class="skn-container">
    <!-- Heading and Main Image Section -->
    <div class="skn-full skn-heading-image-section" data-id="heading-image-section">
        <!-- Heading Section -->
        <div class="skn-heading-section" data-id="heading">
            <div class="skn-widget-container skn-heading">
                <div class="skn-heading-holder">
                    <div class="skn-subheading-content">
                        <span class="skn-subheading skn-charsplit">Pure And Natural</span>
                    </div>
                    <div class="skn-heading-title">
                        <h1><span class="skn-heading-text skn-charsplit">Loved Skincare By Most International Beauticians</span></h1>
                    </div>

                    <div class="skn-heading-content">
                        <div class="skn-content-animation">
                            <span class="skn-text-line">Ex vehicula semper laoreet urna mi nostra quis ut. Egestas penatibus ut torquent,</span>
                            <span class="skn-text-line">porttitor blandit eros egestas maecenas maecenas. Tempus cursus ac semper finibus</span>
                            <span class="skn-text-line">penatibus turpis lorem porta. Curae justo vulputate, sed ullamcorper mi laoreet</span>
                            <span class="skn-text-line">aliquam.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Image Section -->
        <div class="skn-image-section">
            <!-- Main Image -->
            <div class="skn-img-main" data-id="main-img">
                <div class="skn-widget-container">
                    <img loading="lazy" decoding="async" width="500" height="600" src="https://jabon.wpengine.com/wp-content/uploads/2024/08/Home-3-Filler-2-img-1.jpg" alt="Skincare Product" srcset="https://jabon.wpengine.com/wp-content/uploads/2024/08/Home-3-Filler-2-img-1.jpg 800w, https://jabon.wpengine.com/wp-content/uploads/2024/08/Home-3-Filler-2-img-1-250x300.jpg 250w, https://jabon.wpengine.com/wp-content/uploads/2024/08/Home-3-Filler-2-img-1-768x922.jpg 768w" sizes="(max-width: 500px) 100vw, 500px">
                </div>
            </div>
            <!-- Parallax Image 1 -->
            <div class="skn-img-small skn-absolute" data-id="parallax-img1" style="top: 0; right: -50px;">
                <div class="skn-widget-container">
                    <div class="skn-parallax-wrapper" data-parallax='{"distance":10,"smoothness":30,"from-scroll":2239.96875,"to-scroll":3046.96875,"x":-150,"y":-150}'>
                        <img decoding="async" width="200" height="200" src="https://jabon.wpengine.com/wp-content/uploads/2024/08/Home-3-Filler-2-img-2.jpg" alt="Small Skincare Product 1" srcset="https://jabon.wpengine.com/wp-content/uploads/2024/08/Home-3-Filler-2-img-2.jpg 200w, https://jabon.wpengine.com/wp-content/uploads/2024/08/Home-3-Filler-2-img-2-150x150.jpg 150w" sizes="(max-width: 200px) 100vw, 200px">
                    </div>
                </div>
            </div>
            <!-- Parallax Image 2 -->
            <div class="skn-img-small skn-absolute" data-id="parallax-img2" style="bottom: 0; left: -50px;">
                <div class="skn-widget-container">
                    <div class="skn-parallax-wrapper" data-parallax='{"distance":10,"smoothness":30,"from-scroll":2679.703125,"to-scroll":3486.703125,"x":100,"y":100}'>
                        <img decoding="async" width="200" height="200" src="https://jabon.wpengine.com/wp-content/uploads/2024/08/Home-3-Filler-2-img-3.jpg" alt="Small Skincare Product 2" srcset="https://jabon.wpengine.com/wp-content/uploads/2024/08/Home-3-Filler-2-img-3.jpg 200w, https://jabon.wpengine.com/wp-content/uploads/2024/08/Home-3-Filler-2-img-3-150x150.jpg 150w" sizes="(max-width: 200px) 100vw, 200px">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="skn-heading-content">...</div>
    <div class="skn-button-section skn-animate" data-id="button">
        <div class="skn-widget-container">
            <div class="skn-button-holder skn-button-sweep" id="skn-button">
                <a class="skn-button" href="skincare.html">
                    <div class="skn-button-text"><span>Explore Now</span></div>
                </a>
            </div>
        </div>
    </div>
</div>

<div class="luxury-marquee">
    <div class="marquee-inner">
        <div class="marquee-item">
            <a href="#"><i class="icon-gift"></i> #20% Off On All Natural Soaps!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-shipping"></i> #Free International Shipping Over $80!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-friends"></i> #Refer A Friend For 20% Off!</a>
        </div>
        <!-- تكرار العناصر للحركة السلسة -->
        <div class="marquee-item">
            <a href="#"><i class="icon-gift"></i> #20% Off On All Natural Soaps!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-shipping"></i> #Free International Shipping Over $80!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-friends"></i> #Refer A Friend For 20% Off!</a>
        </div>
    </div>
</div>

<div class="faq-section">
    <!-- Added H1 Title -->
    <h1 class="faq-main-title">Frequently Asked Questions</h1>

    <div class="faq-container">
        <!-- Column 1 -->
        <div class="faq-column">
            <!-- Question 1 -->
            <div class="faq-item">
                <div class="faq-question">
                    <h3>What is the shelf life of your products?</h3>
                    <svg class="arrow-icon" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div class="faq-answer">
                    <p>All our products have a shelf life of 12-24 months from production date, with expiration dates clearly marked on each package.</p>
                </div>
                <div class="question-divider"></div>
            </div>

            <!-- Question 2 -->
            <div class="faq-item">
                <div class="faq-question">
                    <h3>Are your products suitable for all skin types?</h3>
                    <svg class="arrow-icon" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div class="faq-answer">
                    <p>Yes, our products are designed for all skin types including sensitive skin, but we always recommend doing a patch test first.</p>
                </div>
                <div class="question-divider"></div>
            </div>

            <!-- Question 3 -->
            <div class="faq-item">
                <div class="faq-question">
                    <h3>How do I choose the right product for my skin?</h3>
                    <svg class="arrow-icon" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div class="faq-answer">
                    <p>You can use our online skin quiz or consult with one of our skincare specialists for personalized recommendations.</p>
                </div>
                <div class="question-divider"></div>
            </div>

            <!-- Question 4 -->
            <div class="faq-item">
                <div class="faq-question">
                    <h3>Are your products cruelty-free?</h3>
                    <svg class="arrow-icon" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div class="faq-answer">
                    <p>Absolutely! We are proud to be 100% cruelty-free and never test on animals.</p>
                </div>
                <div class="question-divider"></div>
            </div>

            <!-- Question 5 -->
            <div class="faq-item">
                <div class="faq-question">
                    <h3>Where are your products manufactured?</h3>
                    <svg class="arrow-icon" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div class="faq-answer">
                    <p>All products are manufactured in our FDA-approved facility in California, USA.</p>
                </div>
                <div class="question-divider"></div>
            </div>
        </div>

        <!-- Column 2 -->
        <div class="faq-column">
            <!-- Question 6 -->
            <div class="faq-item">
                <div class="faq-question">
                    <h3>Do you offer international shipping?</h3>
                    <svg class="arrow-icon" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div class="faq-answer">
                    <p>Yes, we ship worldwide with various shipping options available at checkout.</p>
                </div>
                <div class="question-divider"></div>
            </div>

            <!-- Question 7 -->
            <div class="faq-item">
                <div class="faq-question">
                    <h3>What's your return policy?</h3>
                    <svg class="arrow-icon" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div class="faq-answer">
                    <p>We offer a 30-day money-back guarantee on all unopened products.</p>
                </div>
                <div class="question-divider"></div>
            </div>

            <!-- Question 8 -->
            <div class="faq-item">
                <div class="faq-question">
                    <h3>Can I use your products during pregnancy?</h3>
                    <svg class="arrow-icon" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div class="faq-answer">
                    <p>Most of our products are pregnancy-safe, but we recommend consulting with your doctor first.</p>
                </div>
                <div class="question-divider"></div>
            </div>

            <!-- Question 9 -->
            <div class="faq-item">
                <div class="faq-question">
                    <h3>How often should I use these products?</h3>
                    <svg class="arrow-icon" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div class="faq-answer">
                    <p>Usage varies by product - please refer to the instructions on each item or consult our skincare guides.</p>
                </div>
                <div class="question-divider"></div>
            </div>

            <!-- Question 10 -->
            <div class="faq-item">
                <div class="faq-question">
                    <h3>Are your products vegan?</h3>
                    <svg class="arrow-icon" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div class="faq-answer">
                    <p>About 85% of our product line is vegan, clearly marked with a vegan logo on product pages.</p>
                </div>
                <div class="question-divider"></div>
            </div>
        </div>
    </div>
</div>

<div class="luxury-marquee">
    <div class="marquee-inner">
        <div class="marquee-item">
            <a href="#"><i class="icon-gift"></i> #20% Off On All Natural Soaps!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-shipping"></i> #Free International Shipping Over $80!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-friends"></i> #Refer A Friend For 20% Off!</a>
        </div>
        <!-- تكرار العناصر للحركة السلسة -->
        <div class="marquee-item">
            <a href="#"><i class="icon-gift"></i> #20% Off On All Natural Soaps!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-shipping"></i> #Free International Shipping Over $80!</a>
        </div>
        <div class="marquee-item">
            <a href="#"><i class="icon-friends"></i> #Refer A Friend For 20% Off!</a>
        </div>
    </div>
</div>

<div class="e-con-inner">
    <!-- Comment Form -->
    <div class="comment-form-container">
        <h3>Leave a Comment</h3>
        <div>
            <label for="name">Your Name</label>
            <input type="text" id="name" placeholder="Enter your name" required>
            <label for="email">Your Email</label>
            <input type="email" id="email" placeholder="Enter your email" required>
            <label for="comment">Your Comment</label>
            <textarea id="comment" placeholder="Enter your comment" required></textarea>
            <label for="star-rating">Your Rating</label>
            <div class="star-rating" id="star-rating">
                <i class="far fa-star" data-value="1"></i>
                <i class="far fa-star" data-value="2"></i>
                <i class="far fa-star" data-value="3"></i>
                <i class="far fa-star" data-value="4"></i>
                <i class="far fa-star" data-value="5"></i>
            </div>
            <label for="profile-image">Your Profile Image</label>
            <input type="file" id="profile-image" accept="image/*">
            <div class="privacy-notice">
                By using this form, you agree with the storage and handling of your data by this website. For further details on handling user data, see our <a href="#">Privacy Policy</a>.
            </div>
            <button onclick="submitComment()">Leave a Comment | ضيف تعليق</button>
        </div>
    </div>
    <!-- Heading Section -->
    <div class="elementor-element elementor-widget wdt-advanced-heading wdt-inview-section wdt-item-is-inview">
        <div class="elementor-widget-container">
            <div class="wdt-heading-holder">
                <div class="wdt-subheading-content-wrapper">
            <span class="wdt-subheading">
              <div class="wdt-words__item">
                <div class="wdt-chars__item" style="transition-delay: 30ms;">P</div>
                <div class="wdt-chars__item" style="transition-delay: 60ms;">r</div>
                <div class="wdt-chars__item" style="transition-delay: 90ms;">e</div>
                <div class="wdt-chars__item" style="transition-delay: 120ms;">m</div>
                <div class="wdt-chars__item" style="transition-delay: 150ms;">i</div>
                <div class="wdt-chars__item" style="transition-delay: 180ms;">u</div>
                <div class="wdt-chars__item" style="transition-delay: 210ms;">m</div>
              </div>
              <div class="wdt-words__item">
                <div class="wdt-chars__item" style="transition-delay: 240ms;">C</div>
                <div class="wdt-chars__item" style="transition-delay: 270ms;">l</div>
                <div class="wdt-chars__item" style="transition-delay: 300ms;">i</div>
                <div class="wdt-chars__item" style="transition-delay: 330ms;">e</div>
                <div class="wdt-chars__item" style="transition-delay: 360ms;">n</div>
                <div class="wdt-chars__item" style="transition-delay: 390ms;">t</div>
                <div class="wdt-chars__item" style="transition-delay: 420ms;">s</div>
              </div>
            </span>
                </div>
                <div class="wdt-heading-title-wrapper">
                    <h1>
              <span class="wdt-heading-title">
                <div class="wdt-words__item">
                  <div class="wdt-chars__item" style="transition-delay: 30ms;">T</div>
                  <div class="wdt-chars__item" style="transition-delay: 60ms;">e</div>
                  <div class="wdt-chars__item" style="transition-delay: 90ms;">s</div>
                  <div class="wdt-chars__item" style="transition-delay: 120ms;">t</div>
                  <div class="wdt-chars__item" style="transition-delay: 150ms;">i</div>
                  <div class="wdt-chars__item" style="transition-delay: 180ms;">m</div>
                  <div class="wdt-chars__item" style="transition-delay: 210ms;">o</div>
                  <div class="wdt-chars__item" style="transition-delay: 240ms;">n</div>
                  <div class="wdt-chars__item" style="transition-delay: 270ms;">i</div>
                  <div class="wdt-chars__item" style="transition-delay: 300ms;">a</div>
                  <div class="wdt-chars__item" style="transition-delay: 330ms;">l</div>
                  <div class="wdt-chars__item" style="transition-delay: 360ms;">s</div>
                </div>
                <div class="wdt-words__item">
                  <div class="wdt-chars__item" style="transition-delay: 390ms;">&</div>
                </div>
                <div class="wdt-words__item">
                  <div class="wdt-chars__item" style="transition-delay: 420ms;">R</div>
                  <div class="wdt-chars__item" style="transition-delay: 450ms;">e</div>
                  <div class="wdt-chars__item" style="transition-delay: 480ms;">v</div>
                  <div class="wdt-chars__item" style="transition-delay: 510ms;">i</div>
                  <div class="wdt-chars__item" style="transition-delay: 540ms;">e</div>
                  <div class="wdt-chars__item" style="transition-delay: 570ms;">w</div>
                </div>
              </span>
                    </h1>
                </div>
            </div>
        </div>
    </div>
    <!-- Testimonial Carousel -->
    <div class="elementor-element wdt-testimonial-style-1 animated-fast elementor-widget animated fadeInUp">
        <div class="elementor-widget-container">
            <div class="wdt-testimonial-holder wdt-content-item-holder wdt-carousel-holder">
                <div class="wdt-testimonial-container swiper">
                    <div class="wdt-testimonial-wrapper swiper-wrapper">
                        <!-- Comments will be dynamically added here -->
                    </div>
                    <div class="wdt-carousel-pagination-wrapper">
                        <div class="wdt-swiper-pagination"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="instagram-slider">
    <h2 class="slider-title">
        Follow Us on Instagram <i class="fab fa-instagram"></i>
    </h2>
    <p class="slider-subtitle">Discover moments that inspire and connect us.</p>

    <div class="slider-container">
        <div class="slider-track">
            <div class="instagram-post">
                <img src="../image/shampooo.jpg" alt="Instagram Post 1" class="post-image">
                <div class="post-overlay">
                        <span class="post-icon">
                            <a href="https://www.instagram.com" target="_blank">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </span>
                </div>
            </div>
            <div class="instagram-post">
                <img src="../image/sgh.jpg" alt="Instagram Post 2" class="post-image">
                <div class="post-overlay">
                        <span class="post-icon">
                            <a href="https://www.instagram.com" target="_blank">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </span>
                </div>
            </div>
            <div class="instagram-post">
                <img src="../image/sh.jpg" alt="Instagram Post 3" class="post-image">
                <div class="post-overlay">
                        <span class="post-icon">
                            <a href="https://www.instagram.com" target="_blank">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </span>
                </div>
            </div>
            <div class="instagram-post">
                <img src="../image/shhah.jpg" alt="Instagram Post 4" class="post-image">
                <div class="post-overlay">
                        <span class="post-icon">
                            <a href="https://www.instagram.com" target="_blank">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </span>
                </div>
            </div>
            <div class="instagram-post">
                <img src="../image/shamj.jpg" alt="Instagram Post 5" class="post-image">
                <div class="post-overlay">
                        <span class="post-icon">
                            <a href="https://www.instagram.com" target="_blank">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </span>
                </div>
            </div>
            <div class="instagram-post">
                <img src="../image/shhh.jpg" alt="Instagram Post 6" class="post-image">
                <div class="post-overlay">
                        <span class="post-icon">
                            <a href="https://www.instagram.com" target="_blank">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </span>
                </div>
            </div>
            <div class="instagram-post">
                <img src="../image/ssssshhh.jpg" alt="Instagram Post 7" class="post-image">
                <div class="post-overlay">
                        <span class="post-icon">
                            <a href="https://www.instagram.com" target="_blank">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </span>
                </div>
            </div>
            <div class="instagram-post">
                <img src="../image/dssjh.jpg" alt="Instagram Post 8" class="post-image">
                <div class="post-overlay">
                        <span class="post-icon">
                            <a href="https://www.instagram.com" target="_blank">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </span>
                </div>
            </div>
        </div>
    </div>
</div>

<footer class="footer">
    <div class="footer-container">
        <div class="footer-grid">
            <!-- العمود الأيسر: Follow Us و Certifications -->
            <div class="left-column">
                <div class="footer-section">
                    <h3 class="footer-title">Follow Us</h3>
                    <div class="social-links">
                        <a href="https://www.facebook.com/nablussoapco/" target="_blank" class="social-icon">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.instagram.com/nablussoapco/" target="_blank" class="social-icon">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/nablus-soap-b0218929/" target="_blank" class="social-icon">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://goo.gl/X8ZmNR" target="_blank" class="social-icon">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
                <div class="footer-section">
                    <h3 class="footer-title">Our Certifications</h3>
                    <div class="certificates">
                        <div class="certificates">
                            <img src="https://nablussoap.ps/wp/wp-content/uploads/final-Halal-2012.jpg" alt="Halal Certified">
                            <img src="https://nablussoap.ps/wp/wp-content/uploads/psi.jpg" alt="PSI Certified">
                            <img src="https://nablussoap.ps/wp/wp-content/uploads/ecocert-logo.jpg" alt="Ecocert">
                            <img src="https://nablussoap.ps/wp/wp-content/uploads/logo-GMP-scaled.jpg" alt="GMP Certified">
                        </div>
                    </div>
                </div>
            </div>

            <div class="newsletter-section">
                <div class="newsletter-container">
                    <img src="../image/Iqon (1).png"></img>
                    <h3 class="newsletter-title">Be the first to know</h3>
                    <p class="newsletter-subtitle">Subscribe to our newsletter for updates and offers</p>
                    <form class="newsletter-form">
                        <input type="email" placeholder="Enter Your Email" required class="email-input">
                        <button type="submit" class="submit-arrow"></button>
                    </form>
                </div>
            </div>

            <!-- العمود الأيمن: Quick Links -->
            <div class="right-column">
                <div class="footer-section">
                    <h3 class="footer-title">Quick Links</h3>
                    <ul class="footer-links">

                        <li><a href="about_us.html">About Us</a></li>
                        <li><a href="contactus.html">Contact Us</a></li>
                        <li><a href="Shop.html">Our Products</a></li>
                        <li><a href="career.html">Career Opportunities</a></li>

                    </ul>
                </div>
            </div>
        </div>

        <!-- حقوق النشر -->
        <div class="copyright-section">
            <div class="copyright-content">
                <div class="company-info">
                    <span class="company-name">Nablus Soap & Cosmetics Company</span>
                    <span class="copyright-text">© 2024 All Rights Reserved</span>
                </div>
                <div class="developer-credit">
                    Crafted with <i class="fas fa-heart" style="color: #e74c3c;"></i> by
                    <a  target="_blank">Eng. Yaman & Eng.  Roaa </a>
                </div>
            </div>
        </div>
    </div>
</footer>


<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/splitting/dist/splitting.min.js"></script>


<!-- Swiper JS -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
<script src="../js_file/mainbage.js"></script>
<script src="../js_file/temp.js"></script>
<script src="../js_file/temp2.js"></script>
<script src="../js_file/insta.js"></script>
<script src="../js_file/contactus.js"></script>
<script>
    function closeResults() {
        document.querySelector('.results-container').classList.remove('show');
        document.querySelector('.overlay').classList.remove('show');
    }
</script>
</body>
</html>