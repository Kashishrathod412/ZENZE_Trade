<?php
// config.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_host = "127.0.0.1";
$db_user = "root";
$db_pass = "";
$db_name = "zenze_trade";

try {
    $pdo = new PDO("mysql:host=$db_host;port=3307;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // If DB doesn't exist, we'll handle it in setup_db.php
    $pdo = null;
}
?>
