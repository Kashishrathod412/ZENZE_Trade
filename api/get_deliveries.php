<?php
require_once 'db.php';

if (!$conn) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $conn->query("SELECT * FROM deliveries");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as &$row) {
        if (!empty($row['callRecordings'])) $row['callRecordings'] = json_decode($row['callRecordings'], true);
        $row['isRated'] = (bool)$row['isRated'];
    }
    echo json_encode($results);
} catch (Exception $e) {
    echo json_encode([]);
}
?>