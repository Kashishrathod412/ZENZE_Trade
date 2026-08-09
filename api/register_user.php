<?php
require_once 'db.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (empty($data['name']) || empty($data['email']) || empty($data['password']) || empty($data['role'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Name, email, password and role are required."]);
    exit();
}

$name       = trim($data['name']);
$email      = strtolower(trim($data['email']));
$password   = $data['password'];
$role       = $data['role'];
$phone      = $data['phone'] ?? null;
$country    = $data['country'] ?? null;
$sellerType = $data['sellerType'] ?? null;
$category   = $data['category'] ?? null;
$socialLinks = isset($data['socialLinks']) ? json_encode($data['socialLinks']) : null;

// Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->execute([$email]);
if ($check->fetch()) {
    echo json_encode(["success" => false, "error" => "Email already registered."]);
    exit();
}

// Generate unique ID
$id = 'user-' . uniqid();
$createdAt = date('Y-m-d H:i:s');

try {
    $stmt = $conn->prepare("
        INSERT INTO users (id, name, email, password, role, phone, country, sellerType, category, socialLinks, createdAt, verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    ");
    $stmt->execute([$id, $name, $email, $password, $role, $phone, $country, $sellerType, $category, $socialLinks, $createdAt]);

    echo json_encode([
        "success" => true,
        "user" => [
            "id"         => $id,
            "name"       => $name,
            "email"      => $email,
            "password"   => $password,
            "role"       => $role,
            "phone"      => $phone,
            "country"    => $country,
            "sellerType" => $sellerType,
            "category"   => $category,
            "verified"   => false,
            "createdAt"  => $createdAt,
            "socialLinks" => $data['socialLinks'] ?? null,
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Registration failed: " . $e->getMessage()]);
}
?>
