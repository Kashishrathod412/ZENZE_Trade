<?php
require_once 'db.php';
$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['id'], $data['verified'])) {
    $stmt = $conn->prepare("UPDATE products SET verified = :verified WHERE id = :id");
    $stmt->execute(['verified' => $data['verified'] ? 1 : 0, 'id' => $data['id']]);
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
?>