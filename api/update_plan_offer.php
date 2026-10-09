<?php
require_once 'db.php';
require_once 'rbac.php';
enforce_permission($conn, 'manage_subscriptions');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['plan_name'])) {
    echo json_encode(['success' => false, 'error' => 'Missing plan_name']);
    exit;
}

try {
    $updates = [];
    $params = [];
    
    if (isset($data['is_active'])) {
        $updates[] = "is_active = ?";
        $params[] = (int)$data['is_active'];
    }
    if (isset($data['is_monthly_active'])) {
        $updates[] = "is_monthly_active = ?";
        $params[] = (int)$data['is_monthly_active'];
    }
    if (isset($data['offer_price'])) {
        $updates[] = "offer_price = ?";
        $params[] = (int)$data['offer_price'];
    }
    if (isset($data['monthly_offer_price'])) {
        $updates[] = "monthly_offer_price = ?";
        $params[] = (int)$data['monthly_offer_price'];
    }
    if (isset($data['original_yearly_price'])) {
        $updates[] = "original_yearly_price = ?";
        $params[] = (int)$data['original_yearly_price'];
    }
    if (isset($data['original_monthly_price'])) {
        $updates[] = "original_monthly_price = ?";
        $params[] = (int)$data['original_monthly_price'];
    }
    
    if (count($updates) > 0) {
        $params[] = $data['plan_name'];
        $sql = "UPDATE plan_offers SET " . implode(', ', $updates) . " WHERE plan_name = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
    }
    
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>

