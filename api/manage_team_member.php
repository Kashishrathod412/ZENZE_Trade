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
require_once 'rbac.php';
enforce_permission($conn, 'master_admin_only');


$input = json_decode(file_get_contents("php://input"), true);

if (!$input || empty($input['action'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid payload"]);
    exit();
}

try {
    $action = $input['action'];

    if ($action === 'create') {
        if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Name, email, and password are required."]);
            exit();
        }

        $id = 'team-' . uniqid();
        $name = trim($input['name']);
        $email = strtolower(trim($input['email']));
        $password = $input['password'];
        $role = "team_member";
        $permissions = isset($input['permissions']) ? json_encode($input['permissions']) : json_encode([]);
        $is_active = 1;
        $createdAt = date('Y-m-d H:i:s');

        // Check email
        $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$email]);
        if ($check->fetch()) {
            echo json_encode(["success" => false, "error" => "Email already exists."]);
            exit();
        }

        $stmt = $conn->prepare("
            INSERT INTO users (id, name, email, password, role, permissions, is_active, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$id, $name, $email, $password, $role, $permissions, $is_active, $createdAt]);

        echo json_encode(["success" => true, "message" => "Team member created", "id" => $id]);
    } 
    elseif ($action === 'update') {
        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "ID is required for update."]);
            exit();
        }

        $id = $input['id'];
        $updates = [];
        $params = ['id' => $id];

        if (isset($input['name'])) {
            $updates[] = "name = :name";
            $params['name'] = trim($input['name']);
        }
        if (isset($input['email'])) {
            // Check email uniqueness if changing
            $email = strtolower(trim($input['email']));
            $check = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $check->execute([$email, $id]);
            if ($check->fetch()) {
                echo json_encode(["success" => false, "error" => "Email already exists."]);
                exit();
            }
            $updates[] = "email = :email";
            $params['email'] = $email;
        }
        if (!empty($input['password'])) {
            $updates[] = "password = :password";
            $params['password'] = $input['password'];
        }
        if (isset($input['permissions'])) {
            $updates[] = "permissions = :permissions";
            $params['permissions'] = json_encode($input['permissions']);
        }
        if (isset($input['is_active'])) {
            $updates[] = "is_active = :is_active";
            $params['is_active'] = $input['is_active'] ? 1 : 0;
        }

        if (count($updates) > 0) {
            $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = :id AND role = 'team_member'";
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
        }

        echo json_encode(["success" => true, "message" => "Team member updated"]);
    }
    elseif ($action === 'delete') {
        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "ID is required for deletion."]);
            exit();
        }
        $id = $input['id'];
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ? AND role = 'team_member'");
        $stmt->execute([$id]);

        echo json_encode(["success" => true, "message" => "Team member deleted"]);
    }
    else {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Invalid action"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>

