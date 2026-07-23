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
    echo json_encode(["success" => false, "error" => "Database not connected. Did you run setup_db.php?"]);
    exit;
}

$userId = $_POST['userId'] ?? '';
$userName = $_POST['userName'] ?? '';

if (empty($userId) || empty($userName)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing user info"]);
    exit;
}

if (!isset($_FILES['gst']) || !isset($_FILES['pan'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Both GST and PAN documents are required"]);
    exit;
}

$uploadDir = __DIR__ . '/uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Helper to safely move file
function saveFile($file, $prefix) {
    global $uploadDir;
    $filename = $prefix . '_' . time() . '_' . basename($file['name']);
    $targetPath = $uploadDir . $filename;
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return 'api/uploads/' . $filename; // return relative path
    }
    return false;
}

$gstPath = saveFile($_FILES['gst'], 'gst');
$panPath = saveFile($_FILES['pan'], 'pan');

if (!$gstPath || !$panPath) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to save uploaded files"]);
    exit;
}

try {
    // Check if a record already exists for this user, if so delete or update it
    $stmt = $pdo->prepare("DELETE FROM compliance_records WHERE user_id = ?");
    $stmt->execute([$userId]);

    $stmt = $pdo->prepare("INSERT INTO compliance_records (user_id, user_name, gst_document_path, pan_document_path, status) VALUES (?, ?, ?, ?, 'pending')");
    $stmt->execute([$userId, $userName, $gstPath, $panPath]);

    echo json_encode([
        "success" => true, 
        "message" => "Compliance documents uploaded successfully.",
        "record_id" => $pdo->lastInsertId(),
        "paths" => [
            "gst" => $gstPath,
            "pan" => $panPath
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>
