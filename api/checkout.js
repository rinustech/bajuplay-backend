// File: api/checkout.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();

  const xenditApiKey = process.env.XENDIT_SECRET_KEY;
  const { items, customer } = body;

  const invoicePayload = {
    external_id: 'order-' + Date.now(),
    payer_email: customer.email,
    description: 'Pembayaran pesanan di BajuPlay',
    amount: items.reduce((total, item) => total + item.price * item.quantity, 0),
    customer: {
      given_names: customer.name,
      email: customer.email,
      mobile_number: customer.phone
    },
    success_redirect_url: 'https://bajuplay.vercel.app/success',
    failure_redirect_url: 'https://bajuplay.vercel.app/failed'
  };

  const response = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${xenditApiKey}:`).toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(invoicePayload)
  });

  const data = await response.json();
  return NextResponse.json(data);
}
