<?php
require 'config.php';
try {
    $stmt = $pdo->query('DESCRIBE jobs');
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
