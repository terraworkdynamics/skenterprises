<?php
require_once 'config.php';

// Set CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS) || DEBUG_MODE) {
    header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
}
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Function to send WhatsApp message via Whinta API
function sendWhatsAppMessage($phone, $customerName, $amount, $method, $transactionId = null, $category = 'General') {
    $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
    if (!preg_match('/^\+?91/', $cleanPhone)) {
        $cleanPhone = '91' . ltrim($cleanPhone, '0');
    }
    $cleanPhone = ltrim($cleanPhone, '+');
    if (strlen($cleanPhone) === 10) {
        $cleanPhone = '91' . $cleanPhone;
    }

    $messageData = [
        'customer_name' => $customerName,
        'amount' => '₹' . number_format($amount, 2),
        'payment_method' => $method,
        'category' => ucfirst($category),
        'date' => date('d-m-Y'),
        'time' => date('h:i A')
    ];
    if ($transactionId) {
        $messageData['transaction_id'] = $transactionId;
    }

    $postData = [
        'to' => $cleanPhone,
        'template' => TEMPLATE_NAME,
        'language' => 'en',
        'components' => [[
            'type' => 'body',
            'parameters' => [
                ['type' => 'text', 'text' => $customerName],
                ['type' => 'text', 'text' => $messageData['amount']],
                ['type' => 'text', 'text' => $method],
                ['type' => 'text', 'text' => $messageData['date']]
            ]
        ]]
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, WHINTA_API_URL);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . ACCESS_TOKEN
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    file_put_contents(__DIR__ . '/debug_whatsapp.txt', 
        "===== " . date('Y-m-d H:i:s') . " =====\n" .
        "POST URL: " . WHINTA_API_URL . "\n" .
        "DATA: " . json_encode($postData) . "\n" .
        "HTTP CODE: $httpCode\n" .
        "CURL ERROR: $curlError\n" .
        "RAW RESPONSE:\n$response\n\n",
    FILE_APPEND);

    // ✅ Return result
    return [
        'success' => $httpCode === 200 && !$curlError,
        'message_id' => json_decode($response, true)['message_id'] ?? null,
        'error' => $curlError ?: (json_decode($response, true)['error'] ?? null)
    ];
}
// Function to log WhatsApp attempts
function logWhatsAppAttempt($phone, $customerName, $amount, $success, $error = null) {
    $timestamp = date('Y-m-d H:i:s');
    $status = $success ? 'SUCCESS' : 'FAILED';
    $errorMsg = $error ? " - Error: $error" : '';
    
    $logEntry = "[$timestamp] $status - Phone: $phone, Customer: $customerName, Amount: $amount$errorMsg\n";
    
    // Rotate log file if it gets too large
    if (file_exists(LOG_FILE) && filesize(LOG_FILE) > MAX_LOG_SIZE) {
        rename(LOG_FILE, LOG_FILE . '.old');
    }
    
    file_put_contents(LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    // Validate required fields
    $requiredFields = ['phone', 'customer_name', 'amount', 'payment_method'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }
    
    // Extract data
    $phone = $input['phone'];
    $customerName = $input['customer_name'];
    $amount = floatval($input['amount']);
    $method = $input['payment_method'];
    $transactionId = $input['transaction_id'] ?? null;
    $category = $input['category'] ?? 'General';
    
    // Validate amount
    if ($amount <= 0) {
        throw new Exception('Invalid amount');
    }
    
    // Send WhatsApp message
    $result = sendWhatsAppMessage($phone, $customerName, $amount, $method, $transactionId, $category);
    
    // Log the attempt
    logWhatsAppAttempt($phone, $customerName, $amount, $result['success'], $result['error'] ?? null);
    
    if ($result['success']) {
        echo json_encode([
            'success' => true,
            'message' => 'WhatsApp message sent successfully',
            'message_id' => $result['message_id']
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $result['error']
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
