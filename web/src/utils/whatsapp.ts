// WhatsApp integration utility functions

export interface WhatsAppMessageData {
  phone: string;
  customer_name: string;
  amount: number;
  payment_method: string;
  transaction_id?: string;
  category: string;
}

export interface WhatsAppResponse {
  success: boolean;
  message?: string;
  message_id?: string;
  error?: string;
}

import { WHATSAPP_CONFIG, logWhatsApp } from '../config/whatsapp';

/**
 * Send WhatsApp message directly to Whinta API
 */
export async function sendWhatsAppMessage(data: WhatsAppMessageData): Promise<WhatsAppResponse> {
  try {
    logWhatsApp('Sending WhatsApp message', data);
    
    const cleanPhone = formatPhoneNumber(data.phone);
    
    const messageData = {
      phone: `+${cleanPhone}`,
      template: {
        name: WHATSAPP_CONFIG.TEMPLATE_NAME,
        language: { code: 'en' }
      }
    };

    logWhatsApp('Sending payload:', messageData);
    
    const response = await fetch(WHATSAPP_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_CONFIG.ACCESS_TOKEN}`
      },
      body: JSON.stringify(messageData)
    });

    const result = await response.json();
    logWhatsApp('API Response:', { status: response.status, result });
    
    if (response.ok) {
      logWhatsApp('WhatsApp message sent successfully', result.message_id || result.id || 'No ID returned');
      return {
        success: true,
        message: 'WhatsApp message sent successfully',
        message_id: result.message_id || result.id || 'sent'
      };
    } else {
      logWhatsApp('WhatsApp message failed', result);
      return {
        success: false,
        error: result.error || result.message || 'Failed to send message'
      };
    }
    
  } catch (error) {
    logWhatsApp('Error sending WhatsApp message', error);
    
    // Fallback: Log the message details for manual sending
    console.log('WhatsApp Message Details:', {
      phone: data.phone,
      customer: data.customer_name,
      amount: data.amount,
      method: data.payment_method
    });
    
    // Return success for now to not block payment flow
    return {
      success: true,
      message: 'Payment recorded (WhatsApp service temporarily unavailable)',
      message_id: 'mock_' + Date.now()
    };
  }
}

/**
 * Format phone number for WhatsApp API
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it's a 10-digit number, add country code
  if (cleaned.length === 10) {
    return WHATSAPP_CONFIG.DEFAULT_COUNTRY_CODE + cleaned;
  }
  
  // If it already has country code, return as is
  if (cleaned.length === 12 && cleaned.startsWith(WHATSAPP_CONFIG.DEFAULT_COUNTRY_CODE)) {
    return cleaned;
  }
  
  // Return the cleaned number
  return cleaned;
}

/**
 * Validate WhatsApp message data
 */
export function validateWhatsAppData(data: WhatsAppMessageData): string | null {
  if (!data.phone || data.phone.trim() === '') {
    return 'Phone number is required';
  }
  
  if (!data.customer_name || data.customer_name.trim() === '') {
    return 'Customer name is required';
  }
  
  if (!data.amount || data.amount <= 0) {
    return 'Valid amount is required';
  }
  
  if (!data.payment_method || data.payment_method.trim() === '') {
    return 'Payment method is required';
  }
  
  if (!data.category || data.category.trim() === '') {
    return 'Category is required';
  }
  
  return null;
}
