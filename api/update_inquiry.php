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
    echo json_encode(["success" => true, "message" => "Updated locally"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? '';
$status = $input['status'] ?? 'new';

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing inquiry ID"]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE inquiries SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);

    echo json_encode(["success" => true, "message" => "Lead status updated successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>