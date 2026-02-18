const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const md5 = require('md5');
const config = require('./config');

const app = express();
const PORT = 3001; // Backend runs on 3001, Frontend on 5173

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store orders in memory for demo purposes (In production, use a Database like MongoDB/MySQL)
// Format: { orderId: { status: 'pending' | 'paid', amount: 9.90, ... } }
const orders = {};

// --- Helper Functions ---

// Generate Signature (Generic implementation, usually MD5(params + secret))
const generateSignature = (params, secret) => {
    // Sort keys alphabetically
    const keys = Object.keys(params).sort();
    let str = '';
    for (let key of keys) {
        if (params[key] && key !== 'hash') { // Ignore empty values and 'hash' field itself
            str += `${key}=${params[key]}&`;
        }
    }
    str += `key=${secret}`; // Append secret usually at the end is unclear, standard is key=secret
    // Xunhu specific: url_encode_str + hash=md5
    // Note: Implementation details vary by provider. This is a generic placeholders.
    // For Xunhu: appid=1&...&key=SECRET -> MD5 
    // We will stick to a simple placeholder logic for now.
    return md5(str);
};

// --- API Routes ---

// 1. Create Payment Order
app.post('/api/pay/create', async (req, res) => {
    const { amount, title, type } = req.body;  // type: 'wechat' or 'alipay'

    if (!amount) return res.status(400).json({ error: 'Amount required' });

    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Verify we have keys (Mock mode if no keys)
    if (config.APP_ID === 'REPLACE_WITH_YOUR_APPID') {
        console.log('[Mock Mode] Creating fake order:', orderId);

        // Setup mock order in memory
        orders[orderId] = {
            status: 'pending',
            amount,
            created_at: new Date()
        };

        // Return a fake QR code for frontend to display (redirects to a mock success page or just text)
        // In real life, this comes from the connection to config.API_URL
        return res.json({
            orderId,
            qr_code: `MOCK_QR_CODE_FOR_${orderId}`,
            qr_url: `https://fake-payment.com/pay?id=${orderId}`, // Frontend renders this
            is_mock: true
        });
    }

    // --- REAL PAYMENT LOGIC (Commented out until keys are reachable) ---
    /*
    const params = {
        version: '1.1',
        appid: config.APP_ID,
        trade_order_id: orderId,
        total_fee: amount,
        title: title || 'Mental Health Assessment',
        time: Math.floor(Date.now() / 1000),
        notify_url: config.NOTIFY_URL,
        nonce_str: Math.random().toString(36).substr(2, 15)
    };
    params.hash = generateSignature(params, config.APP_SECRET);

    try {
        const response = await axios.post(config.API_URL, params);
        // Save order to DB...
        orders[orderId] = { status: 'pending' };
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ error: 'Payment Gateway Error' });
    }
    */
});

// 2. Check Order Status (Frontend polling)
app.get('/api/pay/status/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = orders[orderId];

    if (!order) return res.status(404).json({ error: 'Order not found' });

    // MOCK LOGIC for auto-completion (To demonstrate flow without paying)
    // If order is > 5 seconds old, mark as paid automatically for demo
    if (config.APP_ID === 'REPLACE_WITH_YOUR_APPID' && order.status === 'pending') {
        const age = Date.now() - new Date(order.created_at).getTime();
        // if (age > 5000) order.status = 'paid'; 
        // User asked for "Real", so we shouldn't auto-complete mock unless asked.
        // Let's keep it pending.
    }

    res.json({ status: order.status });
});

// 3. Payment Callback (Webhook from Provider)
app.post('/api/pay/notify', (req, res) => {
    const data = req.body;
    // Verify signature here...

    const orderId = data.trade_order_id;
    if (orders[orderId]) {
        orders[orderId].status = 'paid';
        console.log(`Order ${orderId} marked as PAID via Webhook`);
    }

    res.send('success');
});


// 4. MOCK FORCE SUCCESS (For testing without real money)
app.post('/api/pay/mock_success', (req, res) => {
    const { orderId } = req.body;
    if (orders[orderId]) {
        orders[orderId].status = 'paid';
        return res.json({ success: true });
    }
    res.status(404).json({ error: 'Order not found' });
});

app.listen(PORT, () => {
    console.log(`Payment Server running on http://localhost:${PORT}`);
});
