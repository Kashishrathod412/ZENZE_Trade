<?php
require_once 'config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

if (!$pdo) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database not connected."]);
    exit;
}

try {
    $stmt = $pdo->query("SELECT * FROM compliance_records ORDER BY created_at DESC");
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $records]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>
