<?php
require 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!$pdo) {
    echo json_encode([]);
    exit;
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
        
        // ensure id is returned formatted as string for frontend
        $job['id'] = (string)$job['id'];
    }

    echo json_encode($jobs);
} catch (PDOException $e) {
    echo json_encode([]);
}
?>
