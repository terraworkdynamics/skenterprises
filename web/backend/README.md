# WhatsApp Integration Backend

This backend handles automatic WhatsApp message sending when payments are processed successfully.

## Files

- `whatsapp_sender.php` - Main API endpoint for sending WhatsApp messages
- `test_whatsapp.php` - Test script to verify the integration
- `whatsapp_logs.txt` - Log file for tracking message attempts (auto-generated)

## Configuration

The following constants are configured in `whatsapp_sender.php`:

- `WHINTA_API_URL`: https://api.whinta.com/v1/messages
- `ACCESS_TOKEN`: WHj8l4zmwHsc2CgyZZlsvnfsVxDT1ANuz8KkFb7s
- `TEMPLATE_NAME`: sk_enterprises_

## API Usage

### Endpoint
```
POST /backend/whatsapp_sender.php
```

### Request Body
```json
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

## Phone Number Format

The API automatically handles phone number formatting:
- Removes non-digit characters
- Adds +91 country code if not present
- Ensures proper format for WhatsApp API

## Logging

All WhatsApp message attempts are logged to `whatsapp_logs.txt` with:
- Timestamp
- Success/Failure status
- Customer details
- Error messages (if any)

## Testing

Run the test script to verify the integration:
```bash
php backend/test_whatsapp.php
```

Make sure to update the phone number in the test script before running.
