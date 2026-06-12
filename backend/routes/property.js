const express = require('express');
const { Buyer, Seller, Property } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/buyers', auth, async (req, res) => {
  try {
    const buyer = await Buyer.create({ ...req.body, user_id: req.user.id });
    res.json({ data: buyer });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/sellers', auth, async (req, res) => {
  try {
    const seller = await Seller.create({ ...req.body, user_id: req.user.id });
    res.json({ data: seller });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/properties', auth, async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.json({ data: property });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/properties', async (req, res) => {
  try {
    const filter = { availability_status: 'available' };
    if (req.query.type) filter.property_type = req.query.type;
    if (req.query.location) filter.location = new RegExp(req.query.location, 'i');
    const properties = await Property.find(filter)
      .populate('seller_id', 'full_name phone email')
      .sort({ createdAt: -1 });
    const data = properties.map((p) => ({
      ...p.toObject(),
      id: p._id,
      seller_name: p.seller_id?.full_name,
      seller_phone: p.seller_id?.phone,
      seller_email: p.seller_id?.email,
    }));
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
