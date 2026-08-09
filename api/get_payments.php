<?php
header("Content-Type: application/json");
require_once __DIR__ . '/config.php';

$userId = isset($_GET['user_id']) ? trim($_GET['user_id']) : '';

if (!$pdo) {
    echo json_encode([
        "success" => true,
        "data" => []
    ]);
    exit;
}

try {
    // Ensure table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS payments (
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
    )");

    if (!empty($userId)) {
        $stmt = $pdo->prepare("SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
    } else {
        $stmt = $pdo->query("SELECT * FROM payments ORDER BY created_at DESC LIMIT 100");
    }

    $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $payments
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
