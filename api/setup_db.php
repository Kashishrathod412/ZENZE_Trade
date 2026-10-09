<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$db_host = "127.0.0.1";
$db_user = "root";
$db_pass = "";
$db_name = "zenze_trade";

$passwords = ["", "root", "admin", "password"];
$ports = [3307, 3306];

$pdo = null;
foreach ($ports as $port) {
    foreach ($passwords as $pwd) {
        try {
            $pdo = new PDO("mysql:host={$db_host};port={$port};charset=utf8mb4", $db_user, $pwd);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            break 2;
        } catch (PDOException $e) {
            $pdo = null;
        }
    }
}

if (!$pdo) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "MySQL Connection failed on all attempted ports and credentials."]);
    exit;
}

try {
    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name`");
    $pdo->exec("USE `$db_name`");

    // 1. Users Table
    $sqlUsers = "CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        sellerType VARCHAR(50) DEFAULT NULL,
        location VARCHAR(255) DEFAULT NULL,
        country VARCHAR(255) DEFAULT NULL,
        category VARCHAR(255) DEFAULT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        website VARCHAR(255) DEFAULT NULL,
        verified TINYINT(1) DEFAULT 0,
        socialLinks JSON DEFAULT NULL,
        deliveryDetails JSON DEFAULT NULL,
        deliveryPricing JSON DEFAULT NULL,
        subscription JSON DEFAULT NULL,
        is_active TINYINT(1) DEFAULT 1,
        permissions JSON DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlUsers);

    // Add columns if they don't exist (for existing databases)
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN is_active TINYINT(1) DEFAULT 1");
    } catch (PDOException $e) {}
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN permissions JSON DEFAULT NULL");
    } catch (PDOException $e) {}

    // 2. Products Table
    $sqlProducts = "CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        priceNum DECIMAL(10,2) DEFAULT 0,
        price VARCHAR(100) DEFAULT '',
        moq VARCHAR(100) DEFAULT '',
        description TEXT,
        image VARCHAR(255) DEFAULT '📦',
        images JSON DEFAULT NULL,
        specifications JSON DEFAULT NULL,
        sellerId VARCHAR(255) NOT NULL,
        sellerName VARCHAR(255) DEFAULT '',
        sellerType VARCHAR(50) DEFAULT 'manufacturer',
        location VARCHAR(255) DEFAULT 'India',
        verified TINYINT(1) DEFAULT 0,
        views INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlProducts);

    // 3. Deliveries Table
    $sqlDeliveries = "CREATE TABLE IF NOT EXISTS deliveries (
        id VARCHAR(255) PRIMARY KEY,
        orderId VARCHAR(255),
        customerName VARCHAR(255),
        customerPhone VARCHAR(50),
        pickupLocation VARCHAR(255),
        dropLocation VARCHAR(255),
        status VARCHAR(50) DEFAULT 'assigned',
        driverName VARCHAR(255),
        driverPhone VARCHAR(50),
        callRecordings JSON DEFAULT NULL,
        isRated TINYINT(1) DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlDeliveries);

    // 4. Jobs Table
    $sqlJobs = "CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'Full-time',
        salary VARCHAR(100),
        description TEXT,
        requirements TEXT,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlJobs);

    // 5. Ads Table
    $sqlAds = "CREATE TABLE IF NOT EXISTS ads (
        id VARCHAR(255) PRIMARY KEY,
        seller_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255),
        product_name VARCHAR(255),
        type VARCHAR(50) DEFAULT 'package',
        package_name VARCHAR(255),
        daily_budget DECIMAL(10,2) DEFAULT 0,
        duration INT DEFAULT 7,
        total_cost DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        headline VARCHAR(255),
        message TEXT,
        video_url VARCHAR(500),
        reach INT DEFAULT 0,
        clicks INT DEFAULT 0,
        verification_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlAds);

    // 6. Inquiries Table
    $sqlInquiries = "CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(255) PRIMARY KEY,
        buyer_name VARCHAR(255) NOT NULL,
        buyer_phone VARCHAR(255) NOT NULL,
        buyer_email VARCHAR(255),
        buyer_id VARCHAR(255),
        product_name VARCHAR(255),
        product_id VARCHAR(255),
        description TEXT,
        quantity VARCHAR(100),
        seller_id VARCHAR(255),
        seller_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlInquiries);

    // 7. Compliance Records Table
    $sqlCompliance = "CREATE TABLE IF NOT EXISTS compliance_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        gst_document_path VARCHAR(500) NOT NULL,
        pan_document_path VARCHAR(500) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlCompliance);

    // 8. Payments Table
    $sqlPayments = "CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        payment_id VARCHAR(255) NOT NULL,
        order_id VARCHAR(255) DEFAULT NULL,
        user_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) DEFAULT '',
        user_email VARCHAR(255) DEFAULT '',
        plan_id VARCHAR(100) NOT NULL,
        plan_name VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL DEFAULT 0,
        currency VARCHAR(20) DEFAULT 'INR',
        payment_method VARCHAR(100) DEFAULT 'UPI',
        billing_cycle VARCHAR(50) DEFAULT 'yearly',
        status VARCHAR(50) DEFAULT 'success',
        subscription_data JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlPayments);

    // 9. Plan Offers Table
    $sqlPlanOffers = "CREATE TABLE IF NOT EXISTS plan_offers (
        plan_name VARCHAR(50) PRIMARY KEY,
        offer_price INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 0
    )";
    $pdo->exec($sqlPlanOffers);

    // Ensure uploads directory exists
    $upload_dir = __DIR__ . '/uploads';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    echo json_encode(["success" => true, "message" => "Database and all 9 tables created successfully."]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
