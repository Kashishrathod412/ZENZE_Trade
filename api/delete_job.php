<?php
require 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once 'rbac.php';
enforce_permission($conn, 'manage_hiring');


$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid JSON payload or missing id"]);
    exit();
}

try {
    $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = ?");
    $stmt->execute([$input['id']]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Job deleted successfully"]);
    } else {
        echo json_encode(["success" => true, "message" => "Job not found or already deleted"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>

