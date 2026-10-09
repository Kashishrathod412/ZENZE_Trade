<?php
require_once 'db.php';
header('Content-Type: application/json');

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

try {
    $conn->exec("CREATE TABLE IF NOT EXISTS plan_offers (
        plan_name VARCHAR(50) PRIMARY KEY,
        offer_price INT DEFAULT 0,
        monthly_offer_price INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 0,
        is_monthly_active TINYINT(1) DEFAULT 0,
        original_yearly_price INT DEFAULT 0,
        original_monthly_price INT DEFAULT 0
    )");

    try { $conn->exec("ALTER TABLE plan_offers ADD COLUMN monthly_offer_price INT DEFAULT 0"); } catch (PDOException $e) { }
    try { $conn->exec("ALTER TABLE plan_offers ADD COLUMN is_monthly_active TINYINT(1) DEFAULT 0"); } catch (PDOException $e) { }
    try { $conn->exec("ALTER TABLE plan_offers ADD COLUMN original_yearly_price INT DEFAULT 0"); } catch (PDOException $e) { }
    try { $conn->exec("ALTER TABLE plan_offers ADD COLUMN original_monthly_price INT DEFAULT 0"); } catch (PDOException $e) { }

    $stmt = $conn->query("SELECT * FROM plan_offers");
    $offers = $stmt->fetchAll();

    if (count($offers) === 0) {
        $default_offers = [
            ['Starter', 1, 1, 0, 0, 499, 49],
            ['Basic', 49, 9, 0, 0, 999, 99],
            ['Premium', 99, 19, 0, 0, 3000, 299],
            ['Advanced', 199, 29, 0, 0, 5000, 499],
            ['Enterprise', 499, 49, 0, 0, 9999, 999]
        ];
        $insertStmt = $conn->prepare("INSERT INTO plan_offers (plan_name, offer_price, monthly_offer_price, is_active, is_monthly_active, original_yearly_price, original_monthly_price) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach ($default_offers as $offer) {
            $insertStmt->execute($offer);
        }
        $stmt = $conn->query("SELECT * FROM plan_offers");
        $offers = $stmt->fetchAll();
    }

    echo json_encode(["success" => true, "data" => $offers]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
