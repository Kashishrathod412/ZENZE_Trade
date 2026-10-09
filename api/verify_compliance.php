<?php
require_once 'config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

if (!$pdo) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database not connected."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$userId = $input['userId'] ?? '';

if (empty($userId)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing user ID"]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE compliance_records SET status = 'verified' WHERE user_id = ?");
    $stmt->execute([$userId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "User compliance verified successfully."]);
    } else {
        echo json_encode(["success" => false, "error" => "User not found or already verified."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>

