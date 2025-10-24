const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Configuration
const WHINTA_API_URL = 'https://app.whinta.in/api/send/template';
const ACCESS_TOKEN = 'WHj8l4zmwHsc2CgyZZlsvnfsVxDT1ANuz8KkFb7s';
const TEMPLATE_NAME = 'sk_enterprises_';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://skenterprisesaland.shop'],
  credentials: true
}));
app.use(express.json());

// WhatsApp message sender
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { phone, customer_name, amount, payment_method, transaction_id, category = 'General' } = req.body;

    // Validate required fields
    if (!phone || !customer_name || !amount || !payment_method) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Format phone number
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    // Prepare message data
    const messageData = {
      to: cleanPhone,
      template: TEMPLATE_NAME,
      language: 'en',
      components: [{
        type: 'body',
        parameters: [
          { type: 'text', text: customer_name },
          { type: 'text', text: `₹${parseFloat(amount).toFixed(2)}` },
          { type: 'text', text: payment_method },
          { type: 'text', text: new Date().toLocaleDateString('en-IN') }
        ]
      }]
    };

    // Send to WhatsApp API
    const response = await fetch(WHINTA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify(messageData)
    });

    const result = await response.json();

    if (response.ok) {
      res.json({
        success: true,
        message: 'WhatsApp message sent successfully',
        message_id: result.message_id
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to send message'
      });
    }

  } catch (error) {
    console.error('WhatsApp API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`WhatsApp backend server running on http://localhost:${PORT}`);
});