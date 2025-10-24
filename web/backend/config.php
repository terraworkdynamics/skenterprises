<?php
// ==================================================
// ✅ WhatsApp Integration Configuration (Corrected)
// ==================================================

// Whinta API Configuration
define('WHINTA_API_URL', 'https://app.whinta.in/api/send/template'); // <-- FIXED DOMAIN (.in)
define('ACCESS_TOKEN', 'WHj8l4zmwHsc2CgyZZlsvnfsVxDT1ANuz8KkFb7s');
define('TEMPLATE_NAME', 'sk_enterprises_');

// Backend Configuration
define('LOG_FILE', __DIR__ . '/whatsapp_logs.txt');
define('MAX_LOG_SIZE', 10 * 1024 * 1024); // 10MB

// CORS Configuration
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://skenterprisesaland.shop/laptop/payment',
    'https://skenterprisesaland.shop',
    'http://skenterprisesaland.shop'
]);

// Error Reporting (disable in production)
define('DEBUG_MODE', true);

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}
?>
