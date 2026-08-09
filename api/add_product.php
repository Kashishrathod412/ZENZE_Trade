<?php
require_once 'db.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['name']) || empty($data['category']) || empty($data['sellerId'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "name, category and sellerId are required."]);
    exit();
}

$id          = $data['id'] ?? ('p-' . uniqid());
$name        = $data['name'];
$category    = $data['category'];
$priceNum    = $data['priceNum'] ?? 0;
$price       = $data['price'] ?? '';
$moq         = $data['moq'] ?? '';
$description = $data['description'] ?? '';
$image       = $data['image'] ?? '📦';
$sellerId    = $data['sellerId'];
$sellerName  = $data['sellerName'] ?? '';
$sellerType  = $data['sellerType'] ?? 'manufacturer';
$location    = $data['location'] ?? 'India';
$verified    = $data['verified'] ? 1 : 0;
$status      = $data['status'] ?? 'active';
$createdAt   = date('Y-m-d H:i:s');

// JSON columns
$images      = isset($data['images'])     ? json_encode($data['images'])     : null;
$offers      = isset($data['offers'])     ? json_encode($data['offers'])     : null;
$highlights  = isset($data['highlights']) ? json_encode($data['highlights']) : null;
$shipping    = $data['shipping']  ?? null;
$warranty    = $data['warranty']  ?? null;
$security    = $data['security']  ?? null;

try {
    $stmt = $conn->prepare("
        INSERT INTO products
            (id, name, category, priceNum, price, moq, description, image, sellerId, sellerName, sellerType, location, verified, views, status, createdAt)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
        ON DUPLICATE KEY UPDATE
            name=VALUES(name), category=VALUES(category), priceNum=VALUES(priceNum),
            price=VALUES(price), moq=VALUES(moq), description=VALUES(description),
            image=VALUES(image), status=VALUES(status)
    ");
    $stmt->execute([$id, $name, $category, $priceNum, $price, $moq, $description, $image, $sellerId, $sellerName, $sellerType, $location, $verified, $status, $createdAt]);

    echo json_encode([
        "success" => true,
        "message" => "Product saved to database.",
        "id"      => $id
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
