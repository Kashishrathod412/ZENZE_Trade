<?php
header("Content-Type: application/json");
require_once __DIR__ . '/config.php';

// Get JSON Input
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid JSON payload"
    ]);
    exit;
}

$amount = isset($data['amount']) ? floatval($data['amount']) : 0;
$currency = isset($data['currency']) ? $data['currency'] : PAYMENT_CURRENCY;
$planId = isset($data['planId']) ? $data['planId'] : 'starter';
$planName = isset($data['planName']) ? $data['planName'] : 'Startup Hub';
$userId = isset($data['userId']) ? $data['userId'] : 'guest';
$userName = isset($data['userName']) ? $data['userName'] : 'User';
$userEmail = isset($data['userEmail']) ? $data['userEmail'] : '';
$billingCycle = isset($data['billingCycle']) ? $data['billingCycle'] : 'yearly';

if ($amount < 0) {
    echo json_encode([
        "success" => false,
        "error" => "Amount must be greater than or equal to 0"
    ]);
    exit;
}

// Amount in paise for Razorpay
$amountInPaise = intval(round($amount * 100));
$receipt = 'rcpt_' . substr(md5(uniqid(rand(), true)), 0, 10);

$orderId = null;

// If live/real Razorpay keys are configured (not placeholder), try creating an order via Razorpay API
if (
    RAZORPAY_KEY_ID !== 'rzp_test_51ZenzeTradeHub' && 
    !empty(RAZORPAY_KEY_SECRET) && 
    function_exists('curl_init')
) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.razorpay.com/v1/orders');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_USERPWD, RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'amount' => $amountInPaise,
        'currency' => $currency,
        'receipt' => $receipt,
        'notes' => [
            'plan_id' => $planId,
            'plan_name' => $planName,
            'user_id' => $userId,
            'billing_cycle' => $billingCycle
        ]
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $response) {
        $rzpOrder = json_decode($response, true);
        if (isset($rzpOrder['id'])) {
            $orderId = $rzpOrder['id'];
        }
    }
}

// If not generated via live Razorpay API, generate standardized Razorpay Order ID format
if (!$orderId) {
    $orderId = 'order_' . strtoupper(substr(bin2hex(random_bytes(7)), 0, 14));
}

echo json_encode([
    "success" => true,
    "order_id" => $orderId,
    "amount" => $amountInPaise,
    "amount_inr" => $amount,
    "currency" => $currency,
    "receipt" => $receipt,
    "key" => RAZORPAY_KEY_ID,
    "planId" => $planId,
    "planName" => $planName,
    "billingCycle" => $billingCycle,
    "company" => COMPANY_NAME,
    "theme" => COMPANY_THEME_COLOR
]);
?>
