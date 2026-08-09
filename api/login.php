<?php
require_once 'db.php';
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$stmt = $conn->prepare("SELECT * FROM users WHERE email = :email AND password = :password");
$stmt->execute(['email' => $email, 'password' => $password]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    if ($user['socialLinks']) $user['socialLinks'] = json_decode($user['socialLinks'], true);
    if ($user['deliveryDetails']) $user['deliveryDetails'] = json_decode($user['deliveryDetails'], true);
    if ($user['deliveryPricing']) $user['deliveryPricing'] = json_decode($user['deliveryPricing'], true);
    if ($user['subscription']) $user['subscription'] = json_decode($user['subscription'], true);
    echo json_encode(["success" => true, "user" => $user]);
} else {
    echo json_encode(["success" => false]);
}
?>