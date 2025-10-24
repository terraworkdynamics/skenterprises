// WhatsApp Integration Configuration

export const WHATSAPP_CONFIG = {
  // Backend URL for WhatsApp API
  // Direct API integration - no backend needed
  API_URL: 'https://app.whinta.com/api/send/template',
  ACCESS_TOKEN: 'WHj8l4zmwHsc2CgyZZlsvnfsVxDT1ANuz8KkFb7s',
  
  // Template configuration
  TEMPLATE_NAME: 'sk_enterprises_',
  
  // Default settings
  DEFAULT_COUNTRY_CODE: '91',
  TIMEOUT: 30000, // 30 seconds
  
  // Debug mode
  DEBUG: import.meta.env.DEV || false
};

// Logging utility
export function logWhatsApp(message: string, data?: any) {
  if (WHATSAPP_CONFIG.DEBUG) {
    console.log(`[WhatsApp] ${message}`, data);
  }
}
