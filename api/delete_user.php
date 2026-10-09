<?php
require_once 'db.php';
header("Content-Type: application/json");

// Handle CORS
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'rbac.php';
enforce_permission($conn, ['manage_users', 'register_users']);

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "User ID is required"]);
    exit();
}

$id = $data['id'];

// Check if user is trying to delete the master admin
if ($id === 'admin-1' || $id === '1' || $id == 1) {
    http_response_code(403);
    echo json_encode(["success" => false, "error" => "Cannot delete master admin node"]);
    exit();
}

try {
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "User not found"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to delete user: " . $e->getMessage()]);
}
?>
