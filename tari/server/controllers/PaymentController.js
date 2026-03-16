/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          TARI PAYMENT CONTROLLER — PLUGIN ARCHITECTURE       ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  Current: COD (default) + Mock UPI                           ║
 * ║                                                              ║
 * ║  TO ADD RAZORPAY:                                            ║
 * ║  1. npm install razorpay                                     ║
 * ║  2. Add RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET to .env        ║
 * ║  3. Uncomment Razorpay block in initiatePayment()            ║
 * ║  4. Uncomment webhook route in payment.routes.js             ║
 * ║                                                              ║
 * ║  TO ADD PHONEPE:                                             ║
 * ║  1. npm install phonepe-pg-sdk                               ║
 * ║  2. Follow PhonePe integration docs                          ║
 * ║  3. Replace mock UPI logic in initiatePayment()              ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const { Order } = require('../models');
const crypto = require('crypto');

exports.initiatePayment = async (req, res) => {
  try {
    const { method, amount } = req.body;

    if (method === 'cod') {
      return res.json({ success: true, ref: 'COD' });
    }

    if (method === 'upi') {
      // ─────────────────────────────────────────
      // RAZORPAY PLUGIN POINT — Uncomment to use:
      // ─────────────────────────────────────────
      // const Razorpay = require('razorpay');
      // const razorpay = new Razorpay({
      //   key_id: process.env.RAZORPAY_KEY_ID,
      //   key_secret: process.env.RAZORPAY_KEY_SECRET
      // });
      // const order = await razorpay.orders.create({
      //   amount: Math.round(amount * 100),
      //   currency: 'INR',
      //   receipt: `order_${Date.now()}`
      // });
      // return res.json({
      //   success: true,
      //   orderId: order.id,
      //   key: process.env.RAZORPAY_KEY_ID
      // });
      // ─────────────────────────────────────────

      // MOCK response — remove when plugin added
      return res.json({
        success: true,
        ref: `MOCK_UPI_${Date.now()}`,
        note: 'Replace with real UPI provider SDK'
      });
    }

    res.status(400).json({ message: 'Unsupported payment method' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    // RAZORPAY VERIFICATION POINT:
    // const body = orderId + '|' + paymentId;
    // const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
    // if (expectedSig !== signature) return res.status(400).json({ message: 'Invalid payment signature' });

    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid', paymentRef: paymentId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.paymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).select('paymentStatus paymentRef');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ paymentStatus: order.paymentStatus, paymentRef: order.paymentRef });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RAZORPAY WEBHOOK — Uncomment and update signature verification
exports.webhook = async (req, res) => {
  // const signature = req.headers['x-razorpay-signature'];
  // const body = JSON.stringify(req.body);
  // const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex');
  // if (signature !== expectedSig) return res.status(400).json({ message: 'Invalid webhook signature' });
  // Handle event: req.body.event
  res.json({ received: true });
};
