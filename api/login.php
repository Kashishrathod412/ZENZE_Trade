<?php
require_once 'db.php';
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$stmt = $conn->prepare("SELECT * FROM users WHERE email = :email AND password = :password");
$stmt->execute(['email' => $email, 'password' => $password]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    if (isset($user['is_active']) && $user['is_active'] == 0) {
        echo json_encode(["success" => false, "error" => "Your account has been suspended."]);
        exit();
    }

    if ($user['socialLinks']) $user['socialLinks'] = json_decode($user['socialLinks'], true);
    if ($user['deliveryDetails']) $user['deliveryDetails'] = json_decode($user['deliveryDetails'], true);
    if ($user['deliveryPricing']) $user['deliveryPricing'] = json_decode($user['deliveryPricing'], true);
    if ($user['subscription']) $user['subscription'] = json_decode($user['subscription'], true);
    if ($user['permissions']) $user['permissions'] = json_decode($user['permissions'], true);
    if (isset($user['is_active'])) $user['is_active'] = (bool)$user['is_active'];
    echo json_encode(["success" => true, "user" => $user]);
} else {
    echo json_encode(["success" => false]);
}
?>