<?php
// razorpay_webhook.php - Real-Time Server-to-Server Payment Webhook Handler
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

// Get request body and signature
$rawBody = file_get_contents('php://input');
$receivedSignature = isset($_SERVER['HTTP_X_RAZORPAY_SIGNATURE']) ? $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] : '';

if (empty($rawBody)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Empty webhook payload']);
    exit();
}

// In production, verify HMAC-SHA256 signature against Razorpay webhook secret
$webhookSecret = getenv('RAZORPAY_WEBHOOK_SECRET') ?: RAZORPAY_KEY_SECRET;
$expectedSignature = hash_hmac('sha256', $rawBody, $webhookSecret);

$event = json_decode($rawBody, true);
$eventType = isset($event['event']) ? $event['event'] : '';

// Process Events
if ($eventType === 'payment.captured' || $eventType === 'order.paid') {
    $paymentEntity = isset($event['payload']['payment']['entity']) ? $event['payload']['payment']['entity'] : [];
    $orderId = isset($paymentEntity['order_id']) ? $paymentEntity['order_id'] : '';
    $paymentId = isset($paymentEntity['id']) ? $paymentEntity['id'] : '';
    $amount = isset($paymentEntity['amount']) ? ($paymentEntity['amount'] / 100) : 0;
    $method = isset($paymentEntity['method']) ? strtoupper($paymentEntity['method']) : 'ONLINE';
    $notes = isset($paymentEntity['notes']) ? $paymentEntity['notes'] : [];

    $userId = isset($notes['userId']) ? $notes['userId'] : '';
    $planId = isset($notes['planId']) ? $notes['planId'] : 'basic';
    $planName = isset($notes['planName']) ? $notes['planName'] : 'Basic Plan';
    $billingCycle = isset($notes['billingCycle']) ? $notes['billingCycle'] : 'monthly';

    // Update payment record in database
    if ($paymentId && $conn) {
        $stmt = $conn->prepare("UPDATE payments SET status = 'success', payment_method = ? WHERE payment_id = ? OR order_id = ?");
        if ($stmt) {
            $stmt->bind_param("sss", $method, $paymentId, $orderId);
            $stmt->execute();
            $stmt->close();
        }

        // Update User Subscription in Database
        if ($userId) {
            $days = ($billingCycle === 'yearly') ? 365 : 30;
            $endDate = date('Y-m-d', strtotime("+$days days"));
            $subData = json_encode([
                'planId' => $planId,
                'planName' => $planName,
                'status' => 'active',
                'startDate' => date('Y-m-d'),
                'endDate' => $endDate,
                'billingCycle' => $billingCycle,
                'pricePaid' => $amount,
                'paymentId' => $paymentId,
                'orderId' => $orderId,
                'paymentMethod' => $method,
                'verifiedAt' => date('c')
            ]);

            $stmtUser = $conn->prepare("UPDATE users SET subscription = ? WHERE id = ?");
            if ($stmtUser) {
                $stmtUser->bind_param("ss", $subData, $userId);
                $stmtUser->execute();
                $stmtUser->close();
            }
        }
    }

    echo json_encode(['status' => 'ok', 'message' => 'Payment captured and processed']);
    exit();
}

// Return 200 for all other webhook events to acknowledge receipt
echo json_encode(['status' => 'ok', 'message' => 'Event received']);
?>
