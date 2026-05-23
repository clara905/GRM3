/**
 * ======================================================
 * MIDTRANS SERVICE - CLEAN FIXED VERSION
 * React Native + Express Backend Integration
 * ======================================================
 */

// ======================================================
// CONFIG
// ======================================================
export const MIDTRANS_CONFIG = {
  SNAP_URL: 'https://app.sandbox.midtrans.com/snap/snap.js',
  SNAP_EMBED_URL: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/',
  CLIENT_KEY: 'Mid-client-IGmgZ0h-a_x_BMhK', // ← ganti punya kamu
  BACKEND_URL: 'http://10.226.227.72:3000',        // ← ganti IP laptop kamu
};

// ======================================================
// CREATE SNAP TOKEN
// ======================================================
export async function createSnapToken({ orderId, amount, car, user, days }) {
  try {
    const response = await fetch(
      `${MIDTRANS_CONFIG.BACKEND_URL}/create-transaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount,
          customerName: user?.name || 'Unknown',
          customerEmail: user?.email || '',
          carName: car?.name || 'Car',
          days: days || 1,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || 'Failed to create snap token');
    }

    if (!data?.token) {
      throw new Error('Snap token not returned from backend');
    }

    return data;
  } catch (error) {
    console.log('Midtrans Error:', error.message);
    throw error;
  }
}

// ======================================================
// PAYMENT STATUS
// ======================================================
export const PAYMENT_STATUS = {
  settlement: {
    label: 'Pembayaran Berhasil',
    color: '#4CAF50',
    icon: 'checkmark-circle',
  },
  
  pending: {
    label: 'Menunggu Pembayaran',
    color: '#FF9800',
    icon: 'time',
  },

  deny: {
    label: 'Pembayaran Ditolak',
    color: '#F44336',
    icon: 'close-circle',
  },

  expire: {
    label: 'Pembayaran Kadaluarsa',
    color: '#9E9E9E',
    icon: 'alert-circle',
  },

  cancel: {
    label: 'Pembayaran Dibatalkan',
    color: '#F44336',
    icon: 'close-circle',
  },

  capture: {
    label: 'Pembayaran Dikonfirmasi',
    color: '#4CAF50',
    icon: 'shield-checkmark',
  },
};

// ======================================================
// SNAP HTML FOR WEBVIEW
// ======================================================
export function getMidtransSnapHTML(snapToken, clientKey) {
  return `
<!DOCTYPE html>
<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script
    src="https://app.sandbox.midtrans.com/snap/snap.js"
    data-client-key="${clientKey}"
  ></script>

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0A0A0A;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      color: white;
    }
    .loading { text-align: center; }
    .spinner {
      width: 42px;
      height: 42px;
      border: 4px solid #333;
      border-top-color: #FF1744;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 18px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    p { color: #ccc; font-size: 15px; }
  </style>
</head>
<body>
  <div class="loading">
    <div class="spinner"></div>
    <p>Memuat halaman pembayaran...</p>
  </div>

  <script>
    function sendMessage(type, result) {
      try {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type, result: result || null })
        );
      } catch (e) {}
    }

    window.onload = function () {
      if (!window.snap) {
        sendMessage('PAYMENT_ERROR', { message: 'Snap not loaded' });
        return;
      }

      snap.pay('${snapToken}', {
        onSuccess: function (result) {
          sendMessage('PAYMENT_SUCCESS', result);
        },
        onPending: function (result) {
          sendMessage('PAYMENT_PENDING', result);
        },
        onError: function (result) {
          sendMessage('PAYMENT_ERROR', result);
        },
        onClose: function () {
          sendMessage('PAYMENT_CLOSED');
        },
      });
    };
  </script>
</body>

</html>
`;
}