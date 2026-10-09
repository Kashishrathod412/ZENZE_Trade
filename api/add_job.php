<?php
require 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once 'rbac.php';
enforce_permission($conn, 'manage_hiring');


$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid JSON payload"]);
    exit();
}

try {
    $id = isset($input['id']) ? $input['id'] : uniqid();
    $title = $input['title'] ?? '';
    $department = $input['department'] ?? '';
    $location = $input['location'] ?? '';
    $type = $input['type'] ?? '';
    $salary = $input['salary'] ?? '';
    $description = $input['description'] ?? '';
    $requirements = isset($input['requirements']) ? json_encode($input['requirements']) : '[]';
    $status = $input['status'] ?? 'open';

    $stmt = $pdo->prepare("INSERT INTO jobs (id, title, department, location, type, salary, description, requirements, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id, $title, $department, $location, $type, $salary, $description, $requirements, $status]);

    echo json_encode([
        "success" => true,
        "job" => [
            "id" => $id,
            "title" => $title,
            "department" => $department,
            "location" => $location,
            "type" => $type,
            "salary" => $salary,
            "description" => $description,
            "requirements" => isset($input['requirements']) ? $input['requirements'] : [],
            "status" => $status
        ]
    ]);
} catch (PDOException $e) {
    // If id column is integer auto_increment, the insert with a string id will fail. Let's fallback.
    if ($e->getCode() == 'HY000' || $e->getCode() == '22007') {
        try {
            $stmt = $pdo->prepare("INSERT INTO jobs (title, department, location, type, salary, description, requirements, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $department, $location, $type, $salary, $description, $requirements, $status]);
            $newId = $pdo->lastInsertId();
            
            echo json_encode([
                "success" => true,
                "job" => [
                    "id" => (string)$newId,
                    "title" => $title,
                    "department" => $department,
                    "location" => $location,
                    "type" => $type,
                    "salary" => $salary,
                    "description" => $description,
                    "requirements" => isset($input['requirements']) ? $input['requirements'] : [],
                    "status" => $status
                ]
            ]);
            exit();
        } catch (PDOException $e2) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e2->getMessage()]);
            exit();
        }
    }

    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>

