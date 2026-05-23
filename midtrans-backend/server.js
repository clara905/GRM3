const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ BENAR - serverKey pakai SB-Mid-server-..., clientKey pakai SB-Mid-client-...
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

app.post('/create-transaction', async (req, res) => {
  try {
    const {
      orderId,
      amount,
      customerName,
      customerEmail,
      carName,
    } = req.body;

    const parameter = {
  transaction_details: {
    order_id: orderId,
    gross_amount: amount,
  },
  credit_card: {
    secure: true,
  },
  // ✅ TAMBAH INI
  enabled_payments: [
    'qris',
    'gopay',
    'shopeepay',
    'bank_transfer',
    'credit_card',
  ],
  customer_details: {
    first_name: customerName,
    email: customerEmail,
  },
  item_details: [
    {
      id: 'CAR-01',
      price: amount,
      quantity: 1,
      name: carName,
    },
  ],
};

    const transaction = await snap.createTransaction(parameter);

    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on port 3000');
});