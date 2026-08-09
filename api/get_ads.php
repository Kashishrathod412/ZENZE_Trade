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
    $stmt = $pdo->query("SELECT * FROM ads ORDER BY created_at DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $ads = [];
    foreach ($rows as $r) {
        $ads[] = [
            'id' => (string)$r['id'],
            'sellerId' => (string)$r['seller_id'],
            'productId' => (string)($r['product_id'] ?? ''),
            'productName' => (string)($r['product_name'] ?? ''),
            'type' => (string)($r['type'] ?? 'package'),
            'packageName' => (string)($r['package_name'] ?? ''),
            'dailyBudget' => (float)($r['daily_budget'] ?? 0),
            'duration' => (int)($r['duration'] ?? 7),
            'totalCost' => (float)($r['total_cost'] ?? 0),
            'status' => (string)($r['status'] ?? 'active'),
            'headline' => (string)($r['headline'] ?? ''),
            'message' => (string)($r['message'] ?? ''),
            'videoUrl' => (string)($r['video_url'] ?? ''),
            'reach' => (int)($r['reach'] ?? 0),
            'clicks' => (int)($r['clicks'] ?? 0),
            'verificationStatus' => (string)($r['verification_status'] ?? 'pending'),
            'createdAt' => (string)$r['created_at']
        ];
    }

    echo json_encode($ads);
} catch (PDOException $e) {
    echo json_encode([]);
}
?>
