<?php
require_once 'db.php';
$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['id'], $data['verificationStatus'])) {
    $stmt = $conn->prepare("SELECT deliveryDetails FROM users WHERE id = :id");
    $stmt->execute(['id' => $data['id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user && $user['deliveryDetails']) {
        $details = json_decode($user['deliveryDetails'], true);
        $details['verificationStatus'] = $data['verificationStatus'];
        $updateStmt = $conn->prepare("UPDATE users SET deliveryDetails = :details WHERE id = :id");
        $updateStmt->execute(['details' => json_encode($details), 'id' => $data['id']]);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Not found"]);
    }
} else {
    echo json_encode(["success" => false]);
}
?>