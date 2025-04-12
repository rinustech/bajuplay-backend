import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Hanya menerima POST' });
  }

  const XENDIT_API_KEY = process.env.XENDIT_API_KEY;

  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Data keranjang kosong' });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const invoiceId = `invoice-${Date.now()}`;

  try {
    const response = await axios.post(
      'https://api.xendit.co/v2/invoices',
      {
        external_id: invoiceId,
        amount: total,
        description: 'Pembelian dari BajuPlay',
        invoice_duration: 86400,
        currency: 'IDR',
        success_redirect_url: 'https://your-store.vercel.app/success',
      },
      {
        auth: {
          username: XENDIT_API_KEY,
          password: '',
        },
      }
    );

    return res.status(200).json({ invoice_url: response.data.invoice_url });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: 'Gagal membuat invoice' });
  }
}
