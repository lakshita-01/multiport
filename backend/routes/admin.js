const express = require('express');
const { Buyer, Seller, Property, MatrimonialProfile, Order } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  try {
    const [buyers, sellers, properties, matrimonialProfiles, orders] = await Promise.all([
      Buyer.countDocuments(),
      Seller.countDocuments(),
      Property.countDocuments(),
      MatrimonialProfile.countDocuments(),
      Order.find({}, 'total_amount'),
    ]);
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    res.json({ buyers, sellers, properties, matrimonialProfiles, orders: orders.length, totalRevenue });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
