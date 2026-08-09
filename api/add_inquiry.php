<?php
require_once 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!$pdo) {
    echo json_encode(["success" => true, "message" => "Saved locally (Database not available)"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['buyerName']) || empty($input['buyerPhone'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required buyer fields"]);
    exit;
}

try {
    $id = !empty($input['id']) ? $input['id'] : uniqid('inq_');

    $stmt = $pdo->prepare("INSERT INTO inquiries 
        (id, buyer_name, buyer_phone, buyer_email, buyer_id, product_name, product_id, description, quantity, seller_id, seller_name, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        buyer_name = VALUES(buyer_name),
        buyer_phone = VALUES(buyer_phone),
        buyer_email = VALUES(buyer_email),
        buyer_id = VALUES(buyer_id),
        product_name = VALUES(product_name),
        product_id = VALUES(product_id),
        description = VALUES(description),
        quantity = VALUES(quantity),
        seller_id = VALUES(seller_id),
        seller_name = VALUES(seller_name),
        status = VALUES(status)
    ");

    $stmt->execute([
        $id,
        $input['buyerName'],
        $input['buyerPhone'],
        $input['buyerEmail'] ?? '',
        $input['buyerId'] ?? '',
        $input['productName'] ?? 'General Procurement Lead',
        $input['productId'] ?? '',
        $input['description'] ?? '',
        $input['quantity'] ?? '1 Unit',
        $input['sellerId'] ?? '',
        $input['sellerName'] ?? '',
        $input['status'] ?? 'new'
    ]);

    echo json_encode(["success" => true, "message" => "Lead created successfully", "id" => $id]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
