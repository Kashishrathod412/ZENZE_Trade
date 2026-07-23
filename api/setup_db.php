<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$db_host = "127.0.0.1";
$db_user = "root";
$db_pass = "";
$db_name = "zenze_trade";

try {
    // Connect to MySQL server without DB
    $pdo = new PDO("mysql:host=$db_host;port=3307;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name`");
    $pdo->exec("USE `$db_name`");

    // Create compliance_records table
    $sql = "CREATE TABLE IF NOT EXISTS compliance_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        gst_document_path VARCHAR(500) NOT NULL,
        pan_document_path VARCHAR(500) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sql);

    // Ensure uploads directory exists
    $upload_dir = __DIR__ . '/uploads';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    echo json_encode(["success" => true, "message" => "Database and tables created successfully."]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
