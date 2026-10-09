<?php
require_once 'db.php';

function enforce_permission($conn, $required_permissions) {
    if (!is_array($required_permissions)) {
        $required_permissions = [$required_permissions];
    }

    $admin_id = $_SERVER['HTTP_X_ADMIN_ID'] ?? '';
    
    // If no admin_id is provided, reject
    if (empty($admin_id)) {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "Unauthorized: Missing X-Admin-Id header"]);
        exit();
    }
    
    $stmt = $conn->prepare("SELECT role, permissions FROM users WHERE id = ?");
    $stmt->execute([$admin_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || ($user['role'] !== 'admin' && $user['role'] !== 'team_member')) {
        http_response_code(403);
        echo json_encode(["success" => false, "error" => "Forbidden: Invalid Admin Session"]);
        exit();
    }
    
    if ($user['role'] === 'admin') {
        return true; // Master Admin allows everything
    }
    
    if (in_array('master_admin_only', $required_permissions)) {
        http_response_code(403);
        echo json_encode(["success" => false, "error" => "Forbidden: Requires Master Admin privileges"]);
        exit();
    }
    
    $permissions = json_decode($user['permissions'], true) ?? [];
    if (!is_array($permissions)) {
        $permissions = [];
    }
    
    $has_permission = false;
    foreach ($required_permissions as $perm) {
        if (in_array($perm, $permissions)) {
            $has_permission = true;
            break;
        }
    }
    
    if (!$has_permission) {
        http_response_code(403);
        echo json_encode(["success" => false, "error" => "Forbidden: You do not have the required permissions"]);
        exit();
    }
    
    return true;
}
?>
