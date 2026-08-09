<?php
require_once 'db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || empty($input['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid payload or missing user id"]);
    exit();
}

try {
    $id = $input['id'];
    $country = isset($input['country']) ? $input['country'] : null;
    $location = isset($input['location']) ? $input['location'] : null;
    $website = isset($input['website']) ? $input['website'] : null;
    $subscription = isset($input['subscription']) ? json_encode($input['subscription']) : null;
    $socialLinks = isset($input['socialLinks']) ? json_encode($input['socialLinks']) : null;
    $deliveryDetails = isset($input['deliveryDetails']) ? json_encode($input['deliveryDetails']) : null;
    $deliveryPricing = isset($input['deliveryPricing']) ? json_encode($input['deliveryPricing']) : null;
    $verified = isset($input['verified']) ? ($input['verified'] ? 1 : 0) : 0;
    
    // We update fields that might be changed by the user dashboard
    $stmt = $conn->prepare("
        UPDATE users 
        SET country = :country,
            location = :location,
            website = :website,
            subscription = :subscription,
            socialLinks = :socialLinks,
            deliveryDetails = :deliveryDetails,
            deliveryPricing = :deliveryPricing,
            verified = :verified
        WHERE id = :id
    ");

    $stmt->execute([
        'id' => $id,
        'country' => $country,
        'location' => $location,
        'website' => $website,
        'subscription' => $subscription,
        'socialLinks' => $socialLinks,
        'deliveryDetails' => $deliveryDetails,
        'deliveryPricing' => $deliveryPricing,
        'verified' => $verified
    ]);

    echo json_encode(["success" => true, "message" => "User profile updated successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
