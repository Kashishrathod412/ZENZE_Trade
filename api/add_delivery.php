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

if (empty($data['orderId']) || empty($data['customerName'])) {
    echo json_encode(["success" => false, "message" => "Missing required order data"]);
    exit;
}

$id = !empty($data['id']) ? $data['id'] : uniqid('del_');
$orderId = $data['orderId'];
$customerName = $data['customerName'];
$customerPhone = !empty($data['customerPhone']) ? $data['customerPhone'] : (!empty($data['receiverPhone']) ? $data['receiverPhone'] : '');
$pickupLocation = !empty($data['pickupLocation']) ? $data['pickupLocation'] : (!empty($data['pickupAddress']) ? $data['pickupAddress'] : '');
$dropLocation = !empty($data['dropLocation']) ? $data['dropLocation'] : (!empty($data['deliveryAddress']) ? $data['deliveryAddress'] : '');
$status = !empty($data['status']) ? $data['status'] : 'pending';
$driverName = !empty($data['driverName']) ? $data['driverName'] : (!empty($data['partnerName']) ? $data['partnerName'] : '');
$driverPhone = !empty($data['driverPhone']) ? $data['driverPhone'] : (!empty($data['partnerPhone']) ? $data['partnerPhone'] : '');
$callRecordings = !empty($data['callRecordings']) ? json_encode($data['callRecordings']) : null;
$isRated = !empty($data['isRated']) ? 1 : 0;

try {
    $stmt = $conn->prepare("INSERT INTO deliveries (id, orderId, customerName, customerPhone, pickupLocation, dropLocation, status, driverName, driverPhone, callRecordings, isRated, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$id, $orderId, $customerName, $customerPhone, $pickupLocation, $dropLocation, $status, $driverName, $driverPhone, $callRecordings, $isRated]);
    
    echo json_encode([
        "success" => true,
        "message" => "Delivery created successfully",
        "delivery" => [
            "id" => $id,
            "orderId" => $orderId,
            "customerName" => $customerName,
            "customerPhone" => $customerPhone,
            "pickupAddress" => $pickupLocation,
            "deliveryAddress" => $dropLocation,
            "status" => $status,
            "partnerName" => $driverName,
            "partnerPhone" => $driverPhone
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
