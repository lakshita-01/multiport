const express = require('express');
const { Buyer, Seller, Property, MatrimonialProfile, Order } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/properties', auth, async (req, res) => {
  try {
    const properties = await Property.find().populate('seller_id', 'full_name phone email').sort({ createdAt: -1 });
    res.json(properties.map(p => {
      const obj = p.toObject();
      const seller = obj.seller_id;
      return { ...obj, id: obj._id, seller_name: seller?.full_name, seller_phone: seller?.phone };
    }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/properties', auth, async (req, res) => {
  try {
    const { seller_name, seller_email, seller_phone, ...propertyData } = req.body;
    let seller = await Seller.findOne({ email: seller_email });
    if (!seller) {
      seller = await Seller.create({ user_id: req.user.id, full_name: seller_name, email: seller_email, phone: seller_phone });
    }
    const property = await Property.create({ ...propertyData, seller_id: seller._id });
    res.json({ ...property.toObject(), id: property._id, seller_name, seller_phone });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/matrimonial-profiles', auth, async (req, res) => {
  try {
    const profiles = await MatrimonialProfile.find().sort({ createdAt: -1 });
    res.json(profiles.map(p => ({ ...p.toObject(), id: p._id, name: p.full_name })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/matrimonial-profiles/:id/approve', auth, async (req, res) => {
  try {
    const profile = await MatrimonialProfile.findByIdAndUpdate(req.params.id, { profile_status: 'active' }, { new: true });
    res.json({ ...profile.toObject(), id: profile._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders.map(o => ({
      ...o.toObject(),
      id: o._id,
      order_number: o._id.toString().slice(-6).toUpperCase(),
      items: (o.items || []).map(i => ({ ...i, product_name: i.name, total: i.price * i.quantity })),
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

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
