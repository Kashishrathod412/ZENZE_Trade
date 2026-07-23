<?php
require 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $stmt = $pdo->query("SELECT * FROM jobs ORDER BY created_at DESC");
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Parse JSON requirements string back to an array
    foreach ($jobs as &$job) {
        if (!empty($job['requirements'])) {
            $parsed = json_decode($job['requirements'], true);
            $job['requirements'] = is_array($parsed) ? $parsed : [];
        } else {
            $job['requirements'] = [];
        }
        
        // ensure id is returned (could be auto-increment INT, format as string for frontend)
        $job['id'] = (string)$job['id'];
    }

    echo json_encode(["success" => true, "data" => $jobs]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
