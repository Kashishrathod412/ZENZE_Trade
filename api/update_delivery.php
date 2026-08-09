<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'db.php';

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    $data = $_POST;
}

if (empty($data['id'])) {
    echo json_encode(["success" => false, "message" => "Delivery ID is required"]);
    exit;
}

$id = $data['id'];
$status = isset($data['status']) ? $data['status'] : null;
$driverName = isset($data['partnerName']) ? $data['partnerName'] : (isset($data['driverName']) ? $data['driverName'] : null);
$driverPhone = isset($data['partnerPhone']) ? $data['partnerPhone'] : (isset($data['driverPhone']) ? $data['driverPhone'] : null);
$isRated = isset($data['isRated']) ? ($data['isRated'] ? 1 : 0) : null;

try {
    $updates = [];
    $params = [];

    if ($status !== null) {
        $updates[] = "status = ?";
        $params[] = $status;
    }
    if ($driverName !== null) {
        $updates[] = "driverName = ?";
        $params[] = $driverName;
    }
    if ($driverPhone !== null) {
        $updates[] = "driverPhone = ?";
        $params[] = $driverPhone;
    }
    if ($isRated !== null) {
        $updates[] = "isRated = ?";
        $params[] = $isRated;
    }

    if (empty($updates)) {
        echo json_encode(["success" => true, "message" => "No changes supplied"]);
        exit;
    }

    $params[] = $id;
    $sql = "UPDATE deliveries SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    echo json_encode(["success" => true, "message" => "Delivery updated successfully"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
