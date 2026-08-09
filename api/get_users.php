<?php
require_once 'db.php';

if (!$conn) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $conn->query("SELECT * FROM users");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as &$row) {
        if (!empty($row['socialLinks'])) $row['socialLinks'] = json_decode($row['socialLinks'], true);
        if (!empty($row['deliveryDetails'])) $row['deliveryDetails'] = json_decode($row['deliveryDetails'], true);
        if (!empty($row['deliveryPricing'])) $row['deliveryPricing'] = json_decode($row['deliveryPricing'], true);
        if (!empty($row['subscription'])) $row['subscription'] = json_decode($row['subscription'], true);
        $row['verified'] = (bool)$row['verified'];
    }
    echo json_encode($results);
} catch (Exception $e) {
    echo json_encode([]);
}
?>