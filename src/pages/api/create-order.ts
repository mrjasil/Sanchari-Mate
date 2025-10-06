import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { amount, currency = 'INR', receipt } = req.body;

      // Mock Razorpay order creation
      // In production, use actual Razorpay SDK
      const order = {
        id: `order_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        currency: currency,
        receipt: receipt || `receipt_${Math.floor(Math.random() * 100000)}`,
        status: 'created',
        created_at: Math.floor(Date.now() / 1000)
      };

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}