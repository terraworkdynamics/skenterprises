# WhatsApp Integration Setup Guide

## Overview

This integration automatically sends WhatsApp messages to customers when payments are successfully processed using the Whinta API.

## Files Created/Modified

### Backend Files (PHP)
- `backend/whatsapp_sender.php` - Main API endpoint
- `backend/config.php` - Configuration file
- `backend/test_whatsapp.php` - Test script
- `backend/README.md` - Backend documentation
- `backend/DEPLOYMENT.md` - Deployment guide

### Frontend Files (React/TypeScript)
- `src/utils/whatsapp.ts` - WhatsApp utility functions
- `src/config/whatsapp.ts` - Configuration
- `src/pages/Payment.tsx` - Updated to trigger WhatsApp messages

## Configuration

### Backend Configuration
Edit `backend/config.php`:

```php
// Whinta API Configuration
define('WHINTA_API_URL', 'https://api.whinta.com/v1/messages');
define('ACCESS_TOKEN', 'WHj8l4zmwHsc2CgyZZlsvnfsVxDT1ANuz8KkFb7s');
define('TEMPLATE_NAME', 'sk_enterprises_');

// Update your domain in allowed origins
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://skenterprisesaland.shop',
    'http://skenterprisesaland.shop'
]);
```

### Frontend Configuration
Create a `.env` file in the web directory:

```env
VITE_WHATSAPP_BACKEND_URL=/backend/whatsapp_sender.php
```

## Deployment Steps

### 1. Backend Deployment
1. Upload backend files to your web server
2. Ensure PHP 7.4+ with cURL extension is installed
3. Set proper file permissions (755 for directories, 644 for files)
4. Update `config.php` with your domain and settings

### 2. Frontend Deployment
1. Update the backend URL in your environment variables
2. Build and deploy your React application
3. Ensure CORS is properly configured

### 3. Testing
1. Update phone number in `backend/test_whatsapp.php`
2. Run the test script: `php backend/test_whatsapp.php`
3. Process a test payment in your application

## How It Works

### Payment Flow
1. User processes payment in the Payment page
2. Payment is recorded in Supabase
3. If payment is successful, WhatsApp message is automatically triggered
4. Message is sent via Whinta API using the configured template
5. Receipt is printed as before

### Message Template
The system uses the `sk_enterprises_` template with the following parameters:
- Customer name
- Payment amount
- Payment method
- Date

### Phone Number Formatting
- Automatically adds +91 country code for Indian numbers
- Removes non-digit characters
- Handles various input formats

## Monitoring and Logs

### Log Files
- `backend/whatsapp_logs.txt` - Contains all WhatsApp message attempts
- Logs include timestamp, success/failure status, and error details
- Automatic log rotation when file exceeds 10MB

### Debug Mode
Enable debug mode in `backend/config.php` for detailed error messages:

```php
define('DEBUG_MODE', true);
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update `ALLOWED_ORIGINS` in `config.php`
   - Ensure your domain is included

2. **API Errors**
   - Verify Whinta API credentials
   - Check template name matches exactly
   - Ensure phone numbers are properly formatted

3. **Permission Errors**
   - Check file permissions for log directory
   - Ensure web server can write to log files

4. **Network Errors**
   - Verify cURL extension is installed
   - Check firewall settings
   - Ensure HTTPS is properly configured

### Testing Checklist

- [ ] Backend API responds correctly
- [ ] Phone number formatting works
- [ ] Whinta API credentials are valid
- [ ] Template name matches exactly
- [ ] CORS is properly configured
- [ ] Log files are being created
- [ ] Frontend can communicate with backend

## Security Considerations

1. **Production Settings**
   - Set `DEBUG_MODE` to `false`
   - Update `ALLOWED_ORIGINS` with actual domains
   - Use HTTPS for all communications

2. **API Security**
   - Keep access tokens secure
   - Monitor API usage and quotas
   - Implement rate limiting if needed

3. **Data Privacy**
   - Log files may contain customer data
   - Implement proper log rotation and cleanup
   - Consider data retention policies

## Support

For technical support:
- Check logs first: `backend/whatsapp_logs.txt`
- Verify configuration in `backend/config.php`
- Test with `backend/test_whatsapp.php`
- Contact Whinta support for API-related issues
