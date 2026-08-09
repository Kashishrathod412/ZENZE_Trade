<?php
// Handle CORS
if (isset($_SERVER['REQUEST_METHOD'])) {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Database Connection Helper
$db_host = "127.0.0.1";
$db_name = "zenze_trade";
$db_user = "root";
$passwords = ["", "root", "admin", "password"];
$ports = [3307, 3306];

$conn = null;
foreach ($ports as $port) {
    foreach ($passwords as $pwd) {
        try {
            $conn = new PDO("mysql:host={$db_host};port={$port};dbname={$db_name};charset=utf8mb4", $db_user, $pwd);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            break 2; // Connected successfully
        } catch (PDOException $e) {
            $conn = null;
        }
    }
}
$pdo = $conn;
?>
