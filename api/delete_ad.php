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
    echo json_encode(["success" => true, "message" => "Deleted locally"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? '';

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing ad ID"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM ads WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["success" => true, "message" => "Ad campaign deleted successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
