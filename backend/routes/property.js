const express = require('express');
const { Buyer, Seller, Property } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

function mapProperty(property) {
  const object = property.toObject ? property.toObject() : property;
  const seller = object.seller_id;
  return {
    ...object,
    id: object._id,
    images: object.image_urls || object.images || [],
    seller_name: seller?.full_name || object.seller_name,
    seller_phone: seller?.phone || object.seller_phone,
    seller_email: seller?.email || object.seller_email,
  };
}

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

router.post('/buyer-profile', auth, async (req, res) => {
  try {
    const buyer = await Buyer.create({ ...req.body, user_id: req.user.id });
    res.json({ ...buyer.toObject(), id: buyer._id, data: buyer });
  } catch (err) { res.status(500).json({ error: err.message, detail: err.message }); }
});

router.post('/properties', auth, async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.json({ data: mapProperty(property) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/listings', auth, async (req, res) => {
  try {
    const seller = await Seller.create({
      user_id: req.user.id,
      full_name: req.body.seller_name,
      email: req.body.seller_email,
      phone: req.body.seller_phone,
    });
    const property = await Property.create({
      seller_id: seller._id,
      property_type: req.body.property_type,
      location: req.body.location,
      area_size: req.body.area_size,
      selling_price: Number(req.body.selling_price),
      description: req.body.description,
      image_urls: req.body.images || req.body.image_urls || [],
    });
    const populated = await Property.findById(property._id).populate('seller_id', 'full_name phone email');
    res.json(mapProperty(populated));
  } catch (err) { res.status(500).json({ error: err.message, detail: err.message }); }
});

router.get('/properties', async (req, res) => {
  try {
    const filter = { availability_status: 'available' };
    if (req.query.type || req.query.property_type) {
      const propertyType = req.query.type || req.query.property_type;
      if (propertyType !== 'all_types') filter.property_type = propertyType;
    }
    if (req.query.location) filter.location = new RegExp(req.query.location, 'i');
    if (req.query.min_price || req.query.max_price) {
      filter.selling_price = {};
      if (req.query.min_price) filter.selling_price.$gte = Number(req.query.min_price);
      if (req.query.max_price) filter.selling_price.$lte = Number(req.query.max_price);
    }
    const properties = await Property.find(filter)
      .populate('seller_id', 'full_name phone email')
      .sort({ createdAt: -1 });
    const data = properties.map(mapProperty);
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/listings', async (req, res) => {
  try {
    const filter = { availability_status: 'available' };
    if (req.query.property_type && req.query.property_type !== 'all_types') filter.property_type = req.query.property_type;
    if (req.query.location) filter.location = new RegExp(req.query.location, 'i');
    if (req.query.min_price || req.query.max_price) {
      filter.selling_price = {};
      if (req.query.min_price) filter.selling_price.$gte = Number(req.query.min_price);
      if (req.query.max_price) filter.selling_price.$lte = Number(req.query.max_price);
    }
    const properties = await Property.find(filter)
      .populate('seller_id', 'full_name phone email')
      .sort({ createdAt: -1 });
    res.json(properties.map(mapProperty));
  } catch (err) { res.status(500).json({ error: err.message, detail: err.message }); }
});

module.exports = router;
