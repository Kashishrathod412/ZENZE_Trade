<?php
// config.php - Razorpay & General App Configuration
require_once __DIR__ . '/db.php';

// Razorpay API Credentials
// Replace with your live keys from Razorpay Dashboard (https://dashboard.razorpay.com)
define('RAZORPAY_KEY_ID', getenv('RAZORPAY_KEY_ID') ?: 'rzp_test_51ZenzeTradeHub');
define('RAZORPAY_KEY_SECRET', getenv('RAZORPAY_KEY_SECRET') ?: 'rzp_secret_zenze123456789');

// Company & Currency Settings
define('PAYMENT_CURRENCY', 'INR');
define('COMPANY_NAME', 'ZENZE Trade Hub');
define('COMPANY_LOGO', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80');
define('COMPANY_THEME_COLOR', '#7C3AED');
?>
