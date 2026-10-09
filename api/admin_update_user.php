<?php
require_once 'db.php';
require_once 'rbac.php';

enforce_permission($conn, 'manage_users');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || empty($input['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid payload or missing user id"]);
    exit;
}

try {
    $id = $input['id'];
    $name = isset($input['name']) ? $input['name'] : null;
    $email = isset($input['email']) ? $input['email'] : null;
    $phone = isset($input['phone']) ? $input['phone'] : null;
    $role = isset($input['role']) ? $input['role'] : null;
    $verified = isset($input['verified']) ? ($input['verified'] ? 1 : 0) : 0;
    
    // We allow setting a subscription manually
    $subscription = isset($input['subscription']) ? json_encode($input['subscription']) : null;
    
    $stmt = $conn->prepare("
        UPDATE users 
        SET name = COALESCE(:name, name),
            email = COALESCE(:email, email),
            phone = COALESCE(:phone, phone),
            role = COALESCE(:role, role),
            verified = :verified,
            subscription = COALESCE(:subscription, subscription)
        WHERE id = :id
    ");

    $stmt->execute([
        'id' => $id,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'role' => $role,
        'verified' => $verified,
        'subscription' => $subscription
    ]);

    echo json_encode(["success" => true, "message" => "User updated successfully by admin"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
