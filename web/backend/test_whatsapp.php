<?php
// Test script for WhatsApp integration
header('Content-Type: application/json');

// Test data
$testData = [
    'phone' => '9876543210', // Replace with a test phone number
    'customer_name' => 'Test Customer',
    'amount' => 1000.00,
    'payment_method' => 'UPI',
    'transaction_id' => 'TXN123456789',
    'category' => 'Laptop'
];

// Convert to JSON
$jsonData = json_encode($testData);

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/backend/whatsapp_sender.php');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

// Execute the request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";
?>
