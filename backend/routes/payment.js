const express = require('express');
const crypto = require('crypto');
const { MatrimonialPayment, MatrimonialProfile } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create-order', auth, async (req, res) => {
  try {
    const amount = Number(req.body.amount || 0);
    const currency = req.body.currency || 'INR';
    const orderId = `order_${crypto.randomBytes(10).toString('hex')}`;

    res.json({
      id: orderId,
      amount,
      currency,
      status: 'created',
      reference_id: req.body.reference_id,
      order_type: req.body.order_type,
      key: process.env.RAZORPAY_KEY_ID || '',
    });
  } catch (err) {
    res.status(500).json({ error: err.message, detail: err.message });
  }
});

router.post('/verify', auth, async (req, res) => {
  try {
    if (req.body.order_type === 'matrimonial' && req.body.reference_id) {
      await MatrimonialPayment.create({
        profile_id: req.body.reference_id,
        razorpay_order_id: req.body.razorpay_order_id,
        razorpay_payment_id: req.body.razorpay_payment_id,
        payment_status: 'SUCCESS',
        payment_date: new Date(),
      });
      await MatrimonialProfile.findByIdAndUpdate(req.body.reference_id, { profile_status: 'ACTIVE' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message, detail: err.message });
  }
});

module.exports = router;
