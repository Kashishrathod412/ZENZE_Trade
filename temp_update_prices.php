<?php
require 'api/db.php';
$updates = [
    'Starter' => ['yearly' => 499, 'monthly' => 49],
    'Basic' => ['yearly' => 999, 'monthly' => 99],
    'Premium' => ['yearly' => 3000, 'monthly' => 299],
    'Advanced' => ['yearly' => 5000, 'monthly' => 499],
    'Enterprise' => ['yearly' => 9999, 'monthly' => 999]
];
$stmt = $conn->prepare("UPDATE plan_offers SET original_yearly_price = ?, original_monthly_price = ? WHERE plan_name = ?");
foreach ($updates as $name => $prices) {
    $stmt->execute([$prices['yearly'], $prices['monthly'], $name]);
}
echo 'Updated existing original prices';
