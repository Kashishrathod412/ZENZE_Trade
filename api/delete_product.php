<?php
require_once 'db.php';
$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['id'])) {
    $stmt = $conn->prepare("DELETE FROM products WHERE id = :id");
    $stmt->execute(['id' => $data['id']]);
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
?>