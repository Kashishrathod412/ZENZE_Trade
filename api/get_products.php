<?php
require_once 'db.php';

if (!$conn) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $conn->query("SELECT * FROM products");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as &$row) {
        if (!empty($row['specifications'])) $row['specifications'] = json_decode($row['specifications'], true);
        if (!empty($row['images'])) $row['images'] = json_decode($row['images'], true);
        $row['verified'] = (bool)$row['verified'];
    }
    echo json_encode($results);
} catch (Exception $e) {
    echo json_encode([]);
}
?>