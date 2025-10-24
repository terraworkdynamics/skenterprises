# WhatsApp Integration Deployment Guide

## Prerequisites

1. **Web Server with PHP**: Ensure you have a web server (Apache/Nginx) with PHP 7.4+ installed
2. **cURL Extension**: PHP cURL extension must be enabled
3. **File Permissions**: Ensure the backend directory has write permissions for log files

## Installation Steps

### 1. Upload Backend Files

Upload the following files to your web server:
- `whatsapp_sender.php` - Main API endpoint
- `config.php` - Configuration file
- `test_whatsapp.php` - Test script
- `README.md` - Documentation

### 2. Configure the Backend

Edit `config.php` and update the following settings:

```php
// Update your domain in allowed origins
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://skenterprisesaland.shop',
    'http://skenterprisesaland.shop'
]);

// Disable debug mode in production
define('DEBUG_MODE', false);
```

### 3. Test the Integration

1. Update the phone number in `test_whatsapp.php`
2. Run the test script:
   ```bash
   php test_whatsapp.php
   ```

### 4. Update Frontend Configuration

In your React application, update the backend URL in `Payment.tsx`:

```typescript
// Update this line in the sendWhatsAppMessage function
const response = await fetch('/backend/whatsapp_sender.php', {
```

Replace `/backend/whatsapp_sender.php` with your actual backend URL.

## Production Deployment

### 1. Security Considerations

- Set `DEBUG_MODE` to `false` in production
- Update `ALLOWED_ORIGINS` with your actual domain
- Ensure proper file permissions (755 for directories, 644 for files)
- Consider using HTTPS for the backend API

### 2. Log Management

- Log files are automatically rotated when they exceed 10MB
- Monitor `whatsapp_logs.txt` for any issues
- Set up log rotation in your server configuration

### 3. Monitoring

Monitor the following:
- API response times
- Success/failure rates in logs
- Whinta API quota usage

## Troubleshooting

### Common Issues

1. **CORS Errors**: Update `ALLOWED_ORIGINS` in `config.php`
2. **cURL Errors**: Ensure cURL extension is installed
3. **Permission Errors**: Check file permissions for log directory
4. **API Errors**: Verify Whinta API credentials and template name

### Debug Mode

Enable debug mode in `config.php` to see detailed error messages:

```php
define('DEBUG_MODE', true);
```

## API Endpoints

### Send WhatsApp Message
```
POST /backend/whatsapp_sender.php
Content-Type: application/json

{
    "phone": "9876543210",
    "customer_name": "John Doe",
    "amount": 1500.00,
    "payment_method": "UPI",
    "transaction_id": "TXN123456789",
    "category": "Laptop"
}
```

### Response
```json
{
    "success": true,
    "message": "WhatsApp message sent successfully",
    "message_id": "msg_123456789"
}
```

## Support

For issues related to:
- **Whinta API**: Contact Whinta support
- **Backend Integration**: Check logs and configuration
- **Frontend Integration**: Verify API calls and CORS settings
