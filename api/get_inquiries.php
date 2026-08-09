<?php
require_once 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!$pdo) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->query("SELECT * FROM inquiries ORDER BY created_at DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $inquiries = [];
    foreach ($rows as $r) {
        $inquiries[] = [
            'id' => (string)$r['id'],
            'buyerName' => (string)$r['buyer_name'],
            'buyerPhone' => (string)$r['buyer_phone'],
            'buyerEmail' => (string)($r['buyer_email'] ?? ''),
            'buyerId' => (string)($r['buyer_id'] ?? ''),
            'productName' => (string)($r['product_name'] ?? 'General Procurement Lead'),
            'productId' => (string)($r['product_id'] ?? ''),
            'description' => (string)($r['description'] ?? ''),
            'quantity' => (string)($r['quantity'] ?? '1 Unit'),
            'sellerId' => (string)($r['seller_id'] ?? ''),
            'sellerName' => (string)($r['seller_name'] ?? ''),
            'status' => (string)($r['status'] ?? 'new'),
            'createdAt' => (string)$r['created_at']
        ];
    }

    echo json_encode($inquiries);
} catch (PDOException $e) {
    echo json_encode([]);
}
?>
